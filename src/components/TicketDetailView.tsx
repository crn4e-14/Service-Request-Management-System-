import React, { useState } from 'react';
import { useServiceDesk } from '../context/ServiceDeskContext';
import { 
  Ticket, 
  TicketStatus, 
  TicketPriority, 
  DepartmentId 
} from '../types';
import { 
  X, 
  Clock, 
  User, 
  Building2, 
  Send, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  Star, 
  ArrowRight, 
  History, 
  UserCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

interface TicketDetailViewProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  onClose,
}) => {
  const { 
    currentUser, 
    currentRole, 
    departments, 
    updateTicketStatus, 
    assignTicket, 
    rerouteTicket, 
    addComment, 
    submitCSAT 
  } = useServiceDesk();

  const [activeTab, setActiveTab] = useState<'discussion' | 'history' | 'fields'>('discussion');
  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Re-route modal state
  const [showRerouteModal, setShowRerouteModal] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState<DepartmentId>(
    departments.find((d) => d.id !== ticket.departmentId)?.id || 'dept-it'
  );
  const [rerouteReason, setRerouteReason] = useState('');

  // Status change note state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TicketStatus>(ticket.status);
  const [statusNote, setStatusNote] = useState('');

  // CSAT state
  const [rating, setRating] = useState<number>(ticket.csatRating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [csatFeedback, setCsatFeedback] = useState(ticket.csatFeedback || '');
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  const dept = departments.find((d) => d.id === ticket.departmentId);
  const isOfficerOrExecutive = currentRole === 'officer' || currentRole === 'executive';
  const isMyTicket = ticket.requesterId === currentUser.id;

  const statusMap: Record<TicketStatus, { label: string; color: string; desc: string }> = {
    submitted: { label: 'รอดำเนินการ (Submitted)', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'รอดำเนินการรับเรื่องจากเจ้าหน้าที่' },
    in_review: { label: 'กำลังตรวจสอบ (In Review)', color: 'text-sky-700 bg-sky-50 border-sky-200', desc: 'เจ้าหน้าที่กำลังตรวจสอบเอกสารและข้อเท็จจริง' },
    assigned: { label: 'มอบหมายแล้ว (Assigned)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', desc: 'มอบหมายผู้รับผิดชอบงานเรียบร้อย' },
    in_progress: { label: 'กำลังดำเนินการ (In Progress)', color: 'text-blue-700 bg-blue-50 border-blue-200', desc: 'กำลังปฏิบัติงานแก้ไขหรือจัดทำ' },
    waiting_user: { label: 'รอข้อมูลจากผู้ขอรับบริการ (Waiting User)', color: 'text-orange-700 bg-orange-50 border-orange-200', desc: 'ต้องการข้อมูลยืนยันหรือเอกสารเพิ่มเติมจากผู้ใช้' },
    resolved: { label: 'ดำเนินการแล้วเสร็จ (Resolved)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'การดำเนินการเสร็จสิ้น รอยืนยันปิดงาน' },
    closed: { label: 'ปิดคำร้องสมบูรณ์ (Closed)', color: 'text-slate-600 bg-slate-100 border-slate-200', desc: 'ปิดคำร้องเสร็จสมบูรณ์' },
    rejected: { label: 'ปฏิเสธคำร้อง (Rejected)', color: 'text-rose-700 bg-rose-50 border-rose-200', desc: 'ปฏิเสธคำร้องเนื่องจากผิดเงื่อนไข' },
  };

  const priorityLabels: Record<TicketPriority, { label: string; color: string; hours: string }> = {
    low: { label: 'ต่ำ (Low)', color: 'text-slate-600 bg-slate-100', hours: '72 ชม.' },
    medium: { label: 'ปานกลาง (Medium)', color: 'text-blue-700 bg-blue-50', hours: '24 ชม.' },
    high: { label: 'สูง (High)', color: 'text-amber-700 bg-amber-50', hours: '8 ชม.' },
    critical: { label: 'วิกฤต (Critical)', color: 'text-rose-700 bg-rose-50', hours: '2 ชม.' },
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(ticket.id, commentText.trim(), isOfficerOrExecutive ? isInternalNote : false);
    setCommentText('');
  };

  const handleExecuteReroute = () => {
    if (!rerouteReason.trim()) return;
    rerouteTicket(ticket.id, targetDeptId, rerouteReason.trim());
    setShowRerouteModal(false);
    setRerouteReason('');
  };

  const handleExecuteStatusChange = () => {
    updateTicketStatus(ticket.id, targetStatus, statusNote.trim() || undefined);
    setShowStatusModal(false);
    setStatusNote('');
  };

  const handleAssignToMe = () => {
    assignTicket(ticket.id, currentUser.id, currentUser.name);
  };

  const handleCSATSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCSAT(ticket.id, rating, csatFeedback.trim());
    setCsatSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-detail-title"
        className="dialog-panel bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="dialog-header shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono-num font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {ticket.ticketCode}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-800">{dept?.name}</span>
              <span aria-hidden="true">·</span>
              <span>{ticket.serviceName}</span>
            </div>

            <h2 id="ticket-detail-title" className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {ticket.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="ปิดรายละเอียดคำร้อง"
            className="min-w-11 sm:min-w-0 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Re-route banner if ticket was transferred */}
        {ticket.reRoutedFrom && (
          <div className="bg-amber-50 border-b border-amber-200 shrink-0 max-h-[20dvh] overflow-y-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-amber-800">
            <Share2 className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-semibold">ประวัติการโอนย้ายแผนก (Re-routed): </span>
              <span>
                คำร้องนี้ได้รับการโอนย้ายจาก {departments.find(d => d.id === ticket.reRoutedFrom)?.name} มายังแผนกปัจจุบัน 
                {ticket.reRouteReason && ` เนื่องจาก: "${ticket.reRouteReason}"`}
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="dialog-body flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Status & Officer Action Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Status and Priority Details */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">สถานะปัจจุบัน:</span>
                <span className={`inline-block font-medium px-2 py-0.5 rounded border mt-0.5 ${statusMap[ticket.status].color}`}>
                  {statusMap[ticket.status].label}
                </span>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-slate-400 block text-[11px]">ความสำคัญ / SLA:</span>
                <span className={`inline-block font-semibold px-2 py-0.5 rounded mt-0.5 ${priorityLabels[ticket.priority].color}`}>
                  {priorityLabels[ticket.priority].label} ({priorityLabels[ticket.priority].hours})
                </span>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-slate-400 block text-[11px]">เจ้าหน้าที่รับผิดชอบ:</span>
                <span className="font-medium text-slate-800 block mt-0.5">
                  {ticket.assignedOfficerName || 'ยังไม่มอบหมาย'}
                </span>
              </div>
            </div>

            {/* Right: Officer ITSM Action Triggers */}
            {isOfficerOrExecutive && (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {!ticket.assignedOfficerId && (
                  <button
                    onClick={handleAssignToMe}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>รับเคสนี้ (Claim)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setTargetStatus(ticket.status);
                    setShowStatusModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>เปลี่ยนสถานะงาน</span>
                </button>

                <button
                  onClick={() => setShowRerouteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                  title="โอนย้ายคำร้องไปยังแผนกที่ถูกต้องหากผู้ใช้ส่งผิดแผนก"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>โอนย้ายแผนก (Re-route)</span>
                </button>
              </div>
            )}
          </div>

          {/* Description & Submitted Form Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Description & Custom Field Values */}
            <div className="min-w-0 md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  รายละเอียดของคำร้อง (Request Description)
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>

              {/* Dynamic Service Fields */}
              {Object.keys(ticket.customFieldValues).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    ข้อมูลเฉพาะตามแบบฟอร์มของบริการ (Custom Form Data)
                  </h3>
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                    {Object.entries(ticket.customFieldValues).map(([key, value]) => (
                      <div key={key} className="p-3 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                        <span className="font-medium text-slate-500 sm:w-1/3">{key}</span>
                        <span className="text-slate-900 font-medium sm:w-2/3">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Requester & Metadata Card */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                  ข้อมูลผู้ขอรับบริการ (Requester)
                </h3>
                
                <div>
                  <div className="text-slate-400 text-[11px]">ชื่อผู้ร้องขอ:</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{ticket.requesterName}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px]">สังกัดแผนก:</div>
                  <div className="font-medium text-slate-700 mt-0.5">{ticket.requesterDepartment}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px]">อีเมลติดต่อ:</div>
                  <div className="font-mono-num text-slate-600 mt-0.5">{ticket.requesterEmail}</div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-slate-400 text-[11px]">วันเวลาที่ส่งเรื่อง:</div>
                  <div className="font-mono-num text-slate-600 mt-0.5">
                    {new Date(ticket.createdAt).toLocaleString('th-TH')}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px]">เป้าหมายกำหนดส่ง (Due Date):</div>
                  <div className="font-mono-num text-slate-600 mt-0.5">
                    {new Date(ticket.dueDate).toLocaleString('th-TH')}
                  </div>
                </div>
              </div>

              {/* CSAT Rating Widget (if resolved or closed) */}
              {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>การประเมินความพึงพอใจ (CSAT)</span>
                  </div>

                  {ticket.csatRating ? (
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${s <= (ticket.csatRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                          />
                        ))}
                        <span className="font-bold text-slate-800 ml-1.5 font-mono-num">{ticket.csatRating}/5</span>
                      </div>
                      {ticket.csatFeedback && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">
                          "{ticket.csatFeedback}"
                        </p>
                      )}
                    </div>
                  ) : isMyTicket ? (
                    <form onSubmit={handleCSATSubmit} className="space-y-2.5">
                      <p className="text-[11px] text-emerald-800">
                        งานนี้ดำเนินการเสร็จแล้ว โปรดให้คะแนนบริการของเจ้าหน้าที่
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 cursor-pointer"
                          >
                            <Star 
                              className={`w-5 h-5 ${
                                (hoverRating !== null ? star <= hoverRating : star <= rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="ข้อคิดเห็นเพิ่มเติม (ถ้ามี)..."
                        value={csatFeedback}
                        onChange={(e) => setCsatFeedback(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-200 rounded-lg text-slate-900 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                      >
                        ส่งคะแนนความพึงพอใจ
                      </button>
                    </form>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">
                      รอผู้ขอรับบริการทำการประเมินความพึงพอใจ
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Discussion & Activity Trail Tabs */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 border-b border-slate-200 pb-2 mb-4">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'discussion'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                การสื่อสารและข้อความตอบกลับ ({ticket.comments.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ประวัติกิจกรรม / Audit Trail ({ticket.activities.length})
              </button>
            </div>

            {/* Tab 1: Discussion Thread */}
            {activeTab === 'discussion' && (
              <div className="space-y-4">
                {ticket.comments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    ยังไม่มีข้อความตอบกลับในคำร้องนี้ สามารถส่งข้อความด้านล่างได้ทันที
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ticket.comments.map((comment) => {
                      // Internal note check: non-officers cannot see internal notes
                      if (comment.isInternalNote && !isOfficerOrExecutive) return null;

                      return (
                        <div
                          key={comment.id}
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                            comment.isInternalNote
                              ? 'bg-amber-50/70 border-amber-200'
                              : comment.userId === currentUser.id
                              ? 'bg-blue-50/60 border-blue-200 ml-4'
                              : 'bg-white border-slate-200 mr-4'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-slate-900">{comment.userName}</span>
                              {comment.isInternalNote && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Internal Note (เฉพาะเจ้าหน้าที่)</span>
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400">({comment.userRole})</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono-num">
                              {new Date(comment.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-800">{comment.message}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Send message form */}
                <form onSubmit={handleSendMessage} className="pt-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2">
                    {isOfficerOrExecutive && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-xs pb-1 border-b border-slate-100">
                        <span className="text-[11px] text-slate-500">รูปแบบข้อความ:</span>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                            <input
                              type="radio"
                              name="noteType"
                              checked={!isInternalNote}
                              onChange={() => setIsInternalNote(false)}
                              className="text-blue-600"
                            />
                            <span>ตอบกลับผู้ขอรับบริการ (Public)</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-amber-800 font-medium">
                            <input
                              type="radio"
                              name="noteType"
                              checked={isInternalNote}
                              onChange={() => setIsInternalNote(true)}
                              className="text-amber-600"
                            />
                            <span>Internal Note (พนักงานไม่เห็น)</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder={
                          isInternalNote
                            ? 'พิมพ์บันทึกภายในสำหรับการปรึกษาในทีมเจ้าหน้าที่...'
                            : 'พิมพ์ข้อความแจ้งความคืบหน้า หรือสอบถามข้อมูลเพิ่มเติม...'
                        }
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full min-w-0 sm:flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ส่งข้อความ</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Activity Trail */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {ticket.activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{act.action}</span>
                        <span className="text-[11px] text-slate-400 font-mono-num">
                          {new Date(act.timestamp).toLocaleString('th-TH')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ดำเนินการโดย: <span className="font-medium text-slate-700">{act.performedBy}</span>
                      </div>
                      {act.detail && (
                        <div className="text-[11px] text-slate-600 mt-0.5 bg-slate-50 p-1.5 rounded border border-slate-100">
                          {act.detail}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Transition Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40">
            <div className="dialog-panel overflow-y-auto overscroll-contain bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                เปลี่ยนสถานะคำร้อง (ITSM Workflow Update)
              </h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เลือกสถานะใหม่
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as TicketStatus)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="submitted">รอดำเนินการ (Submitted)</option>
                  <option value="in_review">กำลังตรวจสอบ (In Review)</option>
                  <option value="assigned">มอบหมายแล้ว (Assigned)</option>
                  <option value="in_progress">กำลังดำเนินการ (In Progress)</option>
                  <option value="waiting_user">รอข้อมูลจากผู้ใช้ (Waiting User)</option>
                  <option value="resolved">ดำเนินการแล้วเสร็จ (Resolved)</option>
                  <option value="closed">ปิดคำร้องสมบูรณ์ (Closed)</option>
                  <option value="rejected">ปฏิเสธคำร้อง (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  หมายเหตุหรือข้อความชี้แจง (จะส่งแจ้งผู้ขอรับบริการ)
                </label>
                <textarea
                  rows={3}
                  placeholder="เช่น ตรวจสอบสายแลนเรียบร้อยแล้ว, จัดส่งไฟล์กราฟิกแล้ว, ต้องการเอกสารแนบเพิ่มเติม..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleExecuteStatusChange}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  บันทึกสถานะ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Re-route Department Modal (Crucial solution for 'ส่งผิดแผนก') */}
        {showRerouteModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40">
            <div className="dialog-panel overflow-y-auto overscroll-contain bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-amber-600" />
                  <span>โอนย้ายคำร้องข้ามแผนก (Cross-Department Re-route)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  ใช้กรณีผู้ใช้งานส่งผิดแผนก หรือคำร้องต้องอาศัยแผนกอื่นดำเนินการแทน
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เลือกแผนกปลายทางที่ถูกต้อง
                </label>
                <select
                  value={targetDeptId}
                  onChange={(e) => setTargetDeptId(e.target.value as DepartmentId)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  {departments
                    .filter((d) => d.id !== ticket.departmentId)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  เหตุผลในการโอนย้ายคำร้อง <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="ระบุเหตุผล เช่น ไม่ใช่ปัญหาไอที แต่เป็นการขอสื่อกราฟิกของฝ่ายการตลาด..."
                  value={rerouteReason}
                  onChange={(e) => setRerouteReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRerouteModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleExecuteReroute}
                  disabled={!rerouteReason.trim()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg cursor-pointer"
                >
                  ยืนยันการโอนย้ายคำร้อง
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
