import { useEffect, useState } from 'react';

export const BREAKPOINT_SM = 640;
export const BREAKPOINT_MD = 768;
export const BREAKPOINT_LG = 1024;
export const BREAKPOINT_XL = 1280;
export const BREAKPOINT_2XL = 1536;

export const FLOAT_INSET = 24;

export function useBreakpoints() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const sm = width >= BREAKPOINT_SM;
  const md = width >= BREAKPOINT_MD;
  const lg = width >= BREAKPOINT_LG;
  const xl = width >= BREAKPOINT_XL;
  const xxl = width >= BREAKPOINT_2XL;

  function getMaxBreakpointWidth() {
    if (xxl) return BREAKPOINT_2XL;
    if (xl) return BREAKPOINT_XL;
    if (lg) return BREAKPOINT_LG;
    if (md) return BREAKPOINT_MD;
    if (sm) return BREAKPOINT_SM;
    return 0;
  }

  function getLargestActiveBreakpoint() {
    if (xxl) return '2XL';
    if (xl) return 'XL';
    if (lg) return 'LG';
    if (md) return 'MD';
    if (sm) return 'SM';
    return 'XS';
  }

  function getFloatButtonInset() {
    if (xxl) return (width - BREAKPOINT_2XL) / 2 + FLOAT_INSET;
    if (xl) return (width - BREAKPOINT_XL) / 2 + FLOAT_INSET;
    if (lg) return (width - BREAKPOINT_LG) / 2 + FLOAT_INSET;
    if (md) return (width - BREAKPOINT_MD) / 2 + FLOAT_INSET;
    if (sm) return (width - BREAKPOINT_SM) / 2 + FLOAT_INSET;
    return FLOAT_INSET;
  }

  return {
    screenWidth: width,
    maxBreakpointWidth: getMaxBreakpointWidth(),
    currentBreakpoint: getLargestActiveBreakpoint(),
    floatButtonInset: getFloatButtonInset(),
    breakpoints: { sm, md, lg, xl, xxl }
  }
}