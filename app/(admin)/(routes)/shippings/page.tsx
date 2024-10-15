import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSenders } from "@/lib/db/queries/admin/senders";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const ShippingsPage = async () => {
  const senders = await getSenders();

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Shippings" description="Manage shippings for your store" />
        <Link href="/shippings/add-new">
          <Button type="button" className="flex items-center">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Add new</span>
          </Button>
        </Link>
      </div>
      <Separator />
      <div className="max-w-5xl">
        {senders ? (
          <ul className="grid md:grid-cols-3 gap-4">
            {senders.map((sender) => (
              <li key={sender.id} className="border rounded-md p-2 text-xs text-muted-foreground w-full">
                <div>
                  {sender.name}, {sender.dialing_country_code}, {sender.phone}, {sender.email || "No email"}, {sender.address_1},
                  {sender.address_2 && `${sender.address_2}, `}
                  {sender.postcode}, {sender.province}, {sender.city}, {sender.country}
                </div>
                <div className="flex justify-end">
                  <Link href={`/shippings/${sender.id}`} className="text-orange-500">
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          "No sender data"
        )}
      </div>
    </section>
  );
};

export default ShippingsPage;
