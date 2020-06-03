import React, { useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import Rest from '../page/Rest'
const { Header, Sider, Content } = Layout
const { Title } = Typography
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BookOutlined,
  ContactsOutlined,
} from '@ant-design/icons'
import logo from '../images/logo/automizy-color-logo-full.svg';
import "./Layout.css"

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('rental')

  const handleOnClickToggle = () => {
    setCollapsed(!collapsed)
  }

  const handleOnClickMenu = e => {
    setActiveMenu(e.key)
  }
  const header = {
    'user': 'User handler',
    'book': 'Book handler',
    'rental': 'Rental handler'
  }
  return (
    <Layout className="layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className={"sider"}
        >
        <img 
          className={collapsed ? "logo-hide" : "logo"}
          src={logo}
          alt={""}/>
        <Menu 
          theme="dark" 
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={ e => handleOnClickMenu(e) }>
          <Menu.Item key="user" icon={<UserOutlined />}>
            User
          </Menu.Item>
          <Menu.Item key="book" icon={<BookOutlined />}>
            Book
          </Menu.Item>
          <Menu.Item key="rental" icon={<ContactsOutlined />}>
            Rental
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <Toggle 
            onClick={handleOnClickToggle} 
            collapsed={collapsed}/>
          <Title>{header[activeMenu]}</Title>
        </Header>
        <Content className="content">
          <Rest/>
        </Content>
      </Layout>
    </Layout>
  )
}
const Toggle=({
  onClick,
  collapsed
})=>{
  return(
    <div
      onClick={onClick}
      className="toggle">
      { collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
    </div>
  )
}
export default App