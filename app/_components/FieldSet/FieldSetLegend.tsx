"use client";
import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext } from "./FieldSet";
import styles from "./styles.module.css";


export default function FieldSetLegend(props:IProps) {
  const { children, className, style, srOnly } = props;
  const { legendId } = useContext(FieldSetContext);

  return (
    <legend
      id={legendId}
      className={clsx(styles["fieldSet__Legend"], className, srOnly && "srOnly")}
      style={style}
    >
      {children}
    </legend>
  )
}

interface IProps {
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
  srOnly: boolean;
}