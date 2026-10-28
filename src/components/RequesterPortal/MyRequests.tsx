import React, { useState, useMemo } from 'react';
import { useServiceDesk } from '../../context/ServiceDeskContext';
import { Ticket, TicketStatus, TicketPriority } from '../../types';
import { 
  Search, 
  Clock, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Hourglass, 
  MessageSquare,
  Plus,
  RefreshCw,
  Star
} from 'lucide-react';

interface MyRequestsProps {
  onSelectTicket: (ticket: Ticket) => void;
  onOpenNewRequest: () => void;
}

export const MyRequests: React.FC<MyRequestsProps> = ({
  onSelectTicket,
  onOpenNewRequest,
}) => {
  const { tickets, currentUser, departments } = useServiceDesk();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'waiting' | 'resolved'>('all');
  const [viewScope, setViewScope] = useState<'mine' | 'all'>('mine');

  // Status mapping
  const statusLabels: Record<TicketStatus, { label: string; color: string; desc: string }> = {
    submitted: { label: 'รอดำเนินการ', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'คำร้องส่งเข้าระบบแล้ว รอเจ้าหน้าที่รับเรื่อง' },
    in_review: { label: 'กำลังตรวจสอบ', color: 'text-sky-700 bg-sky-50 border-sky-200', desc: 'เจ้าหน้าที่กำลังตรวจสอบข้อมูลและความพร้อม' },
    assigned: { label: 'มอบหมายงานแล้ว', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', desc: 'มอบหมายเจ้าหน้าที่ผู้รับผิดชอบแล้ว' },
    in_progress: { label: 'กำลังดำเนินการ', color: 'text-blue-700 bg-blue-50 border-blue-200', desc: 'เจ้าหน้าที่กำลังปฏิบัติงานตามคำร้อง' },
    waiting_user: { label: 'รอข้อมูลจากคุณ', color: 'text-orange-700 bg-orange-50 border-orange-200', desc: 'ต้องการข้อมูลเพิ่มเติมจากผู้ขอรับบริการ' },
    resolved: { label: 'ดำเนินการแล้วเสร็จ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'งานเสร็จแล้ว รอการยืนยันและประเมินผล' },
    closed: { label: 'ปิดคำร้องสมบูรณ์', color: 'text-slate-600 bg-slate-100 border-slate-200', desc: 'ปิดคำร้องเรียบร้อย' },
    rejected: { label: 'ปฏิเสธคำร้อง', color: 'text-rose-700 bg-rose-50 border-rose-200', desc: 'ไม่อนุมัติหรือข้อมูลไม่ตรงเกณฑ์' },
  };

  const priorityLabels: Record<TicketPriority, { label: string; textClass: string }> = {
    low: { label: 'ต่ำ', textClass: 'text-slate-500' },
    medium: { label: 'ปานกลาง', textClass: 'text-slate-700' },
    high: { label: 'สูง', textClass: 'text-amber-600 font-semibold' },
    critical: { label: 'วิกฤต', textClass: 'text-rose-600 font-semibold' },
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Scope filter
      const matchScope = viewScope === 'mine' ? t.requesterId === currentUser.id : true;

      // Status filter
      let matchStatus = true;
      if (statusFilter === 'open') {
        matchStatus = t.status === 'submitted' || t.status === 'in_review' || t.status === 'assigned' || t.status === 'in_progress';
      } else if (statusFilter === 'waiting') {
        matchStatus = t.status === 'waiting_user';
      } else if (statusFilter === 'resolved') {
        matchStatus = t.status === 'resolved' || t.status === 'closed';
      }

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        t.ticketCode.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.serviceName.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q);

      return matchScope && matchStatus && matchQuery;
    });
  }, [tickets, currentUser.id, viewScope, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ติดตามสถานะคำร้องขอรับบริการ (Request Tracking)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ตรวจสอบความคืบหน้าของงาน สื่อสารกับเจ้าหน้าที่ผู้รับผิดชอบ และประเมินความพึงพอใจ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewRequest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>สร้างคำร้องใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col xl:flex-row xl:flex-wrap xl:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        
        {/* Scope Selector */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg min-w-0">
          <button
            onClick={() => setViewScope('mine')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewScope === 'mine' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            คำร้องของฉัน ({tickets.filter((t) => t.requesterId === currentUser.id).length})
          </button>
          <button
            onClick={() => setViewScope('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewScope === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            คำร้องทั้งหมดในองค์กร ({tickets.length})
          </button>
        </div>

        {/* Status Quick Filters */}
        <div className="scroll-strip flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'all' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ทุกสถานะ
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'open' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            กำลังดำเนินการ
          </button>
          <button
            onClick={() => setStatusFilter('waiting')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'waiting' ? 'bg-orange-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            รอข้อมูลเพิ่มเติม
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'resolved' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            เสร็จสิ้น / ปิดงาน
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-0 xl:flex-1 xl:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหา Ticket Code หรือชื่อ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Ticket List Display */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <Hourglass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-900">ไม่พบคำร้องที่ตรงตามเงื่อนไข</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            คุณสามารถสร้างคำร้องขอรับบริการใหม่ หรือสลับดูคำร้องทั้งหมดในองค์กรได้
          </p>
          <button
            onClick={onOpenNewRequest}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>สร้างคำร้องใหม่</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const dept = departments.find((d) => d.id === ticket.departmentId);
            const statusInfo = statusLabels[ticket.status];
            const priorityInfo = priorityLabels[ticket.priority];
            const hasComments = ticket.comments.length > 0;
            const isWaitingUser = ticket.status === 'waiting_user';

            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={`bg-white border rounded-xl p-4 sm:p-5 transition-all hover:shadow-xs hover:border-slate-300 cursor-pointer ${
                  isWaitingUser ? 'border-orange-200 bg-orange-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
                  {/* Left Metadata: Code, Department, Service (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono-num font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                      {ticket.ticketCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{dept?.name.split(' (')[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ticket.serviceName}</span>
                    {ticket.reRoutedFrom && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-600 font-medium">
                          โอนย้ายจาก {departments.find((d) => d.id === ticket.reRoutedFrom)?.code}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors mb-1.5">
                  {ticket.title}
                </h3>

                {/* Description snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {ticket.description}
                </p>

                {/* Footer bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <span>ความสำคัญ: </span>
                      <span className={priorityInfo.textClass}>{priorityInfo.label}</span>
                    </div>

                    <span aria-hidden="true" className="text-slate-300">·</span>

                    <div className="flex items-center gap-1 font-mono-num">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>ยื่นเรื่องเมื่อ: {new Date(ticket.createdAt).toLocaleDateString('th-TH')}</span>
                    </div>

                    {ticket.assignedOfficerName && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div>
                          <span>ผู้รับผิดชอบ: </span>
                          <span className="text-slate-700 font-medium">{ticket.assignedOfficerName}</span>
                        </div>
                      </>
                    )}

                    {hasComments && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div className="flex items-center gap-1 text-slate-600">
                          <MessageSquare className="w-3 h-3" />
                          <span>{ticket.comments.length} ข้อความ</span>
                        </div>
                      </>
                    )}

                    {ticket.csatRating && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div className="flex items-center gap-1 text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>ประเมิน {ticket.csatRating}/5</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-blue-600 font-medium group text-[11px]">
                    <span>ดูรายละเอียด</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
