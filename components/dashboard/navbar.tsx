import { ModeToggle } from "../ui/mode-toggle";
import MobileNav from "./mobile-nav";
import UserButton from "../auth/user-button";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();
  return (
    <div>
      {session?.user.id && (
        <header className="flex h-12 items-center justify-between border-b p-4 w-full">
          <MobileNav />
          <div className="flex items-center gap-4">
            <UserButton session={session} />
          </div>
        </header>
      )}
    </div>
  );
};
export default Navbar;
