import { useCallback, useState } from 'react';
import { Upload, X, Image, Video, FileText, AlertCircle } from 'lucide-react';

const MAX_FILES = 5;
const MAX_SIZE_MB = 50;
const ACCEPTED = {
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/avi': 'video',
  'application/pdf': 'pdf',
};

const typeIcons = { image: Image, video: Video, pdf: FileText };
const typeColors = {
  image: 'text-blue-500 bg-blue-50',
  video: 'text-purple-500 bg-purple-50',
  pdf: 'text-red-500 bg-red-50',
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function FilePreview({ file, onRemove, index }) {
  const type = ACCEPTED[file.type] || 'image';
  const Icon = typeIcons[type];
  const colorClass = typeColors[type];

  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        {type === 'image' && file.preview ? (
          <img src={file.preview} alt="" className="w-9 h-9 rounded-lg object-cover" />
        ) : (
          <Icon size={18} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-neutral-800 truncate">{file.name}</p>
        <p className="text-xs text-neutral-400">{formatSize(file.size)}</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default function DragDropUpload({ files, onChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const validateAndAdd = useCallback(
    (newFiles) => {
      setError('');
      const valid = [];
      for (const file of newFiles) {
        if (!ACCEPTED[file.type]) {
          setError(`"${file.name}" is not a supported format.`);
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
          continue;
        }
        if (files.length + valid.length >= MAX_FILES) {
          setError(`Maximum ${MAX_FILES} files allowed.`);
          break;
        }
        // Attach preview URL for images
        if (file.type.startsWith('image/')) {
          file.preview = URL.createObjectURL(file);
        }
        valid.push(file);
      }
      if (valid.length) onChange([...files, ...valid]);
    },
    [files, onChange]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndAdd(Array.from(e.dataTransfer.files));
  };

  const onInputChange = (e) => {
    validateAndAdd(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50 scale-[1.01]'
            : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30'
        } ${files.length >= MAX_FILES ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.pdf"
          onChange={onInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          disabled={files.length >= MAX_FILES}
        />
        <div className="flex flex-col items-center gap-4 p-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            dragActive ? 'bg-primary-600' : 'bg-primary-50 border border-primary-100'
          }`}>
            <Upload size={28} className={dragActive ? 'text-white' : 'text-primary-600'} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-800">
              {dragActive ? 'Release to drop files' : 'Drag & drop your evidence here'}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              or <span className="text-primary-600 font-semibold">click to browse</span> files
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              Max {MAX_SIZE_MB}MB per file · Up to {MAX_FILES} files
            </p>
          </div>
          {/* Accepted types */}
          <div className="flex gap-3">
            {[
              { Icon: Image,    label: 'Images',  cls: 'bg-sky-50    text-sky-700    border-sky-200' },
              { Icon: Video,    label: 'Videos',  cls: 'bg-purple-50 text-purple-700 border-purple-200' },
              { Icon: FileText, label: 'PDFs',    cls: 'bg-orange-50 text-orange-700 border-orange-200' },
            ].map(({ Icon, label, cls }) => (
              <span key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cls}`}>
                <Icon size={12} /> {label}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar when files selected */}
        {files.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${(files.length / MAX_FILES) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-700">{files.length} of {MAX_FILES} files</p>
            <div className="flex gap-1">
              {[...Array(MAX_FILES)].map((_, i) => (
                <div key={i} className={`w-6 h-1.5 rounded-full transition-colors ${i < files.length ? 'bg-primary-500' : 'bg-neutral-200'}`} />
              ))}
            </div>
          </div>
          {files.map((file, i) => (
            <FilePreview key={i} file={file} index={i} onRemove={removeFile} />
          ))}
        </div>
      )}
    </div>
  );
}
