import { ObjectEdit } from "@/app/_ui/ObjectEdit";


export default async function AddObjectPage({params, searchParams}) {
  const parent = searchParams.parent ? await getObjectById(Number(searchParams.parent)) : null;

  return (
    <ObjectEdit init={{}} parent={parent}/>
  )
}