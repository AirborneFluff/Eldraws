import {Flex, Space} from "antd";
import React from "react";

export function PageView({buttons, children, loading}: { buttons?: React.ReactNode[], children: React.ReactNode, loading?: boolean }) {
  return (
    <Flex className='w-full' gap='0.5rem' vertical>
      <Space>
        {Array.isArray(buttons)
          ? buttons.map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))
          : buttons}
      </Space>
      {loading ? null : children}
    </Flex>
  )
}