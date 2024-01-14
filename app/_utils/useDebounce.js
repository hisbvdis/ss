import { useState } from "react";


export function useDebounce(props) {
  const [ timeoutId, setTimeoutId ] = useState();

  return (func, delay) => {
    clearTimeout(timeoutId);
    const id = setTimeout(func, delay);
    setTimeoutId(id);
  }
}
