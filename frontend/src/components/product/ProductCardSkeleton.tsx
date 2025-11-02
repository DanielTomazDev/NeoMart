export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />

        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

        {/* Rating */}
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />

        {/* Price */}
        <div className="mt-auto">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

