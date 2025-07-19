import { Link } from 'react-router'
import { Button, Result } from 'antd'

import { Routes } from '@/data/routes'

import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  showGuard?: boolean
}>

/**
 * Higher Order Component, renders a 404 page
 * when a certain condition occurs
 */
const Guard404 = (props: Props) => {
  const { showGuard, children } = props

  return showGuard ? (
    <Result
      status='404'
      title='404'
      subTitle='Page not found'
      extra={
        <Link to={Routes.Root}>
          <Button>Back Home</Button>
        </Link>
      }
    />
  ) : (
    <>{children}</>
  )
}

export { Guard404 }
export default Guard404
