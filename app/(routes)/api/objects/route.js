import { prisma } from "@/prisma/client.prisma";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") ?? undefined;
  const cityId = searchParams.get("city") ? Number(searchParams.get("city")) : undefined;
  const type = searchParams.get("type") ?? undefined;
  const sectionId = searchParams.get("section") ? Number(searchParams.get("section")) : undefined;
  const options = searchParams.get("options") ?? undefined;
  const groupedOptions = Object.values(
    options
      ? options?.split(",")
        .map((str) => str.split(":"))
        .map((arr) => arr.map((str) => Number(str)))
        .reduce((acc, [key, value]) => ({...acc,[key]: acc[key] ? [...acc[key], value] : [value]}),{})
      : {}
    )
  const dbData = await prisma.object.findMany({
    where: {
      name_full: query ? {contains: query, mode: 'insensitive'} : undefined,
      city_id: cityId,
      type: type,
      sections: sectionId ? {some: {section_id: {equals: sectionId}}} : undefined,
      AND: groupedOptions?.length ? groupedOptions?.map((ids) => ({options: {some: {option_id: {in: ids}}}})) : undefined,
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
    include: {
      city: true,
      options: {include: {option: true}},
      photos: {orderBy: {order: "asc"}},
    },
  });
  return Response.json(dbData);
}

export async function POST(req) {
  const { state, init } = await req.json();
  const fields = {
    name_type: state.name_type || null,
    name_where: state.name_where || null,
    name_full: state.type === "org" ? state.name_full : [state.name_type, state.name_where].filter((v) => v).join(" "),
    type: state.type || null,
    status: state.status || null,
    status_inherit: state.status_inherit || null,
    status_comment: state.status_comment || null,
    status_confirm: state.status_confirm || null,
    status_instead_id: state.status_instead_id || null,
    city_id: state.city_id || null,
    parent_id: state.parent_id || null,
    address: state.address || null,
    address_2: state.address_2 || null,
    coord_inherit: state.coord_inherit || null,
    coord_lat: state.coord_lat ? Number.parseFloat(state.coord_lat) : null,
    coord_lon: state.coord_lon ? Number.parseFloat(state.coord_lon) : null,
    description: state.description || null,
    schedule_inherit: state.schedule_inherit || null,
    schedule_247: state.schedule_247 || null,
    schedule_date: state.schedule_date ? new Date(state.schedule_date) : null,
    schedule_source: state.schedule_source || null,
    schedule_comment: state.schedule_comment || null,
    modified: new Date(),
  };
  const phonesAdded = state.phones?.filter((statePhone) => !init?.phones?.some((initPhone) => statePhone.localId === initPhone.localId && statePhone.value !== ""));
  const phonesChanged = state.phones?.filter((statePhone) => init.phones?.some((initPhone) => statePhone.localId === initPhone.localId && (statePhone.value !== initPhone.value || statePhone.comment !== initPhone.comment)));
  const phonesDeleted = init.phones?.filter((initPhone) => !state.phones.some((statePhone) => initPhone.localId === statePhone.localId));
  const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.localId === initLink.localId && stateLink.value !== ""));
  const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.localId === initLink.localId && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
  const linksDeleted = init.links?.filter((initLink) => !state.links.some((stateLink) => initLink.localId === stateLink.localId));
  const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.id === initOption.id));
  const optionsDeleted = init.options?.filter((initOption) => !state.options.some((stateOption) => initOption.id === stateOption.id));
  const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.id === initSection.id));
  const sectionsDeleted = init.sections?.filter((initSection) => !state.sections.some((stateSection) => initSection.id === stateSection.id));
  const scheduleAdded = (init.schedule.filter(({time}) => time).length === 0 && state.schedule.filter(({time}) => time).length !== 0) ? state.schedule : undefined;
  const scheduleChanged = init.schedule.filter(({time}) => time).length > 0 && state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => (stateDay.day_num === initDay.day_num) && stateDay.time !== initDay.time)).length ? state.schedule : undefined;
  const scheduleDeleted = (state.schedule.filter(({time}) => time).length === 0 && init.schedule.filter(({time}) => time).length !== 0) ? {} : undefined;
  const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId));
  const photosDeleted = init.photos?.filter((initPhoto) => !state.photos.some((statePhoto) => initPhoto.localId === statePhoto.localId));
  const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
  const addedObject = await prisma.object.upsert({
    where: {
      id: state.id ?? -1
    },
    create: {
      ...fields,
      phones: {
        create: phonesAdded.length ? phonesAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
      },
      links: {
        create: linksAdded.length ? linksAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
      },
      options: {
        create: optionsAdded.length ? optionsAdded?.map(({id}) => ({option: {connect: {id}}})) : undefined,
      },
      sections: {
        create: sectionsAdded.length ? sectionsAdded?.map(({id}) => ({section: {connect: {id}}})) : undefined,
      },
      schedule: {
        create: scheduleAdded.length ? scheduleAdded?.map((day, i) => ({time: day.time, from: day.from, to: day.to, day_num: i})) : undefined,
      },
      photos: {
        // Don't: The
      },
      created: new Date(),
    },
    update: {
      ...fields,
      phones: {
        create: phonesAdded.length ? phonesAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
        update: phonesChanged.length ? phonesChanged?.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
        deleteMany: phonesDeleted.length ? phonesDeleted?.map((item) => ({...item, localId: undefined})) : undefined,
      },
      links: {
        create: linksAdded.length ? linksAdded?.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
        update: linksChanged.length ? linksChanged?.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
        deleteMany: linksDeleted.length ? linksDeleted?.map((item) => ({...item, localId: undefined})) : undefined,
      },
      options: {
        create: optionsAdded.length ? optionsAdded?.map(({id}) => ({option: {connect: {id}}})) : undefined,
        deleteMany: optionsDeleted.length ? {option_id: {in: optionsDeleted?.map(({id}) => id)}} : undefined,
      },
      sections: {
        create: sectionsAdded.length ? sectionsAdded?.map(({id}) => ({section: {connect: {id}}})) : undefined,
        deleteMany: sectionsDeleted.length ? {section_id: {in: sectionsDeleted?.map(({id}) => id)}} : undefined,
      },
      schedule: {
        create: scheduleAdded.length ? scheduleAdded?.map((day, i) => ({time: day.time, from: day.from, to: day.to, day_num: i})) : undefined,
        update: scheduleChanged.length ? scheduleChanged?.map((day, i) => ({where: {id: day.id}, data: {time: day.time, from: day.from, to: day.to, day_num: i}})) : undefined,
        deleteMany: scheduleDeleted.length ? scheduleDeleted : undefined,
      },
      photos: {
        create: photosAdded.length ? photosAdded?.map(({name, order}) => ({name, order, uploaded: new Date()})) : undefined,
        update: photosMoved.length ? photosMoved?.map((photo) => ({where: {id: photo.id}, data: {order: photo.order}})) : undefined,
        deleteMany: photosDeleted.length ? {id: {in: photosDeleted?.map(({id}) => id)}} : undefined,
      },
    }
  });

  // Rename photo names of created object
  if (!state.id && state.photos?.length > 0) {
    const updatedObject = await prisma.object.update({
      where: {id: addedObject.id},
      data: {
        photos: {
          create: state.photos.map(({name, order}) => ({
            name: name.replace("ID", addedObject.id),
            order,
            uploaded: new Date()
          })),
        }
      },
    });
    return Response.json(updatedObject);
  };

  return Response.json(addedObject);
}