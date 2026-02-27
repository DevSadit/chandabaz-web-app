import { Link } from 'react-router-dom';
import { MapPin, Calendar, Image, Video, FileText, Eye, UserX, User, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mediaMeta = {
  image: { icon: Image, cls: 'badge-image', label: 'Image' },
  video: { icon: Video, cls: 'badge-video', label: 'Video' },
  pdf: { icon: FileText, cls: 'badge-pdf', label: 'Doc' },
};

function MediaBadges({ media }) {
  const counts = media.reduce((acc, m) => { acc[m.type] = (acc[m.type] || 0) + 1; return acc; }, {});
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(counts).map(([type, count]) => {
        const { icon: Icon, cls } = mediaMeta[type] || mediaMeta.image;
        return (
          <span key={type} className={`${cls} gap-1`}>
            <Icon size={11} /> {count}
          </span>
        );
      })}
    </div>
  );
}

export default function PostCard({ post }) {
  const firstImage = post.media?.find((m) => m.type === 'image');
  const hasVideo = post.media?.some((m) => m.type === 'video');

  return (
    <Link
      to={`/post/${post._id}`}
      className="group card-hover flex flex-col overflow-hidden bg-white rounded-3xl"
    >
      {/* Thumbnail */}
      <div className="relative h-56 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden flex-shrink-0">
        {firstImage ? (
          <>
            <img
              src={firstImage.url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-14 h-14 bg-white/70 rounded-2xl flex items-center justify-center shadow-sm">
              {hasVideo
                ? <Video size={26} className="text-primary-500" />
                : post.media?.[0]?.type === 'pdf'
                  ? <FileText size={26} className="text-orange-500" />
                  : <Image size={26} className="text-primary-400" />}
            </div>
            <span className="text-xs font-medium text-primary-600">
              {hasVideo ? 'Video Evidence' : post.media?.[0]?.type === 'pdf' ? 'Document' : 'No media'}
            </span>
          </div>
        )}

        {/* Arrow icon on hover */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shadow-md">
          <ArrowUpRight size={18} className="text-primary-600" />
        </div>

        {/* Pending badge */}
        {post.status === 'pending' && (
          <span className="absolute top-3 left-3 badge-pending text-[10px]">Under Review</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3.5">
        {/* Media badges */}
        {post.media?.length > 0 && <MediaBadges media={post.media} />}

        <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-primary-600 transition-colors duration-300"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </h3>

        <p className="text-xs text-neutral-500 leading-relaxed flex-1"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.description}
        </p>

        {/* Meta row */}
        <div className="mt-auto space-y-2.5 pt-2.5 border-t border-neutral-50">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={11} className="text-primary-500 flex-shrink-0" />
              <span className="truncate max-w-[110px]">{post.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-neutral-400" />
              {formatDistanceToNow(new Date(post.incidentDate), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              {post.isAnonymous
                ? <><UserX size={11} className="text-amber-500" /><span className="font-medium text-amber-600">Anonymous</span></>
                : <><User size={11} /><span className="truncate max-w-[100px]">{post.author?.name || 'Unknown'}</span></>
              }
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {post.viewCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
