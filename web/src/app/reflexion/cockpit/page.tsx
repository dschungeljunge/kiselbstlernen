import { redirect } from "next/navigation";

export default async function CockpitRedirect(
  props: PageProps<"/reflexion/cockpit">,
) {
  await props.params;
  redirect("/reflexion/fazit");
}
