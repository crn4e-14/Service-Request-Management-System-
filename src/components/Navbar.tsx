import React, { useState } from 'react';
import { useServiceDesk } from '../context/ServiceDeskContext';
import { UserRole } from '../types';
import { 
  Building2, 
  Layers, 
  ClipboardList, 
  SlidersHorizontal, 
  BarChart3, 
  Code2, 
  Plus, 
  ChevronDown, 
  RotateCcw,
  Check
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'my-requests' | 'officer-queue' | 'executive' | 'sdlc';
  setActiveTab: (tab: 'catalog' | 'my-requests' | 'officer-queue' | 'executive' | 'sdlc') => void;
  onOpenNewRequest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRequest,
}) => {
  const { currentUser, currentRole, switchRole, resetToInitialData } = useServiceDesk();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    requester: { title: 'ผู้ขอรับบริการ (Requester)', badge: 'พนักงานทั่วไป', color: 'text-sky-700 bg-sky-50 border-sky-200' },
    officer: { title: 'เจ้าหน้าที่ผู้รับเรื่อง (Officer)', badge: 'เจ้าหน้าที่แผนก', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    executive: { title: 'ผู้บริหารองค์กร (Executive)', badge: 'ผู้บริหารระดับสูง', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Brand and actions stay together; desktop navigation uses its own row. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
            OS
          </div>
          <button 
            onClick={() => setActiveTab('catalog')} 
            className="min-w-0 text-left group cursor-pointer"
          >
            <span className="block text-[13px] sm:text-base font-bold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
              OneService Central
            </span>
            <span className="hidden sm:block text-[11px] text-slate-500 font-normal">
              ศูนย์กลางบริการและจัดการคำร้ององค์กร
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav aria-label="เมนูหลัก" className="hidden lg:flex order-3 w-full justify-center items-center gap-1 xl:gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>บริการทั้งหมด</span>
          </button>

          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'my-requests'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>คำร้องของฉัน</span>
          </button>

          <button
            onClick={() => setActiveTab('officer-queue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'officer-queue'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>คิวงานเจ้าหน้าที่</span>
          </button>

          <button
            onClick={() => setActiveTab('executive')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'executive'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>แดชบอร์ดผู้บริหาร</span>
          </button>

          <button
            onClick={() => setActiveTab('sdlc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sdlc'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>สถาปัตยกรรม SDLC & DBMS</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* New Request Button */}
          <button
            onClick={onOpenNewRequest}
            aria-label="ส่งคำร้องใหม่"
            className="min-w-11 flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ส่งคำร้องใหม่</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              aria-label="สลับบทบาทผู้ใช้งาน"
              aria-expanded={roleMenuOpen}
              aria-controls="role-menu"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
              title="สลับมุมมองบทบาทผู้ใช้งาน (RBAC Simulation)"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-medium text-[11px]">
                {currentUser.avatarInitials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium text-slate-900 truncate max-w-[110px] leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                  {roleLabels[currentRole].badge}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div 
                id="role-menu"
                className="absolute right-0 mt-1.5 w-72 max-w-[calc(100vw-2rem)] max-h-[65dvh] overflow-y-auto overscroll-contain bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    สลับบทบาทผู้ใช้ (RBAC Mode)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    ทดสอบมุมมองของแต่ละบทบาทตามโจทย์ระบบ
                  </p>
                </div>

                <div className="py-1">
                  {/* Option 1: Requester */}
                  <button
                    onClick={() => {
                      switchRole('requester');
                      setRoleMenuOpen(false);
                      setActiveTab('catalog');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'requester' ? 'bg-slate-50 text-blue-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">นายสมชาย ประเสริฐ</div>
                      <div className="text-[11px] text-slate-500">บทบาท: ผู้ขอรับบริการ (พนักงานฝ่ายขาย/การตลาด)</div>
                    </div>
                    {currentRole === 'requester' && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  {/* Option 2: IT Officer */}
                  <button
                    onClick={() => {
                      switchRole('officer', 'dept-it');
                      setRoleMenuOpen(false);
                      setActiveTab('officer-queue');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'officer' && currentUser.department.includes('IT') ? 'bg-slate-50 text-blue-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">นายอนันต์ นวัตกรรม</div>
                      <div className="text-[11px] text-slate-500">บทบาท: เจ้าหน้าที่ฝ่าย IT Support & ระบบ</div>
                    </div>
                    {currentRole === 'officer' && currentUser.department.includes('IT') && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  {/* Option 3: Marketing Officer */}
                  <button
                    onClick={() => {
                      switchRole('officer', 'dept-mkt');
                      setRoleMenuOpen(false);
                      setActiveTab('officer-queue');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'officer' && currentUser.department.includes('การตลาด') ? 'bg-slate-50 text-blue-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">นางสาวกัญญา สื่อสาร</div>
                      <div className="text-[11px] text-slate-500">บทบาท: เจ้าหน้าที่ฝ่ายการตลาด (Creative & Media)</div>
                    </div>
                    {currentRole === 'officer' && currentUser.department.includes('การตลาด') && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  {/* Option 4: Executive */}
                  <button
                    onClick={() => {
                      switchRole('executive');
                      setRoleMenuOpen(false);
                      setActiveTab('executive');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'executive' ? 'bg-slate-50 text-blue-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">ดร.วิชัย บูรณาการ</div>
                      <div className="text-[11px] text-slate-500">บทบาท: ผู้บริหารระดับสูง (COO / Management BI)</div>
                    </div>
                    {currentRole === 'executive' && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-100 px-3">
                  <button
                    onClick={() => {
                      resetToInitialData();
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left py-1 text-[11px] text-slate-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รีเซ็ตข้อมูลตัวอย่างทั้งหมด (Reset Data)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <nav aria-label="เมนูหลักบนมือถือ" className="scroll-strip lg:hidden flex items-center gap-1 px-4 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600'
          }`}
        >
          บริการทั้งหมด
        </button>
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'my-requests' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600'
          }`}
        >
          คำร้องของฉัน
        </button>
        <button
          onClick={() => setActiveTab('officer-queue')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'officer-queue' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600'
          }`}
        >
          คิวงานเจ้าหน้าที่
        </button>
        <button
          onClick={() => setActiveTab('executive')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'executive' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600'
          }`}
        >
          แดชบอร์ดผู้บริหาร
        </button>
        <button
          onClick={() => setActiveTab('sdlc')}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'sdlc' ? 'bg-white text-slate-900 font-medium shadow-sm' : 'text-slate-600'
          }`}
        >
          สถาปัตยกรรม SDLC
        </button>
      </nav>
    </header>
  );
};
