import Link from "next/link";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { CatalogContext } from "../Catalog";
import { Card } from "@/app/_components/Card";
import { CloseIcon, BinIcon } from "@/app/_icons";
import { Control } from "@/app/_components/Control";
import { Checkbox, CheckboxGroup } from "@/app/_components/Choice";


export default function Filters(props) {
  const { searchParams, manageSearchParams, section } = useContext(CatalogContext);

  return (
    <Card className="object__filters  mt10">
      <Card.Heading style={{display: "flex", alignItems: "center", gap: "10px"}}>
        <span style={{marginInlineEnd: "auto"}}>{section?.name_plural}</span>
        {searchParams.options
          ? <Link href={manageSearchParams("delete", "options")} style={{display: "flex", alignItems: "center"}}>
              <BinIcon width="18" height="18"/>
            </Link>
          : null
        }
        <Link href={manageSearchParams("delete", ["section", "options"])} style={{display: "flex", alignItems: "center"}}>
          <CloseIcon/>
        </Link>
      </Card.Heading>
      {section?.specs?.map((spec) => (
        <Card.Section key={spec.id}>
          <Control>
            <Control.Label>{spec.name_filter}</Control.Label>
            <CheckboxGroup arrayToCompare={searchParams?.options?.split(",")}>
              {spec?.options.map((opt) => (
                <Link key={opt.id} href={manageSearchParams("append", "options", `${spec.id}:${opt.id}`)}>
                  <Checkbox value={`${spec.id}:${opt.id}`} tabIndex="-1">{opt.name}</Checkbox>
                </Link>
              ))}
            </CheckboxGroup>
          </Control>
        </Card.Section>
      ))}
    </Card>
  )
}