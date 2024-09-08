import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useFetcher, useNavigate, useRouteLoaderData } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Public', '/', <PieChartOutlined />),
  getItem('Protected', '/protected', <DesktopOutlined />),
  getItem('Logout', 'logout', <UserOutlined /> )
];

export function LayoutUI() {
  let { user } = useRouteLoaderData("root") as { user: string | null };
  const [collapsed, setCollapsed] = useState(false);
  let fetcher = useFetcher();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      fetcher.submit(null, {
        action: '/logout',
        method: 'post',  // Use 'post' because it's a form submission
      });
      return;
    }
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <h2>{user}</h2>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={onClick} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}