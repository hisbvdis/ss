"use client";
import Link from "next/link";
import Image from "next/image";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { Flex } from "@/app/_components/Flex";
import { DelBtn } from "@/app/_components/DelBtn";
import { Map, Marker } from "@/app/_components/Map";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteObject } from "@/app/(routes)/api/objects/requests";
import "./ObjectView.css";


export default function ObjectView(props) {
  const { id, type, name_full, photos, city, address, address_2, phones, links, coord_lat, coord_lon, description, sections, options, modified, parent_id, parent, children } = props.state;

  return (
    <div className="objectView  container  page">
      <header className="objectView__header">
        <Card>
          <Flex>
            <Breadcrumbs size="small" items={[
              {label: "Каталог", href: "/catalog"},
              {label: `${city?.name ?? ""}`, href: `/catalog?city=${city?.id}`},
              {label: `${sections?.[0]?.section?.name ?? ""}`, href: `/catalog?city=${city?.id}&section=${sections?.[0]?.section?.id}`}
            ]}/>
            <a href={`/object/${id}/edit`} style={{marginInlineStart: "auto"}}>Ред</a>
            <DelBtn id={id} delFunc={deleteObject} redirectPath="/">X</DelBtn>
          </Flex>
          <h1 style={{fontSize: "23rem", fontWeight: "400"}}>{name_full}</h1>
          {parent_id ? <Link href={`/object/${parent_id}`}>&lt; {parent?.name_full}</Link> : null}
        </Card>
      </header>

      <aside className="objectView__aside">
        <Card>
          <Card.Section>
            <p>{city?.name}</p>
            <p>{address}</p>
            <p>{address_2}</p>
            <div style={{color: "var(--fontColor-lighter)", marginBlockStart: "5px"}}>
              <span>{city?.country_name},</span>
              <span>{city?.admin1_name},</span>
              <span>{city?.admin2_name}</span>
            </div>
          </Card.Section>
          <Card.Section>
            <ul style={{listStyle: "none", paddingInlineStart: 0}}>
              {phones?.map(({id, value, comment}) => (
                <li key={id}>
                  <p>{value}</p>
                  <p>{comment}</p>
                </li>
              ))}
            </ul>
          </Card.Section>
          <Card.Section>
            <ul style={{listStyle: "none", paddingInlineStart: 0}}>
              {links?.map(({id, value, comment}) => (
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
            <Map center={[coord_lat, coord_lon]} zoom={16} zoomControl={false}>
              <Marker coord={[coord_lat, coord_lon]}/>
            </Map>
          </Card.Section>
        </Card>

        <Card className="mt10">
          <Card.Section>
            <p>Последняя правка:</p>
            <p>{modified}</p>
          </Card.Section>
        </Card>
      </aside>

      <main className="objectView__main">
        <Card>
          <Image className="objectView__photo" src={photos?.length > 0 ? `/photos/${photos[0].name}`: "/icons/no-photo.svg"} width="565" height="350" alt="Image" priority={true}/>
        </Card>

        <Card className="mt10" style={{whiteSpace: "pre-line"}}>
          <Card.Section>{description}</Card.Section>
        </Card>

        {type === "org" ?
          <Card className="mt10">
            <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <span>На базе организации</span>
              <Link href={`/object/add/place?parent=${id}`}>Добавить</Link>
            </Card.Heading>
            <Card.Section>
              <ul style={{display: "flex", listStyle: "none", paddingInlineStart: 0, gap: "15px"}}>
                {children?.map((child) => (
                  <li key={child.id}>
                    <Link className="objectView__childLink" href={`/object/${child.id}`}>
                      <Image className="objectView__childPhoto" src={child.photos?.length > 0 ? `/photos/${child.photos[0].name}`: "/icons/no-photo.svg"} width="178" height="120" alt="Image" loading="lazy"/>
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
          {sections?.map(({section}) => (
            <Card.Section key={section.id}>
              <p>{section.name}</p>
              {section.specs.map(({spec}) => (
                <Flex key={spec.id} gap="10px">
                  <p>{spec.name_filter}</p>
                  <ul style={{listStyle: "none", paddingInlineStart: 0, display: "flex", gap: "10px"}}>
                    {options.filter(({option}) => option.spec_id === spec.id).map(({option}) => (
                        <li key={option.id}>
                          <Link href={`/catalog?city=${city?.id}&section=${section?.id}&options=${option.spec_id}:${option.id}`}>{option.name}</Link>
                        </li>
                      ))}
                  </ul>
                </Flex>
              ))}
            </Card.Section>
          ))}
        </Card>
      </main>
    </div>
  )
}