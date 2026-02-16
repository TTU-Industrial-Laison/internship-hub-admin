import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationTabsProps = {
  page: number;
  size: number;
  total: number;
  onPageChange?: (page: number) => void;
};

export function PaginationTabs({
  page,
  size,
  total,
  onPageChange,
}: Readonly<PaginationTabsProps>) {
  const totalPages = Math.ceil(total / size) || 1;
  const start = total === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, total);

  const isDisabled = total === 0;

  const goto = (page: number) => {
    if (isDisabled || page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  // condensed page numbers
  const getPageNumbers = () => {
    if (isDisabled) return [1];

    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const showEllipsis = totalPages > maxVisible + 2;

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);

    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mt-5">
      <p className="font-semibold text-sm">
        Showing{" "}
        <span className="text-primary font-bold">
          {start} - {end}
        </span>{" "}
        of <span className="text-primary font-bold">{total}</span> {total === 1 ? "item" : "items"}
      </p>

      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={`text-sm ${
                isDisabled || page <= 1
                  ? "pointer-events-none opacity-50 text-gray-400"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                goto(page - 1);
              }}
            />
          </PaginationItem>

          {getPageNumbers().map((p, idx) => {
            const key = typeof p === "number" ? `page-${p}` : `ellipsis-${idx}`;
            return (
              <PaginationItem key={key} className="text-sm p-0">
                {p === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    className={`!text-sm size-7 ${
                      isDisabled
                        ? "pointer-events-none opacity-50 text-gray-400"
                        : ""
                    }`}
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      goto(p as number);
                    }}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              className={`text-sm ${
                isDisabled || page >= totalPages
                  ? "pointer-events-none opacity-50 text-gray-400"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                goto(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
