"use client";
import Link from "next/link";
import { useImmer } from "use-immer";
import { useRouter } from "next/navigation";

import { Form } from "@/app/_components/Form";
import { Button } from "@/app/_components/Button";
import { BottomPanel } from "@/app/_ui/BottomPanel";
import { ChoiceGroup, Radio } from "@/app/_components/Choice";
import { Card } from "@/app/_components/Card";

import { InputAddon } from "@/app/_components/InputAddon";
import { Select } from "@/app/_components/Select";
import { getSpecsByFilters } from "@/app/(routes)/api/specs/requests";
import { deleteSectionById, upsertSection } from "@/app/(routes)/api/sections/requests";
import { TextField } from "@/app/_components/TextField";


export default function SectionEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  const router = useRouter();

  const handleState = {
    change: (e) => {
      setState((state) => {state[e.target.name] = e.target.value});
    }
  }

  const handleSpecs = {
    add: ({id, data}) => {
      if (!id || state.specs.some((stateSpec) => stateSpec.id === id)) return;
      setState((state) => {state.specs.push(data)});
    },
    delete: (id) => {
      setState((state) => {state.specs = state.specs.filter((spec) => spec.id !== id);})
    },
  }

  const handleFormSubmit = async (e, params) => {
    e.preventDefault();
    const { id } = await upsertSection(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/sections"); router.refresh();
    } else {
      router.replace(`/admin/sections/${id}`, {scroll: false}); router.refresh();
    }
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Card label="Название и Тип" className="mt10">
        <TextField
          label="id"
          value={state.id}
          disabled
        />
        <TextField
          label="Название (множ. число)"
          className="mt20"
          name="name"
          value={state.name}
          onChange={handleState.change}
          required
        />
        <ChoiceGroup
          label="Тип объектов"
          className="mt20"
          name="object_type"
          valueToCompare={state.object_type}
          onChange={handleState.change}
        >
          <Radio value="org">Организация</Radio>
          <Radio value="place">Место</Radio>
        </ChoiceGroup>
      </Card>

      <Card label="Характеристики раздела" className="mt10">
        <Select
          isAutocomplete={true}
          onChange={handleSpecs.add}
          placeholder="Добавить характеристику"
          requestItemsOnFirstTouch={async () =>
            (await getSpecsByFilters({objectType: state.object_type}))
              ?.map((spec) => ({id: spec.id, label: spec.name_service, data: spec}))
          }
        />
        <ul className="mt20" style={{paddingInlineStart: 0}}>
          {state?.specs?.map(({id, name_service}) => (
            <li key={id} style={{display: "flex"}}>
              <Button onClick={() => handleSpecs.delete(id)}>X</Button>
              <InputGroup>
                <InputAddon>{id}</InputAddon>
                <Link href={`/admin/specs/${id}`}>{name_service}</Link>
              </InputGroup>
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
