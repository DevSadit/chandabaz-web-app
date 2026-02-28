import { Fragment, useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, XCircle, Trash2, Eye, Users, FileText,
  Clock, RefreshCw, MapPin, User, UserX, ShieldCheck,
  TrendingUp, AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { Dialog, Transition } from '@headlessui/react';

function StatCard({ icon: Icon, label, value, bg, iconColor, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-neutral-900">{value ?? '—'}</p>
        <p className="text-xs text-neutral-500 font-medium mt-0.5">{label}</p>
        {trend && (
          <p className="text-xs text-primary-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={10} />
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

function PostRow({ post, onApproveRequest, onReject, onDeleteRequest }) {
  const [loading, setLoading] = useState('');

  const act = async (key, fn) => {
    setLoading(key);
    await fn();
    setLoading('');
  };

  const statusStripe = {
    pending: 'border-l-amber-400',
    approved: 'border-l-primary-500',
    rejected: 'border-l-red-400',
  };

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 border-l-4 ${statusStripe[post.status] || ''} p-4 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow`}>
      {/* Thumbnail */}
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

      {/* Info */}
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
            {post.isAnonymous ? <UserX size={10} /> : <User size={10} />}
            {post.isAnonymous ? 'Anonymous' : post.author?.name || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <FileText size={10} />
            {post.media?.length || 0} file(s)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/post/${post._id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Eye size={12} /> View
          </Link>

          {post.status !== 'approved' && (
            <button
              onClick={() => onApproveRequest(post)}
              disabled={loading === 'approve'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
            >
              {loading === 'approve' ? <LoadingSpinner size="sm" /> : <CheckCircle size={12} />}
              Approve
            </button>
          )}

          {post.status !== 'rejected' && (
            <button
              onClick={() => onReject(post)}
              disabled={loading === 'reject'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
            >
              <XCircle size={12} />
              Reject
            </button>
          )}

          <button
            onClick={() => onDeleteRequest(post)}
            disabled={loading === 'delete'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {loading === 'delete' ? <LoadingSpinner size="sm" /> : <Trash2 size={12} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectingPost, setRejectingPost] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [rejectBusy, setRejectBusy] = useState(false);
  const [approvingPost, setApprovingPost] = useState(null);
  const [approveBusy, setApproveBusy] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/posts?status=${activeTab}`),
      ]);
      setStats(statsRes.data.data);
      setPosts(postsRes.data.data);
    } catch (_) {
      toast.error('Failed to load admin data');
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

  const handleApprove = async (postId) => {
    try {
      await api.put(`/admin/posts/${postId}/approve`);
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, status: 'approved' } : p));
      toast.success('Post approved');
    } catch (_) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (postId, reason) => {
    try {
      await api.put(`/admin/posts/${postId}/reject`, { reason });
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, status: 'rejected', rejectionReason: reason } : p));
      toast.success('Post rejected');
      return true;
    } catch (_) {
      toast.error('Failed to reject. Feedback is required.');
      return false;
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted');
    } catch (_) {
      toast.error('Failed to delete');
    }
  };

  const confirmApprove = async () => {
    if (!approvingPost) return;
    setApproveBusy(true);
    await handleApprove(approvingPost._id);
    setApproveBusy(false);
    setApprovingPost(null);
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setDeleteBusy(true);
    await handleDelete(deletingPost._id);
    setDeleteBusy(false);
    setDeletingPost(null);
  };

  const tabs = [
    { key: 'pending', label: 'Pending Review', count: stats?.pendingPosts, dot: 'bg-amber-400' },
    { key: 'approved', label: 'Approved', count: stats?.approvedPosts, dot: 'bg-primary-500' },
    { key: 'rejected', label: 'Rejected', count: stats?.rejectedPosts, dot: 'bg-red-400' },
  ];

  const openRejectModal = (post) => {
    setRejectingPost(post);
    setRejectReason('');
    setRejectError('');
  };

  const closeRejectModal = () => {
    if (rejectBusy) return;
    setRejectingPost(null);
    setRejectReason('');
    setRejectError('');
  };

  const submitReject = async () => {
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError('Please provide feedback before rejecting.');
      return;
    }
    setRejectBusy(true);
    const ok = await handleReject(rejectingPost._id, trimmed);
    setRejectBusy(false);
    if (ok) closeRejectModal();
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Admin Dashboard</h1>
              <p className="text-sm text-neutral-500">Review and moderate submitted reports</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={FileText}
            label="Total Reports"
            value={stats?.totalPosts}
            bg="bg-primary-50"
            iconColor="text-primary-600"
          />
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={stats?.pendingPosts}
            bg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={stats?.approvedPosts}
            bg="bg-primary-50"
            iconColor="text-primary-600"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers}
            bg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>

        {/* Posts Panel */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-neutral-200 px-2">
            {tabs.map(({ key, label, count, dot }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'text-primary-700'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
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

          {/* Post List */}
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={22} className="text-neutral-300" />
                </div>
                <p className="text-sm font-medium text-neutral-500">No {activeTab} posts</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeTab === 'pending' ? 'All caught up! No posts waiting for review.' : `No posts have been ${activeTab} yet.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostRow
                    key={post._id}
                    post={post}
                    onApproveRequest={setApprovingPost}
                    onReject={openRejectModal}
                    onDeleteRequest={setDeletingPost}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!approvingPost}
        variant="approve"
        title="Approve this report?"
        description="This will make the report publicly visible on the platform. Review it carefully before approving."
        postTitle={approvingPost?.title}
        busy={approveBusy}
        onConfirm={confirmApprove}
        onClose={() => !approveBusy && setApprovingPost(null)}
      />

      <ConfirmDialog
        open={!!deletingPost}
        variant="delete"
        title="Permanently delete this post?"
        description="This will remove the report and all its media from the platform. The author will not be notified."
        postTitle={deletingPost?.title}
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onClose={() => !deleteBusy && setDeletingPost(null)}
      />

      <Transition appear show={!!rejectingPost} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeRejectModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-base font-semibold text-neutral-900">
                    Provide rejection feedback
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-neutral-500 mt-1">
                    This feedback will be visible to the user and helps them resubmit successfully.
                  </Dialog.Description>
                  {rejectingPost?.title && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Post: <span className="font-medium text-neutral-800">{rejectingPost.title}</span>
                    </p>
                  )}

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                      Feedback
                    </label>
                    <textarea
                      rows={4}
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value);
                        if (rejectError) setRejectError('');
                      }}
                      placeholder="Explain what needs to be fixed or clarified..."
                      className="input resize-none"
                      maxLength={600}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-neutral-400">{rejectReason.length}/600</p>
                      {rejectError && <p className="text-[11px] text-red-600">{rejectError}</p>}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeRejectModal}
                      disabled={rejectBusy}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitReject}
                      disabled={rejectBusy}
                      className="btn-primary"
                    >
                      {rejectBusy ? <LoadingSpinner size="sm" /> : 'Reject with feedback'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
