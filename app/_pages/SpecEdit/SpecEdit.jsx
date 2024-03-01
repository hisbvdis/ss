"use client";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Form } from "@/app/_components/Form";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { BottomPanel } from "@/app/_ui/BottomPanel";
import { Control } from "@/app/_components/Control";
import { InputAddon } from "@/app/_components/InputAddon";
import { Radio, RadioGroup } from "@/app/_components/Choice";
// -----------------------------------------------------------------------------
import { upsertSpec, deleteSpecById } from "@/app/(router)/api/specs/requests";


export default function SpecEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e) => {
      setState((state) => {
        state[e.target.name] = e.target.value;
      });
    }
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
        const option = state.options.find((option) => option.localId === localId);
        option.name = e.target.value;
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
      router.push("/admin/specs");
    } else {
      router.replace(`/admin/specs/${id}`, {scroll: false});
    }
  }

  return (
    <Form onSubmit={handleFormSubmit} noEnterSubmit ctrlEnterSubmit>
      <Card className="mt10">
        <Card.Heading>Название и Тип</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>ID</Control.Label>
            <Input value={state.id} disabled />
          </Control>
          <Control className="mt20">
            <Control.Label>Название (служебное)</Control.Label>
            <Input
              name="name_service"
              value={state.name_service}
              onChange={handleStateChange.value}
              required
            />
          </Control>
          <Control className="mt20">
            <Control.Label>Название (в поиске и редактировании)</Control.Label>
            <Input
              name="name_filter"
              value={state.name_filter}
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
              <Radio value="org">Организации</Radio>
              <Radio value="place">Места</Radio>
            </RadioGroup>
          </Control>
        </Card.Section>
      </Card>

      <Card className="mt10">
        <Card.Heading>Страница "Редактировать"</Card.Heading>
        <Card.Section>
          <Control>
            <Control.Label>Элемент выбора опции</Control.Label>
            <RadioGroup
              name="control_type"
              valueToCompare={state.control_type}
              onChange={handleStateChange.value}
            >
              <Radio value="checkbox">Checkbox</Radio>
              <Radio value="radio">Radio</Radio>
            </RadioGroup>
          </Control>
        </Card.Section>
      </Card>

      <Card className="mt10">
        <Card.Heading>
          <span>Опции</span>
          <Button onClick={handleOptions.add}>+</Button>
        </Card.Heading>
        <Card.Section>
          <ul style={{paddingInlineStart: 0}}>
            {state.options?.map((opt) => (
              <li key={opt.localId} style={{display: "flex"}}>
                <Button onClick={() => handleOptions.delete(opt.localId)} tabIndex="-1">X</Button>
                <InputAddon>{opt.id}</InputAddon>
                <Input value={opt.name} onChange={(e) => handleOptions.change(e, opt.localId)} required/>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <BottomPanel
        id={state.id}
        delFunc={deleteSpecById}
        delRedirectPath="/admin/specs"
        exitRedirectPath="./"
      />
    </Form>
  )
}
