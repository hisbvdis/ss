// <Label id={""} required={""}>{label}</Label>
"use client";
import clsx from "clsx";
import "./Label.css";


export default function Label(props) {
  const { id, htmlFor, required } = props;
  const { className, children, style } = props;

  return (
    <label id={id} htmlFor={htmlFor} className={clsx("label", className)} style={style}>
      {children}
      {required ? <span className="label__asteriks">*</span> : null}
    </label>
  )
}
