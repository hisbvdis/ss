import { prisma } from "@/app/_db/dbClient";

export async function GET() {
  const dbData = await prisma.spec.findMany({
    include: {options: {orderBy: {id: "asc"}}},
  });
  return Response.json(dbData);
}