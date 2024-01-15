"use client";
import clsx from "clsx";
import { createContext, useId } from 'react';
import "./FieldSet.css";


export default function FieldSet(props) {
  const { children, className, style, row } = props;
  const legendId = useId();

  return (
    <FieldSetContext.Provider value={{ legendId }}>
      <fieldset className={clsx("fieldSet", className, row && "fieldSet--row")} role="group" style={style}>
        {children}
      </fieldset>
    </FieldSetContext.Provider>
  )
}

export const FieldSetContext = createContext();
