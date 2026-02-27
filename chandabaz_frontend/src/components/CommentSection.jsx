import { useState, useEffect } from 'react';
import { MessageSquare, UserX, Trash2, Send, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

function Avatar({ name, isAnonymous }) {
  if (isAnonymous) {
    return (
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <UserX size={14} className="text-amber-600" />
      </div>
    );
  }
  const initials = name ? name.charAt(0).toUpperCase() : '?';
  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${color}`}>
      {initials}
    </div>
  );
}

function CommentItem({ comment, onDelete, canDelete }) {
  return (
    <div className="flex gap-3 group py-4 border-b border-neutral-100 last:border-0">
      <Avatar
        name={comment.isAnonymous ? null : comment.author?.name}
        isAnonymous={comment.isAnonymous}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs font-semibold ${comment.isAnonymous ? 'text-amber-700' : 'text-neutral-800'}`}>
            {comment.isAnonymous ? 'Anonymous' : comment.author?.name || 'Unknown'}
          </span>
          {comment.isAnonymous && (
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
              Anonymous
            </span>
          )}
          <span className="text-xs text-neutral-400 ml-auto">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          {canDelete && (
            <button
              onClick={() => onDelete(comment._id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
              title="Delete comment"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user, isLoggedIn, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/${postId}`);
      setComments(data.data);
    } catch (_) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/comments/${postId}`, { content, isAnonymous });
      setComments((prev) => [...prev, data.data]);
      setContent('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (_) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
          <MessageSquare size={15} className="text-primary-600" />
        </div>
        <h2 className="text-base font-semibold text-neutral-900">
          Discussion
          <span className="ml-2 text-sm font-normal text-neutral-400">({comments.length})</span>
        </h2>
      </div>

      {/* Add Comment Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
          <div className="flex gap-3">
            <Avatar name={user?.name} isAnonymous={isAnonymous} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts or additional context..."
              rows={3}
              maxLength={1000}
              className="flex-1 text-sm bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between pl-11">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-9 h-5 rounded-full relative transition-all cursor-pointer ${isAnonymous ? 'bg-amber-500' : 'bg-neutral-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isAnonymous ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-xs text-neutral-600 group-hover:text-neutral-800 transition-colors">
                Post anonymously
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">{content.length}/1000</span>
              <button
                type="submit"
                disabled={!content.trim() || submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {submitting ? <LoadingSpinner size="sm" /> : <Send size={13} />}
                Post
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <LogIn size={16} className="text-primary-600" />
          </div>
          <p className="text-sm text-neutral-600 flex-1">
            Join the conversation —{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              sign in
            </Link>{' '}
            to post a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
            <MessageSquare size={20} className="text-neutral-300" />
          </div>
          <p className="text-sm text-neutral-500 font-medium">No comments yet</p>
          <p className="text-xs text-neutral-400 mt-1">Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              canDelete={isAdmin || comment.author?._id === user?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
