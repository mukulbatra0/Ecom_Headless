export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block space-y-6">
            <div className="h-64 bg-white rounded-3xl p-6 border border-gray-100 animate-pulse" />
            <div className="h-48 bg-white rounded-3xl p-6 border border-gray-100 animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse space-y-3">
                  <div className="aspect-square bg-gray-100 rounded-2xl" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
