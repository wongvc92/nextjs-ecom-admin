import { auth } from "@/auth";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return null;
};

export default HomePage;
