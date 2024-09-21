import React, {createContext, useCallback, useContext, useState} from 'react';
import {Layout, Skeleton} from 'antd';
import { Outlet, useFetcher, useNavigate } from 'react-router-dom';
import {usePathSegments} from '../hooks/usePathSegments.ts';
import {HumanizeWord} from '../utils/text-utilities.ts';
import {PageHeader} from '@ant-design/pro-components';
import {ArrowLeftOutlined} from "@ant-design/icons";


const {Header, Content} = Layout;

const PageContext = createContext<{
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setHeaderContent: (content: HeaderContent) => void;
  addBreadcrumbOverride: (item: BreadcrumbOverride) => void;
} | undefined>(undefined);

interface HeaderContent {
  title: string,
  subtitle: string,
  backRoute: string | undefined
}

interface BreadcrumbOverride {
  match: string,
  override: string
}

export function AppLayout() {
  let fetcher = useFetcher();
  const segments = usePathSegments();
  const routes = segments.map(segment => ({
    breadcrumbName: HumanizeWord(segment)
  }))
  const [isLoading, setIsLoading] = useState(false);
  const [headerContent, setHeaderContent] = useState<HeaderContent>();
  const [breadcrumbOverrides, setBreadcrumbOverrides] = useState<BreadcrumbOverride[]>([]);
  const navigate = useNavigate();

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const breadcrumbs = routes.map(bc => {
    const index = breadcrumbOverrides
      .findIndex(override => override.match.toLowerCase() === bc.breadcrumbName.toLowerCase());
    if (index === -1) return bc;

    return {
      breadcrumbName: breadcrumbOverrides[index].override
    }
  })

  function handleOnLogout() {
    fetcher.submit(null, {
      action: '/logout',
      method: 'post',
    });
  }

  function addBreadcrumbOverride(item: BreadcrumbOverride) {
    setBreadcrumbOverrides(curr => {
      const index = curr.findIndex(ov => ov.match.toLowerCase() === item.match.toLowerCase());

      if (index !== -1) {
        const newOverrides = [...curr];
        newOverrides[index] = item;
        return newOverrides;
      }

      return [...curr, item];
    });
  }

  function handleOnBackPress() {
    if (headerContent.backRoute == undefined) {
      window.history.back();
      return;
    }

    navigate(headerContent.backRoute);
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
      <Content>
        <PageContext.Provider value={{setLoading, setHeaderContent, addBreadcrumbOverride}}>
          <div className='container'>
            <div className='rounded-sm p-4 md:p-8 bg-gray-100'>
              {headerContent &&
                <PageHeader
                  backIcon={breadcrumbs.length > 1 ? <ArrowLeftOutlined /> : false}
                  onBack={handleOnBackPress}
                  title={isLoading ? <Skeleton.Input size='large' active/> : headerContent.title}
                  subTitle={isLoading ? <Skeleton.Input size='small' active/> : headerContent.subtitle}
                  breadcrumb={{breadcrumbs}}/>
              }
              <Outlet/>
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