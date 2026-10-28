import React, { useState } from 'react';
import { useServiceDesk } from '../../context/ServiceDeskContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Users, 
  Building2, 
  Sparkles, 
  Share2,
  Star,
  Activity,
  Layers
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { tickets, departments, metrics } = useServiceDesk();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'all'>('month');

  // Department breakdown stats
  const deptStats = departments.map((dept) => {
    const deptTickets = tickets.filter((t) => t.departmentId === dept.id);
    const resolved = deptTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
    const open = deptTickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed' && t.status !== 'rejected').length;
    const critical = deptTickets.filter((t) => t.priority === 'critical').length;
    const reroutedFrom = tickets.filter((t) => t.reRoutedFrom === dept.id).length;
    const reroutedTo = deptTickets.filter((t) => !!t.reRoutedFrom).length;
    
    const resolveRate = deptTickets.length > 0 ? Math.round((resolved / deptTickets.length) * 100) : 100;

    return {
      dept,
      total: deptTickets.length,
      resolved,
      open,
      critical,
      resolveRate,
      reroutedFrom,
      reroutedTo,
    };
  });

  // Category breakdown
  const categoryCount: Record<string, number> = {};
  tickets.forEach((t) => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });

  // Priority breakdown
  const priorityCount = {
    critical: tickets.filter((t) => t.priority === 'critical').length,
    high: tickets.filter((t) => t.priority === 'high').length,
    medium: tickets.filter((t) => t.priority === 'medium').length,
    low: tickets.filter((t) => t.priority === 'low').length,
  };

  // Staff workload breakdown
  const staffWorkload: Record<string, { name: string; dept: string; activeCount: number; resolvedCount: number }> = {};
  tickets.forEach((t) => {
    if (t.assignedOfficerName) {
      if (!staffWorkload[t.assignedOfficerName]) {
        const d = departments.find((dept) => dept.id === t.departmentId);
        staffWorkload[t.assignedOfficerName] = {
          name: t.assignedOfficerName,
          dept: d ? d.name.split(' (')[0] : 'ทั่วไป',
          activeCount: 0,
          resolvedCount: 0,
        };
      }
      if (t.status === 'resolved' || t.status === 'closed') {
        staffWorkload[t.assignedOfficerName].resolvedCount += 1;
      } else {
        staffWorkload[t.assignedOfficerName].activeCount += 1;
      }
    }
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Ticket Code',
      'Title',
      'Department',
      'Category',
      'Priority',
      'Status',
      'Requester',
      'Assigned Officer',
      'Created At',
      'Due Date',
      'CSAT Rating',
    ];

    const rows = tickets.map((t) => [
      t.ticketCode,
      `"${t.title.replace(/"/g, '""')}"`,
      departments.find((d) => d.id === t.departmentId)?.nameEn || t.departmentId,
      t.category,
      t.priority,
      t.status,
      `"${t.requesterName}"`,
      `"${t.assignedOfficerName || 'Unassigned'}"`,
      t.createdAt,
      t.dueDate,
      t.csatRating || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OneService_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Executive Management Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>รายงานสรุปภาพรวมและการจัดสรรทรัพยากร</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            แดชบอร์ดผู้บริหาร (Executive Service Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สถิติการดำเนินงาน อัตราความสำเร็จ SLA และการกระจายตัวของปริมาณงานรายแผนก
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedTimeframe('month')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedTimeframe === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              เดือนนี้
            </button>
            <button
              onClick={() => setSelectedTimeframe('quarter')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedTimeframe === 'quarter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ไตรมาสปัจจุบัน
            </button>
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedTimeframe === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ข้อมูลสะสม
            </button>
          </div>

          {/* Export Report CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>ส่งออกรายงาน (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">คำร้องทั้งหมด (Total Requests)</div>
          <div className="text-2xl font-bold text-slate-900 font-mono-num mt-1">
            {metrics.totalTickets}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>ระบบรวบรวมจากทุกแผนก</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">อัตราความสำเร็จตาม SLA</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono-num mt-1">
            {metrics.slaComplianceRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            เป้าหมายเกณฑ์องค์กร: &gt; 90%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">เวลาแก้ไขเฉลี่ย (MTTR)</div>
          <div className="text-2xl font-bold text-slate-900 font-mono-num mt-1">
            {metrics.avgResolutionHours} <span className="text-xs font-normal text-slate-500">ชม.</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            ลดลง 42% จากระบบเดิม
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">งานที่ค้างในระบบ (In Progress)</div>
          <div className="text-2xl font-bold text-blue-600 font-mono-num mt-1">
            {metrics.openTickets}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            กระจายอยู่ในคิวงาน
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">คะแนนความพึงพอใจ (CSAT)</div>
          <div className="text-2xl font-bold text-amber-500 font-mono-num mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{metrics.csatScore}</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            ประเมินโดยพนักงานผู้ขอใช้
          </div>
        </div>
      </div>

      {/* Department Workload Breakdown & Cross-Department Re-routing Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Workload Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                การกระจายปริมาณงานและประสิทธิภาพรายแผนก (Department Workload)
              </h2>
              <p className="text-[11px] text-slate-500">
                เปรียบเทียบภาระงาน ปริมาณงานที่ปิดได้ และความเสี่ยงของแต่ละแผนก
              </p>
            </div>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <div className="table-scroll" tabIndex={0} role="region" aria-label="ตารางสถิติแผนก เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">แผนกบริการ</th>
                  <th className="py-2.5 px-4 font-normal text-center">คำร้องทั้งหมด</th>
                  <th className="py-2.5 px-4 font-normal text-center">กำลังทำ</th>
                  <th className="py-2.5 px-4 font-normal text-center">เสร็จสิ้น</th>
                  <th className="py-2.5 px-4 font-normal text-center">ความสำเร็จ</th>
                  <th className="py-2.5 px-4 font-normal text-right">เคสโอนย้าย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptStats.map(({ dept, total, resolved, open, resolveRate, reroutedTo }) => (
                  <tr key={dept.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{dept.name.split(' (')[0]}</div>
                      <div className="text-[10px] text-slate-400">{dept.nameEn}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono-num font-semibold text-slate-800">
                      {total}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-num text-blue-600">
                      {open}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-num text-emerald-600">
                      {resolved}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${resolveRate}%` }}
                          />
                        </div>
                        <span className="font-mono-num text-[11px] text-slate-700">{resolveRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-num text-slate-500">
                      {reroutedTo > 0 ? (
                        <span className="text-amber-600 font-semibold">+{reroutedTo} เคส</span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority & Problem Category Analysis (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              การกระจายระดับความสำคัญ (Priority Distribution)
            </h2>
            <p className="text-[11px] text-slate-500 mb-3">
              สัดส่วนคำร้องตามระดับความเร่งด่วนตามข้อตกลง SLA
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>วิกฤต (Critical - 2h SLA)</span>
                </span>
                <span className="font-mono-num font-bold text-rose-600">{priorityCount.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>สูง (High - 8h SLA)</span>
                </span>
                <span className="font-mono-num font-bold text-amber-600">{priorityCount.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>ปานกลาง (Medium - 24h SLA)</span>
                </span>
                <span className="font-mono-num font-bold text-blue-600">{priorityCount.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>ต่ำ (Low - 72h SLA)</span>
                </span>
                <span className="font-mono-num font-bold text-slate-600">{priorityCount.low}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              หมวดหมู่บริการยอดนิยม (Top Categories)
            </h2>
            <div className="space-y-2 text-xs mt-2.5">
              {Object.entries(categoryCount).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-slate-600 truncate max-w-[180px]">{cat}</span>
                  <span className="font-mono-num font-semibold text-slate-900">{count} คำร้อง</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Resource Allocation & Staff Workload */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              การจัดสรรทรัพยากรและภาระงานของเจ้าหน้าที่ (Staff Workload & Capacity)
            </h2>
            <p className="text-xs text-slate-500">
              ข้อมูลช่วยผู้บริหารตัดสินใจเกลี่ยงาน หรือจัดสรรอัตรากำลังพลเพิ่มเติม
            </p>
          </div>
          <Users className="w-4 h-4 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.values(staffWorkload).map((staff) => (
            <div key={staff.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="font-semibold text-xs text-slate-900">{staff.name}</div>
              <div className="text-[11px] text-slate-500">{staff.dept}</div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">งานที่กำลังทำ</span>
                  <span className="font-bold font-mono-num text-blue-600">{staff.activeCount} เคส</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">งานที่ปิดแล้ว</span>
                  <span className="font-bold font-mono-num text-emerald-600">{staff.resolvedCount} เคส</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
