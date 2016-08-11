'use strict'

/*
* ==========================================
*/

const os = require('os'),
      async = require('async'),
      lodash = require('lodash'),
      debug = require('./libs/debug'),
      filesLib = require('./libs/files'),
      analysisLib = require('./libs/analysis'),
      pdfText = require('pdf-text'),
      mongoClient = require('mongodb').MongoClient

let   dbs = {},
      filesList = []

/*
* CONFIG VARIAVLES
*/
const mongoUrl = 'mongodb://localhost:27017/pdf',
      collectionName = 'pdfAnalysis',
      dropCollectionFirst = false,
      availableCPUs = os.cpus().length - 1

/*
* ==========================================
*/

process.on('exit', (code) => {
  debug.title('Finished')
  debug.elapsedTime()
  debug.exit(code)
});

debug.title('files-analysis-starter-kit')
debug.info(`Up to ${availableCPUs} CPUs ${os.cpus()[0].model}`)

debug.title('Debug')

async.parallel([

  function connectDb(_cb) {
    mongoClient.connect(mongoUrl, (err, db) => {
      if (err) return _cb(err, db)

      debug.success(`Connected to mongoDB @ ${mongoUrl}`)

      dbs.mongo = db

      if (dropCollectionFirst) {
        dbs.mongo.dropCollection(collectionName, _cb)
      } else {
        _cb(null, null)
      }
    })
  },

  function readDir(_cb) {
    filesLib.walk('data', (err, result) => {
      filesList = result
      debug.success(`Managed to find ${filesList.length} files to be processed.`);
      _cb()
    })
  }
], (err, result) => {
  if (err) {
    debug.error(err)
  } else {
    doTheJob()
  }
})

let doTheJob = () => {

  debug.init()

  var q = async.queue((task, cb) => {
    analysisLib.work(dbs, task, cb)
  }, os.cpus().length -1)

  // assign a callback
  q.drain = function() {
    debug.finish()

    debug.success('All items have been processed');

    process.exit()
  };

  lodash.map(filesList, (f) => {
    q.push({file: f})
  })

}
