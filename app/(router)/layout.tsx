import "@/app/_styles/global.css";
// -----------------------------------------------------------------------------
import PageHeader from "@/app/_ui/PageHeader/PageHeader";


export default function RootLayout(props:IProps) {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <PageHeader/>
        {children}
      </body>
    </html>
  );
}

interface IProps {
  children: React.ReactNode;
}