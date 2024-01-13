"use client";
import { useId, createContext, useEffect, useRef } from "react";


export default function Form(props) {
  const { onSubmit=(e=>e), noEnterSubmit, ctrlEnterSubmit, action, noValidate, method } = props;
  const { className, id, style, children } = props;
  const formRef = useRef();
  const formHeadingId = useId();
  const enterKey = useRef();
  const ctrlKey = useRef();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDownUp);
    document.addEventListener("keyup", handleKeyDownUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDownUp);
      document.removeEventListener("keyup", handleKeyDownUp);
    };
    function handleKeyDownUp(e) {
      enterKey.current = (e.code === "Enter" && e.type === "keydown") ? true : false;
      ctrlKey.current = (e.ctrlKey && e.type === "keydown") ? true : false;
      if (ctrlEnterSubmit && enterKey.current && ctrlKey.current) formRef.current.requestSubmit();
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noEnterSubmit && enterKey.current && !ctrlKey.current) return;
    onSubmit(e);
  }

  return (
    <FormContext.Provider value={{formHeadingId}}>
      <form
        id={id}
        ref={formRef}
        className={className}
        aria-labelledby={formHeadingId}
        onSubmit={handleSubmit}
        noValidate={noValidate}
        action={action}
        method={method}
        style={style}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

export const FormContext = createContext();