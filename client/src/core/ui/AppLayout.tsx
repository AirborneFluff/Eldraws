import React, { createContext, useCallback, useContext, useState } from 'react';
import { Layout, Skeleton } from 'antd';
import { Outlet, useFetcher } from 'react-router-dom';
import { usePathSegments } from '../hooks/usePathSegments.ts';
import { HumanizeWord } from '../utils/text-utilities.ts';
import { PageHeader } from '@ant-design/pro-components';

const { Header, Content } = Layout;

const PageContext = createContext<{
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setHeaderContent: (loading: HeaderContent) => void;
} | undefined>(undefined);

interface HeaderContent {
  title: string,
  subtitle: string
}

export function AppLayout() {
  let fetcher = useFetcher();
  const segments = usePathSegments();
  const routes = segments.map(segment => ({
    breadcrumbName: HumanizeWord(segment)
  }))
  const [isLoading, setIsLoading] = useState(false);
  const [headerContent, setHeaderContent] = useState<HeaderContent | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  function handleOnLogout() {
    fetcher.submit(null, {
      action: '/logout',
      method: 'post',
    });
  }

  return (
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
        <PageContext.Provider value={{ setLoading, setHeaderContent }}>
          <div className='container'>
            <div className='rounded-sm p-8 bg-gray-100'>
              {headerContent &&
                <PageHeader
                  onBack={() => window.history.back()}
                  title={isLoading ? <Skeleton.Input size='large' active /> : headerContent.title}
                  subTitle={isLoading ? <Skeleton.Input size='small' active /> : headerContent.subtitle}
                  breadcrumb={{routes}} />
              }
              <Outlet />
            </div>
          </div>
        </PageContext.Provider>
      </Content>
    </Layout>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageLoading must be used within a PageLoadingProvider');
  }
  return context;
}