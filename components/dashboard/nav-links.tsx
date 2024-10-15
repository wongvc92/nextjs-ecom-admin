import { Box, GalleryHorizontal, Image, LayoutDashboard, ShoppingCart, StretchHorizontal, TruckIcon, UsersRound } from "lucide-react";
import Link from "next/link";

export const routes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Banners",
    path: "/banners",
    icon: GalleryHorizontal,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: StretchHorizontal,
  },
  {
    name: "Products",
    path: "/products",
    icon: Box,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Galleries",
    path: "/galleries",
    icon: Image,
  },
  {
    name: "Shippings",
    path: "/shippings",
    icon: TruckIcon,
  },
  {
    name: "Users",
    path: "/users",
    icon: UsersRound,
  },
];

const NavLinks = ({ role }: { role: string }) => {
  const roleBasedRoute =
    role === "USER"
      ? routes.filter((route) => {
          return route.name !== "Users";
        })
      : routes;

  return (
    <aside>
      <ul className={"flex flex-col items-start space-y-4 mt-12 px-4 py-2 w-full"}>
        {roleBasedRoute.map((item) => (
          <li key={item.name}>
            <Link href={item.path}>
              <p
                className={
                  "flex items-center gap-2 w-full h-8 group text-muted-foreground text-sm px-2 rounded-md hover:bg-white hover:w-auto hover:text-black"
                }
              >
                <item.icon className={"w-6 h-6 transition-transform duration-300 group-hover:rotate-45"} />
                <span>{item.name}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default NavLinks;
