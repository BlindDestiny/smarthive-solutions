import { SkeletonCard, Skeleton } from "@/components/ui/Skeleton"

export default function ClientDashboardLoading() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <Skeleton className="h-5 w-36 mb-2" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
    </div>
  )
}
