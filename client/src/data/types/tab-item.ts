import { ReactNode } from 'react';

export interface TabItem {
  key: string,
  label: string,
  children: ReactNode
}