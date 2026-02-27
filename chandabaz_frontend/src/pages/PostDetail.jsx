import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, UserX, Eye, Tag, ArrowLeft, Share2, Trash2, Clock, FileText, Image, Film } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MediaViewer from '../components/MediaViewer';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

function MetaItem({ icon: Icon, label, value, iconClass }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${iconClass || 'bg-neutral-100'}`}>
        <Icon size={13} className={iconClass ? 'text-current' : 'text-neutral-500'} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-400 font-medium mb-0.5">{label}</p>
        <p className="text-sm text-neutral-800 font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

const mediaTypeIcon = { image: Image, video: Film, pdf: FileText };
const mediaTypeBadge = {
  image: 'bg-sky-50 text-sky-700 border-sky-200',
  video: 'bg-purple-50 text-purple-700 border-purple-200',
  pdf: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data.data);
    } catch (err) {
      if (err.response?.status === 404) navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch (_) {
      toast.error('Failed to delete post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post.author && post.author._id === user._id;
  const canDelete = isAdmin || isOwner;

  return (
    <div className="bg-neutral-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back + Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-700 transition-colors font-medium"
          >
            <ArrowLeft size={15} />
            Back to Reports
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-white border border-neutral-200 rounded-xl transition-all"
            >
              <Share2 size={14} />
              Share
            </button>
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-all"
              >
                {deleting ? <LoadingSpinner size="sm" /> : <Trash2 size={14} />}
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Media */}
            {post.media?.length > 0 && (
              <div className="card p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
                <MediaViewer media={post.media} />
              </div>
            )}

            {/* Post Info Card */}
            <div className="card p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
              <h1 className="text-xl font-bold text-neutral-900 leading-snug mb-4">{post.title}</h1>

              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-neutral-100">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="card p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-base font-bold text-neutral-900 mb-1">Report Details</h3>
              <p className="text-xs text-neutral-400 mb-3">Submitted evidence information</p>

              <div>
                <MetaItem
                  icon={MapPin}
                  label="Location"
                  value={post.location}
                  iconClass="bg-primary-50 text-primary-600"
                />
                <MetaItem
                  icon={Calendar}
                  label="Incident Date"
                  value={format(new Date(post.incidentDate), 'MMMM d, yyyy')}
                  iconClass="bg-blue-50 text-blue-600"
                />
                <MetaItem
                  icon={post.isAnonymous ? UserX : User}
                  label="Submitted by"
                  value={post.isAnonymous ? 'Anonymous Citizen' : post.author?.name || 'Unknown'}
                  iconClass={post.isAnonymous ? 'bg-amber-50 text-amber-600' : 'bg-neutral-100 text-neutral-500'}
                />
                <MetaItem
                  icon={Clock}
                  label="Published"
                  value={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  iconClass="bg-neutral-100 text-neutral-500"
                />
                <MetaItem
                  icon={Eye}
                  label="Views"
                  value={`${post.viewCount} views`}
                  iconClass="bg-neutral-100 text-neutral-500"
                />
              </div>
            </div>

            {/* Evidence Files */}
            {post.media?.length > 0 && (
              <div className="card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-base font-bold text-neutral-900 mb-4">
                  Evidence Files
                  <span className="ml-1.5 text-xs font-normal text-neutral-400">({post.media.length})</span>
                </h3>
                <div className="space-y-2">
                  {post.media.map((m, i) => {
                    const Icon = mediaTypeIcon[m.type] || FileText;
                    const badgeClass = mediaTypeBadge[m.type] || 'bg-neutral-50 text-neutral-600 border-neutral-200';
                    return (
                      <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-medium ${badgeClass}`}>
                        <Icon size={12} />
                        <span className="capitalize">{m.type}</span>
                        {m.filename && (
                          <span className="text-current/60 truncate ml-auto font-normal">{m.filename}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Share CTA */}
            <button
              onClick={handleShare}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 text-neutral-600 text-sm font-medium rounded-xl transition-all"
            >
              <Share2 size={14} />
              Share this Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
