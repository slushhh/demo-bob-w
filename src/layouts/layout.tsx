import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { Layout } from 'antd'

import { useNetwork } from '@/hooks'
import { Header, Footer } from '@/layouts'

const { Content } = Layout

/**
 * App layout, aliases: App, Root, and so on
 */
const AppLayout = () => {
  const { getProperty } = useNetwork()

  // This is where we ask for property data,
  // because we need the time zone that we use
  // in different parts of the application
  useEffect(() => getProperty(), [])

  return (
    <Layout>
      <Header />
      <Content style={{ padding: '0 50px' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}

export { AppLayout }
