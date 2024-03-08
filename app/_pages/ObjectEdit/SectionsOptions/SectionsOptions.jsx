"use client";
import { produce } from "immer";
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
import { ObjectEditContext } from "../ObjectEdit";
import { getSectionsByFilters } from "@/app/(router)/api/sections/requests";


export default function Sections(props) {
  const { state, setState } = useContext(ObjectEditContext);

  const handleSections = {
    add: (e) => {
      if (!e.target.value || state.sections?.some((section) => section.id === e.target.value)) return;
      setState(produce(state, (draft) => {
        if (!draft.sections) draft.sections = [];
        draft.sections.push(e.target.data);
      }));
    },
    delete: (section) => {
      setState(produce(state, (draft) => {
        draft.sections = draft.sections.filter(({id}) => id !== section.id);
        const optionsOfRemainingSections = draft.sections.flatMap(({specs}) => specs.flatMap(({spec}) => spec.options.flatMap(({id}) => id)));
        draft.options = draft.options?.filter(({id}) => optionsOfRemainingSections.includes(id));
      }));
    },
  };

  const handleOptions = {
    changeCheckbox: (e, opt) => {
      setState(produce(state, (draft) => {
        if (!draft.options) draft.options = [];
        if (e.target.checked) {
          draft.options = draft.options.concat(opt);
        } else {
          draft.options = draft.options.filter(({id}) => id !== opt.id);
        }
      }))
    },
    changeRadio: (spec, opt) => {
      setState(produce(state, (draft) => {
        if (!draft.options) draft.options = [];
        draft.options = draft.options?.filter((draftOpt) => !spec.options.map((opt) => opt.id).includes(draftOpt.id));
        draft.options = draft.options?.concat(opt);
      }));
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
              <span>{section.name_plural}</span>
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
                id: section.id, text: section.name_plural, data: section
              }))
          }
        />
        <RequiredInput isValidIf={state.sections?.length > 0}/>
      </Card.Section>
    </Card>
  )
}
