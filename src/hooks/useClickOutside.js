import { useEffect, useRef } from "react";

export default function useClickOutside(callbacks) {
  const elementDatas = callbacks.map(callback => ({ref: useRef(), func: callback})) 

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      elementDatas.forEach(element => {
        if (element.ref?.current && !element.ref?.current?.contains(event.target)) {
          element.func()
        }
      });
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementDatas]);

  return elementDatas.map(elementData => elementData.ref)
}