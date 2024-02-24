import { ObjectEdit } from "@/app/_ui/ObjectEdit";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(routes)/api/objects/requests";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";


export default async function ObjectEditPage({params}) {
  const object = await getObjectById(params.id);

  return (
    <div className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `${object.name_full}`, href: `/object/${object.id}` },
        { label: `Редактировать ${params.type === "org" ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={object}/>
    </div>
  )
}