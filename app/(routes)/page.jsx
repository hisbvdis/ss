import { redirect } from "next/navigation";

export default async function RootPage({searchParams}) {
  redirect("/catalog");
  return (
    <h1>Main page</h1>
  )
}
