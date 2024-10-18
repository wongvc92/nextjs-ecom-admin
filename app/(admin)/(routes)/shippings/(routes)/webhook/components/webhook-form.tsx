"use client";

import React, { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateCourierWebhook } from "@/actions/courier";
import SubmitButton from "@/components/submit-button";
import { EventOptions } from "@/lib/db/types/couriers/webhook";

interface WebhookFormValues {
  webhooks: EventOptions[];
}

const eventOptions: EventOptions[] = [
  EventOptions.ShipmentCancel,
  EventOptions.ShipmentCreate,
  EventOptions.ShipmentDelete,
  EventOptions.ShipmentGenerated,
  EventOptions.ShipmentUpdate,
  EventOptions.TrackingCheckpointUpdate,
  EventOptions.TrackingCreate,
  EventOptions.TrackingDelete,
  EventOptions.TrackingUpdate,
];

const WebhookForm = ({ events }: { events: EventOptions[] }) => {
  const [isPending, startTransition] = useTransition();
  const { handleSubmit, control } = useForm<WebhookFormValues>({
    defaultValues: {
      webhooks: events ? events : [],
    },
  });

  const onSubmit = async (data: { webhooks: string[] }) => {
    startTransition(async () => {
      if (data.webhooks.length === 0) {
        toast.error(`Please select "Tracking Checkpoint Update" as default`);
        return;
      }
      const res = await updateCourierWebhook(data.webhooks);
      if (res.error) {
        toast.error(res.error);
      }
      if (res.success) {
        toast.success(res.success);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        {eventOptions.map((eventOption) => (
          <div key={eventOption} className="flex items-center space-x-2 gap-2">
            <Controller
              name="webhooks"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Checkbox
                    className={` ${!value.includes(eventOption) ? "text-muted-foreground " : ""}`}
                    checked={value.includes(eventOption)}
                    onCheckedChange={(checked) => {
                      const newValues = checked ? [...value, eventOption] : value.filter((v: string) => v !== eventOption);
                      onChange(newValues);
                    }}
                  />
                  <Label className={`capitalize ${!value.includes(eventOption) ? "text-muted-foreground " : ""}`}>
                    {eventOption.split("_").join(" ")}
                  </Label>
                </>
              )}
            />
          </div>
        ))}
      </div>
      <div>
        <SubmitButton defaultTitle="Save events" isLoadingTitle="Saving events" isLoading={isPending} />
      </div>
    </form>
  );
};

export default WebhookForm;
