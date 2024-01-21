import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const options = searchParams.get("options").split(",").map((v) => v.split(":")).map(([_, opt]) => opt).join(",");
  const dbData = await prisma.$queryRawUnsafe(`
    WITH RelevantObjects AS (
      SELECT object_id
      FROM object_on_option
      ${options.length ? `WHERE option_id in (${options})` : ""}
    )
    SELECT
        option.id as "optionId",
        COUNT(DISTINCT object_on_option.object_id) as "objectCount"
    FROM
        option
    INNER JOIN
        object_on_option ON option.id = object_on_option.option_id
    JOIN
        section_on_spec ON section_on_spec.spec_id = option.spec_id AND section_on_spec.section_id = ${searchParams.get("section")}
    WHERE
        object_on_option.object_id IN (SELECT object_id FROM RelevantObjects)
    GROUP BY
        option.id, option.name
    ORDER BY
        option.id;
  `)
  return Response.json(dbData.reduce((acc, {optionId, objectCount}) => ({...acc, [optionId]: Number(objectCount)}), {}));
}