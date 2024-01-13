import clsx from "clsx";

export default function FormSectionContent(props) {
  const { className, children } = props;

  return (
    <div className={clsx("formSectionContent", className)}>
      {children}
    </div>
  )
}
