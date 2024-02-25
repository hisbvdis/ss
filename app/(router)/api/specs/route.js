import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const dbData = await prisma.spec.findMany({
    where: {
      object_type: searchParams.get("objectType") ?? undefined,
    },
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const fields = {
    name_service: state.name_service || null,
    name_filter: state.name_filter || null,
    object_type: state.object_type || null,
    control_type: state.control_type || null,
  }
  const optionsAdded = state.options?.filter((stateOption) => !init.options?.some((initOption) => initOption.id === stateOption.id));
  const optionsChanged = state.options?.filter((stateOption) => init.options?.some((initOption) => stateOption.id === initOption.id && stateOption.name !== initOption.name));
  const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => stateOption.id === initOption.id));
  const response = await prisma.spec.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...fields,
      options: {
        create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, localId: undefined})) : undefined,
      },
    },
    update: {
      ...fields,
      options: {
        create: optionsAdded?.length ? optionsAdded.map((opt) => ({...opt, localId: undefined})) : undefined,
        update: optionsChanged?.length ? optionsChanged?.map((option) => ({where: {id: option.id}, data: {name: option.name}})) : undefined,
        deleteMany: optionsDeleted?.length ? optionsDeleted?.map(({id}) => ({id: id})) : undefined,
      },
    }
  });
  return Response.json(response);
}