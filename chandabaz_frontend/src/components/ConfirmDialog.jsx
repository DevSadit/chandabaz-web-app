import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

/**
 * ConfirmDialog — a visually modern replacement for window.confirm().
 *
 * Props:
 *  open         — boolean
 *  variant      — 'delete' | 'approve'
 *  title        — string
 *  description  — string
 *  postTitle    — string (optional, shown as context)
 *  busy         — boolean (shows spinner on confirm button)
 *  onConfirm    — () => void
 *  onClose      — () => void
 */
export default function ConfirmDialog({
  open,
  variant = 'delete',
  title,
  description,
  postTitle,
  busy = false,
  onConfirm,
  onClose,
}) {
  const isDelete = variant === 'delete';

  const config = isDelete
    ? {
        iconBg: 'bg-red-100',
        icon: <Trash2 size={22} className="text-red-600" />,
        confirmClass:
          'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors disabled:opacity-50 min-w-[120px]',
        confirmLabel: 'Delete',
        borderAccent: 'border-red-100',
        tag: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
      }
    : {
        iconBg: 'bg-emerald-100',
        icon: <CheckCircle size={22} className="text-emerald-600" />,
        confirmClass:
          'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-colors disabled:opacity-50 min-w-[120px]',
        confirmLabel: 'Approve',
        borderAccent: 'border-emerald-100',
        tag: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
      };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !busy && onClose()}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-2"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200/60 transition-all">

                {/* Top accent line */}
                <div className={`h-1 w-full ${isDelete ? 'bg-red-500' : 'bg-emerald-500'}`} />

                <div className="p-6">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <Dialog.Title className="text-base font-bold text-neutral-900 leading-snug">
                        {title}
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-neutral-500 mt-1 leading-relaxed">
                        {description}
                      </Dialog.Description>
                    </div>
                  </div>

                  {/* Post context card */}
                  {postTitle && (
                    <div className={`rounded-xl border ${config.borderAccent} bg-neutral-50 px-4 py-3 mb-5 flex items-center gap-3`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${config.tag.dot}`} />
                      <p className="text-sm text-neutral-700 font-medium line-clamp-2 leading-snug">
                        {postTitle}
                      </p>
                    </div>
                  )}

                  {/* Warning notice for delete */}
                  {isDelete && (
                    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
                      <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        This action is <span className="font-semibold">permanent</span> and cannot be undone. All associated media will also be removed.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={busy}
                      className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={busy}
                      className={config.confirmClass}
                    >
                      {busy ? <LoadingSpinner size="sm" /> : config.icon}
                      {busy ? 'Processing…' : config.confirmLabel}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
