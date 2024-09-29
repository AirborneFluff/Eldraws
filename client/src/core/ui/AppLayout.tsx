import React, {createContext, useCallback, useContext, useState} from 'react';
import {Layout, Skeleton} from 'antd';
import { Outlet, useFetcher, useNavigate } from 'react-router-dom';
import {usePathSegments} from '../hooks/usePathSegments.ts';
import {HumanizeWord} from '../utils/text-utilities.ts';
import {PageHeader} from '@ant-design/pro-components';
import {ArrowLeftOutlined} from "@ant-design/icons";
import { useBreakpoints } from '../hooks/useBreakpoints.ts';


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
  const {currentBreakpoint} = useBreakpoints();

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
    <Layout className='h-screen'>
      <Header className='bg-gray-200 px-0.5 sm:px-4 flex items-center'>
        {headerContent &&
          <div className='container flex justify-between'>
            <PageHeader
              className='text-white'
              backIcon={breadcrumbs.length > 1 ? <ArrowLeftOutlined /> : false}
              onBack={handleOnBackPress}
              title={isLoading ? <Skeleton.Input size='large' active/> : headerContent.title}
              subTitle={isLoading ? <Skeleton.Input size='small' active/> : headerContent.subtitle}
              breadcrumb={{breadcrumbs}}/>
            <span>{currentBreakpoint}</span>
          </div>
        }
      </Header>
      <Layout>
        <Content className='overflow-y-auto'>
          <PageContext.Provider value={{setLoading, setHeaderContent, addBreadcrumbOverride}}>
            <div className='container'>
              <div className='rounded-md p-4 md:p-8 bg-white shadow-lg'>
                <Outlet/>
              </div>
            </div>
          </PageContext.Provider>
        </Content>
      </Layout>
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