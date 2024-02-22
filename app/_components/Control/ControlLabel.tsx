// <Control.Label></Control.Label>
"use client";
import clsx from "clsx";
import { useContext } from "react";
import { ControlContext } from "./Control";
import styles from "./Control.module.css";

export default function _(props:Props) {
  const controlContext = useContext(ControlContext);
  const labelId = props.id ?? controlContext?.labelId;
  const required = controlContext?.required;
  const inputId = controlContext?.inputId;
  const { className, children, style, srOnly } = props;

  return (
    <label id={labelId} htmlFor={inputId} className={clsx("control__label", className, srOnly && "srOnly")} style={style}>
      {children}
      {required ? <span className={styles["control__asteriks"]}>*</span> : ""}
    </label>
  )
}

interface Props {
  id:string;
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  srOnly: boolean;
}