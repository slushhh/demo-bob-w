import { useContext } from 'react'
import { Image, Button, Tag, Badge, Space } from 'antd'
import { Link } from 'react-router'
import cls from 'classnames'

import { SettingsContext } from '@/context'
import { Routes } from '@/data/routes'
import { useDateTime, useURLSearchParams } from '@/hooks'
import { priceWithDiscount, priceWithTax } from '@/utils'

import type { APIRoom } from '@/types/api'

import styles from './styles.module.scss'

type Props = APIRoom

const RoomCard = (props: Props) => {
  const { id, image, name, pricePerNightNet, priceTaxPercentage } = props
  const { roomDiscount, minNightsForRoomDiscount } = useContext(SettingsContext)

  const { search } = useURLSearchParams()
  const { numberOfDays } = useDateTime()

  // Is the user entitled to discount prices
  const isRoomsDiscounted = numberOfDays >= minNightsForRoomDiscount
  const discountedPrice = priceWithDiscount(pricePerNightNet, roomDiscount)

  // Here we calculate prices for various situations,
  // including discount prices, taxes and more.
  // By law, tax is added to the price with or without a discount
  const basePrice = isRoomsDiscounted ? discountedPrice : pricePerNightNet
  const finalPrice = priceWithTax(basePrice, priceTaxPercentage) * numberOfDays

  const badgeStyles = cls({
    [styles.hideBadge]: !isRoomsDiscounted,
  })

  const bookRoomURL = () => {
    // This meant dynamic links, depending on
    // how the user got to the room selection page
    // const isRequiredData = [params.has('startDate'), params.has('endDate')].every(Boolean)

    // const roomDetailsURL = Routes.Room + '/' + id
    const roomBookingURL = Routes.Products + search + '&roomId=' + id

    // return isRequiredData ? roomBookingURL : roomDetailsURL

    return roomBookingURL
  }

  return (
    <div className={styles.card} data-room-id={id}>
      <Image className={styles.image} src={image} preview={false} width='100%' />

      <Badge.Ribbon text='Discount' color='green' className={badgeStyles}>
        <Space direction='vertical' size='small' style={{ padding: '20px' }}>
          <div className={styles.name}>
            <h1>{name}</h1>
          </div>
          <div className={styles.price}>Price per night: {basePrice.toFixed(2)}</div>
          <div className={styles.price}>Total price: {finalPrice.toFixed(2)}</div>

          <Space style={{ marginTop: '10px' }}>
            <Tag bordered={false} style={{ backgroundColor: '#f5f7f6' }}>
              40 m2
            </Tag>

            <Tag bordered={false} style={{ backgroundColor: '#f5f7f6' }}>
              Sauna
            </Tag>

            <Tag bordered={false} style={{ backgroundColor: '#f5f7f6' }}>
              Pet Friendly
            </Tag>
          </Space>

          <Link to={bookRoomURL()}>
            <Button>Book Room</Button>
          </Link>
        </Space>
      </Badge.Ribbon>
    </div>
  )
}

export { RoomCard }
