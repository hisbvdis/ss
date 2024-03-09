import { getObjectById } from "@/app/_db/object";
import { Object } from "@/app/_pages/Object";
// -----------------------------------------------------------------------------


export default async function ObjectPage({params, searchParams}:Props) {
  const object = await getObjectById(Number(params.id));

  return (
    <Object state={object} searchParams={searchParams}/>
  )
}

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string };
}