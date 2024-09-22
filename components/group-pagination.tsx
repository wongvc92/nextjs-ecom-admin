"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProductPaginationProps {
  totalPages: number;
}
const GroupPagination: React.FC<ProductPaginationProps> = ({ totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") as string) || 1;
  const pathname = usePathname();

  const handlePreviousClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const previousPage = page > 1 ? page - 1 : 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", previousPage.toString());
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const handleNextClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const nextPage = page < totalPages ? page + 1 : totalPages;
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const pageNumbers = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <ChevronLeft onClick={handlePreviousClick} className="cursor-pointer" />
              </PaginationItem>
            )}

            {pageNumbers.map((pageNumber, i) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink href={`${pathname}?page=${pageNumber}`} isActive={pageNumber === page}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page < totalPages && (
              <PaginationItem>
                <ChevronRight onClick={handleNextClick} className="cursor-pointer" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default GroupPagination;
