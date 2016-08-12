
const Map = require('../lib/index')
const streamify = require('stream-array')
const toArray = require('stream-to-array')
const concat = require('concat-stream')
const assert = require('chai').assert
const os = require('os')

let sample = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}]

//  .pipe(myTransform)
//  .pipe(process.stdout)

//filter.test()

function notInLookup (data) {
  return this.lookupData.some((d) => d.id === data.id)
}

function anaToObj (a) {
  return {id: a[0]}
}

function mapFn (o) {
  return {b: o.a}
}

describe('Simple mapping', () => {
  it('Should be able to map a property to another', (done) => {
    streamify(sample)
      .pipe(new Map({objectMode: true}).setFn((o) => {return {b: o.a}}))
      .pipe(concat((data) => {
        for(var i = 0; i < sample.length; i++) {
          assert.strictEqual(sample[i].a, data[i].b, 'these property value are stricly equal')
        }
        done()
      }))
  })
})
