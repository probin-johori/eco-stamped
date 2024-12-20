// components/ImageGallerySkeleton.tsx
export function ImageGallerySkeleton() {
  return (
    <div className="relative">
      <div className="grid grid-cols-5 gap-2 p-1 mb-3">
        {/* Main image skeleton */}
        <div className="col-span-3 relative aspect-auto">
          <div className="w-full h-full relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 w-full h-full shimmer" />
          </div>
        </div>

        {/* Grid of 4 thumbnail skeletons */}
        <div className="col-span-2 grid grid-rows-2 grid-cols-2 gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="aspect-square relative">
              <div className="w-full h-full relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 w-full h-full shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery button skeleton */}
      <div className="absolute right-4 bottom-6">
        <div className="h-9 w-24 shimmer rounded-full" />
      </div>
    </div>
  );
}
