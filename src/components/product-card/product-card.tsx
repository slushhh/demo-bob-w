import { useEffect, useState, useContext } from 'react'
import { Image, Checkbox, Tooltip, Space, Badge } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import cls from 'classnames'

import { SettingsContext } from '@/context'
import { useDateTime, useURLSearchParams } from '@/hooks'
import { paramsIds, priceWithTax } from '@/utils'

import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { APIProduct } from '@/types/api'

import styles from './styles.module.scss'

type Props = APIProduct

/**
 * Product card
 */
const ProductCard = (props: Props) => {
  const { id, image, name, priceNet, priceTaxPercentage, chargeMethod } = props
  const { breakfastId, minNightsForFreeBreakfast } = useContext(SettingsContext)

  const { setSearchParams, params, search } = useURLSearchParams()
  const { numberOfDays } = useDateTime()
  const [isChecked, setIsChecked] = useState(false)

  // Is the user entitled to a free breakfast
  const isFreeBreakfast = numberOfDays >= minNightsForFreeBreakfast && id === breakfastId

  // Here we calculate prices for various situations,
  // including discount prices, taxes and more.
  // By law, tax is added to the price with or without a discount
  const basePrice = priceWithTax(priceNet, priceTaxPercentage)
  const totalPrice = basePrice * numberOfDays
  const finalPrice = chargeMethod === 'nightly' ? totalPrice : basePrice
  const urlParamKey = 'productIds'

  const badgeStyles = cls({
    [styles.hideBadge]: !isFreeBreakfast,
  })

  // Small shortcuts
  let basePriceTooltip: string
  let finalPriceTooltip: string

  // We want to visually show the user how
  // and why prices are formed. Including
  // free breakfast
  if (isFreeBreakfast) {
    basePriceTooltip = finalPriceTooltip = "It's free for you!"
  } else {
    basePriceTooltip = `You will be charged ${chargeMethod}`
    finalPriceTooltip = `Product price of ${basePrice} € x ${numberOfDays} day booking`

    if (chargeMethod === 'once-per-booking') finalPriceTooltip = 'On the day of use'
  }

  // If the user came through a direct link,
  // we can set the status of selected products
  useEffect(() => {
    const { isIdSet } = paramsIds(params, urlParamKey, id)
    setIsChecked(isIdSet)
  }, [search])

  const onCheckboxChange = (ev: CheckboxChangeEvent) => {
    const { newParams } = paramsIds(params, urlParamKey, id)

    setSearchParams(Object.fromEntries(newParams))
    setIsChecked(ev.target.checked)
  }

  return (
    <Badge.Ribbon text='Free' color='green' className={badgeStyles}>
      <Space className={styles.card} size='middle' data-product-id={id} align='start'>
        <Image className={styles.image} src={image} preview={false} />

        <Space direction='vertical' style={{ padding: '10px 0' }}>
          <div className={styles.name}>
            <h2>{name}</h2>
          </div>

          <div className={styles.price}>
            Price: {basePrice.toFixed(2)} &euro;
            <Tooltip
              color='orange'
              className={styles.infoIcon}
              placement='top'
              title={basePriceTooltip}
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>

          <div className={styles.price}>
            Total price: {finalPrice.toFixed(2)} &euro;
            <Tooltip
              color='orange'
              className={styles.infoIcon}
              placement='top'
              title={finalPriceTooltip}
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>

          <Checkbox checked={isChecked} onChange={onCheckboxChange}>
            Include in booking
          </Checkbox>
        </Space>
      </Space>
    </Badge.Ribbon>
  )
}

export { ProductCard }
