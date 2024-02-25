import { Object } from "@/app/_ui/Object";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(routes)/api/objects/requests";


export default async function ObjectPage({params, searchParams}) {
  const object = await getObjectById(params.id);

  return (
    <Object state={object} searchParams={searchParams}/>
  )
}