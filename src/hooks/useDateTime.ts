import { useSelector } from 'react-redux'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { useURLSearchParams } from '@/hooks'
import { datesRange } from '@/utils'
import type { APIBooking } from '@/types/api'
import type { RootState } from '@/store'

/**
 * Hook for various manipulations on dates,
 * time and everything related to it.
 * The calculation of the date intersection is
 * done here
 */
const useDateTime = (startDate?: string, endDate?: string) => {
  const property = useSelector((state: RootState) => state.propertySlice.value)

  dayjs.extend(timezone)
  dayjs.extend(utc)
  dayjs.tz.setDefault(property?.timezone)

  // These are the most important variables
  const passedStartDate = startDate && dayjs(startDate).tz()
  const passedEndDate = endDate && dayjs(endDate).tz()

  const { params } = useURLSearchParams()
  let numberOfDays: number

  // From the URL parameters we make the user's booking date
  // So far it's just strings
  const userStartDate = passedStartDate || params.get('startDate') + 'T' + params.get('checkIn')
  const userEndDate = passedEndDate || params.get('endDate') + 'T' + params.get('checkOut')

  /**
   * Converts string dates selected by user
   * to `UTC` timezone
   */
  const userBookingToDayJs = () => {
    // Here we convert string user-selected booking dates
    // into a Dayjs object, and convert that date into a UTC
    // timezone
    // We manually set the necessary values so that Dayjs does
    // not "assume" anything automatically

    /** In UTC format */
    const userBookingStart = dayjs()
      .tz()
      .year(dayjs(userStartDate).year())
      .month(dayjs(userStartDate).month())
      .date(dayjs(userStartDate).date())
      .hour(dayjs(userStartDate).hour())
      .minute(dayjs(userStartDate).minute())
      .second(0)
      .utc()

    /** In UTC format */
    const userBookingEnd = dayjs()
      .tz()
      .year(dayjs(userEndDate).year())
      .month(dayjs(userEndDate).month())
      .date(dayjs(userEndDate).date())
      .hour(dayjs(userEndDate).hour())
      .minute(dayjs(userEndDate).minute())
      .second(0)
      .utc()

    return {
      userBookingStart,
      userBookingEnd,
    }
  }

  /**
   * A function that contains the entire routine
   * of calculating overlapping dates and times
   * for the booked room and the user's selected
   * booking
   */
  const checkDateOverlaps = (bookingData: APIBooking, roomId?: number) => {
    let shouldDisplay = true

    // Convert string dates from the server to Dayjs
    // object and to UTC timezone (I want to be explicit)
    // Here the dates and times should not be changed by Dayjs
    const roomBookingStart = dayjs(bookingData.startDateUtc).tz().utc()
    const roomBookingEnd = dayjs(bookingData.endDateUtc).tz().utc()

    const { userBookingStart, userBookingEnd } = userBookingToDayJs()

    // To avoid having to invent a bunch of variables
    // with long names in order to avoid collisions, we
    // create scopes

    /** Room booking scope */
    const roomBooking = {
      daysInRange: 0 as number,
      range: [] as Array<string>,
      rangeSlice: [] as Array<string>,
    }

    /** User booking scope */
    const userBooking = {
      daysInRange: 0 as number,
      range: [] as Array<string>,
      rangeSlice: [] as Array<string>,
    }

    // Here we do internal calculations in blocks, since
    // there is no need to use created variables from outside
    // the block

    // Calculating the dates of the booked room
    {
      const { daysInRange, range, rangeSlice } = datesRange(roomBookingStart, roomBookingEnd)

      roomBooking.daysInRange = daysInRange
      roomBooking.range = range
      roomBooking.rangeSlice = rangeSlice
    }

    // Calculation of user booking dates
    {
      const { daysInRange, range, rangeSlice } = datesRange(userBookingStart, userBookingEnd)

      userBooking.daysInRange = daysInRange
      userBooking.range = range
      userBooking.rangeSlice = rangeSlice
    }

    // Here's where the fun part happens, we test the
    // various date and time intersections to see if we
    // can let the user select a room

    // Scenario 1

    /**
     * Does the end date of the user's booking
     * match the start date of the booked room
     */
    const userEndToRoomStart = dayjs(roomBookingStart).isSame(userBookingEnd, 'date')

    /**
     * Does the end date of the booked room match
     * the start date of the user's booking
     */
    const roomEndToUserStart = dayjs(roomBookingEnd).isSame(userBookingStart, 'date')

    // If the end date of the booked room matches
    // with the selected start date of the user's
    // booking, we want to understand if the booking
    // date of the booked room ends before the selected
    // time of the user's check-in
    if (roomEndToUserStart) {
      const isEndsBefore = roomBookingEnd.isBefore(userBookingStart, 'minute')

      if (!isEndsBefore) shouldDisplay = false
      if (!isEndsBefore) console.log('Room end overlaps with user booking start', roomId)
    }

    // If the selected end date of the user's
    // booking matches with the start date of the
    // booked room, we want to understand if the
    // booking date of the booked room starts later
    // than the selected checkout time of the user
    if (userEndToRoomStart) {
      const isStartsAfter = roomBookingStart.isAfter(userBookingEnd, 'minute')

      if (!isStartsAfter) shouldDisplay = false
      if (!isStartsAfter) console.log('User booking end overlaps with room booking start', roomId)
    }

    // Scenario 2

    // If scenario 1 did not work, we want to check
    // if any of the dates of the user's booking and
    // the dates of the booked room match at all
    if (!roomEndToUserStart && !userEndToRoomStart) {
      const roomDatesSlice = roomBooking.rangeSlice
      const userDatesSlice = userBooking.rangeSlice

      const overlaps = roomDatesSlice.findIndex(i => userDatesSlice.includes(i))

      if (overlaps !== -1) shouldDisplay = false
      if (overlaps !== -1) console.log('Found other overlapping dates', roomId)
    }

    // Return the result, if no scenario worked,
    // then no overlapping dates were found and
    // the room can be booked
    return shouldDisplay
  }

  {
    // Here we calculate the number of days
    // (or nights) between the two dates
    const { userBookingStart, userBookingEnd } = userBookingToDayJs()
    numberOfDays = datesRange(userBookingStart, userBookingEnd).daysInRange
  }

  return { userBookingToDayJs, checkDateOverlaps, numberOfDays }
}

export { useDateTime }
