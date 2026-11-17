import { ArrowUpRight, Heart } from 'lucide-react'

export default function ProjectCard({ project, image, isLiked, onOpen, onLike }) {
  const tech = (project.tags || []).slice(0, 4).join(' · ')
  const likes = Number(project.likes ?? 0)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors duration-200 hover:border-[#7A33FF]/50">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${project.title} details`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A33FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090514]"
      />

      <div className="relative h-[180px] w-full overflow-hidden border-b border-white/10 bg-white/[0.03]">
        {image ? (
          <img
            src={image}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div
            className="h-full w-full bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
            aria-hidden="true"
          />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onLike()
          }}
          aria-label={isLiked ? `Liked ${project.title}` : `Like ${project.title}`}
          aria-pressed={isLiked}
          className={`absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-semibold backdrop-blur-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
            isLiked
              ? 'bg-rose-950/90 border border-rose-500/80 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.5)]'
              : 'bg-[#090514]/85 border border-white/25 text-white shadow-lg hover:border-rose-400/70 hover:bg-black/95 hover:scale-105 active:scale-95'
          }`}
          style={{ cursor: isLiked ? 'default' : 'pointer' }}
        >
          <Heart
            size={15}
            strokeWidth={2}
            fill={isLiked ? '#f43f5e' : 'none'}
            color={isLiked ? '#f43f5e' : '#fb7185'}
            className="transition-transform duration-200"
            style={{
              filter: isLiked ? 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.8))' : 'none',
            }}
          />
          <span className={isLiked ? 'text-rose-200 font-bold' : 'text-gray-200'}>
            {likes}
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
            {project.subtitle}
          </span>
          <ArrowUpRight
            size={14}
            className="flex-shrink-0 text-gray-600 transition-colors group-hover:text-[#7A33FF]"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-2 text-[16px] font-medium leading-snug text-gray-100">
          {project.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[13px] font-normal leading-relaxed text-gray-400">
          {project.desc}
        </p>

        {tech && (
          <p className="mt-3 truncate font-mono text-[12px] font-normal text-gray-500">
            {tech}
          </p>
        )}
      </div>
    </article>
  )
}
