"use strict"

const async = require('async'),
      lodash = require('lodash')

const dropCollectionsFirst = ['analysisResults']

/**
 * Code executed before the processing
 *
 * @param  {Object}   dbs      Databases instances
 * @param  {Function} callback Callback
 */
module.exports.before = (dbs, callback) => {

  let q = async.queue((collection, cb) => {
    dbs.mongo.dropCollection(collection, cb)
  }, 1)

  q.drain = function() {
    _cb(null, null)
  }

  lodash.map(dropCollectionsFirst, (c) => {
    q.push(c)
  })

}

/**
 * Perform the processing
 *
 * @param  {Object}   dbs      Databases instances
 * @param  {Object}   fileInfo Object containing the fileInfo. See the docs.
 * @param  {Function} callback Callback
 */
module.exports.process = (dbs, fileInfo, callback) => {

  dbs.mongo.collection('analysisResults').insert({
    file: fileInfo.route,
    topic: data...,
  }, (...) => {
    setImmediate(callback)
  })

}

/**
 * Code executed before the processing
 *
 * @param  {Object}   dbs      Databases instances
 * @param  {Function} callback Callback
 */
module.exports.after = (dbs, callback) => {
  setImmediate(callback)
}
