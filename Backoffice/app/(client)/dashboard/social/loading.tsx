import { Skeleton } from "@/components/ui/Skeleton"

export default function SocialLoading() {
  return (
    <div className="p-8 max-w-2xl">
      <Skeleton className="h-8 w-36 mb-2" />
      <Skeleton className="h-4 w-52 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
