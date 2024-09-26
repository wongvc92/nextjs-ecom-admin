import { Skeleton } from "@/components/ui/skeleton";

const TableLoading = () => {
  const rows = Array.from({ length: 5 }); // Creates 5 rows as placeholders
  return (
    <div className="w-full overflow-hidden border border-gray-200 shadow rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50">
              <Skeleton className="h-4 w-10" />
            </th>
            <th className="px-6 py-3 bg-gray-50">
              <Skeleton className="h-4 w-40" />
            </th>
            <th className="px-6 py-3 bg-gray-50">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="px-6 py-3 bg-gray-50">
              <Skeleton className="h-4 w-10" />
            </th>
            <th className="px-6 py-3 bg-gray-50">
              <Skeleton className="h-4 w-20" />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-48" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-24" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-16" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-10" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-20" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoading;
