import { ReflexionProvider } from "@/contexts/ReflexionContext";

export default function ReflexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReflexionProvider>{children}</ReflexionProvider>;
}
