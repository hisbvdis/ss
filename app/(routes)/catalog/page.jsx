import { getCityById } from "@/app/(routes)/api/cities/requests"
import { getObjectsByFilters } from "@/app/(routes)/api/objects/requests";
import { getSectionsByFilters } from "@/app/(routes)/api/sections/requests";
// -----------------------------------------------------------------------------
import { Catalog } from "@/app/_ui/Catalog";
import { SearchPanel } from "@/app/_ui/SearchPanel";


export default async function CatalogPage({searchParams}) {
  const city = searchParams.city ? await getCityById(searchParams.city) : undefined;
  const sections = await getSectionsByFilters();
  const searchResults = await getObjectsByFilters(searchParams);

  return (<>
    <SearchPanel/>
    <div className="container  page">
      <Catalog searchParams={searchParams} city={city} sections={sections} searchResults={searchResults}/>
    </div>
  </>)
}