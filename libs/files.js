'use strict'

const fs = require('fs'),
      path = require('path'),
      mime = require('mime-types')

// Ingores this files (in all subfolders)
const ignoreFiles = ['.DS_Store', '.gitkeep']

/**
 * Search for all files within a path and return the array in the Callback
 * @param  {String}   dir  Path to walk
 * @param  {Function} callback Callback
 */
module.exports.walk = (dir, options, callback) => {

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
          self.walk(file, options, function(err, res) {

            console.log(res)

            results = results.concat(res)
            if (!--pending) {
              return callback(null, results)
            }
          })
        } else {
          let parse = path.parse(file)

          if (ignoreFiles.indexOf(parse.name) < 0 ) {

            let mt = mime.lookup(path.parse(file).ext)

            // Apply mime/type filtering
            if (!options.mimeType || mt === options.mimeType) {
              results.push(Object.assign(parse, {
                route: file,
                mime: mt
              }, {stats: fs.statSync(file)}))
            }

          }

          if (!--pending) {
            callback(null, results)
          }
        }
      })
    })
  })
}
