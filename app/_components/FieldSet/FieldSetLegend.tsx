"use client";
import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext } from "./FieldSet";
import styles from "./FieldSetLegend.module.css";


export default function FieldSetLegend(props:Props) {
  const { children, className, style, srOnly } = props;
  const { legendId } = useContext(FieldSetContext);

  return (
    <legend
      id={legendId}
      className={clsx(styles["fieldSetLegend"], className, srOnly && "srOnly")}
      style={style}
    >
      {children}
    </legend>
  )
}

interface Props {
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
  srOnly: boolean;
}