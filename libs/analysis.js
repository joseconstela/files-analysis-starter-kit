'use strict'

/**
 * Do the actual analysis
 * @param  {Object}   dbs      Contains DB connections
 * @param  {Object}   fileInfo Contains the file information
 *
 * Example of fileInfo parameter:
 * {
 *   root: '/',
 *   dir: '/.../files-analysis-starter-kit/data/subfolder',
 *   base: 'myPdfFile.PDF',
 *   ext: '.PDF',
 *   name: 'myPdfFile',
 *   route: '/.../files-analysis-starter-kit/data/subfolder/myPdfFile.PDF',
 *   mime: 'application/pdf',
 *   stats: {
 *     dev: 16777220,
 *     mode: 33188,
 *     nlink: 1,
 *     uid: 501,                  // user-id of the owner of the file.
 *     gid: 20,                   // group-id of the owner of the file.
 *     rdev: 0,
 *     blksize: 4096,
 *     ino: 29670994,
 *     size: 68704,               // Size in bytes
 *     blocks: 136,
 *     atime: Thu Aug 11 2016 13:30:51 GMT+0200 (CEST),     // last access
 *     mtime: Tue Apr 01 2008 08:52:56 GMT+0200 (CEST),     // last modification
 *     ctime: Tue Aug 09 2016 04:20:35 GMT+0200 (CEST),     // creation
 *     birthtime: Tue Apr 01 2008 08:52:56 GMT+0200 (CEST)
 *   }
 * }
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
