"use client";
import { useContext } from "react";
import { Input } from "@/app/_components/Input";
import { ObjectContext } from "./ObjectEdit";
import { Button } from "@/app/_components/Button";
import { FieldSet, FieldSetLegend } from "@/app/_components/FieldSet";
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";


export default function Contacts(props) {
  const { state, setState } = useContext(ObjectContext);

  const handleContacts = {
    add: (type) => {
      setState((state) => {
        if (!state[type]) state[type] = [];
        state[type] = state[type].concat({order: state[type].length, value: "", localId: crypto.randomUUID()});
      })
    },

    delete: (type, localId) => {
      setState((state) => {state[type] = state[type].filter((item) => item.localId !== localId)});
    },

    changeValue: (type, e, localId) => {
      setState((state) => {state[type].find((item) => item.localId === localId).value = e.target.value});
    },

    changeComment: (type, e, id) => {
      setState((state) => {state[type].find(({localId}) => localId === id).comment = e.target.value});
    },
  }

  return (
    <Card className="mt10">
      <Card.Heading>Контакты</Card.Heading>
      <Card.Section style={{display: "flex", gap: "20px"}}>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSetLegend>
            <span>Телефоны</span>
            <Button onClick={() => handleContacts.add("phones")} disabled={state.parent_org_id}>+</Button>
          </FieldSetLegend>
          <Flex direction="column">
            {state.phones?.map(({localId, value, comment}) => (
              <div key={localId} style={{display: "grid", gridTemplateColumns: "auto 1fr", inlineSize: "100%"}}>
                <Button onClick={() => handleContacts.delete("phones", localId)} tabIndex="-1" disabled={state.parent_org_id} style={{gridRow: "1 / span 2"}}>X</Button>
                <Input value={value} onChange={(e) => handleContacts.changeValue("phones", e, localId)} placeholder="+1 (111) 111-11-11" disabled={state.parent_org_id}/>
                <Input value={comment} onChange={(e) => handleContacts.changeComment("phones", e, localId)} placeholder="Комментарий" disabled={state.parent_org_id}/>
              </div>
            ))}
          </Flex>
        </FieldSet>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSetLegend>
            <span>Ссылки</span>
            <Button onClick={() => handleContacts.add("links")} disabled={state.parent_org_id}>+</Button>
          </FieldSetLegend>
          <Flex direction="column">
          {state.links?.map(({localId, value, comment}) => (
              <div key={localId} style={{display: "grid", gridTemplateColumns: "auto 1fr", inlineSize: "100%"}}>
                <Button onClick={() => handleContacts.delete("links", localId)} tabIndex="-1" disabled={state.parent_org_id} style={{gridRow: "1 / span 2"}}>X</Button>
                <Input value={value} onChange={(e) => handleContacts.changeValue("links", e, localId)} placeholder="site.com" disabled={state.parent_org_id}/>
                <Input value={comment} onChange={(e) => handleContacts.changeComment("links", e, localId)} placeholder="Комментарий" disabled={state.parent_org_id}/>
              </div>
            ))}
          </Flex>
        </FieldSet>
      </Card.Section>
    </Card>
  )
}
