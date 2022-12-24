export const Cache = {
  _cache: {},
  size: 0,
  hitCount: 0,
  missCount: 0,

  put: function (key, value) {
    if (this._cache[key] === undefined) {
      this.size++
    }
    this._cache[key] = value
  },

  del: function (key) {
    this.size--
    delete this._cache[key]
  },

  get: function (key) {
    const data = this._cache[key]
    if (data) {
      this.hitCount++
      return this._cache[key]
    }
    this.missCount++
    return null
  },

  has: function (key) {
    return this._cache[key] !== undefined
  },

  clear: function () {
    this._cache = Object.create(null)
    this.size = 0
    this.hitCount = 0
    this.missCount = 0
  },
}
