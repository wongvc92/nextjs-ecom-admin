import { cn } from "@/lib/utils";

interface MaxWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const MaxWrapper: React.FC<MaxWrapperProps> = ({ className, children }) => {
  return <div className={cn("max-w-7xl m-auto ", className)}>{children}</div>;
};
export default MaxWrapper;
