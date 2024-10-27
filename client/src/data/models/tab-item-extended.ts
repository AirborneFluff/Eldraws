import {TabItem} from "../types/tab-item.ts";

export interface TabItemExtended extends TabItem {
  visible?: boolean;
}

export function GetTabItems(tabs: TabItemExtended[]): TabItem[] {
  return tabs.filter((tab) => tab.visible !== false);
}