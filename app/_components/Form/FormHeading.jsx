"use client";
import { useContext } from "react";
import { FormContext } from "@/app/_components/Form";

export default function _(props) {
  const { children } = props;
  const { formHeadingId } = useContext(FormContext);

  return (
    <h2 id={formHeadingId}>{children}</h2>
  )
}
