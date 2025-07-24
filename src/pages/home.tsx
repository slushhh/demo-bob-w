import { useEffect, useMemo, useState } from 'react'
import { DatePicker, Button, Select, Space } from 'antd'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { Routes } from '@/data/routes'

import type { RootState } from '@/store'

const { RangePicker } = DatePicker

type CheckInOutRange = {
  value: string
  label: string
  disabled?: boolean
}

// Adding extensions to the library
dayjs.extend(timezone)
dayjs.extend(utc)

/**
 * Home page with the ability to select
 * the date and time of the booking
 */
const Home = () => {
  const [dateRange, setDateRange] = useState<[string, string] | Array<undefined>>([])
  const [checkInRange, setCheckInRange] = useState<Array<CheckInOutRange>>()
  const [checkOutRange, setCheckOutRange] = useState<Array<CheckInOutRange>>()

  const [checkIn, setCheckIn] = useState<string>()
  const [checkOut, setCheckOut] = useState<string>()

  const property = useSelector((state: RootState) => state.propertySlice.value)
  const isPropertyLoaded = useMemo(() => !!Object.keys(property).length, [property])

  useEffect(() => {
    document.title = 'Bob W | Exceptionally cool short-stay apartments'
  }, [])

  useEffect(() => {
    // Set the property's time zone instead of the client's time zone
    if (property?.timezone) dayjs.tz.setDefault(property?.timezone)
  }, [property?.timezone])

  useEffect(() => {
    if (isPropertyLoaded && property?.startTimesLocal) {
      // Here we handle the situation when the time
      // in the time zone of the property is already
      // later than the possible hours for chick-in.
      // That is, we cannot let the user select the
      // check-in time of 13:00 if the destination is
      // already 15:00
      // Accordingly, we block such options
      const startTime = property.startTimesLocal?.map(t => {
        const [hour, minute] = t.split(':')
        const startDate = dateRange[0] // e.g. 2023-06-05

        const isSameDay = dayjs().tz().isSame(startDate, 'day')
        const hours = dayjs().tz().hour(+hour).minute(+minute).second(0)
        const isSmallerHour = dayjs().tz().isAfter(hours)

        return {
          value: t,
          label: t,
          disabled: isSameDay ? isSmallerHour : false,
        }
      })

      setCheckInRange(startTime)
    }
  }, [isPropertyLoaded, property?.startTimesLocal, dateRange[0]])

  useEffect(() => {
    if (isPropertyLoaded && property?.endTimesLocal) {
      const endTime = property.endTimesLocal?.map(t => ({
        value: t,
        label: t,
      }))

      setCheckOutRange(endTime)
    }
  }, [isPropertyLoaded, property?.endTimesLocal])

  /**
   * Here we block the days that are before the
   * current property time zone date
   *
   * This function is a performance bottleneck in
   * some browsers, the Antd library RangePicker
   * triggers this function every time you open the
   * calendar and move the cursor over the days without
   * clicking on them. However, some calculations in
   * the Day.js library are quite slow, especially in Safai.
   * At the same time, this function is
   * hard to optimize using caching hooks because the
   * RangePicker throws a new object as a parameter
   * each time this function is called.
   * One of the optimization plans is to completely
   * replace the calendar widget with another one.
   *
   * TODO: optimize the calculations in this function
   */
  const disablePrevDates = (pickerDate: dayjs.Dayjs) => {
    const pickerDateTZ = dayjs(pickerDate).tz()
    const currentPropDate = dayjs().tz()
    const isSameDate = pickerDateTZ.isSame(currentPropDate, 'date')

    // Check if the RangePicker object is the current
    // date, and if so, whether the current date contains
    // time slots when the user can book room of the property
    if (isSameDate) {
      const isAnyAvailableTime = checkInRange?.some(r => !r.disabled)
      return !isAnyAvailableTime
    }

    return pickerDateTZ.isBefore(currentPropDate, 'date')
  }

  const onChange = (range: [dayjs.Dayjs, dayjs.Dayjs]) => {
    const [startDate, endDate] = range

    setDateRange([startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')])
  }

  const onSearchURL = () => {
    let url: string = Routes.Rooms

    if (dateRange.length) {
      const [startDate, endDate] = dateRange

      url += `?startDate=${startDate}&endDate=${endDate}`

      if (checkIn) url += '&checkIn=' + checkIn
      if (checkOut) url += '&checkOut=' + checkOut
    }

    return url
  }

  return (
    <Space>
      <RangePicker
        disabled={!isPropertyLoaded}
        disabledDate={disablePrevDates}
        // @ts-expect-error wrong type of onChange event
        onChange={onChange}
        size='middle'
        allowClear={false}
        inputReadOnly={true}
        separator={null}
        clearIcon={false}
      />

      <Select
        onChange={setCheckIn}
        loading={!isPropertyLoaded}
        disabled={!isPropertyLoaded || !dateRange.length}
        placeholder='Check In'
        options={checkInRange}
      />

      <Select
        onChange={setCheckOut}
        loading={!isPropertyLoaded}
        disabled={!isPropertyLoaded || !dateRange.length}
        placeholder='Check Out'
        options={checkOutRange}
      />

      <Link to={onSearchURL()}>
        <Button disabled={!isPropertyLoaded || !dateRange.length || !checkIn || !checkOut}>
          Search
        </Button>
      </Link>
    </Space>
  )
}

export { Home }
export default Home
