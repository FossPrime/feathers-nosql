import { Params } from '@feathersjs/feathers'
export * from './declarations'
export * from './service.d.js'
export { filterQuery, FILTERS, OPERATORS } from './query'
export * from './sort'
export declare function select(params: Params, ...otherFields: string[]): (result: any) => any
