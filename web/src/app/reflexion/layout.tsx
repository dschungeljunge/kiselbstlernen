import { ReflexionProvider } from "@/contexts/ReflexionContext";

export default async function ReflexionLayout({
  children,
  params,
}: LayoutProps<"/reflexion">) {
  await params;

  return <ReflexionProvider>{children}</ReflexionProvider>;
}
