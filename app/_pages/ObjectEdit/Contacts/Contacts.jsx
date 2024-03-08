"use client";
import { produce } from "immer";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { Input } from "@/app/_components/Input";
import { ObjectEditContext } from "../ObjectEdit";
import { Button } from "@/app/_components/Button";
import { FieldSet } from "@/app/_components/FieldSet";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Contacts(props) {
  const { state, setState } = useContext(ObjectEditContext);

  const handleContacts = {
    add: (type) => {
      setState(produce(state, (draft) => {
        if (!draft[type]) draft[type] = [];
        draft[type] = draft[type].concat({
          order: draft[type].length,
          value: "", localId: crypto.randomUUID(),
        });
      }))
    },

    delete: (type, localId) => {
      setState(produce(state, (draft) => {
        draft[type] = draft[type].filter((item) => item.localId !== localId);
      }));
    },

    changeValue: (type, e, localId) => {
      setState(produce(state, (draft) => {
        draft[type].find((item) => item.localId === localId).value = e.target.value;
      }));
    },

    changeComment: (type, e, id) => {
      setState(produce(state, (draft) => {
        draft[type].find(({localId}) => localId === id).comment = e.target.value;
      }));
    },
  }

  return (
    <Card className="mt10">
      <Card.Heading>Контакты</Card.Heading>
      <Card.Section className={styles["contacts__content"]}>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSet.Legend>
            <span>Телефоны</span>
            <Button onClick={() => handleContacts.add("phones")} disabled={state.parent_id}>+</Button>
          </FieldSet.Legend>
          <Flex direction="column">
            {state.phones?.map(({localId, value, comment}) => (
              <div key={localId} style={{display: "grid", gridTemplateColumns: "auto 1fr", inlineSize: "100%"}}>
                <Button
                  onClick={() => handleContacts.delete("phones", localId)}
                  tabIndex="-1"
                  disabled={state.parent_id}
                  style={{gridRow: "1 / span 2"}}
                >X</Button>
                <Input
                  value={value}
                  onChange={(e) => handleContacts.changeValue("phones", e, localId)}
                  placeholder="+1 (111) 111-11-11"
                  disabled={state.parent_id}
                />
                <Input
                  value={comment}
                  onChange={(e) => handleContacts.changeComment("phones", e, localId)}
                  placeholder="Комментарий"
                  disabled={state.parent_id}
                />
              </div>
            ))}
          </Flex>
        </FieldSet>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSet.Legend>
            <span>Ссылки</span>
            <Button onClick={() => handleContacts.add("links")} disabled={state.parent_id}>+</Button>
          </FieldSet.Legend>
          <Flex direction="column">
            {state.links?.map(({localId, value, comment}) => (
              <div key={localId} style={{display: "grid", gridTemplateColumns: "auto 1fr", inlineSize: "100%"}}>
                <Button
                  onClick={() => handleContacts.delete("links", localId)}
                  tabIndex="-1"
                  disabled={state.parent_id}
                  style={{gridRow: "1 / span 2"}}
                >X</Button>
                <Input
                  value={value}
                  onChange={(e) => handleContacts.changeValue("links", e, localId)}
                  placeholder="site.com"
                  disabled={state.parent_id}
                />
                <Input
                  value={comment}
                  onChange={(e) => handleContacts.changeComment("links", e, localId)}
                  placeholder="Комментарий"
                  disabled={state.parent_id}
                />
              </div>
            ))}
          </Flex>
        </FieldSet>
      </Card.Section>
    </Card>
  )
}
