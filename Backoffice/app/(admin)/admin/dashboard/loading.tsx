import { SkeletonCard, Skeleton } from "@/components/ui/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <Skeleton className="h-5 w-36 mb-4" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-start gap-3">
                <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
