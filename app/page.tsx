import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home page",
  description: "Manage your ecommerce store",
};

const HomePage = async () => {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return null;
};

export default HomePage;
