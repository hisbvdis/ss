"use server";
import { prisma } from "@/prisma/client.prisma";
import { unstable_cache } from "next/cache";
import { objectReadProcessing } from "./object.processing";
import { IObject } from "../_types/types";


export const getObjectsByFilters = unstable_cache(
  async (filters:IFilters={}) => {
    const query = filters.query ?? undefined;
    const cityId = filters.city ? Number(filters.city) : undefined;
    const type = filters.type ?? undefined;
    const sectionId = filters.section ? Number(filters.section) : undefined;
    const options = filters.options ?? undefined;
    const groupedOptions =
      Object.values(options ?
        options /* "1:1,1:2" */
        ?.split(",") /* ["1:1"],["1:2"] */
        .map((str) => str.split(":")) /* [["1":"1"],["1":"2"]] */
        .map((arr) => arr.map((str) => Number(str))) /* [1:1],[1:2] */
        .reduce((acc, [key, value]) => ({...acc,[key]: acc[key] ? [...acc[key], value] : [value]}), {} as {[key:string]: number[]}) /* { '1': [ 1, 2 ] } */
        : {}
      )
    const dbData = await prisma.object.findMany({
      where: {
        name_full: query ? {contains: query, mode: 'insensitive'} : undefined,
        city_id: cityId,
        type: type,
        sections: sectionId ? {some: {section_id: {equals: sectionId}}} : undefined,
        AND: groupedOptions?.length ? groupedOptions.map((ids) => ({options: {some: {option_id: {in: ids}}}})) : undefined,
      },
      orderBy: {
        created: "desc",
      },
      take: 10,
      include: {
        city: true,
        options: {include: {option: true}},
        photos: {orderBy: {order: "asc"}},
        phones: {orderBy: {order: "asc"}},
        links: {orderBy: {order: "asc"}},
        statusInstead: true,
        schedule: true,
      },
    });
    return dbData;
  },
  [],
  { tags: ["objects"] }
)

interface IFilters {
  query?: string;
  city?: string;
  type?: string;
  section?: string;
  options?: string;
}

export const getObjectById = unstable_cache(
  async (id:number) => {
    const dbData = await prisma.object.findUnique({
      where: {
        id: id
      },
      include: {
        city: true,
        sections: {include: {section: {include: {specs: {include: {spec: {include: {options: true}}}}}}}},
        options: {include: {option: true}},
        schedule: true,
        photos: {orderBy: {order: "asc"}},
        statusInstead: true,
        phones: {orderBy: {order: "asc"}},
        links: {orderBy: {order: "asc"}},
        parent: {include: {city: true, phones: true, links: true, schedule: true, statusInstead: true}},
        children: {include: {photos: true, phones: true, links: true, schedule: true}},
      },
    });
    const processed = objectReadProcessing(dbData);
    return processed;
  },
  [],
  { tags: ["objects"] }
)

export const upsertObject = unstable_cache(
  async (state:IObject, init:IObject) => {
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
      coord_lat: state.coord_lat || null,
      coord_lon: state.coord_lon || null,
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
    const phonesDeleted = init.phones?.filter((initPhone) => !state.phones?.some((statePhone) => initPhone.localId === statePhone.localId));
    const linksAdded = state.links?.filter((stateLink) => !init?.links?.some((initLink) => stateLink.localId === initLink.localId && stateLink.value !== ""));
    const linksChanged = state.links?.filter((stateLink) => init.links?.some((initLink) => stateLink.localId === initLink.localId && (stateLink.value !== initLink.value || stateLink.comment !== initLink.comment)));
    const linksDeleted = init.links?.filter((initLink) => !state.links?.some((stateLink) => initLink.localId === stateLink.localId));
    const optionsAdded = state.options?.filter((stateOption) => !init?.options?.some((initOption) => stateOption.id === initOption.id));
    const optionsDeleted = init.options?.filter((initOption) => !state.options?.some((stateOption) => initOption.id === stateOption.id));
    const sectionsAdded = state.sections?.filter((stateSection) => !init?.sections?.some((initSection) => stateSection.id === initSection.id));
    const sectionsDeleted = init.sections?.filter((initSection) => !state.sections?.some((stateSection) => initSection.id === stateSection.id));
    const scheduleAdded = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && !initDay.time && stateDay.time));
    const scheduleChanged = state.schedule?.filter((stateDay) => init.schedule?.some((initDay) => stateDay.day_num === initDay.day_num && initDay.id && stateDay.time && stateDay.time !== initDay.time));
    const scheduleDeleted = init.schedule?.filter((initDay) => state.schedule?.some((stateDay) => initDay.day_num === stateDay.day_num && initDay.time && !stateDay.time));
    const photosAdded = state.photos?.filter((statePhoto) => !init?.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId));
    const photosDeleted = init.photos?.filter((initPhoto) => !state.photos?.some((statePhoto) => initPhoto.localId === statePhoto.localId));
    const photosMoved = state.photos?.filter((statePhoto) => init.photos?.some((initPhoto) => statePhoto.localId === initPhoto.localId && statePhoto.order !== initPhoto.order));
    const addedObject = await prisma.object.upsert({
      where: {
        id: state.id ?? -1
      },
      create: {
        ...fields,
        phones: {
          create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
        },
        links: {
          create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
        },
        options: {
          create: optionsAdded?.length ? optionsAdded.map(({id}) => ({option: {connect: {id}}})) : undefined,
        },
        sections: {
          create: sectionsAdded?.length ? sectionsAdded.map(({id}) => ({section: {connect: {id}}})) : undefined,
        },
        schedule: {
          create: scheduleAdded?.length ? scheduleAdded.map((day) => ({...day, isWork: undefined})) : undefined,
        },
        photos: {
          // Don't: The
        },
        created: new Date(),
      },
      update: {
        ...fields,
        phones: {
          create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
          update: phonesChanged?.length ? phonesChanged.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
          deleteMany: phonesDeleted?.length ? phonesDeleted.map((item) => ({...item, localId: undefined})) : undefined,
        },
        links: {
          create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
          update: linksChanged?.length ? linksChanged.map((item) => ({where: {id: item.id}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
          deleteMany: linksDeleted?.length ? linksDeleted.map((item) => ({...item, localId: undefined})) : undefined,
        },
        options: {
          create: optionsAdded?.length ? optionsAdded.map(({id}) => ({option: {connect: {id}}})) : undefined,
          deleteMany: optionsDeleted?.length ? {option_id: {in: optionsDeleted.map(({id}) => id)}} : undefined,
        },
        sections: {
          create: sectionsAdded?.length ? sectionsAdded.map(({id}) => ({section: {connect: {id}}})) : undefined,
          deleteMany: sectionsDeleted?.length ? {section_id: {in: sectionsDeleted.map(({id}) => id)}} : undefined,
        },
        schedule: {
          create: scheduleAdded?.length ? scheduleAdded.map((day) => ({...day, id: undefined, object_id: undefined, isWork: undefined})) : undefined,
          update: scheduleChanged?.length ? scheduleChanged.map((day) => ({where: {id: day.id}, data: {...day, id: undefined, object_id: undefined, isWork: undefined}})) : undefined,
          deleteMany: scheduleDeleted?.length ? {id: {in: scheduleDeleted.map(({id}) => id)}} : undefined,
        },
        photos: {
          create: photosAdded?.length ? photosAdded.map(({name, order}) => ({name, order, uploaded: new Date()})) : undefined,
          update: photosMoved?.length ? photosMoved.map((photo) => ({where: {id: photo.id}, data: {order: photo.order}})) : undefined,
          deleteMany: photosDeleted?.length ? {id: {in: photosDeleted.map(({id}) => id)}} : undefined,
        },
        children: {
          update: state.children?.length ? state.children.map((child) => ({where: {id: child.id}, data: {
            name_where: child.name_where !== state.name_where ? state.name_where : undefined,
            name_full: child.name_where !== state.name_where ? child.name_type + " " + state.name_where : undefined,
            status: child.status_inherit && child.status !== state.status ? state.status : undefined,
            status_comment: child.status_inherit && child.status_comment !== state.status_comment ? state.status_comment : undefined,
            status_confirm: child.status_inherit && child.status_confirm !== state.status_confirm ? state.status_confirm : undefined,
            status_instead_id: child.status_inherit && child.status_instead_id !== state.status_instead_id ? state.status_instead_id : undefined,
            city_id: child.city_id !== state.city_id ? state.city_id : undefined,
            address: child.address !== state.address ? state.address : undefined,
            address_2: child.address_2 !== state.address_2 ? state.address_2 : undefined,
            coord_lat: child.coord_inherit && child.coord_lat !== state.coord_lat ? state.coord_lat : undefined,
            coord_lon: child.coord_inherit && child.coord_lat !== state.coord_lat ? state.coord_lon : undefined,
            schedule_247: child.schedule_inherit && child.schedule_247 !== state.schedule_247 ? state.schedule_247 : undefined,
            schedule_date: (child.schedule_inherit && state.schedule_date) && !child.schedule_date || format(child.schedule_date || "", "yyyy-MM-dd") !== format(state.schedule_date || "", "yyyy-MM-dd") ? new Date(state.schedule_date || "") : null,
            schedule_source: child.schedule_inherit && child.schedule_source !== state.schedule_source ? state.schedule_source : undefined,
            schedule_comment: child.schedule_inherit && child.schedule_comment !== state.schedule_comment ? state.schedule_comment : undefined,
            phones: {
              create: phonesAdded?.length ? phonesAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
              update: phonesChanged?.length ? phonesChanged.map((item) => ({where: {object_id_order: {object_id: child.id, order: item.order}}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
              delete: phonesDeleted?.length ? phonesDeleted.map((item) => ({object_id_order: {object_id: child.id, order: item.order}})) : undefined,
            },
            links: {
              create: linksAdded?.length ? linksAdded.map((item) => ({...item, id: undefined, localId: undefined, object_id: undefined})) : undefined,
              update: linksChanged?.length ? linksChanged.map((item) => ({where: {object_id_order: {object_id: child.id, order: item.order}}, data: {...item, id: undefined, localId: undefined, object_id: undefined}})) : undefined,
              delete: linksDeleted?.length ? linksDeleted.map((item) => ({object_id_order: {object_id: child.id, order: item.order}})) : undefined,
            },
            schedule: {
              create: (child.schedule_inherit && scheduleAdded?.length) ? scheduleAdded.map((day) => ({...day, isWork: undefined, id: undefined, object_id: undefined})) : undefined,
              update: (child.schedule_inherit && scheduleChanged?.length) ? scheduleChanged.map((day) => ({where: {object_id_day_num: {object_id: child.id, day_num: day.day_num}}, data: {...day, id: undefined, object_id: undefined, isWork: undefined}})) : undefined,
              delete: (child.schedule_inherit && scheduleDeleted?.length) ? scheduleDeleted.map((day) => ({object_id_day_num: {object_id: child.id, day_num: day.day_num}})) : undefined,
            },
            modified: new Date(),
          }})) : undefined
        }
      }
    });
    // Rename photo names of created object
    if (!state.id && state.photos?.length) {
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
      return updatedObject;
    };
    return addedObject;
  },
  [],
  { tags: ["objects"] }
)

export const deleteObjectById = unstable_cache(
  async (id:number) => {
    await prisma.object.delete({
      where: {
        id: id,
      },
    });
  },
  [],
  { tags: ["objects"] }
)

export async function getEmptyObject() {
  return {
    status: "works",
    schedule: Array(7).fill(null).map((_,i) => ({day_num: i})),
  }
}