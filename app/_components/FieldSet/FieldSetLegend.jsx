"use client";
import clsx from "clsx";
import { useContext } from "react";
import { FieldSetContext } from "./FieldSet";
import "./FieldSetLegend.css";

export default function FieldSetLegend(props) {
  const { children, className, style, srOnly } = props;
  const { legendId } = useContext(FieldSetContext);

  return (
    <legend id={legendId} className={clsx("fieldSetLegend", className, srOnly && "srOnly")} style={style}>
      {children}
    </legend>
  )
}
