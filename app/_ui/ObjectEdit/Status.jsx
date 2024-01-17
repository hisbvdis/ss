"use client";
import Link from "next/link";
import { useContext } from "react";

import { ObjectContext } from ".";
import { Input } from "@/app/_components/Input";
import { Select } from "@/app/_components/Select";
import { Checkbox } from "@/app/_components/Choice";
import { Control } from "@/app/_components/Control";
import { Flex } from "@/app/_components/Flex";
import { getObjectsByCityAndName, getObjectsByFilters } from "@/app/(routes)/api/objects/requests";


export default function Status(props) {
  const { state, setState, handleStateChange } = useContext(ObjectContext);
  const { className, style } = props;

  return (
    <Flex gap="15px" className={className} style={style}>
      <Control>
        <Flex gap="10px">
          <Control.Label>Статус</Control.Label>
          <Flex gap="0">
            (<Checkbox
              name="status_inherit"
              checked={state.status_inherit}
              onChange={handleStateChange}
              disabled={!state.parent_id}
            >наследовать</Checkbox>)
          </Flex>
        </Flex>
        <Select
          name="status"
          value={state.status}
          onChange={handleStateChange}
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
          onChange={handleStateChange}
          disabled={state.status_inherit || state.status === "works"}
        />
      </Control>
      <Control>
        <Control.Label>Подтверждение (ссылка)</Control.Label>
        <Input
          name="status_confirm"
          value={state.status_confirm}
          onChange={handleStateChange}
          disabled={state.status_inherit || state.status === "works"}
        />
      </Control>
      <Control>
        <Control.Label>
          <span>Вместо закрытого</span>
          <span>
            {state.status_instead_id
              ? <Link href={`/${state.type}/${state.status_instead_id}`}>(O)</Link>
              : null
            }
          </span>
        </Control.Label>
        <Select
          name="status_instead_id"
          value={state?.status_instead_id}
          text={state.statusInstead?.name_full}
          onChange={handleStateChange}
          onChangeData={(data) => setState((state) => {state.statusInstead = data})}
          isAutocomplete={true}
          placeholder="Введите название"
          disabled={state.status !== "closed_forever"}
          requestItemsOnInputChange={
            async (value) => (await getObjectsByCityAndName({cityId: state.city_id, type: state.type, query: value}))
            ?.filter((object) => object.id !== state.id)
            ?.map((object) => ({id: object.id, text: object.name_full, data: object}))
          }
        />
      </Control>
    </Flex>
  )
}
