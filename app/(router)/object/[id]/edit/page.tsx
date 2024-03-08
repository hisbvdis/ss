import { ObjectEdit } from "@/app/_pages/ObjectEdit";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(router)/api/objects/requests";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";


export default async function ObjectEditPage({params}:{params: {id:string, type: string}}) {
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