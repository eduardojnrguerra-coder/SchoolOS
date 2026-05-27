import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  Bus,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSignature,
  FileText,
  HeartHandshake,
  LockKeyhole,
  MessageCircleWarning,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  UsersRound,
  WalletCards,
  type LucideIcon
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pine X School OS | One Dashboard. One Parent App.",
  description:
    "Pine X School OS helps South African schools, ECD centres, aftercare teams, and transport operators manage daily school operations from one connected system.",
  openGraph: {
    title: "Pine X School OS",
    description: "One dashboard for the school. One app for every parent.",
    url: "/",
    type: "website"
  }
};

const problems = [
  { title: "WhatsApp groups everywhere", description: "Important updates are scattered across chats, screenshots, voice notes, and admin inboxes.", icon: MessageCircleWarning },
  { title: "Paper consent forms getting lost", description: "Outing slips and indemnities disappear between bags, cars, classrooms, and office trays.", icon: FileText },
  { title: "Payment proofs buried in messages", description: "Finance teams spend time matching EFT proofs instead of managing exceptions clearly.", icon: ReceiptText },
  { title: "Manual attendance follow-ups", description: "Absent and late learners turn into phone calls because the register is not connected to parent alerts.", icon: AlertTriangle },
  { title: "Parents asking the same questions", description: "Families want to know if their child is safe, present, collected, informed, and paid up.", icon: BellRing },
  { title: "Transport and aftercare updates scattered", description: "Route delays, pickup status, collectors, and aftercare notes need a traceable operating flow.", icon: Bus }
];

const modules = [
  { title: "Attendance alerts", icon: ClipboardCheck },
  { title: "Parent notices", icon: BellRing },
  { title: "Digital consent forms", icon: FileSignature },
  { title: "Fee tracking", icon: WalletCards },
  { title: "Proof of payment uploads", icon: ReceiptText },
  { title: "Documents and reports", icon: FileText },
  { title: "Transport updates", icon: Bus },
  { title: "Aftercare check-in/out", icon: HeartHandshake },
  { title: "Incident notes", icon: ShieldCheck }
];

const schoolPulse = [
  ["Today's School Pulse", "Live overview"],
  ["Learners present", "21 / 24"],
  ["Unsigned forms", "32 pending"],
  ["Outstanding fees", "R87,600"],
  ["Transport delays", "1 route"],
  ["Aftercare check-ins", "10 learners"]
];

const parentApp = [
  ["Child status", "Safe at school"],
  ["Urgent notices", "1 to read"],
  ["Forms to sign", "Zoo excursion"],
  ["Fee balance", "R3,500"],
  ["Transport timeline", "North Loop +8 min"],
  ["Documents", "2 new"]
];

const demoFlow = [
  "Teacher marks learner absent",
  "Parent receives alert",
  "Admin sends urgent notice",
  "Parent acknowledges notice",
  "Consent form is signed",
  "Proof of payment uploaded",
  "Transport route updated",
  "Aftercare pickup confirmed"
];

const customerTypes = [
  { title: "ECD centres", description: "Calm parent updates, forms, attendance, fee reminders, and document sharing without admin overload.", icon: HeartHandshake },
  { title: "Preschools", description: "A modern parent app experience for daily care, notices, documents, and consent workflows.", icon: Sparkles },
  { title: "Aftercare centres", description: "Check-in, check-out, collector notes, pickup confirmations, and parent reassurance in one flow.", icon: UserCheck },
  { title: "Small private schools", description: "A serious dashboard for attendance, finance, notices, incidents, analytics, and rollout readiness.", icon: UsersRound },
  { title: "School transport operators", description: "Routes, vehicles, drivers, delays, pickup/drop-off status, and parent-facing transport updates.", icon: Bus }
];

const trustItems = [
  "Built for South African school operations",
  "POPIA-conscious structure",
  "Role-based access planning",
  "Parent-friendly communication",
  "Configured around your school workflow",
  "Demo mode available for walkthroughs"
];

export default function HomePage() {
  return (
    <main className="landing-page overflow-hidden bg-[#f7f4ee] text-slate-950">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ProductSplitSection />
      <DemoFlowSection />
      <TargetCustomerSection />
      <TrustSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden px-4 py-5 md:px-8">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_18%_16%,rgba(45,212,191,0.22),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(242,201,76,0.22),transparent_28%),linear-gradient(180deg,#07111f_0%,#10243f_72%,#111c34_100%)]" />
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <BellRing className="absolute left-[6%] top-[18%] hidden h-5 w-5 text-white/10 animate-[deco-float_9s_ease-in-out_infinite] lg:block" />
        <ClipboardCheck className="absolute right-[7%] top-[20%] hidden h-6 w-6 text-emerald-100/15 animate-[deco-float_10s_ease-in-out_infinite_800ms] lg:block" />
        <Bus className="absolute left-[7%] bottom-[18%] hidden h-6 w-6 text-white/10 animate-[deco-float_11s_ease-in-out_infinite_1200ms] xl:block" />
        <ShieldCheck className="absolute right-[6%] bottom-[17%] hidden h-5 w-5 text-amber-100/15 animate-[deco-float_12s_ease-in-out_infinite_400ms] xl:block" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl">
        <nav className="relative z-50 landing-reveal flex items-center justify-between rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-pine-900">PX</span>
            Pine X School OS
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
            <a href="#problem" className="hover:text-white">Problem</a>
            <a href="#solution" className="hover:text-white">Solution</a>
            <a href="#demo-flow" className="hover:text-white">Demo flow</a>
            <a href="#trust" className="hover:text-white">Trust</a>
          </div>
          <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pine-900 transition hover:-translate-y-0.5 hover:bg-amber-100">
            Login
          </Link>
        </nav>

        <div className="grid min-h-[82vh] items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="landing-reveal relative z-20 max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Serious school operations, parent-friendly communication
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-7xl">
              One dashboard for the school. One app for every parent.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Pine X School OS helps schools, ECD centres, aftercare teams, and transport operators manage attendance, notices, fees, consent forms, documents, transport, and parent updates from one connected system.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo/school" className="rounded-full bg-amber-300 px-6 py-3 text-center text-sm font-bold text-pine-900 shadow-2xl shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200">
                View School Demo
              </Link>
              <Link href="/demo/parent" className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
                View Parent App
              </Link>
              <Link href="mailto:hello@pine-x.local?subject=Book%20a%20Pine%20X%20School%20OS%20demo" className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                Book a Demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/60">Demo mode opens instantly without Supabase. Real staff login remains available separately.</p>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="landing-reveal relative z-20 mx-auto w-full max-w-2xl lg:max-w-none">
      <div className="relative rounded-[2rem] border border-white/20 bg-white/90 p-3 shadow-[0_28px_90px_rgba(2,6,23,0.34)] backdrop-blur-xl">
        <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Live School Day Command Centre</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Hermanus Valley Academy</h2>
            </div>
            <span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">Demo data live</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ["Present", "21"],
              ["Absent", "2"],
              ["Forms", "32"],
              ["Fees", "R87k"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs text-white/45">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Today&apos;s School Pulse</p>
                <span className="rounded-full bg-pine-50 px-2.5 py-1 text-xs text-pine-800">Needs attention</span>
              </div>
              <div className="mt-4 grid gap-2">
                {[
                  ["Unconfirmed absence", "Parent action needed"],
                  ["Route delayed", "North Loop +8 min"],
                  ["Consent due", "Zoo Excursion"]
                ].map(([title, detail]) => (
                  <div key={title} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{title}</p>
                      <p className="text-xs text-slate-500">{detail}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

            <PhonePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="mx-auto w-full max-w-[260px] rounded-[2rem] border border-white/20 bg-slate-900 p-2 shadow-2xl">
      <div className="overflow-hidden rounded-[1.6rem] bg-slate-50 text-slate-950">
        <div className="flex items-center justify-between bg-slate-950 px-4 pb-3 pt-4 text-[11px] font-semibold text-white">
          <span>08:22</span>
          <span className="h-3 w-16 rounded-full bg-white/15" />
          <span>92%</span>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pine X Parent</p>
          <h3 className="mt-1 text-lg font-semibold text-pine-900">Ariana is safe</h3>
          <div className="mt-4 rounded-3xl bg-pine-900 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/55">Attendance alert</p>
            <p className="mt-2 text-lg font-semibold">Absence confirmation needed</p>
            <p className="mt-2 text-sm text-white/75">Ariana was marked absent today. Please confirm if this is correct.</p>
            <button className="mt-4 w-full rounded-2xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-pine-900">Confirm absence</button>
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">Transport: North Loop +8 min</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">Forms: Zoo Excursion due</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="The real problem"
        title="Schools are not short on effort. They are short on connected systems."
        description="Most school teams are already working hard. The pain comes from daily operations living across WhatsApp, paper, spreadsheets, inboxes, and memory."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((problem) => <InfoCard key={problem.title} {...problem} />)}
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solution" className="bg-pine-900 px-4 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">The solution</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Run the school day from one place.</h2>
          <p className="mt-5 max-w-xl text-white/70">
            Pine X connects the operational moments that parents care about and staff need to control: attendance, messages, forms, fees, documents, transport, aftercare, and incidents.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div key={module.title} className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/10">
              <module.icon className="h-5 w-5 text-amber-200" />
              <p className="mt-4 text-sm font-semibold">{module.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSplitSection() {
  return (
    <section className="px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="Two connected experiences"
        title="A command centre for the school. A calm daily app for parents."
        description="The same operational data becomes staff action on one side and parent reassurance on the other."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-2">
        <SplitCard title="School Dashboard" subtitle="For owners, principals, admin, teachers, finance, transport, and aftercare teams" items={schoolPulse} tone="dark" />
        <SplitCard title="Parent App" subtitle="For families who need simple answers without phoning the office" items={parentApp} tone="light" />
      </div>
    </section>
  );
}

function DemoFlowSection() {
  return (
    <section id="demo-flow" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[radial-gradient(circle_at_10%_20%,rgba(45,212,191,0.22),transparent_28%),linear-gradient(135deg,#07111f,#172543)] p-6 text-white shadow-[0_30px_90px_rgba(17,28,52,0.32)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">Demo flow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">One school day. One connected system.</h2>
            <p className="mt-4 text-white/70">Show a school owner how one staff action becomes the right parent update, record, reminder, or follow-up without another WhatsApp scramble.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {demoFlow.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300 font-bold text-pine-900">{index + 1}</div>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TargetCustomerSection() {
  return (
    <section className="px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="Who it is for"
        title="Built for real school operators, not generic enterprise software."
        description="Pine X is shaped around small and mid-sized education operations where every admin minute matters and parents expect clear updates."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-5">
        {customerTypes.map((customer) => <InfoCard key={customer.title} {...customer} />)}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="trust" className="bg-white px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="Trust by design"
        title="Designed to support privacy-aware school operations."
        description="No inflated claims, no fake customers, no legal guarantees. Pine X uses careful product patterns for access control, parent visibility, and accountability."
      />
      <div className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-2">
        {trustItems.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="font-medium text-slate-800">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section id="book-demo" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-[radial-gradient(circle_at_10%_20%,rgba(242,201,76,0.28),transparent_28%),linear-gradient(135deg,#111c34,#1b2a4f)] p-8 text-center text-white shadow-[0_30px_90px_rgba(17,28,52,0.32)] md:p-14">
        <Phone className="mx-auto h-8 w-8 text-amber-200" />
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Ready to see how your school could run from one system?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-white/70">
          Walk through the dashboard, parent app, attendance alerts, digital consent, fee tracking, transport, aftercare, and privacy-aware settings using realistic demo data.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/demo/school" className="rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-pine-900 transition hover:-translate-y-0.5 hover:bg-amber-200">View Demo</Link>
          <Link href="/demo/parent" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20">View Parent App</Link>
          <Link href="mailto:hello@pine-x.local?subject=Book%20a%20Pine%20X%20School%20OS%20demo" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Book Demo</Link>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-pine-800">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-pine-900 md:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function InfoCard({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <article className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pine-50 text-pine-800 transition group-hover:bg-pine-900 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-pine-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function SplitCard({ title, subtitle, items, tone }: { title: string; subtitle: string; items: string[][]; tone: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <div className={`rounded-[2rem] border p-5 shadow-2xl ${dark ? "border-pine-900 bg-pine-900 text-white" : "border-slate-200 bg-white text-slate-950"}`}>
      <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${dark ? "text-amber-200" : "text-pine-800"}`}>{title}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{subtitle}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className={`rounded-2xl border p-4 ${dark ? "border-white/10 bg-white/10" : "border-slate-200 bg-slate-50"}`}>
            <p className={`text-xs ${dark ? "text-white/50" : "text-slate-500"}`}>{label}</p>
            <p className="mt-2 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
