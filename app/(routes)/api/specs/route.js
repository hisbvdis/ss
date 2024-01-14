import { prisma } from "@/app/(routes)/api/dbClient";
import { specWriteProcessing } from "./processing";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const objectType = searchParams.get("objectType");
  const dbData = await prisma.spec.findMany({
    where: {
      object_type: objectType
    },
    include: {options: {orderBy: {id: "asc"}}},
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const processed = specWriteProcessing(state);
  const optionsAdded = processed.options?.filter((processedOption) => !init.options?.some((initOption) => initOption.id === processedOption.id));
  const optionsChanged = processed.options?.filter((processedOption) => init.options?.some((initOption) => processedOption.id === initOption.id && processedOption.name !== initOption.name));
  const optionsDeleted = init.options?.filter((initOption) => !processed.options?.some((processedOption) => processedOption.id === initOption.id));
  const response = await prisma.spec.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...processed,
      options: {
        create: optionsAdded,
      },
    },
    update: {
      ...processed,
      options: {
        create: optionsAdded,
        update: optionsChanged?.map((option) => ({where: {id: option.id}, data: {name: option.name}})),
        deleteMany: optionsDeleted?.map(({id}) => ({id: id})),
      },
    }
  });
  return Response.json(response);
}