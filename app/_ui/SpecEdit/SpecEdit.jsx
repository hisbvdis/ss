"use client";
import { useImmer } from "use-immer";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { Card } from "@/app/_components/Card";
import { Form } from "@/app/_components/Form";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { BottomPanel } from "@/app/_ui/BottomPanel";
import { TextField } from "@/app/_components/TextField";
import { InputAddon } from "@/app/_components/InputAddon";
import { ChoiceGroup, Radio } from "@/app/_components/Choice";

import { upsertSpec, deleteSpecById } from "@/app/(routes)/api/specs/funcs";


export default function SpecEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = (e) => {
    setState((state) => {state[e.target.name] = e.target.value});
  }

  const handleOptions = {
    add: () => {
      setState((state) => {
        if (!state.options) state.options = [];
        state.options.push({name: "", localId: crypto.randomUUID()});
      })
    },
    change: (e, localId) => {
      setState((state) => {
        const entry = state.options.find((option) => option.localId === localId);
        entry.name = e.target.value;
      });
    },
    delete: (localId) => {
      setState((state) => {
        state.options = state.options.filter((option) => option.localId !== localId);
      });
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { id } = await upsertSpec(state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push("/admin/specs"); router.refresh();
    } else {
      router.replace(`/admin/specs/${id}`, {scroll: false}); router.refresh();
    }
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Card label="Название и Тип">
        <TextField
          label="ID"
          value={state.id}
          disabled
        />
        <TextField
          className="mt20"
          label="Название (служебное)"
          name="name_service"
          value={state.name_service}
          onChange={handleStateChange}
          required
        />
        <TextField
          className="mt20"
          label="Название (в поиске и редактировании)"
          name="name_filter"
          value={state.name_filter}
          onChange={handleStateChange}
          required
        />
        <ChoiceGroup
          className="mt20"
          label="Тип объектов"
          name="object_type"
          valueToCompare={state.object_type}
          onChange={handleStateChange}
        >
          <Radio value="org">Организации</Radio>
          <Radio value="place">Места</Radio>
        </ChoiceGroup>
      </Card>

      <Card label='Страница "Редактировать"' className="mt10">
        <ChoiceGroup
          label="Элемент выбора опции"
          name="control_type"
          valueToCompare={state.control_type}
          onChange={handleStateChange}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">Radio</Radio>
        </ChoiceGroup>
      </Card>

      <Card className="mt10">
        <Card.Heading>
          <span>Опции</span>
          <Button onClick={handleOptions.add}>+</Button>
        </Card.Heading>
        <ul style={{paddingInlineStart: 0}}>
          {state.options?.map((opt) => (
            <li key={opt.localId} style={{display: "flex"}}>
              <Button onClick={() => handleOptions.delete(opt.localId)} tabIndex="-1">X</Button>
              <InputAddon>{opt.id}</InputAddon>
              <Input value={opt.name} onChange={(e) => handleOptions.change(e, opt.localId)} required/>
            </li>
          ))}
        </ul>
      </Card>

      <BottomPanel
        id={state.id}
        delFunc={deleteSpecById}
        delRedirectPath="/admin/specs"
        exitRedirectPath="./"
        handleFormSubmit={handleFormSubmit}
      />
    </Form>
  )
}
