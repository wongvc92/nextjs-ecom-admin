import React from "react";
import EditForm from "./components/edit-form";
import { getSenderById } from "@/lib/db/queries/admin/senders";
import { TSenderFormSchema } from "@/lib/validation/courierValidation";

const page = async ({ params }: { params: { id: string } }) => {
  const sender = await getSenderById(params.id);

  const defaultValues = {
    ...sender,
    dialing_country_code: sender?.dialing_country_code,
    country: sender?.country,
  } as TSenderFormSchema;
  return <section className="w-full md:max-w-2xl px-2 mx-auto">{!sender ? "No data found" : <EditForm defaultValues={defaultValues} />}</section>;
};

export default page;
