import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { emptySpec, getSpecById } from "@/app/_db/specs.db";
import { SpecEdit } from "@/app/_ui/SpecEdit";

export default async function EditSpecPage({params}) {
  const spec = (params.id === "add") ? emptySpec : await getSpecById(params.id);

  return (
    <main className="container">
      <Breadcrumbs items={[
        { label: "Админка", href: "/admin" },
        { label: "Характеристики", href: "/admin/specs" },
        { label: spec?.id ? "Редактировать" : "Создать" },
      ]}/>
      <SpecEdit init={spec}/>
    </main>
  );
}
