import { useEffect } from 'react'
import { Col, Row, Spin } from 'antd'
import { useSelector } from 'react-redux'

import { RoomCard } from '@/components/room-card'
import { useDateTime, useNetwork } from '@/hooks'

import type { RootState } from '@/store'

/**
 * Displays a list of rooms filtered by parameters
 */
const Rooms = () => {
  document.title = 'Bob W | Booking: Select room'

  const rooms = useSelector((state: RootState) => state.roomsSlice.value)
  const bookings = useSelector((state: RootState) => state.bookingsSlice.value)

  const { checkDateOverlaps } = useDateTime()
  const { getRoomsAndBooking } = useNetwork()

  useEffect(() => getRoomsAndBooking(), [])

  return (
    <>
      {(!!rooms?.length && (
        <Row
          gutter={[
            { xs: 8, sm: 8, md: 16, lg: 24 },
            { xs: 8, sm: 8, md: 16, lg: 24 },
          ]}
          align='top'
          justify='space-between'
        >
          {rooms.map(r => {
            const isBooked = r.id in bookings
            let shouldDisplay = true

            if (isBooked) shouldDisplay = checkDateOverlaps(bookings[r.id], r.id)

            return (
              <Col
                hidden={!shouldDisplay}
                key={r.id}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={{ span: 24 }}
              >
                <RoomCard {...r} />
              </Col>
            )
          })}
        </Row>
      )) || <Spin size='large' style={{ position: 'relative', top: '5px', left: '5px' }} />}
    </>
  )
}

export { Rooms }
export default Rooms
