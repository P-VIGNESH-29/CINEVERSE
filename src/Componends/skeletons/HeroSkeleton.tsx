export default function HeroSkeleton() {
  return (
    <div className="w-full h-[56.25vw] max-h-[550px] min-h-[350px] bg-[#141519] border-b border-white/5 relative flex items-center overflow-hidden animate-pulse">
      {/* Background Skeleton */}
      <div className="absolute inset-0 bg-white/5" />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1013] via-[#0f1013]/60 to-transparent" />
      
      {/* Content Skeleton */}
      <div className="relative max-w-7xl mx-auto w-full px-6 md:p-8 z-10 flex flex-col gap-4">
        <div className="h-4 bg-white/10 rounded w-24" />
        <div className="h-10 bg-white/10 rounded w-1/2 md:w-1/3" />
        <div className="flex gap-4 items-center">
          <div className="h-5 bg-white/5 rounded w-16" />
          <div className="h-5 bg-white/5 rounded w-20" />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
          <div className="h-4 bg-white/5 rounded w-4/6" />
        </div>
        <div className="flex gap-4 mt-2">
          <div className="h-10 bg-white/10 rounded w-32" />
          <div className="h-10 bg-white/5 rounded w-36" />
        </div>
      </div>
    </div>
  );
}
