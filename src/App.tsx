/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ServiceDeskProvider, useServiceDesk } from './context/ServiceDeskContext';
import { Navbar } from './components/Navbar';
import { ServiceCatalog } from './components/RequesterPortal/ServiceCatalog';
import { NewRequestModal } from './components/RequesterPortal/NewRequestModal';
import { MyRequests } from './components/RequesterPortal/MyRequests';
import { QueueOverview } from './components/OfficerWorkspace/QueueOverview';
import { TicketDetailView } from './components/TicketDetailView';
import { ExecutiveDashboard } from './components/ExecutiveDashboard/ExecutiveDashboard';
import { SDLCExplorer } from './components/SDLCExplorer/SDLCExplorer';
import { ServiceItem, Ticket } from './types';

function MainApp() {
  const { currentRole, currentUser } = useServiceDesk();
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-requests' | 'officer-queue' | 'executive' | 'sdlc'>('catalog');
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [inspectedTicket, setInspectedTicket] = useState<Ticket | null>(null);
  const hasOpenDialog = isNewRequestOpen || inspectedTicket !== null;

  useEffect(() => {
    if (!hasOpenDialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [hasOpenDialog]);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceForModal(service);
    setIsNewRequestOpen(true);
  };

  const handleTicketCreated = (ticketId: string) => {
    setActiveTab('my-requests');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRequest={() => {
          setSelectedServiceForModal(null);
          setIsNewRequestOpen(true);
        }}
      />

      {/* Role Context Notification Bar (Helps users/reviewers immediately understand what view they are in) */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>คุณกำลังใช้งานในฐานะ: <strong className="text-white font-medium">{currentUser.name}</strong></span>
            <span className="text-slate-400">({currentUser.title} - {currentUser.department})</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>สามารถสลับบทบาท (ผู้ขอรับบริการ / เจ้าหน้าที่ IT / เจ้าหน้าที่การตลาด / ผู้บริหาร) ได้ที่มุมขวาบน</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'catalog' && (
          <ServiceCatalog
            onSelectService={handleSelectService}
            onOpenMyRequests={() => setActiveTab('my-requests')}
          />
        )}

        {activeTab === 'my-requests' && (
          <MyRequests
            onSelectTicket={(ticket) => setInspectedTicket(ticket)}
            onOpenNewRequest={() => {
              setSelectedServiceForModal(null);
              setIsNewRequestOpen(true);
            }}
          />
        )}

        {activeTab === 'officer-queue' && (
          <QueueOverview
            onSelectTicket={(ticket) => setInspectedTicket(ticket)}
          />
        )}

        {activeTab === 'executive' && (
          <ExecutiveDashboard />
        )}

        {activeTab === 'sdlc' && (
          <SDLCExplorer />
        )}
      </main>

      {/* Modals */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        initialService={selectedServiceForModal}
        onTicketCreated={handleTicketCreated}
      />

      {inspectedTicket && (
        <TicketDetailView
          ticket={inspectedTicket}
          onClose={() => setInspectedTicket(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap justify-center sm:justify-start text-center sm:text-left items-center gap-2">
            <span className="font-bold text-slate-800">OneService Central</span>
            <span aria-hidden="true">·</span>
            <span>ระบบศูนย์กลางบริการและจัดการคำร้ององค์กรตามมาตรฐาน ITSM & SDLC</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-center text-[11px]">
            <span>ครอบคลุม: IT · Marketing · HR · Facility · Finance</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Multi-Role RBAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ServiceDeskProvider>
      <MainApp />
    </ServiceDeskProvider>
  );
}
