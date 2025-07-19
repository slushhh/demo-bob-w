import { NavLink } from 'react-router'
import { Layout, Space } from 'antd'

import { Routes } from '@/data/routes'

import styles from './styles.module.scss'

const { Header: HeaderAntd } = Layout

const Header = () => {
  return (
    <HeaderAntd style={{}} className={styles.header}>
      <Space size='middle'>
        <NavLink to={Routes.Root}>Home</NavLink>
        <NavLink to={Routes.About}>About</NavLink>
      </Space>
    </HeaderAntd>
  )
}

export { Header }
