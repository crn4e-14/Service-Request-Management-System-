import React, { useState, useMemo } from 'react';
import { useServiceDesk } from '../../context/ServiceDeskContext';
import { DepartmentId, ServiceItem } from '../../types';
import { 
  Search, 
  Server, 
  Megaphone, 
  Users, 
  Building2, 
  Receipt, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Layers,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface ServiceCatalogProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenMyRequests: () => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  onSelectService,
  onOpenMyRequests,
}) => {
  const { departments, services, tickets, currentUser } = useServiceDesk();
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping helper
  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Receipt': return <Receipt className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const myOpenTicketsCount = tickets.filter(
    (t) => t.requesterId === currentUser.id && t.status !== 'closed' && t.status !== 'resolved'
  ).length;

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchDept = selectedDeptId === 'all' || srv.departmentId === selectedDeptId;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        srv.title.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }, [services, selectedDeptId, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Editorial Hero Announcement (Centralized Solution Value) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Centralized Enterprise Service Portal</span>
            <span aria-hidden="true">·</span>
            <span>มาตรฐาน ITSM & SDLC</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            ศูนย์กลางบริการและส่งคำร้องทุกแผนกในองค์กร
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            แก้ไขปัญหาแบบฟอร์มกระจัดกระจายและส่งผิดแผนก เลือกประเภทงานที่ต้องการ แจ้งข้อมูลในแบบฟอร์มเฉพาะทาง 
            และติดตามผลการดำเนินงานแบบเรียลไทม์ได้ตลอด 24 ชั่วโมง
          </p>

          {/* Quick Stats or Actions */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-lg border border-white/10">
              <span className="text-slate-400">คำร้องของฉันที่กำลังดำเนินการ:</span>
              <span className="font-semibold text-white font-mono-num">{myOpenTicketsCount} รายการ</span>
            </div>

            <button
              onClick={onOpenMyRequests}
              className="flex items-center gap-1.5 text-blue-300 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>ติดตามสถานะคำร้องของฉัน</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Department Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาบริการ เช่น ซ่อมคอม, VPN, ทำสื่อแบนเนอร์, ขอหนังสือรับรอง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="ค้นหาบริการ"
              className="w-full pl-10 pr-12 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้าง
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 shrink-0">
            แสดง {filteredServices.length} บริการที่พร้อมให้ความช่วยเหลือ
          </div>
        </div>

        {/* Department Filter Bar */}
        <div className="scroll-strip flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDeptId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDeptId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            ทุกแผนก ({services.length})
          </button>

          {departments.map((dept) => {
            const count = services.filter((s) => s.departmentId === dept.id).length;
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{dept.name.split(' (')[0]}</span>
                <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Service Cards Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">ไม่พบบริการที่ตรงกับเงื่อนไขค้นหา</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกดูบริการตามแผนกอื่น ๆ ด้านบน
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDeptId('all');
            }}
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            แสดงบริการทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const dept = departments.find((d) => d.id === service.departmentId);
            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-sm group"
              >
                <div>
                  {/* Category & Department metadata (Zero-Pill Discipline) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-medium text-slate-700">{dept?.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{service.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                {/* Footer metadata & Action */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>เป้าหมาย SLA: ~{service.estimatedHours} ชม.</span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <span>ขอรับบริการ</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Department Directory Quick Cards */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          ทำเนียบแผนกบริการในระบบ (Department Directory)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                  {getDeptIcon(dept.iconName)}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ผู้รับผิดชอบ: {dept.headName}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
