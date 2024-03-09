import { ObjectEdit } from "@/app/_pages/ObjectEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptyObject, getObjectById } from "@/app/_db/object";


export default async function AddObjectPage({params, searchParams}:IProps) {
  const emptyObject = await getEmptyObject();
  const parent = searchParams.parent ? await getObjectById(Number(searchParams.parent)) : null;

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

interface IProps {
  params: { type: string };
  searchParams: { [key: string]: string };
}