import MobileNav from "./mobile-nav";
import Link from "next/link";

const MainNav = () => {
  return (
    <aside className="flex flex-col space-y-10 items-start px-2">
      <div className="flex items-center md:flex-row-reverse justify-start">
        <MobileNav />
        <Link href="/">Store</Link>
      </div>
      {/* {routes.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return <NavLink key={item.path} item={item} isActive={isActive} />;
      })} */}
    </aside>
  );
};
export default MainNav;
