"use client";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { Card } from "@/app/_components/Card";
import { Textarea } from "@/app/_components/Input";


export default function Description(props) {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card className="mt10">
      <Card.Heading>Описание</Card.Heading>
      <Card.Section>
        <Textarea name="description" value={state.description} onChange={handleStateChange.value} maxLength="1000"/>
      </Card.Section>
    </Card>
  )
}
