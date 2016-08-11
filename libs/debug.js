'use strict'

const colors = require('colors'),
      moment = require('moment'),
      progress = require('progress')

let initTime = null,
    finishTime = null,
    progressBar = null

const init = (count) => {
  initTime = moment()
  console.log()
  progressBar = new progress('[:bar] :current/:total :percent :elapsed seconds', { total: count, width: 58 })
}

const tick = () => {
  progressBar.tick()
}

const finish = () => {
  finishTime = moment()
  console.log()
}

const elapsedTime = () => {
  info( `Elapsed time: ${initTime.diff(finishTime, 'seconds')} seconds` )
}

const exit = (code) => {
  code === 0 ? success(`Exit with code ${code}`) : error(`Exit with code ${code}`)
}

const title = (str) => {
  console.log()
  console.log(str.blue)
  console.log('============================================================'.blue)
}

const success = (str) => {
  console.log('✔︎'.green, new Date(), str)
}

const error = (str) => {
  console.log('❌ ERROR'.red, new Date(), str)
}

const info = (str) => {
  console.log(`➡`.yellow, new Date(), str)
}

module.exports = {
  init: init,
  finish: finish,
  tick: tick,
  elapsedTime: elapsedTime,
  exit: exit,
  title: title,
  success: success,
  error: error,
  info: info
}
