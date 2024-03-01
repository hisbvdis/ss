import clsx from "clsx";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object"
import { Card } from "@/app/_components/Card";
import { Map, Marker } from "@/app/_components/Map/"
import { CollapseList } from "@/app/_components/CollapseList";
// -----------------------------------------------------------------------------
import "./styles.css";


export default function Contacts(props) {
  const { state } = useContext(ObjectContext);
  const { className, style } = props;

  return (
    <Card className={clsx("contacts", className)} style={style}>

      <Card.Section>
        <p>{state.city?.name}</p>
        <p>{state.address}</p>
        <p style={{color: "var(--fontColor-light)", marginBlockStart: "2px", fontSize: "0.9em"}}>{state.address_2}</p>
        <div style={{color: "var(--fontColor-lighter)", marginBlockStart: "5px", fontSize: "0.8em"}}>
          <span>{state.city?.country_name},</span>
          <span>{state.city?.admin1_name},</span>
          <span>{state.city?.admin2_name}</span>
        </div>
      </Card.Section>

      {state.phones.length ?
        <Card.Section style={{padding: 0}}>
          <CollapseList items={state.phones.map(({id, value, comment}) => ({id, href: `tel:${Array.from(value.matchAll(/[+\d]/g)).join("")}`, label: value, comment}))}/>
        </Card.Section>
      : null}

      {state.links.length ?
        <Card.Section style={{padding: 0}}>
          <CollapseList items={state.links.map(({id, value, comment}) => ({id, href: value, label: value.match(/^(https?:\/\/)?(www.)?(.*?(?=\/))/)?.[3], comment}))}/>
        </Card.Section>
      : null}

      <Card.Section style={{blockSize: "300px"}}>
        <Map center={[state.coord_lat, state.coord_lon]} zoom={16} zoomControl={false}>
          <Marker coord={[state.coord_lat, state.coord_lon]}/>
        </Map>
      </Card.Section>

    </Card>
  )
}