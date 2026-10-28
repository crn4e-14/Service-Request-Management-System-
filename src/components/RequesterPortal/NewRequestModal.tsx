import React, { useState, useEffect } from 'react';
import { useServiceDesk } from '../../context/ServiceDeskContext';
import { ServiceItem, DepartmentId, TicketPriority } from '../../types';
import { 
  X, 
  Send, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Info,
  Building,
  HelpCircle
} from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  onTicketCreated: (ticketId: string) => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  initialService,
  onTicketCreated,
}) => {
  const { departments, services, currentUser, createTicket } = useServiceDesk();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService ? initialService.id : services[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // When initialService changes or modal opens
  useEffect(() => {
    if (initialService) {
      setSelectedServiceId(initialService.id);
      setPriority(initialService.defaultPriority);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
      setPriority(services[0].defaultPriority);
    }
  }, [initialService, services]);

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const targetDept = departments.find((d) => d.id === activeService?.departmentId);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setCustomFieldValues({});
      setErrors({});
      setSuccessCode(null);
      if (initialService) {
        setSelectedServiceId(initialService.id);
        setPriority(initialService.defaultPriority);
      }
    }
  }, [isOpen, initialService]);

  if (!isOpen) return null;

  const handleFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'กรุณาระบุหัวข้อคำร้อง';
    }
    if (!description.trim()) {
      newErrors.description = 'กรุณาระบุรายละเอียดคำร้อง';
    }

    if (activeService) {
      activeService.customFields.forEach((field) => {
        if (field.required && !customFieldValues[field.id]?.trim()) {
          newErrors[field.id] = `กรุณากรอกข้อมูล: ${field.label}`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !activeService || !targetDept) return;

    setIsSubmitting(true);
    try {
      const created = createTicket({
        title: title.trim(),
        departmentId: targetDept.id,
        serviceId: activeService.id,
        description: description.trim(),
        priority,
        customFields: customFieldValues,
      });

      setSuccessCode(created.ticketCode);
      setTimeout(() => {
        setIsSubmitting(false);
        onTicketCreated(created.id);
        onClose();
      }, 1200);
    } catch {
      setIsSubmitting(false);
    }
  };

  const prioritySLAs: Record<TicketPriority, { label: string; hours: string; desc: string }> = {
    low: { label: 'ต่ำ (Low)', hours: '72 ชม.', desc: 'งานทั่วไป ไม่ส่งผลกระทบต่องานปัจจุบัน' },
    medium: { label: 'ปานกลาง (Medium)', hours: '24 ชม.', desc: 'งานตามรอบปกติที่ต้องการผลลัพธ์ตามกำหนด' },
    high: { label: 'สูง (High)', hours: '8 ชม.', desc: 'ส่งผลกระทบต่อขั้นตอนการทำงานบางส่วน' },
    critical: { label: 'วิกฤต (Critical)', hours: '2 ชม.', desc: 'ระบบล่ม / ปัญหาส่งผลกระทบต่อองค์กรทันที' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-request-title"
        className="dialog-panel bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dialog-header shrink-0 px-4 sm:px-6 py-3 sm:py-4 gap-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span>แบบฟอร์มศูนย์กลางบริการ</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-700">{targetDept?.name.split(' (')[0]}</span>
            </div>
            <h2 id="new-request-title" className="text-base font-bold text-slate-900">
              สร้างและส่งคำร้องขอรับบริการ (New Service Request)
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดแบบฟอร์มคำร้อง"
            className="shrink-0 min-w-11 sm:min-w-0 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {successCode ? (
          <div className="p-8 text-center space-y-3 my-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">บันทึกคำร้องสำเร็จ!</h3>
            <p className="text-xs text-slate-600">
              รหัสคำร้องของคุณคือ{' '}
              <span className="font-mono-num font-bold text-blue-600 text-sm">
                {successCode}
              </span>
            </p>
            <p className="text-xs text-slate-400">
              ระบบได้ส่งคำร้องไปยังคิวงานของ {targetDept?.name} เรียบร้อยแล้ว กำลังนำท่านไปที่หน้ารายละเอียด...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="dialog-body flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Requester Identity Banner */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-xs text-slate-600">
              <div>
                <span className="text-slate-400">ผู้ขอรับบริการ: </span>
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
                <span className="text-slate-400 ml-2">({currentUser.department})</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono-num">
                {currentUser.email}
              </div>
            </div>

            {/* Service Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                เลือกประเภทบริการที่ต้องการ (Service Category)
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  const newService = services.find((s) => s.id === e.target.value);
                  if (newService) {
                    setPriority(newService.defaultPriority);
                  }
                  setCustomFieldValues({});
                  setErrors({});
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {departments.map((dept) => {
                  const deptServices = services.filter((s) => s.departmentId === dept.id);
                  return (
                    <optgroup key={dept.id} label={dept.name}>
                      {deptServices.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          [{dept.code}] {srv.title}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              {activeService && (
                <p className="text-[11px] text-slate-500 mt-1">
                  {activeService.description}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                หัวข้อคำร้องสรุปย่อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น คอมพิวเตอร์บูตไม่ขึ้น, ขอแบนเนอร์สัมมนา, ขอหนังสือรับรองเงินเดือน..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Dynamic Custom Fields based on Service Definition */}
            {activeService && activeService.customFields.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>ข้อมูลเฉพาะสำหรับ {activeService.title}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activeService.customFields.map((field) => (
                    <div
                      key={field.id}
                      className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                    >
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={customFieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                            errors[field.id]
                              ? 'border-red-300 focus:ring-red-500/20'
                              : 'border-slate-200 focus:ring-blue-500/20'
                          }`}
                        >
                          <option value="">-- โปรดเลือก --</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          placeholder={field.placeholder}
                          value={customFieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                            errors[field.id]
                              ? 'border-red-300 focus:ring-red-500/20'
                              : 'border-slate-200 focus:ring-blue-500/20'
                          }`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={customFieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                            errors[field.id]
                              ? 'border-red-300 focus:ring-red-500/20'
                              : 'border-slate-200 focus:ring-blue-500/20'
                          }`}
                        />
                      )}

                      {errors[field.id] && (
                        <p className="text-[11px] text-red-500 mt-1">{errors[field.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                รายละเอียดเพิ่มเติมของคำร้อง <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="ระบุรายละเอียด ข้อจำกัด กำหนดเวลา หรือบริบทความต้องการเพื่อความรวดเร็วในการประสานงาน..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Priority Selector & SLA Indicator */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                ระดับความสำคัญตามมาตรฐาน ITSM (Priority & SLA)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'critical'] as TicketPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{prioritySLAs[p].label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono-num">
                        SLA: {prioritySLAs[p].hours}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>คำอธิบาย: {prioritySLAs[priority].desc}</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันและส่งคำร้อง'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
