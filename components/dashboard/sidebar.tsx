import { auth } from "@/auth";
import NavLinks from "./nav-links";

const Sidebar = async () => {
  const session = await auth();

  return (
    <div className="top-0 hidden min-h-screen border w-[50px] items-center xl:w-fit xl:flex xl:flex-col pt-10  bg-muted sticky  h-screen  shadow-md dark:bg-transparent">
      <NavLinks role={session?.user.role as string} />
    </div>
  );
};

export default Sidebar;
