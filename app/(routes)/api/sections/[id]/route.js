import { prisma } from "@/app/(routes)/api/dbClient";

export async function GET(_, {params}) {
  const dbData = await prisma.section.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      specs: {include: {spec: true}},
    }
  });
  const processed = {
    ...dbData,
    specs: state.specs.map(({spec}) => spec),
  }
  return Response.json(processed);
}

export async function DELETE(_, {params}) {
  const result = await prisma.section.delete({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json(result);
}