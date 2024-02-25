"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useRouter } from "next/navigation";
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
import { getSpecsByFilters } from "@/app/(router)/api/specs/requests";
import { deleteSectionById, upsertSection } from "@/app/(router)/api/sections/requests";


export default function SectionEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = (e) => {
    setState((state) => {
      state[e.target.name] = e.target.value;
    });
  }

  const handleSpecs = {
    add: (e) => {
      if (!e.target.value || state.specs?.some((stateSpec) => stateSpec.id === e.target.value)) return;
      setState((state) => {
        if (!state.specs) state.specs = [];
        state.specs.push(e.target.data);
      });
    },
    delete: (id) => {
      setState((state) => {
        state.specs = state.specs.filter((spec) => spec.id !== id);
      })
    },
  }

  const handleFormSubmit = async (e) => {
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
        <Control>
          <Control.Label>id</Control.Label>
          <Input value={state.id} disabled/>
        </Control>
        <Control className="mt20">
          <Control.Label>Название (множ. число)</Control.Label>
          <Input
            name="name"
            value={state.name}
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
      </Card>

      <Card className="mt10">
        <Card.Heading>Характеристики раздела</Card.Heading>
        <Select
          isAutocomplete
          onChange={handleSpecs.add}
          placeholder="Добавить характеристику"
          requestItemsOnFirstTouch={async () =>
            (await getSpecsByFilters({objectType: state.type}))
              ?.map((spec) => ({id: spec.id, text: spec.name_service, data: spec}))
          }
        />
        <ul className="mt20" style={{paddingInlineStart: 0}}>
          {state?.specs?.map(({id, name_service}) => (
            <li key={id} style={{display: "flex"}}>
              <Button onClick={() => handleSpecs.delete(id)}>X</Button>
              <InputAddon>{id}</InputAddon>
              <Link href={`/admin/specs/${id}`}>{name_service}</Link>
            </li>
          ))}
        </ul>
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
