import { getCityById } from "../api/cities/requests"
import { getObjectsByFilters } from "../api/objects/requests";
import { getSectionsByFilters } from "../api/sections/requests";
// -----------------------------------------------------------------------------
import Catalog from "@/app/_ui/Catalog/Catalog";


export default async function CatalogPage({searchParams}) {
  const city = await getCityById(searchParams.city);
  const sections = await getSectionsByFilters();
  const searchResults = await getObjectsByFilters(searchParams);

  return (
    <div className="container  page">
      <Catalog searchParams={searchParams} city={city} sections={sections} searchResults={searchResults}/>
    </div>
  )
}