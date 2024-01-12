import { PageHeader } from "@/app/_ui/PageHeader";
import "@/app/_styles/global.css";


export default function RootLayout({children}) {
  return (
    <html lang="ru">
      <body>
        <PageHeader/>
        {children}
      </body>
    </html>
  )
}