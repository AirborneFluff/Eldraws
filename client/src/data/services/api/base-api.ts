import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery, FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const enableDelay = import.meta.env.VITE_API_DELAY || false;

type CustomError = FetchBaseQueryError & {
  message: string;
};

// @ts-ignore
const baseQueryWithErrorTransform: BaseQueryFn<string | FetchArgs, unknown, CustomError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    return { error:  {...result, message: result.error.data || 'An error occurred'}}
  }

  if (enableDelay) await delay(500);
  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithErrorTransform,
  tagTypes: ['User'],
  endpoints: () => ({}),
});