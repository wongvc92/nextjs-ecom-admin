"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

export default function PageBreadcrumb() {
  const segments = useSelectedLayoutSegments();

  // Filter out segments that are within parentheses like (admin) or (routes)
  const filteredSegments = segments.filter((segment) => !segment.startsWith("(") && !segment.endsWith(")"));

  // Assume a base path starts from the "products" page, for example.
  const basePath = process.env.NEXT_PUBLIC_APP_URL!;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      <Link href={basePath} className="text-gray-600 hover:text-gray-900">
        Home
      </Link>

      {/* Separator Icon */}
      {filteredSegments.length > 0 && <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}

      {/* Dynamically generate breadcrumbs based on filtered segments */}
      {filteredSegments.map((segment, index) => {
        const path = `${basePath}/${filteredSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === filteredSegments.length - 1;

        return (
          <div key={segment} className="flex items-center space-x-2 text-sm text-ellipsis">
            {/* Separator Icon */}
            {index > 0 && <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}

            {isLast ? (
              <span className="text-gray-500">{decodeURIComponent(segment)}</span>
            ) : (
              <Link href={path} className="text-gray-600 hover:text-gray-900">
                {decodeURIComponent(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
