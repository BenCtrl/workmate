import { useEffect } from 'react';

/**
 * Detects clicks outside of the referred component and invokes the given callback function.
 * @param {*} ref - ref to a component
 * @param {*} handleOnClickOutside - Callback function to be invoked once a click event has been detected outside of the referred component
 */
export const useClickOutside = (ref, handleOnClickOutside) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handleOnClickOutside(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handleOnClickOutside]);
}