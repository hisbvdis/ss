// <ControlLabel></ControlLabel>
"use client";
import clsx from "clsx";
import { useContext } from "react";
import { ControlContext } from "./Control";

export default function _(props) {
  const controlContext = useContext(ControlContext);
  const labelId = props.id ?? controlContext?.labelId;
  const required = controlContext?.required;
  const inputId = controlContext?.inputId;
  const { className, children, style, srOnly } = props;

  return (
    <label id={labelId} htmlFor={inputId} className={clsx("control__label", className, srOnly && "srOnly")} style={style}>
      {children}
      {required ? <span className="control__asteriks">*</span> : ""}
    </label>
  )
}
