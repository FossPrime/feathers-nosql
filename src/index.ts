import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { sorter, select, AdapterService } from '@feathersjs/adapter-commons'
import sift from 'sift'

import type { ServiceOptions } from '@feathersjs/adapter-commons'

const _select = (data: any, params: any, ...args: any) => {
  const base = select(params, ...args)

  return base(JSON.parse(JSON.stringify(data)))
}

export interface MemoryServiceStore {
  [key: number]: any
}

interface MemoryServiceOptions extends ServiceOptions {
  store: MemoryServiceStore
  startId: number
  matcher: (query: any) => any
  sorter: (sort: any) => any
}

export class Service extends AdapterService {
  _uId: any
  store: any
  options: MemoryServiceOptions
  // Todo: types
  constructor(options?: Partial<MemoryServiceOptions>) {
    super(
      _.extend(
        {
          id: 'id',
          matcher: sift,
          sorter
        },
        options
      )
    )
    this._uId = options?.startId || 0
    this.store = options?.store || {}
  }

  async getEntries(params = {}) {
    const { query } = this.filterQuery(params)

    return this._find(
      Object.assign({}, params, {
        paginate: false,
        query
      })
    )
  }

  async _find(params = {}) {
    const { query, filters, paginate } = this.filterQuery(params)
    let values = _.values(this.store).filter(this.options.matcher(query))
    const total = values.length

    if (filters.$sort !== undefined) {
      values.sort(this.options.sorter(filters.$sort))
    }

    if (filters.$skip !== undefined) {
      values = values.slice(filters.$skip)
    }

    if (filters.$limit !== undefined) {
      values = values.slice(0, filters.$limit)
    }

    const result = {
      total,
      limit: filters.$limit,
      skip: filters.$skip || 0,
      data: values.map(value => _select(value, params))
    }

    // Todo: types
    if (!(paginate && (paginate as any).default)) {
      return result.data
    }

    return result
  }

  async _get(id, params = {}) {
    if (id in this.store) {
      const { query } = this.filterQuery(params)
      const value = this.store[id]

      if (this.options.matcher(query)(value)) {
        return _select(value, params, this.id)
      }
    }

    throw new errors.NotFound(`No record found for id '${id}'`)
  }

  // Create without hooks and mixins that can be used internally
  async _create(data, params = {}) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this._create(current, params)))
    }

    const id = data[this.id] || this._uId++
    const current = _.extend({}, data, { [this.id]: id })
    const result = (this.store[id] = current)

    return _select(result, params, this.id)
  }

  async _update(id, data, params = {}) {
    const oldEntry = await this._get(id)
    // We don't want our id to change type if it can be coerced
    const oldId = oldEntry[this.id]

    id = oldId == id ? oldId : id // eslint-disable-line

    this.store[id] = _.extend({}, data, { [this.id]: id })

    return this._get(id, params)
  }

  async _patch(id, data, params = {}) {
    const patchEntry = entry => {
      const currentId = entry[this.id]

      this.store[currentId] = _.extend(this.store[currentId], _.omit(data, this.id))

      return _select(this.store[currentId], params, this.id)
    }

    if (id === null) {
      const entries = await this.getEntries(params) as any[]

      return entries.map(patchEntry)
    }

    return patchEntry(await this._get(id, params)) // Will throw an error if not found
  }

  // Remove without hooks and mixins that can be used internally
  async _remove(id, params = {}) {
    if (id === null) {
      const entries = await this.getEntries(params) as any[]

      return Promise.all(entries.map(current => this._remove(current[this.id], params)))
    }

    const entry = await this._get(id, params)

    delete this.store[id]

    return entry
  }
}

// TODO: Default exports are problematic... check if we can remove this
export default (options?: Partial<MemoryServiceOptions>) => {
  return new Service(options)
}
