import { redirect } from "next/navigation";

export default async function WaehlenRedirect(
  props: PageProps<"/reflexion/waehlen">,
) {
  await props.params;
  redirect("/reflexion/dimensionen");
}
