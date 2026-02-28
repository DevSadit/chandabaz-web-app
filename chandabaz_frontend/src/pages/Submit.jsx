import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, MapPin, Calendar, Tag, UserX, CheckCircle, AlertTriangle, FileText, Image, Film } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import DragDropUpload from '../components/DragDropUpload';
import LoadingSpinner from '../components/LoadingSpinner';

const STEPS = [
  { label: 'Details', desc: 'Incident information' },
  { label: 'Media', desc: 'Upload evidence' },
  { label: 'Review', desc: 'Confirm & submit' },
];

export default function Submit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingPost, setLoadingPost] = useState(false);
  const [existingMedia, setExistingMedia] = useState([]);
  const [adminFeedback, setAdminFeedback] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    incidentDate: '',
    tags: '',
    isAnonymous: false,
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    const loadPost = async () => {
      if (!isEditing) return;
      setLoadingPost(true);
      try {
        const { data } = await api.get(`/posts/${id}/owner`);
        const post = data.data;
        if (post.status !== 'rejected') {
          toast.error('Only rejected posts can be updated.');
          navigate('/dashboard');
          return;
        }
        setForm({
          title: post.title || '',
          description: post.description || '',
          location: post.location || '',
          incidentDate: post.incidentDate ? new Date(post.incidentDate).toISOString().split('T')[0] : '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
          isAnonymous: post.isAnonymous || false,
        });
        setExistingMedia(post.media || []);
        setAdminFeedback(post.rejectionReason || '');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load the rejected post');
        navigate('/dashboard');
      } finally {
        setLoadingPost(false);
      }
    };

    loadPost();
  }, [id, isEditing, navigate]);

  const validateStep = () => {
    if (step === 0) {
      if (!form.title.trim()) { toast.error('Title is required'); return false; }
      if (!form.description.trim()) { toast.error('Description is required'); return false; }
      if (!form.location.trim()) { toast.error('Location is required'); return false; }
      if (!form.incidentDate) { toast.error('Incident date is required'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('location', form.location.trim());
      formData.append('incidentDate', form.incidentDate);
      formData.append('isAnonymous', form.isAnonymous);
      if (form.tags.trim()) formData.append('tags', form.tags);
      files.forEach((file) => formData.append('media', file));

      const endpoint = isEditing ? `/posts/${id}` : '/posts';
      const method = isEditing ? api.put : api.post;

      await method(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      toast.success(isEditing ? 'Update submitted for review.' : 'Report submitted! It will be reviewed within 24 hours.');
      navigate(isEditing ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || (isEditing ? 'Update failed. Please try again.' : 'Submission failed. Please try again.'));
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  const steps = isEditing
    ? [
      { label: 'Details', desc: 'Update incident information' },
      { label: 'Media', desc: 'Update evidence' },
      { label: 'Review', desc: 'Confirm & resubmit' },
    ]
    : STEPS;

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-neutral-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Upload size={15} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900">{isEditing ? 'Update Report' : 'Submit Evidence'}</h1>
          </div>
          <p className="text-sm text-neutral-500 ml-11">
            {isEditing
              ? 'Update your rejected report and resubmit it for review.'
              : 'Your submission will be reviewed by our team before going live.'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {isEditing && adminFeedback && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-700">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-semibold">Admin feedback:</span> {adminFeedback}
            </span>
          </div>
        )}
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : i === step
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-neutral-200 text-neutral-400 bg-white'
                  }`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <div className="mt-1.5 text-center">
                  <p className={`text-xs font-semibold ${i <= step ? 'text-primary-700' : 'text-neutral-400'}`}>{s.label}</p>
                  <p className="text-[10px] text-neutral-400 hidden sm:block">{s.desc}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mb-5 transition-all ${i < step ? 'bg-primary-400' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Step header */}
          <div className="px-7 py-5 border-b border-neutral-100 bg-neutral-50/60">
            <h2 className="text-base font-semibold text-neutral-900">{steps[step].label}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{steps[step].desc}</p>
          </div>

          <div className="px-7 py-6">
            {/* Step 0: Details */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Police officer accepting bribe at checkpoint"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    className="input"
                    maxLength={200}
                  />
                  <p className="text-xs text-neutral-400 mt-1 text-right">{form.title.length}/200</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe what happened in detail. Include context, persons involved, and any relevant information..."
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    className="input resize-none"
                    maxLength={5000}
                  />
                  <p className="text-xs text-neutral-400 mt-1 text-right">{form.description.length}/5000</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-neutral-400" />Location <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Punjab"
                      value={form.location}
                      onChange={(e) => update('location', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      <span className="flex items-center gap-1.5"><Calendar size={13} className="text-neutral-400" />Incident Date <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="date"
                      value={form.incidentDate}
                      onChange={(e) => update('incidentDate', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Tag size={13} className="text-neutral-400" />Tags <span className="text-neutral-400 font-normal">(optional)</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. police, bribery, government (comma separated)"
                    value={form.tags}
                    onChange={(e) => update('tags', e.target.value)}
                    className="input"
                  />
                </div>

                {/* Anonymous toggle */}
                <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${form.isAnonymous ? 'bg-amber-50 border-amber-200' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${form.isAnonymous ? 'bg-amber-100' : 'bg-neutral-100'}`}>
                    <UserX size={18} className={form.isAnonymous ? 'text-amber-600' : 'text-neutral-400'} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${form.isAnonymous ? 'text-amber-800' : 'text-neutral-700'}`}>
                      Anonymous Submission
                    </p>
                    <p className={`text-xs mt-0.5 ${form.isAnonymous ? 'text-amber-600' : 'text-neutral-400'}`}>
                      Your name will be hidden from the public view.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={(e) => update('isAnonymous', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>
              </div>
            )}

            {/* Step 1: Media */}
            {step === 1 && (
              <div className="animate-fade-in space-y-4">
                {isEditing && existingMedia.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-700">Current attachments</p>
                      <span className="text-[11px] text-neutral-400">Upload new files to replace</span>
                    </div>
                    <div className="space-y-2">
                      {existingMedia.map((m, i) => {
                        const Icon = m.type === 'video' ? Film : m.type === 'pdf' ? FileText : Image;
                        return (
                          <div key={`${m.url}-${i}`} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-neutral-200 overflow-hidden">
                              {m.type === 'image' ? (
                                <img src={m.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Icon size={16} className="text-neutral-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-neutral-800 truncate">{m.filename || 'Attachment'}</p>
                              <p className="text-xs text-neutral-400 capitalize">{m.type}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <DragDropUpload files={files} onChange={setFiles} />
                {files.length === 0 && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Media is optional but strongly recommended. Strong evidence increases report credibility and approval speed.</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: Image, label: 'Images', color: 'bg-sky-50 border-sky-200 text-sky-700' },
                    { icon: Film, label: 'Videos', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                    { icon: FileText, label: 'PDFs', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${color}`}>
                      <Icon size={13} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-4">
                  <ReviewRow label="Title" value={form.title} />
                  <ReviewRow label="Description" value={form.description} multiline />
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewRow label="Location" value={form.location} />
                    <ReviewRow label="Incident Date" value={form.incidentDate} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewRow label="Media Files" value={`${files.length} file(s) attached`} />
                    <ReviewRow
                      label="Identity"
                      value={form.isAnonymous ? 'Anonymous' : 'Public'}
                      valueClass={form.isAnonymous ? 'text-amber-600' : 'text-neutral-800'}
                    />
                  </div>
                  {form.tags && <ReviewRow label="Tags" value={form.tags} />}
                </div>

                {submitting && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                      <span className="font-medium">Uploading evidence...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5 p-4 bg-primary-50 rounded-xl border border-primary-100 text-xs text-primary-700">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-primary-600" />
                  <span>
                    {isEditing
                      ? 'Your update will be reviewed again before it is made public.'
                      : 'Your report will be reviewed by our team before it is made public. This usually takes less than 24 hours.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between px-7 py-5 border-t border-neutral-100 bg-neutral-50/60">
            {step > 0 ? (
              <button onClick={() => setStep((s) => s - 1)} disabled={submitting} className="btn-secondary">
                Back
              </button>
            ) : <div />}

            {step < steps.length - 1 ? (
              <button onClick={handleNext} className="btn-primary">
                Continue <span className="text-xs opacity-70 ml-1">→ {steps[step + 1].label}</span>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? (
                  <><LoadingSpinner size="sm" />Submitting...</>
                ) : (
                  <><Upload size={15} />{isEditing ? 'Resubmit Report' : 'Submit Report'}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, multiline, valueClass }) {
  return (
    <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4">
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">{label}</p>
      <p className={`text-sm font-medium ${valueClass || 'text-neutral-800'} ${multiline ? 'line-clamp-3 leading-relaxed' : ''}`}>
        {value || <span className="text-neutral-300 font-normal italic">Not provided</span>}
      </p>
    </div>
  );
}
