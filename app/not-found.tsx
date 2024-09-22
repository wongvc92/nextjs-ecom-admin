import MaxWrapper from "@/components/marketing/max-wrapper";
import Link from "next/link";

export default function NotFound() {
  return (
    <MaxWrapper className="flex flex-col items-center justify-center h-screen">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="text-blue-400">
        Return Home
      </Link>
    </MaxWrapper>
  );
}
