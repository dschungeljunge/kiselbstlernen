import { redirect } from "next/navigation";

export default async function SituationRedirectPage(
  props: PageProps<"/reflexion/situation">,
) {
  await props.params;
  redirect("/reflexion/beschreibung");
}
