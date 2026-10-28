export type UserRole = 'requester' | 'officer' | 'executive';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketStatus = 
  | 'submitted'      // รอดำเนินการรับเรื่อง
  | 'in_review'      // กำลังตรวจสอบข้อมูล
  | 'assigned'       // มอบหมายเจ้าหน้าที่แล้ว
  | 'in_progress'    // กำลังดำเนินการ
  | 'waiting_user'   // รอข้อมูลจากผู้ขอรับบริการ
  | 'resolved'       // ดำเนินการแล้วเสร็จ
  | 'closed'         // ปิดคำร้อง
  | 'rejected';      // ปฏิเสธคำร้อง

export type DepartmentId = 'dept-it' | 'dept-mkt' | 'dept-hr' | 'dept-fac' | 'dept-acc';

export interface Department {
  id: DepartmentId;
  name: string;
  nameEn: string;
  code: string;
  description: string;
  iconName: string;
  headName: string;
  slaTargetHours: number;
}

export interface ServiceFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  helpText?: string;
}

export interface ServiceItem {
  id: string;
  departmentId: DepartmentId;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  defaultPriority: TicketPriority;
  customFields: ServiceFieldDefinition[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  avatarInitials: string;
  title: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: string;
  isInternalNote: boolean;
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  detail?: string;
}

export interface Ticket {
  id: string;
  ticketCode: string; // e.g. REQ-2026-0104
  title: string;
  departmentId: DepartmentId;
  serviceId: string;
  serviceName: string;
  category: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  customFieldValues: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  slaDeadline: string;
  resolvedAt?: string;
  closedAt?: string;
  csatRating?: number; // 1-5
  csatFeedback?: string;
  reRoutedFrom?: DepartmentId;
  reRouteReason?: string;
  comments: TicketComment[];
  activities: TicketActivity[];
}

export interface SLAMetrics {
  totalTickets: number;
  resolvedTickets: number;
  openTickets: number;
  slaBreachedCount: number;
  slaComplianceRate: number; // percentage
  avgResolutionHours: number;
  csatScore: number;
}
