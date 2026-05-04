import { redirect } from "next/navigation";

export default async function StrategieRedirectPage(
  props: PageProps<"/reflexion/[strategie]">,
) {
  await props.params;
  redirect("/reflexion/dimensionen");
}
