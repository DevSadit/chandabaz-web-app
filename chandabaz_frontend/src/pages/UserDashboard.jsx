import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, RefreshCw, MapPin, Trash2, Eye, User, Edit3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon: Icon, label, value, tone }) {
  const toneMap = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600' },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600' },
  };
  const colors = toneMap[tone] || toneMap.primary;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
        <Icon size={20} className={colors.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-neutral-900">{value ?? '—'}</p>
        <p className="text-xs text-neutral-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function MyPostRow({ post, onDeleteRequest }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow">
      <div className="w-full sm:w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
        {post.media?.find((m) => m.type === 'image') ? (
          <img
            src={post.media.find((m) => m.type === 'image').url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText size={20} className="text-neutral-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">{post.title}</h3>
          <span className={`badge flex-shrink-0 capitalize ${
            post.status === 'pending' ? 'badge-pending' :
            post.status === 'approved' ? 'badge-approved' : 'badge-rejected'
          }`}>
            {post.status}
          </span>
        </div>

        <p className="text-xs text-neutral-500 line-clamp-2 mb-2.5 leading-relaxed">{post.description}</p>

        <div className="flex flex-wrap gap-3 text-xs text-neutral-400 mb-3">
          <span className="flex items-center gap-1"><MapPin size={10} />{post.location}</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <FileText size={10} />
            {post.media?.length || 0} file(s)
          </span>
        </div>

        {post.status === 'rejected' && post.rejectionReason && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
            Admin feedback: {post.rejectionReason}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {post.status === 'approved' ? (
            <Link
              to={`/post/${post._id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Eye size={12} /> View
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 border border-neutral-200 rounded-lg">
              <Eye size={12} /> Not public yet
            </span>
          )}

          {post.status === 'rejected' && (
            <Link
              to={`/post/${post._id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Edit3 size={12} /> Edit & Resubmit
            </Link>
          )}

          <button
            onClick={() => onDeleteRequest(post)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user, updateName } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [deletebusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const fetchData = useCallback(async () => {
    try {
      const params = { limit: 20 };
      if (activeTab !== 'all') params.status = activeTab;
      const [statsRes, postsRes] = await Promise.all([
        api.get('/users/me/stats'),
        api.get('/posts/my', { params }),
      ]);
      setStats(statsRes.data.data);
      setPosts(postsRes.data.data);
    } catch (_) {
      toast.error('Failed to load your dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const refresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      const statsRes = await api.get('/users/me/stats');
      setStats(statsRes.data.data);
      toast.success('Post deleted');
    } catch (_) {
      toast.error('Failed to delete post');
    }
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setDeleteBusy(true);
    await handleDelete(deletingPost._id);
    setDeleteBusy(false);
    setDeletingPost(null);
  };

  const handleNameSave = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error('Name is required');
    if (trimmed.length > 100) return toast.error('Name is too long');
    setSavingName(true);
    try {
      await updateName(trimmed);
      toast.success('Name updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const tabs = useMemo(() => ([
    { key: 'all', label: 'All Posts', count: stats?.total },
    { key: 'pending', label: 'Pending', count: stats?.pending },
    { key: 'approved', label: 'Approved', count: stats?.approved },
    { key: 'rejected', label: 'Rejected', count: stats?.rejected },
  ]), [stats]);

  return (
    <div className="bg-neutral-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">User Dashboard</h1>
              <p className="text-sm text-neutral-500">Track your submissions and account</p>
            </div>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 bg-white rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Total Reports" value={stats?.total} tone="primary" />
          <StatCard icon={Clock} label="Pending" value={stats?.pending} tone="amber" />
          <StatCard icon={CheckCircle} label="Approved" value={stats?.approved} tone="green" />
          <StatCard icon={XCircle} label="Rejected" value={stats?.rejected} tone="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Edit3 size={15} className="text-primary-600" />
              <h2 className="text-sm font-semibold text-neutral-900">Profile</h2>
            </div>
            <form onSubmit={handleNameSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Email / Phone</label>
                <div className="px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-600">
                  {user?.email || user?.phone || 'Not provided'}
                </div>
              </div>
              <button type="submit" disabled={savingName} className="btn-primary w-full">
                {savingName ? <LoadingSpinner size="sm" /> : 'Update Name'}
              </button>
              <p className="text-[11px] text-neutral-400">
                For security reasons, email and phone can’t be changed here.
              </p>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-neutral-200 px-2">
              {tabs.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === key
                      ? 'text-primary-700'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {label}
                  {count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      activeTab === key
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  )}
                  {activeTab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex justify-center py-20">
                  <LoadingSpinner size="lg" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                    <FileText size={22} className="text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium text-neutral-500">No posts yet</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {activeTab === 'all' ? 'Start by submitting your first report.' : 'No posts match this status.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <MyPostRow
                      key={post._id}
                      post={post}
                      onDeleteRequest={setDeletingPost}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deletingPost}
        variant="delete"
        title="Delete this report?"
        description="Are you sure you want to permanently delete this report? This cannot be undone."
        postTitle={deletingPost?.title}
        busy={deletebusy}
        onConfirm={confirmDelete}
        onClose={() => !deletebusy && setDeletingPost(null)}
      />
    </div>
  );
}
