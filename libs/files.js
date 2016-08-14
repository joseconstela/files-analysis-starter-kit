'use strict'

const fs = require('fs'),
      path = require('path'),
      mime = require('mime-types'),
      config = require('../config')

/**
 * Search for all files within a path and return the array in the Callback
 * @param  {String}   dir  Path to walk
 * @param  {Function} callback Callback
 */
module.exports.walk = (dir, callback) => {

  let self = this

  let results = []
  fs.readdir(dir, function(err, list) {
    if (err) {
      return callback(err)
    }

    let pending = list.length

    if (!pending) {
      return callback(null, results)
    }

    list.forEach(function(file) {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          self.walk(file, function(err, res) {
            results = results.concat(res)
            if (!--pending) {
              return callback(null, results)
            }
          })
        } else {
          let parse = path.parse(file)

          if (config.files.ignoreFiles.indexOf(parse.name) < 0 ) {
            results.push(Object.assign(parse, {
              route: file,
              mime: mime.lookup(path.parse(file).ext)
            }, {stats: fs.statSync(file)}))
          }

          if (!--pending) {
            callback(null, results)
          }
        }
      })
    })
  })
}
