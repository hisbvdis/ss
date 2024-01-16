import { getCityById } from "@/app/(routes)/api/cities/requests";
import { getObjectsByFilters } from "@/app/(routes)/api/objects/requests";
import { getSectionsByFilters } from "@/app/(routes)/api/sections/requests";
// -----------------------------------------------------------------------------
import Catalog from "./Catalog";


export default async function CatalogPage({searchParams}) {
  const city = await getCityById(searchParams.city);
  const sections = await getSectionsByFilters();
  const searchResults = await getObjectsByFilters(searchParams);

  return (
    <Catalog searchParams={searchParams} city={city} sections={sections} searchResults={searchResults}/>
  )
}
