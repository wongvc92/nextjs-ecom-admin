import {
  Box,
  LayoutDashboard,
  Palette,
  Ruler,
  ShoppingCart,
  StretchHorizontal,
} from "lucide-react";

interface IconsProps {
  name: string;
}

const NavIcon: React.FC<IconsProps> = ({ name }) => {
  let icon;

  switch (name) {
    case "Dashboard":
      icon = <LayoutDashboard />;
      break;
    case "Categories":
      icon = <StretchHorizontal />;
      break;
    case "Sizes":
      icon = <Ruler />;
      break;
    case "Colors":
      icon = <Palette />;
      break;
    case "Products":
      icon = <Box />;
      break;
    case "Orders":
      icon = <ShoppingCart />;
      break;
    default:
      break;
  }

  return <>{icon}</>;
};
export default NavIcon;
