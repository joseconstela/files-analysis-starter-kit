'use strict'

const fs = require('fs'),
      path = require('path'),
      mime = require('mime-types'),
      config = require('../config')

/**
 * [description]
 * @param  {[type]}   dir  [description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
const walk = (dir, done) => {
  let results = []
  fs.readdir(dir, function(err, list) {
    if (err) return done(err)
    let pending = list.length
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res)
            if (!--pending) {
              done(null, results)
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
            done(null, results)
          }
        }
      })
    })
  })
}

module.exports = {
  walk: walk
}
