// components/BrandCardSkeleton.tsx
export function BrandCardSkeleton() {
  return (
    <div className="relative w-full">
      <div className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-xl block">
        <div className="relative rounded-3xl border-0 overflow-hidden bg-card">
          <div className="relative w-full pt-[100%]">
            {/* Cover image skeleton */}
            <div className="absolute inset-0 w-full h-full bg-neutral-50">
              <div className="w-full h-full shimmer" />
            </div>

            <div className="absolute inset-x-3 bottom-3">
              <div className="bg-white rounded-full">
                <div className="flex items-center justify-center p-2 gap-2">
                  {/* Logo skeleton */}
                  <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
                    <div className="w-full h-full shimmer" />
                  </div>
                  
                  <div className="flex-1 min-w-0 mr-4">
                    {/* Name skeleton */}
                    <div className="h-5 mb-1 shimmer rounded" />
                    {/* Categories skeleton */}
                    <div className="h-4 w-2/3 shimmer rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
