import { redirect } from "next/navigation";
import { analiseItems } from "@/lib/analises";

export default function AnalisesPage() {
  redirect(analiseItems[0].href);
}
