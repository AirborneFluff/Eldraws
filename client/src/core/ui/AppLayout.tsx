import React from 'react';
import { Breadcrumb, ConfigProvider, Layout } from 'antd';
import { Outlet, useFetcher, useNavigate } from 'react-router-dom';
import { usePathSegments } from '../hooks/usePathSegments.ts';
import { HumanizeWord } from '../utils/text-utilities.ts';

const { Header, Content } = Layout;

export function AppLayout() {
  let fetcher = useFetcher();
  const navigate = useNavigate();
  const segments = usePathSegments();
  const breadcrumbItems = segments.map(segment => { return {title: HumanizeWord(segment)} })

  function handleOnLogout() {
    fetcher.submit(null, {
      action: '/logout',
      method: 'post',
    });
  }

  return (
    <ConfigProvider>
      <Layout className='min-h-screen bg-gray-200'>
        <Header className='flex items-center'>
          {/*<Menu
            className='flex-grow flex-shrink basis-0 flex justify-end'
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']} >
            <Menu.Item key='home' icon={<PieChartOutlined />} onClick={() => navigate('/app')}>Home</Menu.Item>
            <Menu.Item key='logout' className='ml-auto' icon={<UserOutlined />} onClick={handleOnLogout}>Logout</Menu.Item>
          </Menu>*/}
        </Header>
        <Content className='p-1'>
          <div className='container'>
            <Breadcrumb className='px-8 py-4' items={breadcrumbItems} />
            <div className='rounded-sm p-8 bg-gray-100'>
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}