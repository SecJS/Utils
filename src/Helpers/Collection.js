import { Collection as CollectJS } from 'collect.js'

export class Collection extends CollectJS {
  /**
   * An alias for macro instance method:
   *
   * @example
   *  new Collection().macro()
   *  @param {string} name
   *  @param {Function} fn
   */
  static macro(name, fn) {
    return new Collection().macro(name, fn)
  }

  /**
   * Remove all duplicated values from the array.
   *
   * @return {any[]}
   */
  removeDuplicated() {
    return [...new Set(this.all())]
  }

  /**
   * Execute the toResource method inside objects if exists.
   *
   * @param {any} [criterias]
   * @return {any[]}
   */
  toResource(criterias = {}) {
    return this.all().map(item => item.toResource(criterias))
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.toResource = function (criterias = {}) {
  return this.map(model => model.toResource(criterias))
}

// eslint-disable-next-line no-extend-native
Array.prototype.toCollection = function () {
  return new Collection(this)
}

Collection.prototype.order = Collection.prototype.sort
Collection.prototype.orderBy = Collection.prototype.sortBy
Collection.prototype.orderByDesc = Collection.prototype.sortByDesc
Collection.prototype.orderDesc = Collection.prototype.sortDesc
Collection.prototype.orderKeys = Collection.prototype.sortKeys
Collection.prototype.orderKeysDesc = Collection.prototype.sortKeysDesc
