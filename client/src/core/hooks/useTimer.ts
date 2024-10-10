import { useEffect, useState } from 'react';

const SECONDS_DELAY = 30;

const useTimer = () => {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger((prev) => !prev);
    }, SECONDS_DELAY * 1000);

    return () => clearInterval(interval);
  }, []);

  return trigger;
};

export default useTimer;