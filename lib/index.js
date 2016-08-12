const stream = require('stream')
const concat = require('concat-stream')

module.exports = class Map extends stream.Transform {
  constructor (opts) {
    super(opts)
    this.fetched = false;
  }
  test () {
    this.fn()
  }
  _transform (data, enc, next) {
    if (this.fetched || !this.lookup) {
      this.process(data,next)
      return
    }

    this.lookup.pipe(concat((data) => {
      this.lookupData = data
      this.fetched = true
      this.process(data, next)
    }))
  }
  setFn (fn) {
    this.fn = fn
    return this
  }
  setLookup (lookup) {
    this.lookup = lookup
    return this
  }
  process (data, next) {
    this.fn = this.fn ? this.fn : function(a) { return a }
    this.push(this.fn(data))
    next()
  }
}
