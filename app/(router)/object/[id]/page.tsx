import { Object } from "@/app/_pages/Object";
// -----------------------------------------------------------------------------
import { getObjectById } from "@/app/(router)/api/objects/requests";


export default async function ObjectPage({params, searchParams}:Props) {
  const object = await getObjectById(params.id);

  return (
    <Object state={object} searchParams={searchParams}/>
  )
}

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string };
}