import { Skeleton } from "@/components/ui/Skeleton"

export default function EventsLoading() {
  return (
    <div className="p-8 max-w-3xl">
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-4 w-52 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
