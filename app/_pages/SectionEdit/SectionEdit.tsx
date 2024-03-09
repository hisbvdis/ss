"use client";
import Link from "next/link";
import { produce } from "immer";
import { spec } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Form } from "@/app/_components/Form";
import { Input } from "@/app/_components/Input";
import { Select } from "@/app/_components/Select";
import { Button } from "@/app/_components/Button";
import { Control } from "@/app/_components/Control";
import { BottomPanel } from "@/app/_ui/BottomPanel";
import { InputAddon } from "@/app/_components/InputAddon";
import { Radio, RadioGroup } from "@/app/_components/Choice";
// -----------------------------------------------------------------------------
import { ISection } from "@/app/_types/types";
import { getSpecsByFilters } from "@/app/_db/spec";
import { deleteSectionById, upsertSection } from "@/app/(router)/api/sections/requests";


export default function SectionEdit(props: {init: ISection}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:React.ChangeEvent<HTMLInputElement>) => {
      setState(produce(state, (draft) => {
        draft[e.target.name] = e.target.value;
      }))
    }
  }

  const handleSpecs = {
    add: (e:React.ChangeEvent<HTMLInputElement & {data: spec}>) => {
      if (!e.target.value || state.specs?.some((stateSpec) => String(stateSpec.id) === e.target.value)) return;
      setState(produce(state, (draft) => {
        if (!draft.specs) draft.specs = [];
        draft.specs.push(e.target.data);
      }))
    },
    delete: (id:number) => {
      setState(produce(state, (draft) => {
        draft.specs = draft.specs?.filter((spec) => spec.id !== id);
      }))
    },
  }

  const handleFormSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const { id } = await upsertSection(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/sections");
    } else {
      router.replace(`/admin/sections/${id}`, {scroll: false});
    }
  }

  return (
    <Form onSubmit={handleFormSubmit} noEnterSubmit ctrlEnterSubmit>
      <Card className="mt10">
        <Card.Heading>Название и Тип</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>id</Control.Label>
            <Input value={state.id} disabled/>
          </Control>
          <Control className="mt20">
            <Control.Label>Название (множ. число)</Control.Label>
            <Input
              name="name_plural"
              value={state.name_plural}
              onChange={handleStateChange.value}
              required
            />
          </Control>
          <Control className="mt20">
            <Control.Label>Название (ед. число)</Control.Label>
            <Input
              name="name_singular"
              value={state.name_singular}
              onChange={handleStateChange.value}
              required
            />
          </Control>
          <Control className="mt20">
            <Control.Label>Тип объектов</Control.Label>
            <RadioGroup
              name="object_type"
              valueToCompare={state.object_type}
              onChange={handleStateChange.value}
            >
              <Radio value="org">Организация</Radio>
              <Radio value="place">Место</Radio>
            </RadioGroup>
          </Control>
        </Card.Section>
      </Card>

      <Card className="mt10">
        <Card.Heading>Характеристики раздела</Card.Heading>
        <Card.Section>
          <Select
            isAutocomplete
            onChange={handleSpecs.add}
            placeholder="Добавить характеристику"
            requestItemsOnFirstTouch={async () =>
              (await getSpecsByFilters({objectType: state.object_type}))
                ?.map((spec) => ({id: spec.id, text: spec.name_service, data: spec}))
            }
          />
          <ul className="mt20" style={{paddingInlineStart: 0}}>
            {state?.specs?.map(({id, name_service}) => (
              <li key={id} style={{display: "flex"}}>
                <Button onClick={() => id && handleSpecs.delete(id)}>X</Button>
                <InputAddon>{id}</InputAddon>
                <Link href={`/admin/specs/${id}`}>{name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <BottomPanel
        id={state.id}
        delFunc={deleteSectionById}
        delRedirectPath="/admin/sections"
        exitRedirectPath="./"
      />
    </Form>
  );
}
