"use client";
import clsx from "clsx";
import { useId, createContext } from "react";


export default function _(props) {
  const { className, style, children } = props;
  const headingId = useId();

  return (
    <FormSectionContext.Provider value={{headingId}}>
      <div className={clsx("form__section", className)} style={style} ariaLabelledBy={headingId}>
        {children}
      </div>
    </FormSectionContext.Provider>
  )
}
export const FormSectionContext = createContext();
