import { Collection as CollectJS } from 'collect.js'

export class Collection extends CollectJS {
  /**
   * Remove all duplicated values from the array.
   *
   * @return {any[]}
   */
  removeDuplicated() {
    return [...new Set(this.all())]
  }
}

Collection.prototype.order = Collection.prototype.sort
Collection.prototype.orderBy = Collection.prototype.sortBy
Collection.prototype.orderByDesc = Collection.prototype.sortByDesc
Collection.prototype.orderDesc = Collection.prototype.sortDesc
Collection.prototype.orderKeys = Collection.prototype.sortKeys
Collection.prototype.orderKeysDesc = Collection.prototype.sortKeysDesc
