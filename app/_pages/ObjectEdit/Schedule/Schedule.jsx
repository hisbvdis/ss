"use client";
import { produce } from "immer";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { ObjectEditContext } from "../ObjectEdit";
import { Checkbox } from "@/app/_components/Choice";
import { Control } from "@/app/_components/Control";
// -----------------------------------------------------------------------------


export default function Schedule(props) {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);

  const handleSchedule = {
    changeIsWork: (e) => {
      setState(produce(state, (draft) => {
        draft.schedule[e.target.name].isWork = e.target.checked;
        if (!e.target.checked) draft.schedule[e.target.name].time = "";
      }));
    },
    changeTime: (e) => {
      setState(produce(state, (draft) => {
        draft.schedule[e.target.name].time = e.target.value;
      }));
    },
    formatTime: (e) => {
      if (!e.target.value) return;
      const [from, to] = e.target.value.split("-").map((value) => {
        const matching = value.trim().match(/(\d+?)\s?[:.]?\s?(\d{2})?$/);
        if (!matching) return;
        let [_, hours, min] = matching;
        return {
          string: `${hours}:${min ?? "00"}`,
          min: Number(hours) * 60 + Number(min ?? 0)
        }
      });
      if (!from || !to) return;
      setState(produce(state, (draft) => {
        draft.schedule[e.target.name].time = [from.string, to.string].join(" - ");
        draft.schedule[e.target.name].from = from.min;
        draft.schedule[e.target.name].to = to.min;
      }));
    },
    copyToAll: (isWork, time, from, to) => {
      setState(produce(state, (draft) => {
        draft.schedule = draft.schedule.map((day) => ({...day, isWork, time, from, to}));
      }));
    },
    change247: (e) => {
      setState(produce(state, (draft) => {
        draft.schedule_247 = e.target.checked;
        if (e.target.checked) {
          draft.schedule = draft.schedule.map((day) => ({...day, isWork: true, time: "0:00 - 24:00", from: 0, to: 1440}));
        }
      }));
    },
    setDate: (date) => {
      setState(produce(state, (produce) => {
        if (date === "") {
          produce.schedule_date = "";
        } else {
          produce.schedule_date = new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(date);
        }
      }));
    },
    cleanAll: () => {
      setState(produce(state, (draft) => {
        draft.schedule_inherit = false;
        draft.schedule_247 = false;
        draft.schedule = Array(7).fill().map((_,i) => ({day_num: i}));
        draft.schedule_date = "";
        draft.schedule_source = "";
        draft.schedule_comment = "";
      }));
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
            onChange={handleStateChange.checked}
            disabled={!state.parent_id}
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
          {state.schedule?.map((day, i) => (
            <Flex key={i} direction="column">
              <Checkbox name={i} checked={day?.isWork} onChange={handleSchedule.changeIsWork} tabIndex="-1" disabled={state.schedule_247 || state.schedule_inherit}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</Checkbox>
              <Input name={i} value={day?.isWork ? day?.time : "Не работает"} onChange={handleSchedule.changeTime} onBlurIfChanged={handleSchedule.formatTime} disabled={!day?.isWork || state.schedule_247 || state.schedule_inherit}  pattern="\d{1,2}:\d\d\s-\s\d{1,2}:\d\d"/>
              <Button onClick={() => handleSchedule.copyToAll(day?.isWork, day?.time, day?.from, day?.to)} disabled={!day?.isWork || state.schedule_247 || state.schedule_inherit}>Copy</Button>
            </Flex>
          ))}
        </Flex>
        <Flex>
          <Control style={{marginBlockStart: "10px"}}>
            <Control.Label>Дата актуализации графика</Control.Label>
            <input type="date" name="schedule_date" value={state.schedule_date ?? ""} onChange={handleStateChange.value} disabled={state.schedule_inherit}/>
            <Button onClick={() => handleSchedule.setDate(new Date())} disabled={state.schedule_inherit}>Сегодня</Button>
            <Button onClick={() => handleSchedule.setDate("")} disabled={state.schedule_inherit}>X</Button>
          </Control>
          <Control style={{marginBlockStart: "10px"}}>
            <Control.Label>Комментарий к графику</Control.Label>
            <Input name="schedule_comment" value={state.schedule_comment} onChange={handleStateChange.value} disabled={state.schedule_inherit}/>
          </Control>
          <Control style={{marginBlockStart: "10px"}}>
            <Control.Label>Источник (ссылка или название)</Control.Label>
            <Input name="schedule_source" value={state.schedule_source} onChange={handleStateChange.value} disabled={state.schedule_inherit}/>
          </Control>
        </Flex>
      </Card.Section>
    </Card>
  )
}
