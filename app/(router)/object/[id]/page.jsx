import { Object } from "@/app/_pages/Object";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(router)/api/objects/requests";


export default async function ObjectPage({params, searchParams}) {
  const object = await getObjectById(params.id);

  return (
    <Object state={object} searchParams={searchParams}/>
  )
}