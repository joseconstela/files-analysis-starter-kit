'use strict'

const colors = require('colors'),
      moment = require('moment')

let initTime = null,
    finishTime = null

const init = () => {
  initTime = moment()
}

const finish = () => {
  finishTime = moment()
}

const elapsedTime = () => {
  info( `Elapsed time: ${initTime.diff(finishTime, 'seconds')} seconds` )
}

const exit = (code) => {
  info(`Exit with code ${code}`)
  console.log()
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
  console.log(`➡ ${str}`)
}

module.exports = {
  init: init,
  finish: finish,
  elapsedTime: elapsedTime,
  exit: exit,
  title: title,
  success: success,
  error: error,
  info: info
}
