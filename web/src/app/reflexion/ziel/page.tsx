import { redirect } from "next/navigation";

export default async function ZielRedirectPage(
  props: PageProps<"/reflexion/ziel">,
) {
  await props.params;
  redirect("/reflexion/fazit");
}
