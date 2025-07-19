/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shortcut for `object` type, where `key`
 * is a `string` or `number`, value is anything
 */
type Dictionary<T = any> = {
  [key: string | number]: T
}
