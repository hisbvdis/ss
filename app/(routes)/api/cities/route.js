import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name") ?? undefined;
  const dbData = await prisma.city.findMany({
    where: {
      name: name ? {contains: name, mode: 'insensitive'} : undefined,
    },
    take: 25
  });
  return Response.json(dbData);
}