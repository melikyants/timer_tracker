import React from 'react'

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef<() => void>();

  // Remember the latest function.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {

    function tick() {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}