import { prisma } from "@/app/_db/dbClient";

export async function GET(request, {params}) {
  const id = Number(params.id);
  const dbData = await prisma.spec.findUnique({
    where: {
      id: id
    },
    include: {
      options: {orderBy: {id: "asc"}}
    },
  });
  // const processed = specReadProcessing(dbData);
  return Response.json(dbData);
}

export async function DELETE() {
  await prisma.spec.delete({where: {id: id}});
  return Response.json("ok");
}