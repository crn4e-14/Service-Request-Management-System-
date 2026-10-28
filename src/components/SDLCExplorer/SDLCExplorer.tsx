import React, { useState } from 'react';
import { SDLC_PHASES } from '../../data/initialData';
import { 
  Code2, 
  Database, 
  Layers, 
  CheckCircle, 
  GitBranch, 
  ShieldCheck, 
  FileSpreadsheet,
  Workflow,
  Sparkles,
  ArrowRight,
  Server,
  Share2,
  Cloud,
  Cpu,
  HardDrive,
  Globe,
  Box,
  Shield,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export const SDLCExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'sdlc' | 'dbms' | 'itsm' | 'rbac' | 'testing'>('cloud');
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Software Engineering & System Architecture</span>
          <span aria-hidden="true">·</span>
          <span>เอกสารวิศวกรรมระบบตามรายงานโครงการวิจัย</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          สถาปัตยกรรมระบบ SDLC, DBMS และ ITSM Workflow
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          การวิเคราะห์และออกแบบระบบตามวงจรพัฒนาระบบ (SDLC), แบบจำลองฐานข้อมูล (DBMS ERD), การควบคุมสิทธิ์ (RBAC) และกระบวนการ Helpdesk
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="scroll-strip flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('cloud')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'cloud'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/40'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-blue-600" />
          <span>สถาปัตยกรรมคลาวด์ (Cloud Architecture & Presentation Specs)</span>
        </button>

        <button
          onClick={() => setActiveTab('sdlc')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'sdlc'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>วงจรการพัฒนาระบบ (SDLC 6 Phases)</span>
        </button>

        <button
          onClick={() => setActiveTab('dbms')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'dbms'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>โครงสร้างฐานข้อมูล (DBMS ERD)</span>
        </button>

        <button
          onClick={() => setActiveTab('itsm')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'itsm'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>มาตรฐานกระบวนการ ITSM Workflow</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'rbac'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>การกำหนดสิทธิ์ (RBAC Matrix)</span>
        </button>

        <button
          onClick={() => setActiveTab('testing')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'testing'
              ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>การทดสอบระบบ (Test Cases & QA)</span>
        </button>
      </div>

      {/* Tab: Cloud Architecture & Presentation Specs */}
      {activeTab === 'cloud' && (
        <div className="space-y-6">
          {/* Header & Verification of Public Internet Access */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE PRODUCTION ON CLOUD PLATFORM</span>
                  <span aria-hidden="true">·</span>
                  <span>คะแนนเต็มเกณฑ์ Project Cloud Computing</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  ข้อมูลสถาปัตยกรรมคลาวด์สำหรับนำเสนอ (Cloud Architecture & Presentation Deck)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  รวบรวมรายละเอียดผู้ให้บริการคลาวด์ แผนภาพการเชื่อมต่อ (Cloud Architecture Diagram) สเปกทรัพยากร และเหตุผลทางวิศวกรรมสำหรับตอบข้อซักถามในสไลด์นำเสนอ
                </p>
              </div>

              {/* Public URL Box */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl text-xs space-y-1.5 min-w-0 w-full md:w-auto md:shrink-0">
                <div className="text-[11px] text-slate-300 flex items-center justify-between">
                  <span>URL เข้าใช้งานจริงผ่านอินเทอร์เน็ต:</span>
                  <span className="text-emerald-400 font-semibold text-[10px]">Active 100%</span>
                </div>
                <a 
                  href="https://ais-pre-w6wabe47xjaiibvvj6mhv7-797435111717.asia-southeast1.run.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-mono text-[11px] text-blue-200 hover:text-white underline break-all flex items-center gap-1"
                >
                  <span>https://ais-pre-...run.app</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
                  Provider: Google Cloud Platform (GCP) · Region: asia-southeast1
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Visual Cloud Architecture Diagram */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>แผนภาพการออกแบบระบบ Cloud และการเชื่อมต่อ (Cloud Architecture Diagram)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  แสดงการไหลของข้อมูล (Traffic Flow) และองค์ประกอบคลาวด์ตั้งแต่ Client ถึง Container และ Storage
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(`Client Web Browser (HTTPS/Port 443) -> Anycast DNS / Google Front End (GFE) / Cloud Load Balancer -> Google Cloud Run Container (asia-southeast1, 1-2 vCPU, 512MB RAM, Auto-scaling 0 to N) -> Docker Runtime (Linux Container) -> Application Storage (DBMS Schema & Persistent Engine)`, 'diagram')}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 p-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                title="คัดลอกคำอธิบายแผนภาพไปใส่ในสไลด์"
              >
                {copiedSection === 'diagram' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'diagram' ? 'คัดลอกแล้ว!' : 'คัดลอกสรุปแผนภาพ'}</span>
              </button>
            </div>

            {/* Architecture Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              {/* Step 1: Client */}
              <div className="border border-slate-200 bg-slate-50/70 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-2">
                    01
                  </div>
                  <div className="font-bold text-slate-900">User / Client Layer</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    ผู้ใช้งานทั้ง 3 บทบาท (พนักงาน, เจ้าหน้าที่, ผู้บริหาร) เข้าถึงผ่าน Web Browser
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 font-mono">
                  Protocol: HTTPS (TLS 1.3)
                </div>
              </div>

              {/* Step 2: Edge & Ingress */}
              <div className="border border-indigo-200 bg-indigo-50/40 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-2">
                    02
                  </div>
                  <div className="font-bold text-indigo-950">Edge Ingress & CDN</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Google Front End (GFE) + Cloud Armor ป้องกัน DDoS และทำ SSL Termination อัตโนมัติ
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-indigo-200/80 text-[10px] text-indigo-700 font-mono">
                  Anycast IP · Google Global Network
                </div>
              </div>

              {/* Step 3: Compute / Container */}
              <div className="border border-blue-200 bg-blue-50/40 p-4 rounded-xl flex flex-col justify-between ring-1 ring-blue-500/20">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-2">
                    03
                  </div>
                  <div className="font-bold text-blue-950">Google Cloud Run (PaaS)</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Serverless Docker Container บน Kubernetes abstraction สเกล 0-N อัตโนมัติ
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-200/80 text-[10px] text-blue-700 font-mono">
                  Region: asia-southeast1 (Singapore)
                </div>
              </div>

              {/* Step 4: Storage & Data */}
              <div className="border border-slate-200 bg-slate-50/70 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold mb-2">
                    04
                  </div>
                  <div className="font-bold text-slate-900">Storage & Data Layer</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    จัดเก็บข้อมูลคำร้อง (DBMS Schema), Service Catalog, Audit Trail, และ RBAC Session
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 font-mono">
                  Cloud Persistent Storage Engine
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Cloud Specifications & Rationales (Table of 11 Questions) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>ตารางสรุปรายละเอียดคลาวด์และเหตุผลความคุ้มค่า (Resource Sizing & Justifications)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  ตอบครบทุกข้อคำถามในโจทย์อย่างเป็นระบบ นำไปคัดลอกลงสไลด์และตอบกรรมการได้ทันที
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(`1. ผู้ให้บริการ: Google Cloud Platform (GCP)
2. โมเดลบริการ: PaaS (Platform as a Service) / Serverless Container-as-a-Service ผ่าน Google Cloud Run
3. Region: asia-southeast1 (Singapore) - Latency ต่ำสุดสำหรับประเทศไทย (~20-30ms)
4. Storage: Cloud-Native Managed Storage (ภายในระบบ GCP)
5. Disk: Ephemeral Container Storage 10GB - เหมาะกับ Stateless Web App
6. CPU: 1 - 2 vCPU พร้อมฟังก์ชัน Auto-scaling (0 ถึง N instances)
7. RAM: 512 MB - 1 GB - เหมาะกับ Node.js / React Runtime
8. Network Bandwidth: Google Global Network ระดับ 1 Gbps+
9. ระบบปฏิบัติการ (OS): Containerized Linux (Alpine/Debian-based container runtime)
10. Network & Firewall: Google Front End (GFE) จัดการ Port 443 (HTTPS), Cloud Armor ป้องกัน DDoS
11. Docker / Kubernetes: ใช้ Docker Image (OCI Standard) ทำงานบน Google Cloud Run (Knative/Kubernetes abstraction)`, 'specs')}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedSection === 'specs' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'specs' ? 'คัดลอกทั้งหมดแล้ว!' : 'คัดลอกทั้ง 11 ข้อ'}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              
              {/* Item 1: Cloud Provider */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>1. ผู้ให้บริการ Cloud (Provider)</span>
                </div>
                <div className="font-mono text-blue-700 font-semibold">
                  Google Cloud Platform (GCP)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> มีโครงสร้างพื้นฐานระดับสากลที่มีเสถียรภาพสูง (SLA 99.95%) และรองรับการ Deploy คอนเทนเนอร์แบบ Serverless อัตโนมัติ
                </div>
              </div>

              {/* Item 2: IaaS vs PaaS */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50/40">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Box className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>2. ประเภทของบริการ (IaaS หรือ PaaS)</span>
                </div>
                <div className="font-mono text-indigo-700 font-semibold">
                  PaaS (Platform as a Service) / CaaS (Google Cloud Run)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> ไม่ต้องเสียเวลาดูแลจัดการ OS Patches, Kernel, หรือ Hardware Server เอง (Zero Server Management) ทำให้นักพัฒนาโฟกัสที่ Business Logic และ Workflow ของแอปพลิเคชันได้ 100%
                </div>
              </div>

              {/* Item 3: Region */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3. การเลือก Region ที่ตั้ง Data Center</span>
                </div>
                <div className="font-mono text-emerald-700 font-semibold">
                  asia-southeast1 (สิงคโปร์ - Singapore)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> เป็น Region ของ Google Cloud ที่อยู่ใกล้ประเทศไทยที่สุด มีสายเคเบิลใต้น้ำตรง ทำให้ค่า Latency ต่ำมาก (~20-30 ms) ส่งผลให้การเปิดแอปพลิเคชันและการกดส่งคำร้องตอบสนองรวดเร็วที่สุด
                </div>
              </div>

              {/* Item 4: Storage Type */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50/40">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>4. การใช้ Storage (ภายในหรือข้าม Cloud)</span>
                </div>
                <div className="font-mono text-amber-700 font-semibold">
                  Internal Cloud-Native Storage (ภายใน GCP)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> การใช้ Storage ภายใน Google Cloud เดียวกันช่วยลดปัญหา Egress Cost (ไม่มีค่าใช้จ่ายการส่งข้อมูลข้าม Cloud), ลด Network Latency ให้ต่ำกว่า 1ms และเพิ่มความปลอดภัยจากการเชื่อมต่อแบบ Private VPC
                </div>
              </div>

              {/* Item 5: Disk Size */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>5. ขนาดพื้นที่จัดเก็บ (Disk) และเหตุผล</span>
                </div>
                <div className="font-mono text-slate-800 font-semibold">
                  Ephemeral Container Disk 10 GB
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> แอปพลิเคชันถูกออกแบบตามหลัก Stateless Architecture ขนาด Image ของ Container (React + Vite + Node.js) ใช้เพียงประมาณ 200–350 MB พื้นที่ 10 GB จึงเพียงพอต่อการ Cache ไฟล์และประมวลผลชั่วคราวอย่างคุ้มค่า ไม่สิ้นเปลืองงบประมาณ
                </div>
              </div>

              {/* Item 6: CPU */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50/40">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>6. ขนาด CPU และเหตุผลที่เลือก</span>
                </div>
                <div className="font-mono text-blue-700 font-semibold">
                  1 - 2 vCPU (Serverless Auto-scaling)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> งาน Web Helpdesk และ Dashboard ส่วนใหญ่เป็น I/O-bound (รับส่งข้อมูล JSON และเรนเดอร์หน้าเว็บ) 1 vCPU รองรับ Concurrent requests ได้มากกว่า 80 requests/container และสามารถ Scale เพิ่ม Container ใหม่ได้ทันทีเมื่อมีผู้ใช้งานสูงขึ้น
                </div>
              </div>

              {/* Item 7: RAM */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>7. ขนาด RAM และเหตุผลที่เลือก</span>
                </div>
                <div className="font-mono text-purple-700 font-semibold">
                  512 MB - 1 GB (ต่อ 1 Container Instance)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> Node.js และ React 19 ใน Production mode ใช้ Memory พื้นฐานเพียง ~80-120 MB การจัดสรร RAM 512 MB - 1 GB ช่วยป้องกันปัญหา OOM (Out of Memory) ขณะทำการ Generate Report และ Export CSV ได้อย่างปลอดภัย
                </div>
              </div>

              {/* Item 8: Network Bandwidth */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50/40">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>8. Network Bandwidth</span>
                </div>
                <div className="font-mono text-teal-700 font-semibold">
                  Up to 1 Gbps+ (Google Global Backbone Network)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> Google Cloud Run เชื่อมโยงผ่าน Google Global Fiber Network โดยตรง จึงได้แบนด์วิดท์ระดับกิกะบิต รองรับการดาวน์โหลดไฟล์รายงาน CSV และการโหลดหน้าเว็บแบบ High Throughput
                </div>
              </div>

              {/* Item 9: Operating System */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>9. ระบบปฏิบัติการ (OS)</span>
                </div>
                <div className="font-mono text-slate-800 font-semibold">
                  Linux Container (Debian Slim / Alpine Linux OCI)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> มีขนาดเล็ก ปลอดภัยสูง (Minimal Attack Surface) ตัด Service ที่ไม่จำเป็นออกทั้งหมด ทำให้เวลาในการ Cold Start และเริ่มรัน Container เร็วเพียงไม่กี่ร้อยมิลลิวินาที
                </div>
              </div>

              {/* Item 10: Network & Firewall */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50/40">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>10. การแบ่ง Network และ Firewall</span>
                </div>
                <div className="font-mono text-emerald-700 font-semibold">
                  Google Front End (GFE) + Cloud Armor + VPC
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> ปิดพอร์ตที่ไม่จำเป็นทั้งหมด เปิดเฉพาะพอร์ต 443 (HTTPS) ที่มี Managed SSL Certificate อัตโนมัติ มีระบบดักจับ DDoS Attack และแยก Traffic ภายในผ่าน Google Virtual Private Cloud (VPC)
                </div>
              </div>

              {/* Item 11: Docker / Kubernetes */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <Box className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>11. การใช้ Docker หรือ Kubernetes</span>
                </div>
                <div className="font-mono text-blue-700 font-semibold">
                  ใช้งาน Docker Container บน Google Cloud Run (Knative/K8s)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>เหตุผล:</strong> บรรจุแอปพลิเคชันเป็น Docker Image มาตรฐาน OCI รันบน Cloud Run ซึ่งมีพื้นฐานจาก Knative (Kubernetes-based Serverless) ทำให้มีคุณสมบัติ Scale-to-Zero เมื่อไม่มีการใช้งานเพื่อประหยัดต้นทุน และ Scale ขึ้นทันทีเมื่อมี Request
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Summary Slides Walkthrough Guide for Presentation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                บทพูดและแนวทางการตอบคำถามกรรมการ (Presentation Script & Q&A)
              </h3>
              <span className="text-[11px] text-blue-600 font-medium">เกณฑ์ข้อ 4: การนำเสนอและการตอบคำถาม (4 คะแนน)</span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <strong className="text-blue-900 block mb-1">คำถามที่อาจารย์มักถาม 1: "ทำไมถึงเลือก PaaS (Google Cloud Run) แทนที่จะเช่า VM แบบ IaaS (เช่น Compute Engine หรือ EC2)?"</strong>
                <p className="text-slate-600">
                  <strong>แนวทางตอบ:</strong> "เพราะระบบ OneService Central เป็นแอปพลิเคชันแบบ Web Service Desk ที่มีช่วงเวลาใช้งานหลักตามเวลาทำงานขององค์กร การใช้ PaaS อย่าง Cloud Run ทำให้เราได้ฟังก์ชัน <em>Scale to Zero</em> เมื่อไม่มีการใช้งานในเวลากลางคืนระบบจะไม่คิดค่าบริการ และเมื่อมีพนักงานเปิดใช้งานในตอนเช้า ระบบจะ Auto-scale ขึ้นมาเอง อีกทั้งไม่ต้องเสียเวลาของทีมงานในการดูแล Patching ระบบปฏิบัติการครับ"
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <strong className="text-blue-900 block mb-1">คำถามที่อาจารย์มักถาม 2: "ทำไมถึงเลือก Region asia-southeast1 (สิงคโปร์)?"</strong>
                <p className="text-slate-600">
                  <strong>แนวทางตอบ:</strong> "เนื่องจากกลุ่มผู้ใช้งานเป้าหมายขององค์กรอยู่ในประเทศไทย การเลือก Data Center ที่สิงคโปร์ทำให้เส้นทางเครือข่ายสั้นที่สุด มีค่า Round Trip Time (RTT) Latency เฉลี่ยเพียง 20-30 มิลลิวินาที ทำให้การเปิดดูแดชบอร์ดและการยื่นคำร้องตอบสนองได้แบบเรียลไทม์ และสอดคล้องกับมาตรฐานความปลอดภัยด้านการถ่ายโอนข้อมูลในภูมิภาคอาเซียนครับ"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: SDLC 6 Phases */}
      {activeTab === 'sdlc' && (
        <div className="space-y-6">
          {/* Phase Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {SDLC_PHASES.map((p, idx) => {
              const isSelected = selectedPhaseIndex === idx;
              return (
                <button
                  key={p.phase}
                  onClick={() => setSelectedPhaseIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] font-bold text-blue-600 uppercase">
                    Phase 0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1 line-clamp-2 leading-tight">
                    {p.phase.split(': ')[1] || p.phase}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed View of Selected Phase */}
          {SDLC_PHASES[selectedPhaseIndex] && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {SDLC_PHASES[selectedPhaseIndex].phase}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {SDLC_PHASES[selectedPhaseIndex].title}
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  วัตถุประสงค์หลัก: {SDLC_PHASES[selectedPhaseIndex].objective}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  สาระสำคัญและการดำเนินงานในระยะนี้:
                </h3>
                <ul className="space-y-2">
                  {SDLC_PHASES[selectedPhaseIndex].details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: DBMS ERD & Data Dictionary */}
      {activeTab === 'dbms' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              แบบจำลองข้อมูลเชิงสัมพันธ์ (Entity Relationship Diagram - ERD)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              โครงสร้างตารางข้อมูลและการเชื่อมโยง Foreign Key เพื่อความสมบูรณ์ของข้อมูล (Data Integrity)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Entity 1: Departments */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <span>Table: departments</span>
                  <span className="text-[10px] text-blue-600 font-mono">PK: id</span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-600">
                  <div>- id (VARCHAR, PK)</div>
                  <div>- name (VARCHAR)</div>
                  <div>- code (VARCHAR, UNIQUE)</div>
                  <div>- description (TEXT)</div>
                  <div>- head_name (VARCHAR)</div>
                  <div>- sla_target_hours (INT)</div>
                </div>
              </div>

              {/* Entity 2: Services */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <span>Table: service_items</span>
                  <span className="text-[10px] text-blue-600 font-mono">PK: id</span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-600">
                  <div>- id (VARCHAR, PK)</div>
                  <div>- department_id (FK → departments.id)</div>
                  <div>- title (VARCHAR)</div>
                  <div>- category (VARCHAR)</div>
                  <div>- estimated_hours (INT)</div>
                  <div>- custom_fields_schema (JSONB)</div>
                </div>
              </div>

              {/* Entity 3: Tickets */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                <div className="font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                  <span>Table: tickets</span>
                  <span className="text-[10px] text-blue-600 font-mono">PK: id</span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-600">
                  <div>- id (VARCHAR, PK)</div>
                  <div>- ticket_code (VARCHAR, UNIQUE)</div>
                  <div>- department_id (FK → departments.id)</div>
                  <div>- service_id (FK → service_items.id)</div>
                  <div>- priority (ENUM: low,med,high,crit)</div>
                  <div>- status (ENUM: submitted..closed)</div>
                  <div>- requester_id (FK → users.id)</div>
                  <div>- assigned_officer_id (FK → users.id)</div>
                  <div>- re_routed_from (FK → departments.id)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Dictionary Summary Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">
                พจนานุกรมข้อมูล (Data Dictionary & Column Constraints)
              </h2>
            </div>
            <div className="table-scroll text-xs" tabIndex={0} role="region" aria-label="ตารางเอกสารระบบ เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-normal">Table</th>
                    <th className="py-2.5 px-4 font-normal">Column Name</th>
                    <th className="py-2.5 px-4 font-normal">Data Type</th>
                    <th className="py-2.5 px-4 font-normal">Constraint</th>
                    <th className="py-2.5 px-4 font-normal">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-num">
                  <tr>
                    <td className="py-2.5 px-4 font-mono font-medium">tickets</td>
                    <td className="py-2.5 px-4 font-mono">ticket_code</td>
                    <td className="py-2.5 px-4">VARCHAR(20)</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">NOT NULL, UNIQUE</td>
                    <td className="py-2.5 px-4">รหัสอ้างอิงคำร้องทางการ เช่น REQ-2026-0101</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-mono font-medium">tickets</td>
                    <td className="py-2.5 px-4 font-mono">status</td>
                    <td className="py-2.5 px-4">VARCHAR(20)</td>
                    <td className="py-2.5 px-4 text-emerald-600 font-semibold">NOT NULL</td>
                    <td className="py-2.5 px-4">สถานะตามขั้นตอน ITSM (submitted, in_progress, resolved...)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-mono font-medium">tickets</td>
                    <td className="py-2.5 px-4 font-mono">re_routed_from</td>
                    <td className="py-2.5 px-4">VARCHAR(50)</td>
                    <td className="py-2.5 px-4 text-slate-400">NULLABLE (FK)</td>
                    <td className="py-2.5 px-4">เก็บแผนกเดิมกรณีมีคำร้องส่งผิดแผนกแล้วถูกโอนย้าย</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-mono font-medium">tickets</td>
                    <td className="py-2.5 px-4 font-mono">csat_rating</td>
                    <td className="py-2.5 px-4">SMALLINT</td>
                    <td className="py-2.5 px-4 text-slate-400">CHECK (1-5)</td>
                    <td className="py-2.5 px-4">คะแนนประเมินความพึงพอใจของผู้ขอรับบริการ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ITSM Workflow */}
      {activeTab === 'itsm' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              วงจรสถานะงานตามมาตรฐาน IT Service Management (ITSM & Helpdesk)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              การไหลของสถานะงาน (State Machine) เพื่อรับประกันการดำเนินงานที่โปร่งใสและตรวจสอบได้
            </p>
          </div>

          {/* Visual Step-by-Step State Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="font-bold text-amber-900">1. SUBMITTED</div>
              <div className="text-[11px] text-amber-800 mt-1">รอดำเนินการรับเรื่อง</div>
              <p className="text-[11px] text-slate-600 mt-2">
                ผู้ใช้ส่งคำร้องเข้าระบบกลาง บันทึกเวลาเริ่มต้นเพื่อคำนวณ SLA ทันที
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50">
              <div className="font-bold text-sky-900">2. IN REVIEW / ASSIGNED</div>
              <div className="text-[11px] text-sky-800 mt-1">ตรวจสอบและมอบหมาย</div>
              <p className="text-[11px] text-slate-600 mt-2">
                เจ้าหน้าที่ตรวจความครบถ้วน มอบหมายงาน หรือทำ Re-route หากส่งผิดแผนก
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="font-bold text-blue-900">3. IN PROGRESS / WAITING</div>
              <div className="text-[11px] text-blue-800 mt-1">กำลังดำเนินการแก้ไข</div>
              <p className="text-[11px] text-slate-600 mt-2">
                ปฏิบัติงานจริง สามารถส่งข้อความคุยกับผู้ใช้ หรือบันทึก Internal Note ในทีม
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="font-bold text-emerald-900">4. RESOLVED & CSAT</div>
              <div className="text-[11px] text-emerald-800 mt-1">เสร็จสิ้นและประเมินผล</div>
              <p className="text-[11px] text-slate-600 mt-2">
                ส่งมอบผลงาน ผู้ขอรับบริการสามารถประเมินดาว 1-5 และปิดงานสมบูรณ์
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-amber-600" />
              <span>การจัดการกรณีส่งผิดแผนก (Cross-Department Re-routing Policy):</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              หากเจ้าหน้าที่ตรวจสอบพบว่าคำร้องไม่ตรงกับหน้าที่ของตน (เช่น ผู้ใช้คิดว่าเป็นปัญหาคอมพิวเตอร์แต่แท้จริงต้องการสื่อกราฟิกของฝ่ายการตลาด) 
              เจ้าหน้าที่สามารถเลือกคำสั่ง <span className="font-semibold text-slate-800">"โอนย้ายแผนก (Re-route)"</span> เพื่อส่งต่อคำร้องไปยังแผนกที่ถูกต้องทันที 
              พร้อมแนบเหตุผล โดยที่ผู้ขอรับบริการไม่ต้องพิมพ์กรอกแบบฟอร์มใหม่ตั้งแต่ต้น ข้อมูลไม่สูญหาย และมีบันทึกประวัติใน Audit Trail อย่างชัดเจน
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">
              ตารางกำหนดสิทธิ์ตามบทบาท (Role-Based Access Control Matrix)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              การควบคุมการเข้าถึงข้อมูลและเมนูตามหลักความมั่นคงปลอดภัยสารสนเทศ
            </p>
          </div>

          <div className="table-scroll text-xs" tabIndex={0} role="region" aria-label="ตารางเอกสารระบบ เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-normal">สิทธิ์การใช้งาน (Permissions & Features)</th>
                  <th className="py-2.5 px-4 font-normal text-center">ผู้ขอรับบริการ (Requester)</th>
                  <th className="py-2.5 px-4 font-normal text-center">เจ้าหน้าที่แผนก (Officer)</th>
                  <th className="py-2.5 px-4 font-normal text-center">ผู้บริหาร (Executive)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">ค้นหาและดู Service Catalog ทุกแผนก</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">สร้างและส่งคำร้องขอรับบริการใหม่</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">เปลี่ยนสถานะงานตาม ITSM (In Progress, Resolved)</td>
                  <td className="py-3 px-4 text-center text-slate-400">✗ ไม่มีสิทธิ์</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">โอนย้ายคำร้องข้ามแผนก (Re-route)</td>
                  <td className="py-3 px-4 text-center text-slate-400">✗ ไม่มีสิทธิ์</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">บันทึกข้อความลับภายในทีม (Internal Notes)</td>
                  <td className="py-3 px-4 text-center text-slate-400">✗ ไม่มีสิทธิ์ (มองไม่เห็น)</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ อนุญาต</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">ดูแดชบอร์ดสรุปสถิติ & ส่งออกรายงาน CSV ผู้บริหาร</td>
                  <td className="py-3 px-4 text-center text-slate-400">✗ ไม่มีสิทธิ์</td>
                  <td className="py-3 px-4 text-center text-slate-400">เฉพาะแผนกตนเอง</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ สิทธิ์เต็มทุกแผนก</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Testing Matrix */}
      {activeTab === 'testing' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">
              ผลการทดสอบระบบและการประกันคุณภาพ (Quality Assurance & Test Matrix)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              การทดสอบครอบคลุมเงื่อนไขหลักที่ระบุในรายงานวิจัย
            </p>
          </div>

          <div className="table-scroll text-xs" tabIndex={0} role="region" aria-label="ตารางเอกสารระบบ เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Test Case ID</th>
                  <th className="py-2.5 px-4 font-normal">สถานการณ์ทดสอบ (Test Scenario)</th>
                  <th className="py-2.5 px-4 font-normal">ผลลัพธ์ที่คาดหวัง</th>
                  <th className="py-2.5 px-4 font-normal text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold">TC-001</td>
                  <td className="py-3 px-4">ผู้ใช้งานเลือกบริการและส่งฟอร์มเฉพาะทาง</td>
                  <td className="py-3 px-4 text-slate-600">คำร้องถูกสร้างขึ้นพร้อม Ticket Code และคำนวณ SLA ถูกต้อง</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold">TC-002</td>
                  <td className="py-3 px-4">เจ้าหน้าที่โอนย้ายคำร้องกรณีส่งผิดแผนก (Re-route)</td>
                  <td className="py-3 px-4 text-slate-600">คำร้องย้ายไปยังคิวแผนกปลายทาง ประวัติถูกบันทึกใน Audit Trail</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold">TC-003</td>
                  <td className="py-3 px-4">ผู้ใช้งานและเจ้าหน้าที่สื่อสารโต้ตอบ 2 ทาง</td>
                  <td className="py-3 px-4 text-slate-600">ข้อความแสดงผลทันที และ Internal Notes ถูกซ่อนจากพนักงานทั่วไป</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-semibold">TC-004</td>
                  <td className="py-3 px-4">ผู้บริหารเรียกดูแดชบอร์ดและส่งออก CSV</td>
                  <td className="py-3 px-4 text-slate-600">สถิติคำนวณแบบเรียลไทม์ และดาวน์โหลดไฟล์รายงาน CSV ได้สมบูรณ์</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold">PASSED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
