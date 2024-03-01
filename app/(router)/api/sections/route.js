import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const dbData = await prisma.section.findMany({
    where: {
      object_type: searchParams.get("objectType") ?? undefined,
    },
    include: {specs: {include: {spec: {include: {options: true}}}}},
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const fields = {
    name_plural: state.name_plural || null,
    name_singular: state.name_singular || null,
    object_type: state.object_type || null,
  }
  const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.id === initSpec.id));
  const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.id === stateSpec.id));
  const response = await prisma.section.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...fields,
      specs: {
        create: specsAdded?.length ? specsAdded.map(({id}) => ({spec_id: id})) : undefined,
      }
    },
    update: {
      ...fields,
      specs: {
        create: specsAdded?.length ? specsAdded.map(({id}) => ({spec_id: id})) : undefined,
        deleteMany: specsDeleted?.length ? specsDeleted.map(({id}) => ({spec_id: id})) : undefined,
      },
    }
  });
  return Response.json(response);
}