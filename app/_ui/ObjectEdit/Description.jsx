"use client";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "./ObjectEdit";
import { Card } from "@/app/_components/Card";
import { Textarea } from "@/app/_components/Input";


export default function Description(props) {
  const { state, handleStateChange } = useContext(ObjectContext);

  return (
    <Card heading="Описание" className="mt10">
      <Textarea name="description" value={state.description} onChange={handleStateChange.value}/>
    </Card>
  )
}
