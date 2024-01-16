"use client";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "./ObjectEdit";
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { Checkbox } from "@/app/_components/Choice";
import { Control } from "@/app/_components/Control";


export default function Schedule(props) {
  const { state, setState, handleStateChange } = useContext(ObjectContext);

  const handleSchedule = {
    changeIsWork: (e) => {
      setState((state) => {
        const day = state.schedule.find(({day_num}) => day_num === Number(e.target.name));
        day.isWork = e.target.checked;
        if (!e.target.checked) day.time = "";
      });
    },

    changeTime: (e) => {
      setState((state) => {
        const day = state.schedule.find(({day_num}) => day_num === Number(e.target.name));
        day.time = e.target.value
      });
    },

    formatTime: (e) => {
      if (!e.target.value) return;
      const formatedTime = e.target.value.split("-").map((value) => {
        const matching = value.trim().match(/(\d+?)\s?[:.]?\s?(\d{2})?$/);
        if (!matching) return;
        let [_, hours, min] = matching;
        return `${hours}:${min ?? "00"}`;
      }).join(" - ");
      if (!formatedTime) return;
      setState((state) => {
        const day = state.schedule.find(({day_num}) => day_num === Number(e.target.name));
        day.time = formatedTime;
      });
    },

    copyToAll: (isWork, time) => {
      setState((state) => {state.schedule = state.schedule.map((day) => ({...day, isWork, time}))});
    },

    change247: (e) => {
      setState((state) => {
        state.schedule_247 = e.target.checked;
        if (e.target.checked) {
          state.schedule = state.schedule.map((day) => ({...day, isWork: true, time: "0:00 - 24:00"}));
        } else {
          handleSchedule.cleanAll();
        }
      });
    },

    setDate: (date) => {
      setState((state) => {
        if (date === "") {
          state.schedule_date = "";
        } else {
          state.schedule_date = new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(date);
        }
      });
    },

    cleanAll: () => {
      setState((state) => {
        state.schedule_inherit = false;
        state.schedule_247 = false;
        state.schedule = state.schedule.map((day) => ({...day, isWork: false, time: null}));
        state.schedule_date = "";
        state.schedule_source = "";
        state.schedule_comment = "";
      });
    }
  }

  return (
    <Card className="mt10">
      <Card.Heading>График работы</Card.Heading>
      <Card.Section>
        <Flex style={{marginBlockEnd: "10px"}}>
          <Checkbox
            name="schedule_inherit"
            checked={state.schedule_inherit}
            onChange={handleStateChange}
            disabled={!state.parent_org_id}
            style={{marginInlineEnd: "auto"}}
          >Наследовать</Checkbox>
          <Checkbox
            name="schedule_247"
            checked={state.schedule_247}
            onChange={handleSchedule.change247}
            disabled={state.schedule_inherit}
          >Круглосуточно</Checkbox>
          <Button
            onClick={handleSchedule.cleanAll}
            disabled={state.schedule_inherit}
          >
            Очистить
          </Button>
        </Flex>
        <Flex gap="0" style={{marginBlockEnd: "5px"}}>
          {state.schedule?.map(({day_num, name_ru_short, isWork, time}) => (
            <Flex key={day_num} direction="column">
              <Checkbox name={day_num} checked={isWork} onChange={handleSchedule.changeIsWork} tabIndex="-1" disabled={state.schedule_247 || state.schedule_inherit}>{name_ru_short}</Checkbox>
              <Input name={day_num} value={isWork ? time : "Не работает"} onChange={handleSchedule.changeTime} onBlurIfChanged={handleSchedule.formatTime} disabled={!isWork || state.schedule_247 || state.schedule_inherit}  pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d"/>
              <Button onClick={() => handleSchedule.copyToAll(isWork, time)} disabled={state.schedule_247 || state.schedule_inherit}>Copy</Button>
            </Flex>
          ))}
        </Flex>
        <Flex>
          <Control style={{marginBlockStart: "10px"}}>
            <Control.Label>Дата актуализации графика</Control.Label>
            <input type="date" name="schedule_date" value={state.schedule_date ?? ""} onChange={handleStateChange} disabled={state.schedule_inherit}/>
            <Button onClick={() => handleSchedule.setDate(new Date())} disabled={state.schedule_inherit}>Сегодня</Button>
            <Button onClick={() => handleSchedule.setDate("")} disabled={state.schedule_inherit}>X</Button>
          </Control>
          <Control style={{marginBlockStart: "10px"}}>
            <Control.Label>Комментарий к графику</Control.Label>
            <Input name="schedule_comment" value={state.schedule_comment} onChange={handleStateChange} disabled={state.schedule_inherit}/>
          </Control>
          <Control style={{marginBlockStart: "10px"}}>
            <Control.Label>Источник (ссылка или название)</Control.Label>
            <Input name="schedule_source" value={state.schedule_source} onChange={handleStateChange} disabled={state.schedule_inherit}/>
          </Control>
        </Flex>
      </Card.Section>
    </Card>
  )
}
