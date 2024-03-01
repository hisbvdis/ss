import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "../Object";
import { Flex } from "@/app/_components/Flex";
import { Card } from "@/app/_components/Card/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function specs() {
  const { state } = useContext(ObjectContext);

  return (
    <Card>
      <Card.Heading>Характеристики</Card.Heading>
      {state.sections?.map((section) => (
        <Card.Section key={section.id}>
          <Link className={styles["specs__sectionName"]} href={`/catalog?city=${state.city_id}&section=${section?.id}`}>
            {section.name_singular}
          </Link>
          {section.specs.map(({spec}) => (
            <Flex className={styles["specs__spec"]} key={spec.id} gap="10px">
              <p className={styles["specs__specName"]}>{spec.name_filter}</p>
              <ul style={{listStyle: "none", paddingInlineStart: 0, display: "flex", gap: "10px"}}>
                {state.options.filter((option) => option.spec_id === spec.id).map((option) => (
                    <li key={option.id}>
                      <Link className={styles["specs__optionLink"]} href={`/catalog?city=${state.city_id}&section=${section?.id}&options=${option.spec_id}:${option.id}`}>{option.name}</Link>
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