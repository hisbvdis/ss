import Link from "next/link"
import Image from "next/image"
import { useContext } from "react";

import { MapPin } from "@/app/_icons";
import { CatalogContext } from "./Catalog";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { Card } from "@/app/_components/Card";
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function Results(props) {
  const { searchParams, city, searchResults, section } = useContext(CatalogContext);
  const manageSearchParams = useManageSearchParams();

  return (
    <Card>
      <Card.Heading>
        <Breadcrumbs size="small" style={{marginBlockEnd: "5px"}} items={[
          {label: "Каталог", href: city || section ? "/catalog" : null},
          {label: city?.name ?? "", href: section?.id ? `/catalog?city=${city?.id}` : null},
          {label: section?.name ?? ""}
        ]}/>
        <h1 style={{fontSize: "23rem", fontWeight: "400"}}>
          <span>{section?.name ?? "Все спортивные объекты"} {searchParams?.city && city ? ` в ${city?.preposition}` : null}</span>
          <sup style={{fontSize: "0.5em"}}>{searchResults?.length}</sup>
        </h1>
      </Card.Heading>
      <Card.Section style={{display: "flex", justifyContent: "space-between"}}>
        <p>Сортировка: По дате добавления</p>
        <Link href={manageSearchParams("set", "map", "true")} style={{display: "flex", alignItems: "center", gap: "5px"}}>
          <MapPin/>
          <span>Карта</span>
        </Link>
      </Card.Section>
      {searchResults?.map(({id, object_type, city, photos, name_full, address, options}) => (
        <Card.Section key={id} style={{display: "grid", gap: "15px", gridTemplateColumns: "1fr 1.5fr"}}>
          <Image src={photos?.length > 0 ? `/photos/${photos[0].name}`: "/icons/no-photo.svg"} width="250" height="210" alt="Image" loading="lazy" style={{maxInlineSize: "100%", height: "auto", aspectRatio: "250/210"}}/>
          <div>
            <Link href={`${object_type}/${id}`}>{name_full}</Link>
            <p>{city?.name}, {address}</p>
            <hr/>
            <ul style={{display: "flex", gap: "10px", flexWrap: "wrap", listStyle: "none", paddingInlineStart: 0}}>
              {options?.map(({option}) => {
                // console.log( option )
                return (
                  <li key={option?.id}>{option?.name}</li>
                )
              })}
            </ul>
          </div>
        </Card.Section>
      ))}
    </Card>
  )
}
