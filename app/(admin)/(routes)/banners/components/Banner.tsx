import { Heading } from "@/components/ui/heading";
import { Database, Edit, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  id: string;
  url: string;
}

const Banner = ({ data }: { data: BannerProps[] }) => {
  return (
    <section className="w-full md:container">
      <div className="py-8 px-4 flex-col space-y-8 w-full min-h-screen">
        <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
          <Heading title={`Banner `} description="Manage banner for your store" />

          {data.length === 0 ? (
            <Link href={`banners/add-new`} type="button" className="flex items-center bg-black text-white px-4 py-3 rounded-md text-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Add new</span>
            </Link>
          ) : (
            <Link href={`banners/edit`} type="button" className="flex items-center bg-black text-white px-4 py-3 rounded-md text-sm">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Edit</span>
            </Link>
          )}
        </div>
        {data && !!Database.length && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full ">
            {data?.map((item, i) => (
              <div key={item.id} className="relative w-full max-h-[400px] aspect-video rounded-md overflow-hidden">
                <Image src={item.url} alt={item.url} fill className="object-coer" />
                <div className="absolute top-2 left-2 rounded-full bg-white w-4 h-4 flex justify-center items-center p-3 opacity-80">{i + 1}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;
