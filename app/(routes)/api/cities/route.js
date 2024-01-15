import { prisma } from "@/app/(routes)/api/dbClient";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name") ?? undefined;
  const dbData = await prisma.spec.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive'
      }
    },
  });
  return Response.json(dbData);
}