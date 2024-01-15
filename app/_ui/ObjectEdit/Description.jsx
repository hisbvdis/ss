"use client";
import { useContext } from "react";
import { Input } from "@/app/_components/Input";
import { Card } from "@/app/_components/Card";
import { ObjectContext } from "./ObjectEdit";


export default function Description(props) {
  const { state, handleStateChange } = useContext(ObjectContext);

  return (
    <Card heading="Описание" className="mt10">
      <Input type="textarea" name="description" value={state.description} onChange={handleStateChange} />
    </Card>
  )
}
