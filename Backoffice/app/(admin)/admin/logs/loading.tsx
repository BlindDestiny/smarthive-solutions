import { Skeleton } from "@/components/ui/Skeleton"

export default function LogsLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-44 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <th key={i} className="px-6 py-3"><Skeleton className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-6 py-3"><Skeleton className="h-5 w-28 rounded" /></td>
                <td className="px-6 py-3"><Skeleton className="h-4 w-24" /></td>
                <td className="px-6 py-3"><Skeleton className="h-4 w-28" /></td>
                <td className="px-6 py-3"><Skeleton className="h-4 w-20" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
