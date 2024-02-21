import { prisma } from "@/prisma/client.prisma";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name") ?? undefined;
  const dbData = await prisma.$queryRawUnsafe(`
    SELECT
      *
    FROM
      city
    WHERE
      name ilike '${name}%'
    ORDER BY
      length(name),
      name
    LIMIT 25
  `);
  return Response.json(dbData);
}