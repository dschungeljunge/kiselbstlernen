import { ReflexionProvider } from "@/contexts/ReflexionContext";

export default function ReflexionLayout({
  children,
}: LayoutProps<"/reflexion">) {
  return <ReflexionProvider>{children}</ReflexionProvider>;
}
