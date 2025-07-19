import dayjs from 'dayjs'

/**
 * Calculates the final price with tax
 */
export const priceWithTax = (priceNet: number | string, tax: number | string): number => {
  const p = parseFloat(priceNet as string)
  const t = parseFloat(tax as string)
  return +(p + p * (t / 100)).toFixed(2)
}

/**
 * Calculates the final price with a
 * discount (returns the final price
 * without tax)
 */
export const priceWithDiscount = (priceNet: number | string, discount: number | string): number => {
  const p = parseFloat(priceNet as string)
  const d = parseFloat(discount as string)
  return +(p - p * (d / 100)).toFixed(2)
}

/**
 * Allows to set, read and delete several
 * values in one URL parameter
 * @example ...restUrlParams&productIds=1-2-3
 */
export const paramsIds = (params: Map<string, string>, paramKey: string, id: string | number) => {
  const newParams = new Map(params)
  const idString = id.toString()

  const recordIds: string = newParams.get(paramKey) || ''
  const iDs = recordIds ? recordIds.split('-') : []
  const isIdSet = iDs.includes(idString)

  if (isIdSet) {
    // If the value is set, delete it
    const idIndex = iDs.findIndex(i => i === idString)
    iDs.splice(idIndex, 1)

    const newIds = iDs.join('-')

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    newIds === '' ? newParams.delete(paramKey) : newParams.set(paramKey, newIds)
  } else {
    // Set a value in the parameter
    iDs.push(idString)
    const newIds = iDs.join('-')
    newParams.set(paramKey, newIds)
  }

  return { isIdSet, newParams }
}

export const datesRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  const startDateOnly = dayjs(startDate).utc().hour(0).minute(0).second(0)
  const endDateOnly = dayjs(endDate).utc().hour(0).minute(0).second(0)

  const range: Array<string> = []
  const daysInRange = endDateOnly.diff(startDateOnly, 'days')

  for (let i = 0; i < daysInRange + 1; i++) {
    range.push(startDateOnly.hour(0).minute(0).second(0).add(i, 'day').format('YYYY-MM-DD'))
  }

  const rangeSlice = range.slice(1, -1)

  return {
    daysInRange,
    range,
    rangeSlice,
  }
}
