import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";
import { Card } from "@/app/_components/Card/";
import { Flex } from "@/app/_components/Flex";
// -----------------------------------------------------------------------------


export default function specs() {
  const { state } = useContext(ObjectContext);

  return (
    <Card>
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
  )
}