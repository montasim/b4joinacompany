import { redirect } from "next/navigation";

export default function RecoverPage() {
  redirect("/auth/sign-in");
}
