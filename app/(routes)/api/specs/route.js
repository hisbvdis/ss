import { prisma } from "@/app/(routes)/api/dbClient";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const objectType = searchParams.get("objectType") ?? undefined;
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
  const scalarFields = {
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
      ...scalarFields,
      options: {
        create: optionsAdded.map((opt) => ({...opt, localId: undefined})),
      },
    },
    update: {
      ...scalarFields,
      options: {
        create: optionsAdded.map((opt) => ({...opt, localId: undefined})),
        update: optionsChanged?.map((option) => ({where: {id: option.id}, data: {name: option.name}})),
        deleteMany: optionsDeleted?.map(({id}) => ({id: id})),
      },
    }
  });
  return Response.json(response);
}