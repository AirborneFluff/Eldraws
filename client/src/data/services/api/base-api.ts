import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const baseQueryWithErrorTransform: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await delay(1000);
  const result = await baseQuery(args, api, extraOptions) as any;

  if (result.error) {
    return {
      error: {
        status: result.error.status,
        message: result.error.data || 'An error occurred',
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithErrorTransform,
  endpoints: () => ({}),
});