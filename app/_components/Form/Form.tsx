"use client";
import { useId, createContext, useEffect, useRef, FormEvent } from "react";


export default function Form(props:IProps) {
  const { onSubmit=(e=>e), noEnterSubmit, ctrlEnterSubmit, action, noValidate, method } = props;
  const { className, id, style, children } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const formHeadingId = useId();
  const enterKey = useRef(false);
  const ctrlKey = useRef(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDownUp);
    document.addEventListener("keyup", handleKeyDownUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDownUp);
      document.removeEventListener("keyup", handleKeyDownUp);
    };
    function handleKeyDownUp(e:KeyboardEvent) {
      enterKey.current = (e.code === "Enter" && e.type === "keydown") ? true : false;
      ctrlKey.current = (e.ctrlKey && e.type === "keydown") ? true : false;
      if (ctrlEnterSubmit && enterKey.current && ctrlKey.current) formRef.current?.requestSubmit();
    }
  }, [ctrlEnterSubmit])

  const handleSubmit = (e:FormEvent) => {
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

export const FormContext = createContext<IFormContextType>({});

interface IProps {
  onSubmit?: React.FormEventHandler;
  action?: string;
  noEnterSubmit?: boolean;
  ctrlEnterSubmit?: boolean;
  noValidate?: boolean;
  method?: "GET" | "POST";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface IFormContextType {
  formHeadingId?: string;
}