# Cloud options research for OneService Central

Checked: 2026-10-28 (Asia/Bangkok). Scope: official provider documentation only. These are proposed designs, not a record of provisioned resources. User clarified that this is free-only coursework, not production, and prefers Supabase. Course-PDF interpretation and the main implementation plan are handled separately.

## Current recommendation: Supabase Free + Cloudflare Pages Free

Use Supabase PostgreSQL as the shared data store, Supabase Auth for real users, and private Supabase Storage for attachment bytes. Publish the built React/Vite frontend on Cloudflare Pages Free. Treat this as a BaaS/PaaS coursework architecture rather than a student-managed VM. This choice follows the user's free-only constraint; the earlier paid GCP candidates below are not selected.

### Confirmed free allowances and operational limits

| Resource | Current official allowance |
|---|---|
| Supabase database | 500 MB database size |
| Compute | Nano, shared CPU, up to 0.5 GB RAM; no stated dedicated vCPU entitlement |
| Supabase file storage | 1 GB |
| Supabase egress | 5 GB egress and a separate 5 GB cached egress allowance |
| Authentication | 50,000 monthly active users |
| Projects | Limit of 2 active Free projects |
| Idle projects | Paused after one week of inactivity |

Sources: [Supabase pricing](https://supabase.com/pricing), [Compute and Disk](https://supabase.com/docs/guides/platform/compute-and-disk). These are published plan allowances at the check date, not a promise that quotas or terms remain unchanged. Check the account Usage page and plan before deployment. Cached and uncached egress are separate allowances, not one interchangeable 10 GB pool.

Choose the **specific** Singapore region `ap-southeast-1` if available during project creation. Supabase lists this as an AWS region. Its APAC general-region option is a separate placement choice; do not present an automatically selected general region as a user-confirmed exact region. Source: [Available regions](https://supabase.com/docs/guides/platform/regions).

### Fit to this application

Move shared users, roles, departments, services, tickets, comments, activity history, CSAT, and attachment metadata into PostgreSQL. Keep actual PDF/image bytes in Storage. Keep LocalStorage for optional UI preferences, not shared records or authorization. The relational fit is an architectural inference from the app's entity relationships.

Enable RLS for exposed tables. In particular, the frontend role-switching control must not grant database permissions; role membership must be trusted data and verified by policies/functions. Use a browser-safe publishable/anon key with properly tested policies; never include a secret/service-role key in Vite frontend variables. Sources: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

Use a private attachment bucket. Grant access through policies linked to the associated ticket; downloads can use authenticated access or short-lived signed URLs. Keep the frontend build in Cloudflare Pages rather than using the attachment bucket as a frontend hosting substitute. Source for private serving mechanisms: [Serving assets](https://supabase.com/docs/guides/storage/serving/downloads).

Proposed coursework limits, not provider quotas: accept PNG/JPEG/PDF files up to 2 MB per file and up to 5 files per ticket. An illustrative storage estimate is 100 files × 2 MB = 200 MB; this is a planning example, not actual stored data. These application design choices align with the main plan and leave free-tier headroom; they are not existing behavior.

Cloudflare Pages Free currently allows 500 builds/month, up to 20,000 files/site and 25 MiB per site asset. The intended deployment is static `dist/` output; Functions have separate Workers quotas and are not necessary for this candidate design. Source: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

### Free backup and presentation readiness

Automatic daily backups are documented for Pro/Team/Enterprise. For Free, Supabase recommends regular CLI `db dump` exports and off-site backups. Database backups do not include file bytes stored through the Storage API, so download/export those separately and test restore. Source: [Database Backups](https://supabase.com/docs/guides/platform/backups).

Before presentation, verify the project is active and restore it through the Dashboard if paused. Confirm login, a second-device read, a forbidden-role read, attachment download and an Internet-accessible frontend URL. Use small synthetic data and local/off-site backup copies. Do not depend on a paid add-on, custom paid domain, paid upgrade, or large file storage to meet the course requirements.

Unresolved academic issue: if the instructor explicitly requires a deployed IaaS VM or Kubernetes cluster, this managed free design does not demonstrate that requirement by itself. The course rubric/teacher must resolve it; do not claim that using Supabase proves student-managed CPU/disk/network/Kubernetes work.

## Earlier GCP research: not selected under the free-only constraint

### Comparison retained for context

| Candidate | Appropriate use | Tradeoff |
|---|---|---|
| Google Compute Engine VM + Docker Compose + PostgreSQL + Cloud Storage | Course project emphasizing VM sizing, Linux, disk, Docker, firewall, and backups | Student maintains OS/database/security; one VM is a single point of failure |
| Cloud Run + Cloud SQL PostgreSQL + Cloud Storage | Managed deployment with less host administration; relational database and separated storage | More services and independently billed resources; database cost remains even when app traffic is low |
| Firebase Auth + Firestore + Cloud Storage | Faster managed application path if document data and direct SDK access fit the assignment | Requires document schema/security-rule design; less direct evidence of VM/Linux/block-storage skills |

The educational-fit judgments above are engineering inferences, not provider guarantees. The choice still depends on the course requirements, remaining time, budget/credits, and whether Docker/Kubernetes is mandatory.

Cloud Run provides a fully managed application platform; deployment can use container images or source builds. Source: [What is Cloud Run](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run).

Firestore stores documents in collections, rather than SQL tables. Source: [Firestore data model](https://firebase.google.com/docs/firestore/data-model).

## Region and machine selection

For an E2-based VM proposal, Singapore `asia-southeast1` is defensible because the official Compute Engine availability table lists E2 there. Bangkok `asia-southeast3` exists, but its current table lists N4/C4/C3D/M-series and does not list E2. Do not describe Singapore as the closest Google region to Thailand or claim a measured latency without testing. Source: [Compute Engine regions and zones](https://docs.cloud.google.com/compute/docs/regions-zones).

| VM | Exposed vCPUs | Sustained shared-core baseline | Default memory | Published maximum egress |
|---|---:|---:|---:|---:|
| e2-small | 2 | 0.5 vCPU total | 2 GB | Up to 1 Gbps |
| e2-medium | 2 | 1 vCPU total | 4 GB | Up to 2 Gbps |

These are shared-core types; "2 vCPU" is not equivalent to two dedicated cores. Maximum network throughput is not a reserved/guaranteed Internet bandwidth. E2 supports zonal `pd-standard`, `pd-balanced`, and `pd-ssd`. Source: [E2 machine specifications](https://docs.cloud.google.com/compute/docs/general-purpose-machines#e2_shared-core).

Sizing proposal (inference): e2-medium gives a small Dockerized web/API/PostgreSQL demo more memory headroom than e2-small. Build application images before deployment to avoid building on a small VM. Choose the smaller candidate only after verifying memory usage and concurrent demo load. No fixed concurrency or throughput claims are established by these docs.

## Storage design

Use PostgreSQL for users, departments, services, tickets, comments, activities, role membership, and attachment metadata. Use a persistent VM disk or managed Cloud SQL storage for database files. Keep uploaded attachment bytes in object storage; do not use browser LocalStorage as the shared system of record.

On a VM, a Docker volume persists only as well as its underlying host disk. A candidate layout is a boot disk for OS/images and a separate data disk mounted for PostgreSQL. Separate placement helps manage database lifecycle but does not itself provide backup or high availability. A small project may instead use one persistent disk if simplicity/cost is decisive; document that tradeoff.

`pd-balanced` is SSD-based, with a cost/performance position between standard and performance SSD Persistent Disk. Disk type and size need to be selected jointly with VM support and workload. Source: [Persistent Disk](https://docs.cloud.google.com/compute/docs/disks/persistent-disks).

For frequently accessed demo attachments, Cloud Storage Standard avoids retrieval fees and minimum-storage-duration commitments that apply to colder classes. A project-specific attachment quota such as 5 GB is an application/budget planning limit, not a preallocated bucket disk size. Source: [Storage classes](https://docs.cloud.google.com/storage/docs/storage-classes).

Use a private attachment bucket with uniform bucket-level IAM and public access prevention. The API authorizes access to each ticket before granting attachment access. Sources: [Uniform bucket-level access](https://docs.cloud.google.com/storage/docs/uniform-bucket-level-access), [Public access prevention](https://docs.cloud.google.com/storage/docs/public-access-prevention).

Short-lived signed download/upload URLs are an option. Anyone holding an active signed URL can use its granted action, so expiration and scope matter. Source: [Signed URLs](https://docs.cloud.google.com/storage/docs/access-control/signed-urls).

Keep database backups separately from active attachments, ideally in a separate private bucket/prefix and permission boundary. Lifecycle rules can automate retention/deletion once the retention policy is decided. Test restoring a backup rather than only demonstrating successful upload. Source for lifecycle capability: [Object Lifecycle Management](https://docs.cloud.google.com/storage/docs/lifecycle).

## Managed SQL cost considerations

Cloud SQL machine series and storage support vary by edition/region. Shared-core PostgreSQL tiers are intended for test/development and excluded from Cloud SQL SLA; they are not a production availability claim. CPU/memory and allocated storage affect cost. Source: [Cloud SQL instance settings](https://docs.cloud.google.com/sql/docs/postgres/instance-settings).

The Cloud Run + SQL option requires a regional calculator estimate covering both services plus storage, backups and network; do not call it free because the frontend is small. Likewise, a single VM estimate must include VM runtime, persistent disks, public IP where applicable, snapshots, object storage and egress. No monthly currency total was asserted in this research.

## Budget controls

Alerts-only Cloud Billing budgets notify; they do not automatically stop spending. Current documentation also describes service-dependent spend-cap budgets, whose availability must be checked before relying on them. Source: [Budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets).

Proposed controls (not deployed): agree a monthly ceiling, alert thresholds, limited attachment size/count, log rotation, capped retention, and an end-of-course cleanup schedule. Obtain the approved budget and deployment route before provisioning resources.

## Verification performed

- Opened official Compute Engine machine/region/disk documentation.
- Checked Cloud Storage classes, IAM access model, signed URL behavior and lifecycle documentation.
- Checked Cloud SQL instance-setting and billing-budget documentation.
- Compared the options as candidate architecture, without provisioning cloud resources or modifying application source.
