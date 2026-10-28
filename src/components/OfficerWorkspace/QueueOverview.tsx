import React, { useState, useMemo } from 'react';
import { useServiceDesk } from '../../context/ServiceDeskContext';
import { Ticket, DepartmentId, TicketStatus, TicketPriority } from '../../types';
import { 
  Inbox, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Share2, 
  CheckCircle2, 
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Server,
  Megaphone,
  Building2,
  Users
} from 'lucide-react';

interface QueueOverviewProps {
  onSelectTicket: (ticket: Ticket) => void;
}

export const QueueOverview: React.FC<QueueOverviewProps> = ({ onSelectTicket }) => {
  const { tickets, departments, currentUser, currentRole, assignTicket, updateTicketStatus } = useServiceDesk();

  // Detect current officer's department or default to IT
  const initialDept = currentUser.department.includes('การตลาด')
    ? 'dept-mkt'
    : currentUser.department.includes('IT')
    ? 'dept-it'
    : 'all';

  const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>(initialDept);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority | 'all'>('all');
  const [assignedFilter, setAssignedFilter] = useState<'all' | 'mine' | 'unassigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusLabels: Record<TicketStatus, { label: string; color: string }> = {
    submitted: { label: 'รอดำเนินการ', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    in_review: { label: 'กำลังตรวจสอบ', color: 'text-sky-700 bg-sky-50 border-sky-200' },
    assigned: { label: 'มอบหมายแล้ว', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    in_progress: { label: 'กำลังดำเนินการ', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    waiting_user: { label: 'รอข้อมูลผู้ใช้', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    resolved: { label: 'ดำเนินการแล้วเสร็จ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    closed: { label: 'ปิดคำร้อง', color: 'text-slate-600 bg-slate-100 border-slate-200' },
    rejected: { label: 'ปฏิเสธ', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  };

  const priorityBadge: Record<TicketPriority, { label: string; color: string }> = {
    low: { label: 'ต่ำ (Low)', color: 'text-slate-600 bg-slate-100' },
    medium: { label: 'ปานกลาง (Medium)', color: 'text-blue-700 bg-blue-50' },
    high: { label: 'สูง (High)', color: 'text-amber-700 bg-amber-50' },
    critical: { label: 'วิกฤต (Critical)', color: 'text-rose-700 bg-rose-50' },
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchDept = selectedDept === 'all' || t.departmentId === selectedDept;
      const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchPriority = selectedPriority === 'all' || t.priority === selectedPriority;

      let matchAssigned = true;
      if (assignedFilter === 'mine') {
        matchAssigned = t.assignedOfficerId === currentUser.id;
      } else if (assignedFilter === 'unassigned') {
        matchAssigned = !t.assignedOfficerId;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        t.ticketCode.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q) ||
        t.serviceName.toLowerCase().includes(q);

      return matchDept && matchStatus && matchPriority && matchAssigned && matchQuery;
    });
  }, [tickets, selectedDept, selectedStatus, selectedPriority, assignedFilter, searchQuery, currentUser.id]);

  // Queue KPI summaries
  const unassignedCount = tickets.filter(
    (t) => (selectedDept === 'all' || t.departmentId === selectedDept) && !t.assignedOfficerId && t.status !== 'closed'
  ).length;

  const criticalCount = tickets.filter(
    (t) => (selectedDept === 'all' || t.departmentId === selectedDept) && t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved'
  ).length;

  const myAssignedCount = tickets.filter(
    (t) => t.assignedOfficerId === currentUser.id && t.status !== 'closed' && t.status !== 'resolved'
  ).length;

  return (
    <div className="space-y-6">
      {/* Officer Header with Quick KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>ITSM Service Desk Workspace</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">{currentUser.name}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ศูนย์บริหารจัดการคิวคำร้องและบริการ (Department Queues)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            รับทราบปัญหา จัดลำดับความสำคัญ อัปเดตสถานะตามขั้นตอน ITSM และโอนย้ายคำร้องกรณีส่งผิดแผนก
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setAssignedFilter('unassigned')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="text-[11px] text-slate-500 font-medium">รอการมอบหมาย (Unassigned)</div>
          <div className="text-xl font-bold text-slate-900 font-mono-num mt-1">
            {unassignedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">คลิกเพื่อกรองงานที่ยังไม่มีผู้รับผิดชอบ</div>
        </div>

        <div 
          onClick={() => {
            setSelectedPriority('critical');
            setSelectedStatus('all');
          }}
          className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/20 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>เคสด่วนวิกฤต (Critical SLA)</span>
          </div>
          <div className="text-xl font-bold text-rose-700 font-mono-num mt-1">
            {criticalCount}
          </div>
          <div className="text-[10px] text-rose-600/70 mt-0.5">SLA 2 ชม. ต้องเร่งดำเนินการ</div>
        </div>

        <div 
          onClick={() => setAssignedFilter('mine')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="text-[11px] text-slate-500 font-medium">งานในความรับผิดชอบของฉัน</div>
          <div className="text-xl font-bold text-indigo-700 font-mono-num mt-1">
            {myAssignedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">คิวงานของ {currentUser.name}</div>
        </div>

        <div 
          onClick={() => {
            setSelectedDept('all');
            setSelectedStatus('all');
            setSelectedPriority('all');
            setAssignedFilter('all');
          }}
          className="bg-white p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="text-[11px] text-slate-500 font-medium">คำร้องทั้งหมดในระบบ</div>
          <div className="text-xl font-bold text-slate-900 font-mono-num mt-1">
            {tickets.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">คลิกเพื่อรีเซ็ตตัวกรองทั้งหมด</div>
        </div>
      </div>

      {/* Queue Filter Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3.5">
        
        {/* Row 1: Department Queue Selector */}
        <div className="scroll-strip flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 shrink-0">คิวแผนก:</span>
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            ทุกแผนก ({tickets.length})
          </button>

          {departments.map((dept) => {
            const count = tickets.filter((t) => t.departmentId === dept.id).length;
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{dept.code} ({dept.name.split(' (')[0]})</span>
                <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Secondary Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">สถานะงาน (Status)</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="submitted">รอดำเนินการ (Submitted)</option>
              <option value="in_review">กำลังตรวจสอบ (In Review)</option>
              <option value="assigned">มอบหมายแล้ว (Assigned)</option>
              <option value="in_progress">กำลังดำเนินการ (In Progress)</option>
              <option value="waiting_user">รอข้อมูลจากผู้ใช้ (Waiting User)</option>
              <option value="resolved">ดำเนินการแล้วเสร็จ (Resolved)</option>
              <option value="closed">ปิดคำร้อง (Closed)</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">ความสำคัญ (Priority)</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">ทุกระดับความสำคัญ</option>
              <option value="critical">วิกฤต (Critical - 2h SLA)</option>
              <option value="high">สูง (High - 8h SLA)</option>
              <option value="medium">ปานกลาง (Medium - 24h SLA)</option>
              <option value="low">ต่ำ (Low - 72h SLA)</option>
            </select>
          </div>

          {/* Assignment Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">การมอบหมาย (Assignment)</label>
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">ทั้งหมด</option>
              <option value="mine">งานที่ฉันรับผิดชอบ</option>
              <option value="unassigned">ยังไม่มอบหมายเจ้าหน้าที่</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">ค้นหาคำร้อง</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ticket ID, ผู้ส่ง, คำอธิบาย..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Queue Table / High Density Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-2 items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">
            รายการคำร้องในคิว ({filteredTickets.length} รายการ)
          </div>
          <div className="text-[11px] text-slate-500">
            คลิกที่แถวเพื่อเปิดดูรายละเอียดและดำเนินการ
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            ไม่พบคำร้องที่ตรงกับเงื่อนไขในคิวขณะนี้
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="ticket-table w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">รหัสคำร้อง</th>
                  <th className="py-2.5 px-4 font-normal">แผนก / บริการ</th>
                  <th className="py-2.5 px-4 font-normal">หัวข้อคำร้อง</th>
                  <th className="py-2.5 px-4 font-normal">ผู้ขอรับบริการ</th>
                  <th className="py-2.5 px-4 font-normal">ความสำคัญ</th>
                  <th className="py-2.5 px-4 font-normal">สถานะงาน</th>
                  <th className="py-2.5 px-4 font-normal">ผู้รับผิดชอบ</th>
                  <th className="py-2.5 px-4 font-normal text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => {
                  const dept = departments.find((d) => d.id === t.departmentId);
                  const isAssignedToMe = t.assignedOfficerId === currentUser.id;
                  const isUnassigned = !t.assignedOfficerId;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => onSelectTicket(t)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Code */}
                      <td data-label="รหัสคำร้อง" className="py-3 px-4 font-mono-num font-semibold text-blue-600 whitespace-nowrap">
                        {t.ticketCode}
                      </td>

                      {/* Department & Service */}
                      <td data-label="แผนก / บริการ" className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{dept?.code}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[130px]">{t.serviceName}</div>
                      </td>

                      {/* Title & snippet */}
                      <td data-label="หัวข้อคำร้อง" className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {t.title}
                        </div>
                        {t.reRoutedFrom && (
                          <div className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                            <span>โอนย้ายมาจาก {departments.find(d => d.id === t.reRoutedFrom)?.code}</span>
                          </div>
                        )}
                      </td>

                      {/* Requester */}
                      <td data-label="ผู้ขอรับบริการ" className="py-3 px-4 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">{t.requesterName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{t.requesterDepartment}</div>
                      </td>

                      {/* Priority */}
                      <td data-label="ความสำคัญ" className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${priorityBadge[t.priority].color}`}>
                          {priorityBadge[t.priority].label}
                        </span>
                      </td>

                      {/* Status */}
                      <td data-label="สถานะงาน" className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusLabels[t.status].color}`}>
                          {statusLabels[t.status].label}
                        </span>
                      </td>

                      {/* Assigned Officer */}
                      <td data-label="ผู้รับผิดชอบ" className="py-3 px-4 whitespace-nowrap">
                        {t.assignedOfficerName ? (
                          <span className={`text-xs ${isAssignedToMe ? 'font-semibold text-indigo-700' : 'text-slate-600'}`}>
                            {t.assignedOfficerName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">ยังไม่มอบหมาย</span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td data-label="ดำเนินการ" className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTicket(t);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          จัดการเคส
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
