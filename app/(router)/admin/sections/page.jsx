import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/Card";
import { DelBtn } from "@/app/_components/DelBtn";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteSectionById, getSectionsByFilters } from "@/app/(router)/api/sections/requests";


export default async function SectionListPage(props) {
  const sections = await getSectionsByFilters();

  return (
    <div className="container page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Разделы"}]}/>
      <Card className="mt10" style={{display: "flex", flexWrap: "wrap"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/sections/add">Создать</Link>
        </Card.Section>
        <Card.Section style={{flex: 1}}>
          <h3>Организации</h3>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {sections.filter(({object_type}) => object_type === "org").map(({id, name_plural}) => (
              <li key={id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${id}`}>{name_plural}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{flex: 1}}>
          <h3>Места</h3>
          <ul style={{listStyle: "none", paddingInlineStart: 0}}>
            {sections.filter(({object_type}) => object_type === "place").map(({id, name_plural}) => (
              <li key={id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${id}`}>{name_plural}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </div>
  )
}
