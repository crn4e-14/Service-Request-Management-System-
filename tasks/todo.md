# งานตามแผน Cloud/Storage ฟรีของ OneService Central

สถานะ: เสนอแผน ยังไม่เริ่ม implementation; ค่าใช้จ่ายเป้าหมาย $0 ภายใต้ Free plan
อ่านเหตุผล สถาปัตยกรรม และแหล่งข้อมูลใน `tasks/plan.md`

## Task 1 — กำหนดโปรเจกต์และข้อมูล Demo

- [ ] ตรวจบัญชี Supabase ว่าใช้ Free และสร้าง/เลือกโปรเจกต์ใน specific Region Singapore `ap-southeast-1` ที่ว่างได้จริง
- [ ] กำหนดบัญชี requester/officer/executive และชุดข้อมูลสมมติ; ยืนยันขอบเขต officer/executive
- [ ] บันทึก URL, quota และวิธีเก็บ publishable key โดยไม่บันทึก secret ใน source

**Acceptance:** มีโปรเจกต์ Free และหลักฐาน Region/โควตาจริง หรือแจ้งข้อจำกัดก่อนเปลี่ยนแผน ไม่เปิด paid add-on
**Verification:** ตรวจ Dashboard และตรวจไฟล์ที่จะส่งไม่มี secrets
**Dependencies:** ผู้ใช้สั่งให้เริ่มทำและมีบัญชี/สิทธิ์เข้าถึง
**Files likely touched:** `.env.example`, `docs/cloud-setup.md` (ใหม่), `.gitignore` เฉพาะส่วนที่จำเป็น

## Task 2 — Login และ profile ที่เพิ่มสิทธิ์ตัวเองไม่ได้

- [ ] เพิ่ม Supabase client และ Login/logout/session สำหรับบัญชี Demo
- [ ] สร้าง profiles กับ role/department ที่ผู้ใช้แก้เพิ่มสิทธิ์เองไม่ได้
- [ ] แยกบทบาทจริงออกจากปุ่มสลับบทบาทจำลองเดิม

**Acceptance:** Login แล้วได้ role จากข้อมูลที่เชื่อถือได้; แก้ LocalStorage หรือ payload แล้วเปลี่ยน role ไม่ได้
**Verification:** ทดสอบ login/logout และพยายามแก้ role ด้วยบัญชี requester
**Dependencies:** Task 1
**Files likely touched:** `package.json`, `package-lock.json`, `src/lib/supabase.ts` (ใหม่), `src/components/Login.tsx` (ใหม่), migration auth/profile; เชื่อม Context/Navbar เป็นงานย่อยถ้าเกิน 5 ไฟล์

## Task 3 — สร้างและอ่าน Ticket ร่วมกันได้

- [ ] สร้าง schema/migrations/seed สำหรับ departments/services/tickets พร้อม foreign keys และ unique ticket code
- [ ] เขียน grants/RLS ให้ requester เห็นเฉพาะคำร้องตนและ officer เห็นตามขอบเขต
- [ ] ย้าย create/list จาก LocalStorage ไป Supabase โดยรักษาหน้าตาที่มีอยู่

**Acceptance:** บัญชี A สร้างคำร้องและเห็นหลัง refresh; อีกอุปกรณ์บัญชีที่มีสิทธิ์เห็นข้อมูลเดียวกัน; บัญชีที่ไม่มีสิทธิ์เรียกตรงไม่ได้
**Verification:** ทดสอบ Data API/RLS ด้วยอย่างน้อย 2 requester และ 1 officer, `npm run lint`, `npm run build`
**Dependencies:** Task 2
**Files likely touched:** migration tickets, seed, `src/data/ticketRepository.ts` (ใหม่), `src/context/ServiceDeskContext.tsx`, `src/components/RequesterPortal/NewRequestModal.tsx`

### Checkpoint — ฐานข้อมูลร่วมพร้อมใช้

- [ ] เปิดคำร้องจากคนละเบราว์เซอร์ได้ตามสิทธิ์
- [ ] ไม่มีการใช้ LocalStorage เป็นแหล่งคำร้องหลักในโหมด cloud
- [ ] สิทธิ์ไม่อาศัยการซ่อนปุ่มบน UI

## Task 4 — สถานะ รับเคส และโอนย้ายพร้อมประวัติ

- [ ] เพิ่ม transaction/functions/triggers สำหรับ assign/status/reroute และสร้าง activity จากผู้ใช้ที่ยืนยันตัวตน
- [ ] ปิดการเขียนฟิลด์สิทธิ์/ประวัติ/ผู้กระทำที่ไม่ควรเปลี่ยนจาก client โดยตรง
- [ ] เชื่อมคิวงานและรายละเอียดกับผลบันทึกจริง รวม error/loading ที่เกี่ยวข้อง

**Acceptance:** อัปเดตพร้อมประวัติครบใน transaction; officer นอกขอบเขตทำไม่ได้; โอนย้ายแล้วสิทธิ์ตามแผนกใหม่ถูกต้อง
**Verification:** ทดสอบ workflow สำเร็จ/ถูกปฏิเสธ และกรณีรับเคสพร้อมกัน ไม่บันทึกประวัติปลอม
**Dependencies:** Task 3
**Files likely touched:** migration workflow, ticketRepository, Context, `QueueOverview.tsx`, `TicketDetailView.tsx`

## Task 5 — ข้อความและ Internal Note

- [ ] แยก comments/activities เป็นตารางที่มี grants/RLS
- [ ] ส่งข้อความสาธารณะได้ตามสิทธิ์ และไม่ส่ง Internal Note มาถึง requester
- [ ] แสดงประวัติเรียงเวลาและผู้กระทำจากฐานข้อมูล

**Acceptance:** requester อ่าน Internal Note ผ่าน API ไม่ได้; officer ที่มีสิทธิ์อ่านได้; ผู้ใช้ปลอมชื่อผู้ส่งใน payload ไม่ได้
**Verification:** ทดสอบ API ทั้ง requester/officer และหน้ารายละเอียด, lint/build
**Dependencies:** Task 4
**Files likely touched:** migration comments, comment repository (ใหม่), Context, TicketDetailView, types

## Task 6 — ไฟล์แนบ private ใน Object Storage

- [ ] สร้าง private bucket และ metadata table พร้อม Storage policies ตาม Ticket
- [ ] เพิ่ม upload/download พร้อมข้อจำกัด PNG/JPEG/PDF 2 MB และจำนวนไฟล์ตามแผน
- [ ] จัดการกรณี upload สำเร็จแต่ metadata ล้มเหลว และการปฏิเสธไฟล์/ผู้ใช้ที่ไม่มีสิทธิ์

**Acceptance:** แนบไฟล์แล้วอีกอุปกรณ์ที่มีสิทธิ์เปิดได้; บุคคลอื่นเปิดไม่ได้; ไฟล์ใหญ่/ชนิดไม่อนุญาตถูกปฏิเสธ
**Verification:** ทดสอบข้ามบัญชี/ไฟล์เกินขนาด/การบันทึกล้มเหลว; ตรวจ quota; lint/build
**Dependencies:** Task 3 และ Task 5
**Files likely touched:** migration attachments/policies, `src/data/attachmentRepository.ts` (ใหม่), attachment component (ใหม่), TicketDetailView, types

### Checkpoint — Demo กระบวนการและ Storage

- [ ] Login → สร้างคำร้อง → แนบไฟล์ → รับเรื่อง → ข้อความ → เปลี่ยนสถานะทำได้จริง
- [ ] ไม่มี bucket public หรือ secret key ใน frontend

## Task 7 — CSAT และ Dashboard จากข้อมูลที่มีสิทธิ์

- [ ] ให้ requester ประเมินเฉพาะคำร้องตนที่เสร็จแล้ว
- [ ] Query/aggregate สถิติภายใต้ขอบเขตสิทธิ์ และคำนวณ MTTR จากเวลาจริง
- [ ] ตรวจ export CSV ตามข้อมูลที่บัญชีมีสิทธิ์เห็น

**Acceptance:** ตัวเลขตรงกับชุด Demo ที่นับตรวจเอง; ไม่มีข้อมูลแผนก/คำร้องที่ไม่ควรเห็นหลุดใน report
**Verification:** เทียบรายงานกับ query และทดสอบ requester ที่พยายามประเมินแทนผู้อื่น; lint/build
**Dependencies:** Tasks 4–5
**Files likely touched:** migration CSAT/report, report repository (ใหม่), Context, ExecutiveDashboard, TicketDetailView

## Task 8 — เผยแพร่ ตรวจระบบ และเตรียมส่งงาน

- [ ] ใช้ Cloudflare Pages Free: build `npm run build`, output `dist`, URL `pages.dev`; ตั้ง Supabase Auth URL ให้ตรงโดเมน
- [ ] ตรวจบนมือถือ/เดสก์ท็อปและเครือข่ายภายนอก รวมสถานะโปรเจกต์ที่อาจ pause
- [ ] export ฐานข้อมูลและไฟล์แยกกัน ทดลอง restore อย่างปลอดภัย แล้วบันทึกแผนภาพ/ภาพ Dashboard/README สำหรับสไลด์

**Acceptance:** URL เปิดผ่าน Internet ได้และ flow ข้ามบัญชีผ่าน; build/lint ผ่าน; มีหลักฐานกู้คืนและข้อมูลอ้างอิงสไลด์ตรงระบบที่ตั้งจริง
**Verification:** ตรวจ Browser console, responsive, Auth/RLS/Storage และไฟล์ส่งงานไม่มี secrets หรือข้อมูลจริง
**Dependencies:** Tasks 6–7
**Files likely touched:** README, `.env.example`, cloud-setup doc, เอกสารผลตรวจ/สไลด์; แก้ข้อความคลาวด์ใน SDLCExplorer ให้ตรงระบบจริงเป็นงานย่อยเฉพาะเมื่อเริ่ม implementation

### Checkpoint — พร้อมส่ง

- [ ] ผู้ใช้ตรวจรับผล Demo และไฟล์ส่งงาน
- [ ] ยืนยัน Free plan ทั้งสองบริการ ไม่มี paid add-on และไม่มีทรัพยากรเสียเงินที่สร้างเพื่อทดลองค้างไว้
- [ ] ตอบ CPU/Memory/Disk/Network/OS ได้ตรง Managed Platform ไม่ใส่ตัวเลข VM ที่ไม่ได้ใช้
