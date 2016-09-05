'use strict'

let tape = require('tape'),
    fask = require('../')

tape('Check lib.VERSION against package.json', (test) => {
  test.equal(
    fask.version,
    require('../package.json').version
  )
  test.end()
})
