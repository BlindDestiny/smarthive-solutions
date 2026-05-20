import { Skeleton } from "@/components/ui/Skeleton"

export default function ImagesLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-60 mb-6" />
      <Skeleton className="h-32 w-full rounded-xl mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  )
}
