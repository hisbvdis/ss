export const emptyObject = {
  status: "works",
  schedule: [
    {day_num: 1, name_ru_short: "Пн", time: ""},
    {day_num: 2, name_ru_short: "Вт", time: ""},
    {day_num: 3, name_ru_short: "Ср", time: ""},
    {day_num: 4, name_ru_short: "Чт", time: ""},
    {day_num: 5, name_ru_short: "Пт", time: ""},
    {day_num: 6, name_ru_short: "Сб", time: ""},
    {day_num: 7, name_ru_short: "Вс", time: ""},
  ],
}

export const objectReadProcessing = (dbData) => {
  const processed = {
    ...dbData,
    phones: dbData?.phones?.map((phone) => ({...phone, localId: crypto.randomUUID()})),
    links: dbData?.links?.map((link) => ({...link, localId: crypto.randomUUID()})),
    sections : dbData?.sections?.map(({section}) => section),
    options : dbData?.options?.map(({option}) => option),
    schedule_date: dbData?.schedule_date === null ? "" : new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(dbData?.schedule_date),
    schedule: emptyObject?.schedule?.map((emptyDay) => {
      const dbDay = dbData?.schedule?.find((dbDay) => dbDay.day_num === emptyDay.day_num);
      return {...emptyDay, ...dbDay, isWork: dbDay ? true : false}
    }),
    photos: dbData?.photos?.map((photo) => ({...photo, localId: crypto.randomUUID()})),
    modified: dbData?.modified === null ? "" : new Intl.DateTimeFormat('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit', hour: "2-digit", hour12: false, minute: "2-digit"}).format(dbData?.modified),
  }
  return processed;
}

export const objectWriteProcessing = (incoming) => {
  const state = structuredClone(incoming);
  let processed = {
    ...state,
    name_full: state.type === "place" ? [`${state.name_type}`, `${state.name_where}`].filter((v) => v).join(" ") : state.name_full,
    city_id: state.city_id ? Number(state.city_id) : null,
    parent_org_id: state.parent_org_id ? Number(state.parent_org_id) : null,
    coord_lat: state.coord_lat !== 0 ? Number.parseFloat(state.coord_lat) : null,
    coord_lon: state.coord_lon !== 0 ? Number.parseFloat(state.coord_lon) : null,
    schedule_date: state.schedule_date ? new Date(state.schedule_date) : null,
    schedule: state.schedule.map((day) => {
      if (day.time) {
        const [from, to] = day.time.split(" - ").map((str) => Number(str.split(":")[0]) * 60 + Number(str.split(":")[1]));
        day.from = from;
        day.to = to;
      } else {
        day.time = null;
        day.from = null;
        day.to = null;
      }
      delete day.isWork;
      delete day.name_ru_short;
      delete day.day;
      return day;
    }),
    description: state.description ? state.description.trim() : null,
    modified: new Date(),
  };
  // Set "null" instead falsy values
  processed = Object.fromEntries(Object.entries(processed).map(([key, value]) => [key, value || null]));
  processed = Object.fromEntries(Object.entries(processed).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
  // Delete "included" arguments from "SELECT" query
  delete processed.id;
  delete processed.city;
  delete processed.statusInstead;
  delete processed.parentOrg;
  delete processed.sections;
  delete processed.options;
  delete processed.photos;
  delete processed.links;
  delete processed.phones;
  delete processed.childObjects;
  return processed;
}