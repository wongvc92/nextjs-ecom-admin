import { Checkpoint } from "@/lib/db/types/couriers/trackingCheckpointUpdate";
import { format } from "date-fns";

export const TrackingEmailTemplate = ({ latestCheckpoint }: { latestCheckpoint: Checkpoint | null }) => (
  <div>
    <h1>Your parcel tracking update</h1>
    <p>
      <p>{latestCheckpoint?.location || ""}</p>
      <p>{latestCheckpoint?.status.split("_").join(" ") || ""}</p>
      <p>{latestCheckpoint?.content || ""} </p>
      <span>{format(latestCheckpoint?.time as string, "dd/MM/yy MM:HH") || ""}</span>
    </p>
  </div>
);
