import { prisma } from "@/app/(routes)/api/dbClient";
import { sectionWriteProcessing } from "./processing";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const objectType = searchParams.get("objectType") ?? undefined;
  const dbData = await prisma.section.findMany({
    where: {
      object_type: objectType
    },
    include: {specs: {include: {spec: {include: {options: true}}}}},
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const processed = sectionWriteProcessing(state);
  const specsAdded = state.specs?.filter((stateSpec) => !init.specs?.some((initSpec) => stateSpec.id === initSpec.id));
  const specsDeleted = init.specs?.filter((initSpec) => !state.specs?.some((stateSpec) => initSpec.id === stateSpec.id));
  const response = await prisma.section.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...processed,
      specs: {
        create: specsAdded?.map(({id}) => ({spec_id: id})),
      }
    },
    update: {
      ...processed,
      specs: {
        create: specsAdded?.map(({id}) => ({spec_id: id})),
        deleteMany: specsDeleted?.map(({id}) => ({spec_id: id})),
      },
    }
  });
  return Response.json(response);
}