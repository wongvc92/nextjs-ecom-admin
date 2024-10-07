import { Skeleton } from "../ui/skeleton";

export function BannerFormLoading() {
  return (
    <div className="px-4 space-y-8 py-8 w-full min-h-screen">
      {/* Title and Description Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Image Info List Skeleton */}
      <ul className="text-xs text-muted-foreground space-y-2">
        <li className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </li>
        <li className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-56" />
        </li>
        <li className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-64" />
        </li>
      </ul>

      {/* Image Preview or Upload Button Skeleton */}
      <Skeleton className="h-[400px] aspect-video" />

      {/* Submit Button Skeleton */}
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
