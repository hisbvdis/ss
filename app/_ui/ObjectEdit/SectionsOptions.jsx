"use client";
import { useContext } from "react";

import { Button } from "@/app/_components/Button";
import { RequiredInput } from "@/app/_components/RequiredInput";
import { Control } from "@/app/_components/Control";
import { FieldSet } from "@/app/_components/FieldSet";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/Choice";
import { Card } from "@/app/_components/Card";

import { ObjectContext } from "./ObjectEdit";
import { Select } from "@/app/_components/Select";
import { getSectionsByFilters } from "@/app/(routes)/api/sections/requests";


export default function Sections(props) {
  const { state, setState } = useContext(ObjectContext);

  const handleSections = {
    add: (e) => {
      if (!e.target.value || state.sections?.some((section) => section.id === e.target.value)) return;
      setState((state) => {
        if (!state.sections) state.sections = [];
        state.sections.push(e.target.data);
      });
    },
    delete: (section) => {
      setState((state) => {
        state.sections = state.sections.filter(({id}) => id !== section.id);
        const optionsOfRemainingSections = state.sections.flatMap(({specs}) => specs.flatMap(({spec}) => spec.options.flatMap(({id}) => id)));
        state.options = state.options?.filter(({id}) => optionsOfRemainingSections.includes(id));
      });
    },
  };

  const handleOptions = {
    changeCheckbox: (e, opt) => {
      setState((state) => {
        if (!state.options) state.options = [];
        if (e.target.checked) {
          state.options = state.options.concat(opt);
        } else {
          state.options = state.options.filter(({id}) => id !== opt.id);
        }
      })
    },
    changeRadio: (spec, opt) => {
      setState((state) => {
        state.options = state.options.filter((stateOpt) => !spec.options.some((specOpt) => specOpt.id === stateOpt.id));
        state.options = state.options.concat(opt);
      });
    },
  }

  return (
    <Card className="mt10">
      <Card.Heading>Разделы и характеристики</Card.Heading>
      <Card.Section style={{display: "flex", gap: "15px"}}>
        {state.sections?.map((section) => (
          <FieldSet key={section.id}>
            <FieldSet.Legend>
              <Button onClick={() => handleSections.delete(section)}>X</Button>
              <span>{section.name}</span>
            </FieldSet.Legend>
            {section?.specs?.map(({spec}) => (
              <Control key={spec.id}>
                <Control.Label>{spec.name_filter}</Control.Label>
                {spec.control_type === "checkbox"
                  ? <CheckboxGroup arrayToCompare={state.options?.map(({id}) => id)} required>
                      {spec.options.map((opt) => (
                        <Checkbox key={opt.id} value={opt.id} onChange={(e) => handleOptions.changeCheckbox(e, opt)}>{opt.name}</Checkbox>
                      ))}
                    </CheckboxGroup>
                  :
                spec.control_type === "radio"
                  ? <RadioGroup arrayToCompare={state.options.map(({id}) => id)} required>
                      {spec.options.map((opt) => (
                        <Radio key={opt.id} value={opt.id} onChange={() => handleOptions.changeRadio(spec, opt)}>{opt.name}</Radio>
                      ))}
                    </RadioGroup>
                  : ""}
              </Control>
            ))}
          </FieldSet>
          ))}
        </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value={""}
          label={""}
          onChange={handleSections.add}
          placeholder="Введите название"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({type: state.type}))
              .map((section) => ({
                id: section.id, text: section.name, data: section
              }))
          }
        />
        <RequiredInput isValidIf={state.sections?.length > 0}/>
      </Card.Section>
    </Card>
  )
}
