import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CloseIcon } from "@/app/_icons";
import { CatalogContext } from "./Catalog";
import { Card } from "@/app/_components/Card";
import { Control } from "@/app/_components/Control";
import { Checkbox, ChoiceGroup } from "@/app/_components/Choice";


export default function Filters(props) {
  const { searchParams, searchResults, manageSearchParams, section } = useContext(CatalogContext);

  return (
    <Card className="mt10">
      <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span>{section?.name}</span>
        <Link href={manageSearchParams("delete", ["section", "options"])} style={{display: "flex", alignItems: "center"}}>
          <CloseIcon width="20" height="20"/>
        </Link>
      </Card.Heading>
      {section?.specs?.map(({spec}) => (
        <Card.Section key={spec.id}>
          <Control>
            <Control.Label>{spec.name_filter}</Control.Label>
            <ChoiceGroup arrayToCompare={searchParams?.options?.split(",")}>
              {spec?.options.map((opt) => (
                <Link key={opt.id} href={manageSearchParams("append", "options", `${spec.id}:${opt.id}`)}>
                  <Checkbox value={`${spec.id}:${opt.id}`} tabIndex="-1">{opt.name}</Checkbox>
                </Link>
              ))}
            </ChoiceGroup>
          </Control>
        </Card.Section>
      ))}
    </Card>
  )
}