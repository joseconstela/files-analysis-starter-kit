'use strict'

/*
* ==========================================
*/

const async = require('async'),
      lodash = require('lodash'),
      debug = require('./libs/debug'),
      filesLib = require('./libs/files'),
      analysisLib = require('./libs/analysis'),
      performanceTweaks = require('./libs/performanceTweaks'),
      pdfText = require('pdf-text'),
      mongoClient = require('mongodb').MongoClient,
      config = require('./config')

let   dbs = {},
      filesList = []

/**
 * Performance tweaks
 */
const assignedCpus = performanceTweaks.cpus.assigned()

/*
* ==========================================
*/

process.on('exit', (code) => {
  debug.exit(code)
})


debug.title('files-analysis-starter-kit')
debug.info(`Using up to ${assignedCpus} CPUs`)
debug.info(performanceTweaks.cpus.model)

debug.title('Debug')

async.parallel([

  /**
   * Performs the connection to MongoDB and drops - pre-analysis - any
   * collection specified in config.js
   *
   * @param  {function} _cb Callback
   */
  function connectDb(_cb) {

    // Build the mongoUrl for reuse
    const mongoUrl = `${config.mongo.url}/${config.mongo.db}`

    // Connects to the server
    mongoClient.connect(`${mongoUrl}`, (err, db) => {
      if (err) return _cb(err, db)

      debug.success(`Connected ${mongoUrl}`)

      // Assign the instance to the dbs object
      dbs.mongo = db

      // Drops any collection specified in config.js
      if (config.mongo.drop.length > 0) {

        debug.info(`Dropping collections...`)
        debug.info(`\t${config.mongo.drop.join(', ')}`)

        let q = async.queue((collection, cb) => {
          dbs.mongo.dropCollection(collection, cb)
        }, 1)

        q.drain = function() {
          _cb(null, null)
        }

        lodash.map(config.mongo.drop, (c) => {
          q.push(c)
        })

      } else {
        _cb(null, null)
      }
    })
  },

  /**
   * Get the files list
   *
   * @param  {Function} _cb Callback
   */
  function readDir(_cb) {
    debug.info(`Looking recursively for files in ${config.files.path} folder`)
    filesLib.walk(config.files.path, (err, result) => {
      filesList = result
      debug.success(`Managed to find ${filesList.length} files to be processed`)
      _cb(err)
    })
  }
], (err, result) => {
  if (err) {
    debug.error(err)
  } else {
    doTheJob()
  }
})

/**
 * Add each file to the queue for the process
 */
let doTheJob = () => {

  debug.init(filesList.length)

  let q = async.queue((task, cb) => {
    analysisLib.process(dbs, task, (err, result) => {
      cb(err, result)
      debug.tick()
    })
  }, assignedCpus)

  q.drain = function() {
    analysisLib.finish(dbs, () => {
      debug.finish()
      debug.success('All items have been processed')
      process.exit()
    })
  }

  lodash.map(filesList, (f) => {
    q.push(f)
  })

}
