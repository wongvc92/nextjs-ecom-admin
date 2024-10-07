import { Skeleton } from "../ui/skeleton";

export function EditProductFormLoading() {
  return (
    <div className="space-y-6 md:container w-full pt-8 px-2">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-10 w-10 md:w-28 self-start" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-10">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="flex gap-8">
            {/* Product Image Section */}
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2 flex flex-col">
              {/* Info Section */}
              <div className="flex flex-col space-y-4">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-64" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-40 w-40" />
                <Skeleton className="h-40 w-40" />
                <Skeleton className="h-40 w-40" />
                <Skeleton className="h-40 w-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Information Section */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2 flex flex-col">
              <div className="flex flex-col space-y-4">
                <Skeleton className="h-6 w-64" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2 flex flex-col">
              <div className="flex flex-col space-y-4">
                <Skeleton className="h-6 w-64" />
              </div>
            </div>
          </div>
        </div>

        {/* Others Section */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2 flex flex-col">
              <div className="flex flex-col space-y-4">
                <Skeleton className="h-6 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
