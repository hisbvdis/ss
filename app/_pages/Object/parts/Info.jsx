import { useContext } from "react"
import { ObjectContext } from "../Object"
import { Card } from "@/app/_components/Card";
import { Map, Marker } from "@/app/_components/Map/"
import clsx from "clsx";

export default function Info(props) {
  const { state } = useContext(ObjectContext);
  const { className, style } = props;

  return (
    <section className={clsx("object__aside", className)} style={style}>
      <Card>
        <Card.Section>
          <p>{state.city?.name}</p>
          <p>{state.address}</p>
          <p>{state.address_2}</p>
          <div style={{color: "var(--fontColor-lighter)", marginBlockStart: "5px"}}>
            <span>{state.city?.country_name},</span>
            <span>{state.city?.admin1_name},</span>
            <span>{state.city?.admin2_name}</span>
          </div>
        </Card.Section>
        <Card.Section>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {state.phones?.map(({id, value, comment}) => (
              <li key={id}>
                <p>{value}</p>
                <p>{comment}</p>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {state.links?.map(({id, value, comment}) => (
              <li key={id}>
                <a href={value} style={{color: "#0088CF", textDecoration: "none"}}>
                  {value.match(/^(https?:\/\/)?(www.)?(.*?(?=\/))/)?.[3]}
                </a>
                <p>{comment}</p>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{blockSize: "300px"}}>
          <Map center={[state.coord_lat, state.coord_lon]} zoom={16} zoomControl={false}>
            <Marker coord={[state.coord_lat, state.coord_lon]}/>
          </Map>
        </Card.Section>
      </Card>

      <Card className="mt10">
        <Card.Section>
          <p>Последняя правка:</p>
          <p>{state.modified}</p>
        </Card.Section>
      </Card>
    </section>
  )
}