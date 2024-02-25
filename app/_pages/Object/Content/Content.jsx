import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { ObjectContext } from "../Object";
import clsx from "clsx";


export default function Content(props) {
  const { state } = useContext(ObjectContext);
  const { className, style } = props;

  return (
    <section className={clsx("object__main", className)} style={style}>
      <Card>
        <Image className="object__photo" src={state.photos?.length > 0 ? `/photos/${state.photos[0].name}`: "/icons/no-photo.svg"} width="565" height="350" alt="Image" priority={true}/>
      </Card>

      <Card className="mt10" style={{whiteSpace: "pre-line"}}>
        <Card.Section>{state.description}</Card.Section>
      </Card>

      {state.type === "org" ?
        <Card className="mt10">
          <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <span>На базе организации</span>
            <Link href={`/object/add/place?parent=${state.id}`}>Добавить</Link>
          </Card.Heading>
          <Card.Section>
            <ul style={{display: "flex", listStyle: "none", paddingInlineStart: 0, gap: "15px"}}>
              {state.children?.map((child) => (
                <li key={child.id}>
                  <Link className="object__childLink" href={`/object/${child.id}`}>
                    <Image className="object__childPhoto" src={child.photos?.length > 0 ? `/photos/${child.photos[0].name}`: "/icons/no-photo.svg"} width="178" height="120" alt="Image" loading="lazy"/>
                    <span>{child.name_type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card.Section>
        </Card> : null
      }

      <Card className="mt10">
        <Card.Heading>Характеристики</Card.Heading>
        {state.sections?.map((section) => (
          <Card.Section key={section.id}>
            <p>{section.name}</p>
            {section.specs.map(({spec}) => (
              <Flex key={spec.id} gap="10px">
                <p>{spec.name_filter}</p>
                <ul style={{listStyle: "none", paddingInlineStart: 0, display: "flex", gap: "10px"}}>
                  {state.options.filter((option) => option.spec_id === spec.id).map((option) => (
                      <li key={option.id}>
                        <Link href={`/catalog?city=${state.city?.id}&section=${section?.id}&options=${option.spec_id}:${option.id}`}>{option.name}</Link>
                      </li>
                    ))}
                </ul>
              </Flex>
            ))}
          </Card.Section>
        ))}
      </Card>
    </section>
  )
}