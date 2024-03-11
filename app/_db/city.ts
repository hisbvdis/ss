"use server";
import prisma from "@/prisma/client.prisma";
import { city } from "@prisma/client";
import { unstable_cache } from "next/cache";


export const getCitiesByFilters = unstable_cache(
  async (filters:IFilters={}): Promise<city[]> => {
    const name = filters.name ?? undefined;
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
    return dbData;
  },
  [],
  { tags: ["cities"] }
)

interface IFilters {
  name?: string;
}

export const getCityById = unstable_cache(
  async (id:number) => {
    const dbData = await prisma.city.findUnique({
      where: {
        id: id,
      },
    });
    return dbData;
  },
  [],
  { tags: ["cities"] }
)