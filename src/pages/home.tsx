import { useEffect, useState } from 'react'
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

// ant-picker-cell-today disables `Today` frame
// ant-picker-range-arrow

/**
 * Home page with the ability to select
 * the date and time of the booking
 */
const Home = () => {
  document.title = 'Bob W | Exceptionally cool short-stay apartments'

  const [dateRange, setDateRange] = useState<[string, string] | Array<undefined>>([])
  const [checkInRange, setCheckInRange] = useState<Array<CheckInOutRange>>()
  const [checkOutRange, setCheckOutRange] = useState<Array<CheckInOutRange>>()

  const [checkIn, setCheckIn] = useState<string>()
  const [checkOut, setCheckOut] = useState<string>()

  const property = useSelector((state: RootState) => state.propertySlice.value)
  const isPropertyLoaded = !!Object.keys(property).length

  dayjs.extend(timezone)
  dayjs.extend(utc)
  dayjs.tz.setDefault(property?.timezone)

  useEffect(() => {
    if (property) {
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

      const endTime = property.endTimesLocal?.map(t => ({
        value: t,
        label: t,
      }))

      setCheckInRange(startTime)
      setCheckOutRange(endTime)
    }
  }, [property, dateRange])

  /**
   * Here we block the past for time zone
   * property dates
   */
  const disablePrevDates = (pickerDate: dayjs.Dayjs) => {
    const pickerDateTZ = dayjs(pickerDate).tz()
    const currentPropDate = dayjs().tz()
    const isSameDate = pickerDateTZ.isSame(currentPropDate, 'date')

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
