import React from "react";
import WebhookForm from "./components/webhook-form";
import { getWebhookInfo } from "@/lib/db/queries/admin/couriers";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const WebhookPage = async () => {
  const data = await getWebhookInfo();

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Webhook" description="Select event for the courier services" />
      </div>
      <Separator />
      <WebhookForm events={data?.webhook?.events || []} />
    </section>
  );
};

export default WebhookPage;
