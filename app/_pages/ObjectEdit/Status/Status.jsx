"use client";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { Flex } from "@/app/_components/Flex";
import { Input } from "@/app/_components/Input";
import { Select } from "@/app/_components/Select";
import { Checkbox } from "@/app/_components/Choice";
import { Control } from "@/app/_components/Control";
// -----------------------------------------------------------------------------
import { getObjectsByFilters } from "@/app/(router)/api/objects/requests";


export default function Status(props) {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);
  const { className, style } = props;

  const handleStatusChange = (e) => {
    setState((state) => {
      state.status = e.target.value;
      if (e.target.value === "works") {
        state.status_comment = null;
        state.status_confirm = null;
      }
      if (e.target.value !== "closed_forever") {
        state.status_instead_id = null;
        state.statusInstead = null;
      }
    })
  }

  return (
    <Flex gap="15px" className={className} style={style}>
      <Control>
        <Flex gap="10px">
          <Control.Label>Статус</Control.Label>
          <Flex gap="0">
            (<Checkbox
              name="status_inherit"
              checked={state.status_inherit}
              onChange={handleStateChange.checked}
              disabled={!state.parent_id}
            >наследовать</Checkbox>)
          </Flex>
        </Flex>
        <Select
          name="status"
          value={state.status}
          onChange={handleStatusChange}
          disabled={state.status_inherit}
          items={[
            {id: "works", text: "Работает"},
            {id: "opening_soon", text: "Скоро открытие"},
            {id: "might_not_work", text: "Возможно, не работает"},
            {id: "temp_not_work", text: "Временно не работает"},
            {id: "closed_forever", text: "Закрыто навсегда"},
          ]}
        />
      </Control>
      <Control>
        <Control.Label>Комментарий</Control.Label>
        <Input
          name="status_comment"
          value={state.status_comment}
          onChange={handleStateChange.value}
          disabled={state.status_inherit || state.status === "works"}
        />
      </Control>
      <Control>
        <Control.Label>Подтверждение (ссылка)</Control.Label>
        <Input
          name="status_confirm"
          value={state.status_confirm}
          onChange={handleStateChange.value}
          disabled={state.status_inherit || state.status === "works"}
        />
      </Control>
      <Control>
        <Control.Label>
          <a href={state.status_instead_id ? `/object/${state.status_instead_id}` : undefined}>Вместо закрытого</a>
        </Control.Label>
        <Select
          name="status_instead_id"
          value={state?.status_instead_id}
          text={state.statusInstead?.name_full}
          onChange={handleStateChange.value}
          onChangeData={(data) => setState((state) => {state.statusInstead = data})}
          isAutocomplete
          placeholder="Введите название"
          disabled={state.status_inherit || state.status !== "closed_forever"}
          requestItemsOnInputChange={
            async (value) => (await getObjectsByFilters({city: state.city_id, type: state.type, query: value}))
            ?.filter((object) => object.id !== state.id)
            ?.map((object) => ({id: object.id, text: object.name_full, data: object}))
          }
        />
      </Control>
    </Flex>
  )
}