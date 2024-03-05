import { SectionEdit } from "@/app/_pages/SectionEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getEmptySection, getSectionById } from "@/app/(router)/api/sections/requests"


export default async function SectionEditPage({params}:{params: {id:number | "add"}}) {
  const section = (params.id === "add") ? await getEmptySection() : await getSectionById(params.id);

  return (
    <div className="container  page">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Разделы", href: "/admin/sections" },
        { label: section.id ? "Редактировать" : "Создать" },
      ]}/>
      <SectionEdit init={section}/>
    </div>
  );
}