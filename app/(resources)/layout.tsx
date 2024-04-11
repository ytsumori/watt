import { ResourceFooter } from "./_components/resource-footer";

export default function ResourceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ResourceFooter />
    </>
  );
}
