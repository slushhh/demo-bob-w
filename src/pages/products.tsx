import { useEffect } from 'react'
import { Button, Row, Col, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { useURLSearchParams, useNetwork } from '@/hooks'
import { Routes } from '@/data/routes'
import { Guard404 } from '@/components/guard-404'
import { ProductCard } from '@/components/product-card'

import type { RootState } from '@/store'
import type { APIUserBooking } from '@/types/api'

/**
 * Displays a list of products
 */
const Products = () => {
  document.title = 'Bob W | Booking: Select products'

  const { params } = useURLSearchParams()
  const { getProducts, bookRoom } = useNetwork()
  const navigate = useNavigate()

  const products = useSelector((state: RootState) => state.productsSlice.value)
  const userBooking = useSelector((state: RootState) => state.userBookingSlice.value)

  // This is a guard, if we determine that
  // the user got here but we do not have the
  // necessary data, we display a stub instead
  // of a list of products
  const isRequiredData = [
    params.has('startDate'),
    params.has('endDate'),
    params.has('roomId'),
  ].every(Boolean)

  useEffect(() => getProducts(), [])

  // Since this is the last but one step
  // to booking, after a successful order we
  // wipe the browser history, and if the user
  // tries to get here, he gets to the Home page
  useEffect(() => {
    if (Object.keys(userBooking).length) {
      history.pushState(null, '', Routes.Root)
      navigate(Routes.Root)
    }
  }, [userBooking])

  const onBookRoom = async () => {
    try {
      const bookingResult = (await bookRoom()) as APIUserBooking
      const { id } = bookingResult

      if (bookingResult) navigate(Routes.Success + '?bookingId=' + id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    (!!products?.length && (
      <Guard404 showGuard={!isRequiredData}>
        <Row
          gutter={[
            { xs: 8, sm: 8, md: 16, lg: 24 },
            { xs: 8, sm: 8, md: 16, lg: 24 },
          ]}
          align='top'
          justify='space-between'
        >
          {products.map(p => (
            <Col key={p.id} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }}>
              <ProductCard {...p} />
            </Col>
          ))}
        </Row>

        <Button onClick={onBookRoom} style={{ marginTop: '20px' }}>
          Confirm Booking
        </Button>
      </Guard404>
    )) || <Spin size='large' style={{ position: 'relative', top: '5px', left: '5px' }} />
  )
}

export { Products }
export default Products
