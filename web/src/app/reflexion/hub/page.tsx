import { redirect } from "next/navigation";

export default async function HubRedirectPage(
  props: PageProps<"/reflexion/hub">,
) {
  await props.params;
  redirect("/reflexion/dimensionen");
}
