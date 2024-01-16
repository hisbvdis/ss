import { SectionEdit } from "@/app/_ui/SectionEdit";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
// -----------------------------------------------------------------------------
import { getSectionById, getEmptySection } from "@/app/(routes)/api/sections/requests"


export default async function SectionEditPage({params}) {
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