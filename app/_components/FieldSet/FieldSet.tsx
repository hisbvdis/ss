"use client";
import clsx from "clsx";
import { createContext, useId } from 'react';
// -----------------------------------------------------------------------------
import FieldSetLegend from "./FieldSetLegend";
import styles from "./FieldSet.module.css";


export default function FieldSet(props:Props) {
  const { children, className, style, row } = props;
  const legendId = useId();

  return (
    <FieldSetContext.Provider value={{ legendId }}>
      <fieldset
        className={clsx(styles["fieldSet"], className, row && styles["fieldSet--row"])}
        role="group"
        style={style}
      >
        {children}
      </fieldset>
    </FieldSetContext.Provider>
  )
}

export const FieldSetContext = createContext<FieldSetContextType>({});
FieldSet.Legend = FieldSetLegend;

interface Props {
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
  row: boolean;
}

interface FieldSetContextType {
  legendId?: string;
}