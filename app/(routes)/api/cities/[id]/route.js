import { prisma } from "@/app/(routes)/api/dbClient";

export async function GET(_, {params}) {
  const dbData = await prisma.spec.findMany({
    where: {
      id: Number(params.id),
    },
  });
  return Response.json(dbData);
}