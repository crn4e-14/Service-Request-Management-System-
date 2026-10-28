import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Ticket, 
  UserProfile, 
  UserRole, 
  Department, 
  ServiceItem, 
  DepartmentId, 
  TicketStatus, 
  TicketPriority, 
  SLAMetrics 
} from '../types';
import { DEPARTMENTS, SERVICE_ITEMS, INITIAL_TICKETS, DEMO_USERS } from '../data/initialData';

interface ServiceDeskContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  switchRole: (role: UserRole, officerDept?: 'dept-it' | 'dept-mkt') => void;
  departments: Department[];
  services: ServiceItem[];
  tickets: Ticket[];
  activeTicket: Ticket | null;
  setActiveTicket: (ticket: Ticket | null) => void;
  createTicket: (data: {
    title: string;
    departmentId: DepartmentId;
    serviceId: string;
    description: string;
    priority: TicketPriority;
    customFields: Record<string, string>;
  }) => Ticket;
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, note?: string) => void;
  assignTicket: (ticketId: string, officerId: string, officerName: string) => void;
  rerouteTicket: (ticketId: string, targetDepartmentId: DepartmentId, reason: string) => void;
  addComment: (ticketId: string, message: string, isInternalNote: boolean) => void;
  submitCSAT: (ticketId: string, rating: number, feedback?: string) => void;
  resetToInitialData: () => void;
  metrics: SLAMetrics;
}

const ServiceDeskContext = createContext<ServiceDeskContextType | undefined>(undefined);

const STORAGE_KEY_TICKETS = 'oneservice_tickets_v1';
const STORAGE_KEY_ROLE = 'oneservice_current_role_v1';
const STORAGE_KEY_USER = 'oneservice_current_user_v1';

export const ServiceDeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROLE);
    return (saved as UserRole) || 'requester';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEMO_USERS.requester;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_TICKETS;
  });

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentRole, currentUser]);

  // Keep activeTicket synchronized if tickets change
  useEffect(() => {
    if (activeTicket) {
      const updated = tickets.find((t) => t.id === activeTicket.id);
      if (updated) {
        setActiveTicket(updated);
      }
    }
  }, [tickets]);

  const switchRole = (role: UserRole, officerDept?: 'dept-it' | 'dept-mkt') => {
    setCurrentRole(role);
    if (role === 'requester') {
      setCurrentUser(DEMO_USERS.requester);
    } else if (role === 'officer') {
      if (officerDept === 'dept-mkt') {
        setCurrentUser(DEMO_USERS.officer_mkt);
      } else {
        setCurrentUser(DEMO_USERS.officer_it);
      }
    } else if (role === 'executive') {
      setCurrentUser(DEMO_USERS.executive);
    }
  };

  const createTicket = (data: {
    title: string;
    departmentId: DepartmentId;
    serviceId: string;
    description: string;
    priority: TicketPriority;
    customFields: Record<string, string>;
  }): Ticket => {
    const service = SERVICE_ITEMS.find((s) => s.id === data.serviceId);
    const serviceName = service ? service.title : 'ทั่วไป';
    const category = service ? service.category : 'บริการทั่วไป';

    const count = tickets.length + 101;
    const ticketCode = `REQ-2026-${String(count).padStart(4, '0')}`;
    const now = new Date();

    // SLA calculation based on priority
    const slaHours = data.priority === 'critical' ? 2 : data.priority === 'high' ? 8 : data.priority === 'medium' ? 24 : 72;
    const slaDeadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000).toISOString();
    const dueDate = new Date(now.getTime() + Math.max(slaHours * 1.5, 24) * 60 * 60 * 1000).toISOString();

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketCode,
      title: data.title,
      departmentId: data.departmentId,
      serviceId: data.serviceId,
      serviceName,
      category,
      description: data.description,
      priority: data.priority,
      status: 'submitted',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      requesterDepartment: currentUser.department,
      customFieldValues: data.customFields,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueDate,
      slaDeadline,
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          ticketId: `tkt-${Date.now()}`,
          action: 'ส่งคำร้องเข้าสู่ระบบ OneService Central',
          performedBy: currentUser.name,
          timestamp: now.toISOString(),
          detail: `จัดสรรคำร้องไปยัง ${DEPARTMENTS.find((d) => d.id === data.departmentId)?.name}`,
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, note?: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const isResolving = newStatus === 'resolved' && !t.resolvedAt;
        const isClosing = newStatus === 'closed' && !t.closedAt;

        const statusMap: Record<TicketStatus, string> = {
          submitted: 'รอดำเนินการรับเรื่อง',
          in_review: 'กำลังตรวจสอบข้อมูล',
          assigned: 'มอบหมายเจ้าหน้าที่แล้ว',
          in_progress: 'กำลังดำเนินการ',
          waiting_user: 'รอข้อมูลจากผู้ขอรับบริการ',
          resolved: 'ดำเนินการแล้วเสร็จ',
          closed: 'ปิดคำร้องสมบูรณ์',
          rejected: 'ปฏิเสธคำร้อง',
        };

        const newActivities = [
          ...t.activities,
          {
            id: `act-${Date.now()}`,
            ticketId,
            action: `เปลี่ยนสถานะเป็น "${statusMap[newStatus]}"`,
            performedBy: currentUser.name,
            timestamp: now,
            detail: note || undefined,
          },
        ];

        const newComments = note
          ? [
              ...t.comments,
              {
                id: `cmt-${Date.now()}`,
                ticketId,
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                message: note,
                createdAt: now,
                isInternalNote: false,
              },
            ]
          : t.comments;

        return {
          ...t,
          status: newStatus,
          updatedAt: now,
          resolvedAt: isResolving ? now : t.resolvedAt,
          closedAt: isClosing ? now : t.closedAt,
          activities: newActivities,
          comments: newComments,
        };
      })
    );
  };

  const assignTicket = (ticketId: string, officerId: string, officerName: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          assignedOfficerId: officerId,
          assignedOfficerName: officerName,
          status: t.status === 'submitted' ? 'assigned' : t.status,
          updatedAt: now,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              ticketId,
              action: `มอบหมายผู้รับผิดชอบเป็น ${officerName}`,
              performedBy: currentUser.name,
              timestamp: now,
            },
          ],
        };
      })
    );
  };

  const rerouteTicket = (ticketId: string, targetDepartmentId: DepartmentId, reason: string) => {
    const now = new Date().toISOString();
    const targetDept = DEPARTMENTS.find((d) => d.id === targetDepartmentId);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const prevDept = DEPARTMENTS.find((d) => d.id === t.departmentId);
        return {
          ...t,
          reRoutedFrom: t.departmentId,
          reRouteReason: reason,
          departmentId: targetDepartmentId,
          assignedOfficerId: undefined,
          assignedOfficerName: undefined,
          status: 'submitted',
          updatedAt: now,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              ticketId,
              action: `โอนย้ายแผนก (Re-routed) จาก ${prevDept?.name} ไปยัง ${targetDept?.name}`,
              performedBy: currentUser.name,
              timestamp: now,
              detail: reason,
            },
          ],
          comments: [
            ...t.comments,
            {
              id: `cmt-${Date.now()}`,
              ticketId,
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
              message: `[ระบบบันทึกการโอนย้ายแผนก] โอนย้ายจาก ${prevDept?.code} สู่ ${targetDept?.name} เนื่องจาก: ${reason}`,
              createdAt: now,
              isInternalNote: false,
            },
          ],
        };
      })
    );
  };

  const addComment = (ticketId: string, message: string, isInternalNote: boolean) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          updatedAt: now,
          comments: [
            ...t.comments,
            {
              id: `cmt-${Date.now()}`,
              ticketId,
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
              message,
              createdAt: now,
              isInternalNote,
            },
          ],
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              ticketId,
              action: isInternalNote ? 'บันทึก Internal Note (เฉพาะเจ้าหน้าที่)' : 'ส่งข้อความตอบกลับผู้ขอรับบริการ',
              performedBy: currentUser.name,
              timestamp: now,
            },
          ],
        };
      })
    );
  };

  const submitCSAT = (ticketId: string, rating: number, feedback?: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          csatRating: rating,
          csatFeedback: feedback,
          updatedAt: now,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              ticketId,
              action: `ผู้ขอรับบริการประเมินความพึงพอใจ (${rating}/5 ดาว)`,
              performedBy: currentUser.name,
              timestamp: now,
              detail: feedback,
            },
          ],
        };
      })
    );
  };

  const resetToInitialData = () => {
    setTickets(INITIAL_TICKETS);
    setCurrentRole('requester');
    setCurrentUser(DEMO_USERS.requester);
    setActiveTicket(null);
    localStorage.removeItem(STORAGE_KEY_TICKETS);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  // Compute metrics for Executive & System Analytics
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const openTickets = tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed' && t.status !== 'rejected').length;
  
  // Calculate SLA breaches (now past slaDeadline while still open)
  const currentTime = new Date().getTime();
  const slaBreachedCount = tickets.filter((t) => {
    if (t.status === 'resolved' || t.status === 'closed') {
      const resolved = t.resolvedAt ? new Date(t.resolvedAt).getTime() : 0;
      const deadline = new Date(t.slaDeadline).getTime();
      return resolved > deadline;
    }
    const deadline = new Date(t.slaDeadline).getTime();
    return currentTime > deadline;
  }).length;

  const slaComplianceRate = totalTickets > 0 
    ? Math.round(((totalTickets - slaBreachedCount) / totalTickets) * 100) 
    : 100;

  const avgResolutionHours = 14.5;

  const csatItems = tickets.filter((t) => t.csatRating !== undefined);
  const csatScore = csatItems.length > 0 
    ? Number((csatItems.reduce((acc, curr) => acc + (curr.csatRating || 0), 0) / csatItems.length).toFixed(1)) 
    : 4.8;

  const metrics: SLAMetrics = {
    totalTickets,
    resolvedTickets,
    openTickets,
    slaBreachedCount,
    slaComplianceRate,
    avgResolutionHours,
    csatScore,
  };

  return (
    <ServiceDeskContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        departments: DEPARTMENTS,
        services: SERVICE_ITEMS,
        tickets,
        activeTicket,
        setActiveTicket,
        createTicket,
        updateTicketStatus,
        assignTicket,
        rerouteTicket,
        addComment,
        submitCSAT,
        resetToInitialData,
        metrics,
      }}
    >
      {children}
    </ServiceDeskContext.Provider>
  );
};

export const useServiceDesk = () => {
  const context = useContext(ServiceDeskContext);
  if (!context) {
    throw new Error('useServiceDesk must be used within a ServiceDeskProvider');
  }
  return context;
};
