'use strict'

const async = require('async'),
      lodash = require('lodash'),
      debug = require('./libs/debug'),
      filesLib = require('./libs/files'),
      performanceTweaks = require('./libs/performanceTweaks'),
      mongoClient = require('mongodb').MongoClient

const version = '0.3.2'

let   dbs = {},         // Holds the instances for DB connections
      filesList = [],   // Holds the files list to be analysed
      assignedCpus = 0  // Number of CPUs allowed to be used

/**
 * Debug exit codes
 */
process.on('exit', (code) => {
  debug.exit(code)
})

/**
 * Expose lib version
 * @type {String}
 */
exports.version = version

/**
 * Function to be executed pre-analysis.
 *
 * @param  {Object}   dbs Instances for DB connections
 * @param  {Function} cb  Callback to be executed.
 */
exports.before = (dbs, cb) => { setImmediate(cb) }

/**
 * Processing function
 *
 * @param  {Object}   dbs Instances for DB connections
 * @param  {Array}    dbs Files list to be analysed
 * @param  {Function} cb  Callback to be executed.
 *                        Use setImmediate(cb)
 */
exports.process = (dbs, task, cb) => { setImmediate(cb) }

/**
 * Function to be executed post-analysis.
 *
 * @param  {Object}   dbs Instances for DB connections
 * @param  {Function} cb  Callback to be executed.
 */
exports.after = (dbs, cb) => { setImmediate(cb) }

/**
 * [start description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
exports.start = (opts) => {

  let options = lodash.defaults(opts || {}, {
    cpus : 100,     // Max number of CPUs to use
    mimeType: null, // Filter files by mime/type
    limitFiles: -1, // Limit the number of files to be processed
    path: 'data',   // Files location
    mongodb: 'mongodb://localhost:27017/fask' // Mongo url
  })

  assignedCpus = performanceTweaks.cpus.assigned(options.cpus)

  debug.title('files-analysis-starter-kit')
  debug.info(`Using up to ${assignedCpus} CPUs (${performanceTweaks.cpus.model})`)
  debug.info(`Using ${options.path} folder`)

  debug.title('Debug')

  async.parallel([

    /**
     * Performs the connection to MongoDB
     *
     * @param  {function} _cb Callback to be executed.
     */
    function connectDb(_cb) {

      // Connects to the server
      mongoClient.connect(`${options.mongodb}`, (err, db) => {
        if (err) {
          return _cb(err, db)
        }

        debug.success(`Connected ${options.mongodb}`)

        // Assign the instance to the dbs object
        dbs.mongo = db
          _cb(null, null)
      })
    },

    /**
     * Get the files list
     *
     * @param  {Function} _cb Callback to be executed.
     */
    function readDir(_cb) {
      debug.info(`Looking recursively for files...`)
      filesLib.walk(options.path, options, (err, result) => {

        if (!err) {

          if(!result.length) {
            err = 'No files found'
          } else {
            filesList = result

            if (options.limitFiles) {
              filesList = filesList.slice(0, options.limitFiles)
            }

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
      debug.init(filesList.length)

      let q = async.queue((task, cb) => {
        this.process(dbs, task, (err, result) => {
          debug.tick()
          cb(err, result)
        })
      }, assignedCpus)

      q.drain = () => {
        this.after(dbs, () => {
          debug.finish()
          debug.success('All items have been processed')
          process.exit()
        })
      }

      this.before(dbs, () => {
        lodash.map(filesList, (f) => {
          q.push(f)
        })
      })
    }
  })

}
