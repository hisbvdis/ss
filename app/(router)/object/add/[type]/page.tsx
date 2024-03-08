import { ObjectEdit } from "@/app/_pages/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptyObject, getObjectById } from "@/app/(router)/api/objects/requests";


export default async function AddObjectPage({params, searchParams}:Props) {
  const emptyObject = await getEmptyObject();
  const parent = searchParams.parent ? await getObjectById(searchParams.parent) : null;

  return (
    <div className="container  page">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: `Добавить ${params.type === "org" ? "организацию" : "место"}` },
      ]}/>
      <ObjectEdit init={{...emptyObject, type: params.type }} parent={parent}/>
    </div>
  )
}

interface Props {
  params: { type: string };
  searchParams: { [key: string]: string };
}