export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-border/50 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-muted rounded-3xl"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Category */}
        <div className="h-3 bg-muted rounded-full w-20"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-full w-full"></div>
          <div className="h-4 bg-muted rounded-full w-3/4"></div>
        </div>

        {/* Rating */}
        <div className="h-4 bg-muted rounded-full w-32"></div>

        {/* Price */}
        <div className="h-8 bg-muted rounded-full w-24"></div>

        {/* Button */}
        <div className="h-12 bg-muted rounded-full w-full"></div>
      </div>
    </div>
  );
}
