import { Skeleton } from "@/components/ui/Skeleton"

export default function WebsiteLoading() {
  return (
    <div className="p-8 max-w-3xl">
      <Skeleton className="h-8 w-52 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j}>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
