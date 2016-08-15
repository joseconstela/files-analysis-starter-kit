'use strict'

/*
* ==========================================
*/

const async = require('async'),
      lodash = require('lodash'),
      yargs = require('yargs'),
      debug = require('./libs/debug'),
      filesLib = require('./libs/files'),
      analysisLib = require('./libs/analysis'),
      performanceTweaks = require('./libs/performanceTweaks'),
      pdfText = require('pdf-text'),
      mongoClient = require('mongodb').MongoClient

let   dbs = {},
      filesList = []

let   argv = yargs
        .usage('Usage: $0 --cpus [num] --path [string]')
        .option('c', {
            alias: 'cpus',
            demand: true,
            default: 1,
            describe: 'Max number of CPUs to use',
            type: 'number'
        })
        .option('p', {
            alias: 'path',
            demand: true,
            default: 'data',
            describe: 'Files location',
            type: 'string'
        })
        .option('m', {
            alias: 'mongodb',
            demand: true,
            default: 'mongodb://localhost:27017/fask',
            describe: 'Mongo url',
            type: 'string'
        })

        .help('h')
        .alias('h', 'help')
        .example('$0 -c 4 -p data/', 'Uses up to 4 CPUs to analyse files wihtin'
                  + 'the data folder and connects mongodb to its default host.')
        .argv

/**
 * Performance tweaks
 */
const assignedCpus = performanceTweaks.cpus.assigned(argv.cpus)

/*
* ==========================================
*/

process.on('exit', (code) => {
  debug.exit(code)
})

debug.title('files-analysis-starter-kit')
debug.info(`Using up to ${assignedCpus} CPUs (${performanceTweaks.cpus.mode})`)
debug.info(`Using ${argv.p} folder`)

debug.title('Debug')

async.parallel([

  /**
   * Performs the connection to MongoDB
   *
   * @param  {function} _cb Callback
   */
  function connectDb(_cb) {

    // Connects to the server
    mongoClient.connect(`${argv.m}`, (err, db) => {
      if (err) return _cb(err, db)

      debug.success(`Connected ${argv.m}`)

      // Assign the instance to the dbs object
      dbs.mongo = db
        _cb(null, null)
    })
  },

  /**
   * Get the files list
   *
   * @param  {Function} _cb Callback
   */
  function readDir(_cb) {
    debug.info(`Looking recursively for files...`)
    filesLib.walk(argv.p, (err, result) => {

      if (!err) {

        if(!result.length) {
          err = 'No files found'
        } else {
          filesList = result
          debug.success(`Found ${filesList.length} files to be processed`)
        }

      }

      _cb(err, result)
    })
  }
], (err, result) => {
  if (err) {
    debug.error(err)
    process.exit(1)
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
