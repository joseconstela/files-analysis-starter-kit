'use strict'

const colors = require('colors'),
      moment = require('moment'),
      progress = require('progress')

let   initTime = null,
      finishTime = null,
      progressBar = null

/**
 * Starts the debugging system:
 *
 * - Sets the starting time for the processing
 * - Initializes the progressbar
 *
 * @param  {Integer} count Number of files to be processed
 */
module.exports.init = (count) => {
  initTime = moment()
  console.log('')
  progressBar = new progress(
    'analysing [:bar] [Files::current/:total] [:percent :elapsed seconds] [ETA::eta seconds]',
    {
      total: count,
      width: 48,
      complete: '=',
      incomplete: ' '
    }
  )
}

/**
 * Flags a file al processed for the progressBar
 */
module.exports.tick = () => {
  progressBar.tick()
}

/**
 * Sets the processing's finish time
 */
module.exports.finish = () => {
  finishTime = moment()
  console.log('')
}

/**
 * [description]
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
module.exports.exit = (code) => {
  code === 0 ? this.success(`Exit with code ${code}`) : this.error(`Exit with code ${code}`)
}

/**
 * Logs debugging's section title
 * @param  {String} str The section's title
 */
module.exports.title = (str) => {
  console.log('')
  console.log(str.blue)
  console.log('============================================================'.blue)
}

/**
 * Logs a success message
 * @param  {String} str The message to log
 */
module.exports.success = (str) => {
  console.log(`✔︎ ${new Date} ${str}`.green)
}

/**
 * Logs an error message
 * @param  {String} str The message to log
 */
module.exports.error = (str) => {
  console.log(`❌ ${new Date} ${str}`.red)
}

/**
 * Logs an info message
 * @param  {String} str The message to log
 */
module.exports.info = (str) => {
  console.log(`ℹ︎ ${new Date} ${str}`.yellow)
}
