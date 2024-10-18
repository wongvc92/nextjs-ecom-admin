import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSenders } from "@/lib/db/queries/admin/senders";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import AddressAction from "./components/address-action";

const SenderPage = async () => {
  const senders = await getSenders();
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Sender" description="Manage sender info for courier services" />
        <Link href="/shippings/sender/add-new">
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
              <li key={sender.id} className="border rounded-md p-4 text-xs text-muted-foreground w-full flex items-baseline">
                <div className="space-y-2">
                  <p>
                    {sender.address_1},{sender.address_2 && `${sender.address_2}, `}
                    {sender.postcode}, {sender.province}, {sender.city}, {sender.country}
                  </p>
                  <Separator />
                  <p>{sender.name}</p>
                  <p>{sender.phone}</p>
                  <p>{sender.email || "No email"}</p>

                  {sender.defaultSender === true && (
                    <div className="flex justify-end">
                      <Badge variant="secondary" className="text-muted-foreground">
                        Default
                      </Badge>
                    </div>
                  )}
                </div>

                <AddressAction sender={sender} />
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

export default SenderPage;
