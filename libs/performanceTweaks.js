'use strict'

const os = require('os')

/**
 * Calculates the maximun number of cpus from the config & system
 * @param  {Integer} wanted Number of CPUs specified
 * @return {Integer} Number of processors
 */
const assigned = (wanted) => {
  let count = 1
  let available = os.cpus().length

  count = wanted > available ? available : wanted;

  return count ? count : 1
}

module.exports = {
  cpus: {
    assigned: assigned,
    model: os.cpus()[0].model
  }
}
