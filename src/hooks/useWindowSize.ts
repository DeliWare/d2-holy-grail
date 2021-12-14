import { useEffect, useState } from 'react';
import { isClient } from '../utils/helpers';
import useEventListener from './useEventListener';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
}

function getWindowSize() {
  return isClient()
    ? {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768
      }
    : {
        width: 0,
        height: 0,
        isMobile: true
      };
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

  const handleSize = () => {
    setWindowSize(getWindowSize());
  };

  useEventListener('resize', handleSize);

  useEffect(() => {
    handleSize();
  }, []);

  return windowSize;
}

export default useWindowSize;
