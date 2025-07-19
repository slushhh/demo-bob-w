import { Layout, Space } from 'antd'

import styles from './styles.module.scss'

const { Footer: FooterAntd } = Layout

const Footer = () => {
  return (
    <FooterAntd
      style={{}}
      className={styles.footer}
    >
      <Space size='middle'>About Bob W.</Space>
    </FooterAntd>
  )
}

export { Footer }
