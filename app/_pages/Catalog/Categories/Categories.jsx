import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/Card";


export default function Categories(props) {
  const { sectionList, manageSearchParams } = useContext(CatalogContext);

  return (
    <Card className="mt10">
      <Card.Heading>Разделы</Card.Heading>
        <Card.Section>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {/* <Link href={manageSearchParams("set", "section", "all")}>Все разделы</Link> */}
            {sectionList?.map(({id, name}) => (
              <li key={id}>
                <Link href={manageSearchParams("set", "section", id)}>{name}</Link>
              </li>
            ))}
          </ul>
      </Card.Section>
    </Card>
  )
}
