import { Skeleton } from "@/components/ui/Skeleton"

export default function PlansLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-52 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-24" />
            <div className="space-y-2 pt-2">
              {Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-4 w-full" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
