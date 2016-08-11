'use strict'

const os = require('os'),
      config = require('../config')

const assigned = () => {
  let count = 1
  let available = os.cpus().length
  let maxCpus = config.computation.maxCpus

  count = maxCpus > available ? available : maxCpus;

  return count ? count : 1
}

module.exports = {
  cpus: {
    assigned: assigned,
    model: os.cpus()[0].model
  }
}
