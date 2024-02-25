"use client";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { Select } from "@/app/_components/Select";
import { Button } from "@/app/_components/Button";
import { Control } from "@/app/_components/Control";
import { FieldSet } from "@/app/_components/FieldSet";
import { RequiredInput } from "@/app/_components/RequiredInput";
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from "@/app/_components/Choice";
// -----------------------------------------------------------------------------
import { ObjectContext } from "./ObjectEdit";
import { getSectionsByFilters } from "@/app/(router)/api/sections/requests";


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
        if (!state.options) state.options = [];
        state.options = state.options?.filter((stateOpt) => !spec.options.map((opt) => opt.id).includes(stateOpt.id));
        state.options = state.options?.concat(opt);
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
            <Flex>
              {section?.specs?.map(({spec}) => (
                <Control key={spec.id}>
                  <Control.Label>{spec.name_filter}</Control.Label>
                  {spec.control_type === "checkbox"
                    ? <CheckboxGroup arrayToCompare={state.options?.map((option) => option).map(({id}) => id)} required>
                        {spec.options.map((opt) => (
                          <Checkbox key={opt.id} value={opt.id} onChange={(e) => handleOptions.changeCheckbox(e, opt)}>{opt.name}</Checkbox>
                        ))}
                      </CheckboxGroup>
                    :
                  spec.control_type === "radio"
                    ? <RadioGroup arrayToCompare={state.options?.map((option) => option).map(({id}) => id)} required>
                        {spec.options.map((opt) => (
                          <Radio key={opt.id} value={opt.id} onChange={() => handleOptions.changeRadio(spec, opt)}>{opt.name}</Radio>
                        ))}
                      </RadioGroup>
                    : ""}
                </Control>
              ))}
            </Flex>
          </FieldSet>
          ))}
        </Card.Section>
      <Card.Section>
        <Select
          isAutocomplete
          value={""}
          onChange={handleSections.add}
          placeholder="Введите название"
          requestItemsOnFirstTouch={async () =>
            (await getSectionsByFilters({objectType: state.type}))
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
