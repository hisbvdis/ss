"use client";
import clsx from "clsx";
import { createContext, useId } from 'react';
// -----------------------------------------------------------------------------
import FieldSetLegend from "./FieldSetLegend";
import styles from "./styles.module.css";


export default function FieldSet(props:IProps) {
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

export const FieldSetContext = createContext<IFieldSetContextType>({});
FieldSet.Legend = FieldSetLegend;

interface IProps {
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
  row: boolean;
}

interface IFieldSetContextType {
  legendId?: string;
}