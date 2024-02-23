import { format } from "date-fns";

export const objectReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    phones: dbData?.phones?.map((phone) => ({...phone, localId: crypto.randomUUID()})),
    links: dbData?.links?.map((link) => ({...link, localId: crypto.randomUUID()})),
    sections : dbData?.sections?.map(({section}) => section),
    options : dbData?.options?.map(({option}) => option),
    schedule: Array(7).fill().map((_,i) => ({day_num: i}))
      ?.map((localDay) => dbData?.schedule?.find((dbDay) => dbDay.day_num === localDay.day_num) ?? localDay)
      ?.map((day) => ({...day, isWork: day.time ? true : false})),
    schedule_date: dbData?.schedule_date ? format(dbData.schedule_date, "yyyy-MM-dd") : null,
    photos: dbData?.photos?.map((photo) => ({...photo, localId: crypto.randomUUID()})),
    modified: dbData?.modified ? format(dbData.modified, "yyyy-MM-dd") : null,
    created: dbData?.created ? format(dbData.created, "yyyy-MM-dd") : null,
  }
  return processed;
}