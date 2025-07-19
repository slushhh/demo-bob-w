import { Link, useRouteError } from 'react-router'
import { Result, Button } from 'antd'

import { Routes } from '@/data/routes'

/**
 * The `ErrorBoundary` used by `ReactRouter`
 * is actually the page that will display all
 * the errors of the app itself, routing errors
 * and everything else
 */
const Error = () => {
  const error = useRouteError()

  const backHomeButton = (
    <Link to={Routes.Root}>
      <Button>Back Home</Button>
    </Link>
  )

  return (
    // @ts-expect-error The type of error is always `unknown`
    (error.status === 404 && (
      <Result status='404' title='404' subTitle='Page not found' extra={backHomeButton} />
    )) || (
      <Result
        status='error'
        // @ts-expect-error The type of error is always `unknown`
        title={error.statusText || error.message}
        extra={backHomeButton}
      />
    )
  )
}

export { Error }
export default Error
