// /reflexion/cockpit → weitergeleitet zum Hub
import { redirect } from "next/navigation";
export default function CockpitRedirect() {
  redirect("/reflexion/hub");
}
