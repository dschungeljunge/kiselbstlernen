// /reflexion/waehlen → weitergeleitet zum Hub
import { redirect } from "next/navigation";
export default function WaehlenRedirect() {
  redirect("/reflexion/hub");
}
