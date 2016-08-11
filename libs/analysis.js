'use strict'

/**
 * Do the actual analysis
 * @param  {Object}   dbs      Contains DB connections
 * @param  {Object}   fileInfo Contains the file information
 *
 * Example of fileInfo parameter:
 * { root: '/',
 * dir: '/.../files-analysis-starter-kit/data/L11',
 * base: 'myPdfFile.PDF',
 * ext: '.PDF',
 * name: 'myPdfFile',
 * route: '/.../files-analysis-starter-kit/data/L11/myPdfFile.PDF',
 * mime: 'application/pdf' }
 *
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const work = (dbs, fileInfo, callback) => {
  setImmediate(callback)
}

module.exports = {
  work: work
}
