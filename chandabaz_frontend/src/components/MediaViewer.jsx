import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Image, Video, FileText, ZoomIn } from 'lucide-react';

function MediaThumb({ item, active, onClick }) {
  const icons = { video: Video, pdf: FileText, image: Image };
  const Icon = icons[item.type] || Image;

  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
        active ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent hover:border-neutral-300'
      }`}
    >
      {item.type === 'image' ? (
        <img src={item.url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
          <Icon size={20} className="text-neutral-400" />
        </div>
      )}
    </button>
  );
}

export default function MediaViewer({ media }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!media || media.length === 0) return null;

  const item = media[current];

  const prev = () => setCurrent((c) => (c - 1 + media.length) % media.length);
  const next = () => setCurrent((c) => (c + 1) % media.length);

  return (
    <div className="space-y-3">
      {/* Main viewer */}
      <div className="relative bg-neutral-900 rounded-xl overflow-hidden" style={{ minHeight: '320px' }}>
        {item.type === 'image' && (
          <>
            <img
              src={item.url}
              alt="Evidence"
              className="w-full max-h-[480px] object-contain cursor-zoom-in"
              onClick={() => setLightbox(true)}
            />
            <button
              onClick={() => setLightbox(true)}
              className="absolute bottom-3 right-3 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </>
        )}
        {item.type === 'video' && (
          <video
            src={item.url}
            controls
            className="w-full max-h-[480px]"
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        )}
        {item.type === 'pdf' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-white">
            <FileText size={48} className="text-neutral-400" />
            <p className="text-sm text-neutral-300">PDF Document</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Download size={15} />
              Open PDF
            </a>
          </div>
        )}

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {current + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <MediaThumb key={i} item={m} active={i === current} onClick={() => setCurrent(i)} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && item.type === 'image' && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <img
            src={item.url}
            alt="Full view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
