export default function CardSkeleton() {
  return (
    <div className="w-full max-w-[240px] h-[360px] bg-[#1e1f24] rounded-2xl border border-white/5 flex flex-col overflow-hidden animate-pulse">
      {/* Poster Area Skeleton */}
      <div className="flex-1 bg-white/5" />

      {/* Footer Area Skeleton */}
      <div className="bg-[#121316] p-4 flex flex-col gap-2 border-t border-white/5">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}
