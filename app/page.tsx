import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  Bus,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
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
  UsersRound,
  WalletCards,
  type LucideIcon
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pine X School OS | School Operations Platform",
  description:
    "A complete school operations platform with a parent app, built to reduce admin, improve communication, and keep parents informed.",
  openGraph: {
    title: "Pine X School OS",
    description: "One dashboard for school operations. One calm app for parents.",
    url: "/",
    type: "website"
  }
};

const customerTypes = ["ECD centres", "Preschools", "Aftercare centres", "Small private schools", "Transport operators"];

const problems = [
  { title: "WhatsApp chaos", description: "Important messages get buried in groups, screenshots, and voice notes.", icon: MessageCircleWarning },
  { title: "Lost paper forms", description: "Consent slips disappear between bags, classrooms, cars, and office trays.", icon: FileText },
  { title: "Payment proof admin", description: "Finance staff spend hours matching EFT proofs to learner accounts.", icon: ReceiptText },
  { title: "Attendance uncertainty", description: "Parents and admins do not always know who is absent, late, or collected.", icon: AlertTriangle },
  { title: "Parent complaints", description: "Families ask for updates because systems are scattered across too many channels.", icon: BellRing },
  { title: "Transport uncertainty", description: "Route delays and pickup updates need a calm, traceable communication path.", icon: Bus }
];

const solutionCards = [
  "One dashboard for the school",
  "One app-style portal for parents",
  "Automatic notifications and acknowledgements",
  "Attendance, fees, consent, documents, transport, and aftercare in one place"
];

const features = [
  { title: "Parent app", description: "A polished mobile portal for notices, fees, forms, documents, transport, and messages.", icon: Smartphone },
  { title: "Attendance alerts", description: "Mark absences or late arrivals and prepare parent-facing alerts from the register.", icon: ClipboardCheck },
  { title: "Digital consent forms", description: "Send forms, track signatures, capture timestamps, and reduce paper chasing.", icon: FileSignature },
  { title: "Fees and proof uploads", description: "Track balances, payments, reminders, and EFT proof review in one finance view.", icon: WalletCards },
  { title: "Notices and notifications", description: "Send targeted notices by school, grade, class, route, or aftercare group.", icon: BellRing },
  { title: "Transport tracking", description: "Coordinate routes, drivers, checklists, delays, and parent pickup/drop-off updates.", icon: Bus },
  { title: "Aftercare check-in/out", description: "Help staff manage check-ins, collectors, notes, and pickup confirmation.", icon: HeartHandshake },
  { title: "Incident reporting", description: "Record sensitive incidents with role-aware access and parent-safe notifications.", icon: ShieldCheck }
];

const workflow = [
  "Teacher marks absent",
  "Parent gets alert",
  "Admin sends notice",
  "Parent signs form",
  "Finance tracks payment",
  "Transport sends pickup update"
];

const pricing = [
  {
    name: "ECD Starter",
    price: "Starting from R899/mo",
    description: "For ECDs and preschools that need parent communication, attendance, forms, and documents.",
    features: ["Parent app", "Attendance", "Notices", "Digital forms"]
  },
  {
    name: "School Ops",
    price: "Starting from R1,899/mo",
    description: "For growing schools that need finance tracking, role access, analytics, and staff workflows.",
    features: ["Everything in Starter", "Fees and proof uploads", "Incidents", "Analytics"]
  },
  {
    name: "Premium Custom",
    price: "Custom pilot pricing",
    description: "For schools or operators that need transport, aftercare, migration support, or custom rollout.",
    features: ["Transport", "Aftercare", "Custom onboarding", "Priority support"]
  }
];

const trust = [
  { title: "Built for South African schools", description: "Designed around ECD, preschool, aftercare, private school, and transport realities.", icon: UsersRound },
  { title: "POPIA-conscious architecture", description: "Structured around careful data access, audit trails, and privacy-first workflows.", icon: LockKeyhole },
  { title: "Role-based access", description: "Admins, teachers, finance, transport, aftercare, and parents see the tools they need.", icon: ShieldCheck },
  { title: "Parent-friendly design", description: "The parent portal is calm, mobile-first, and clear about what matters today.", icon: Smartphone },
  { title: "Local support mindset", description: "Built for practical school operations, not generic enterprise complexity.", icon: Phone }
];

export default function HomePage() {
  return (
    <main className="landing-page overflow-hidden bg-[#f7f4ee] text-slate-950">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <WorkflowSection />
      <PricingSection />
      <TrustSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate min-h-screen px-4 py-6 md:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(242,201,76,0.24),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(27,42,79,0.2),transparent_30%),linear-gradient(180deg,#111c34_0%,#172543_52%,#f7f4ee_52%,#f7f4ee_100%)]" />
      <div className="mx-auto max-w-7xl">
        <nav className="landing-reveal flex items-center justify-between rounded-full border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-pine-900">PX</span>
            Pine X School OS
          </Link>
          <div className="hidden items-center gap-2 text-xs text-white/70 md:flex">
            {customerTypes.map((type) => (
              <span key={type} className="rounded-full border border-white/15 px-3 py-1">
                {type}
              </span>
            ))}
          </div>
          <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pine-900 hover:-translate-y-0.5 hover:bg-amber-100">
            Login
          </Link>
        </nav>

        <div className="grid min-h-[82vh] items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="landing-reveal text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Complete school operations with a parent app
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-7xl">
              Run the school day from one calm command centre.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Pine X School OS is a complete school operations platform with a parent app, built to reduce admin, improve communication, and keep parents informed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="mailto:hello@pine-x.local?subject=Book%20a%20Pine%20X%20School%20OS%20demo" className="rounded-full bg-amber-300 px-6 py-3 text-center text-sm font-bold text-pine-900 shadow-2xl shadow-amber-300/20 hover:-translate-y-0.5 hover:bg-amber-200">
                Book Demo
              </Link>
              <Link href="/dashboard" className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur hover:-translate-y-0.5 hover:bg-white/20">
                View Admin Demo
              </Link>
              <Link href="/parent" className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-white/10">
                Parent App Demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/55">Demo areas may ask you to choose a demo login role first.</p>
          </div>

          <ProductMockup />
        </div>
      </div>
    </section>
  );
}

function ProductMockup() {
  return (
    <div className="landing-float landing-reveal relative">
      <div className="absolute -left-8 top-10 hidden rounded-3xl border border-white/20 bg-white/10 p-3 text-white shadow-2xl backdrop-blur md:block">
        <p className="text-xs text-white/60">Parent alert</p>
        <p className="mt-1 text-sm font-semibold">Ariana was marked absent</p>
      </div>
      <div className="rounded-[2rem] border border-white/20 bg-white/90 p-3 shadow-[0_28px_80px_rgba(17,28,52,0.36)] backdrop-blur">
        <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Command Center</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Hermanus Valley Academy</h2>
            </div>
            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">Live demo</div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ["Learners", "248"],
              ["Present", "231"],
              ["Forms due", "18"],
              ["Fees", "R42k"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs text-white/45">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Attendance overview</p>
                <span className="rounded-full bg-pine-50 px-2.5 py-1 text-xs text-pine-800">10 days</span>
              </div>
              <div className="mt-6 flex h-32 items-end gap-2">
                {[64, 76, 52, 88, 72, 96, 80, 68, 90, 84].map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-1">
                    <span className="w-full rounded-t-xl bg-pine-900" style={{ height }} />
                    <span className="h-2 w-full rounded-full bg-amber-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["Notice sent", "Grade R pickup update"],
                ["Proof uploaded", "Finance review needed"],
                ["Route delayed", "North Loop +8 min"]
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <p className="text-xs text-amber-100/70">{title}</p>
                  <p className="mt-1 text-sm font-semibold">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="The real problem"
        title="Schools are not short on effort. They are short on one trusted operating system."
        description="Small school teams are often doing brilliant work through scattered tools. Pine X brings the daily moving parts into a clearer workflow."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((problem) => (
          <InfoCard key={problem.title} {...problem} tone="dark" />
        ))}
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="bg-pine-900 px-4 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">The solution</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">One dashboard for staff. One app for parents.</h2>
          <p className="mt-5 max-w-xl text-white/70">
            Pine X helps schools centralise the admin work that normally lives across WhatsApp, spreadsheets, paper forms, email threads, and memory.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {solutionCards.map((item, index) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/10">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-300 text-sm font-bold text-pine-900">0{index + 1}</div>
              <p className="mt-5 text-lg font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="Platform modules"
        title="Everything important in the school day, connected."
        description="Start with the workflows you need now, then expand into transport, aftercare, finance, and analytics as your operation grows."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <InfoCard key={feature.title} {...feature} tone="light" />
        ))}
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#172543] p-6 text-white shadow-[0_24px_70px_rgba(17,28,52,0.26)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">Demo workflow</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">See how a day moves through Pine X.</h2>
            <p className="mt-4 text-white/70">A school action becomes a parent update, a finance record, or an operational checkpoint without another WhatsApp scramble.</p>
          </div>
          <div className="grid gap-3">
            {workflow.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300 font-bold text-pine-900">{index + 1}</div>
                <div className="flex-1">
                  <p className="font-semibold">{step}</p>
                  <p className="mt-1 text-sm text-white/55">{workflowCopy(index)}</p>
                </div>
                <CheckCircle2 className="hidden h-5 w-5 text-emerald-300 sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="Pricing preview"
        title="Simple starting points for different school operations."
        description="Pricing is intentionally shown as a preview while pilots are scoped around learner count, modules, onboarding, and support needs."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-3">
        {pricing.map((plan, index) => (
          <div key={plan.name} className={`rounded-[1.7rem] border p-6 shadow-card ${index === 1 ? "border-pine-900 bg-pine-900 text-white" : "border-slate-200 bg-white text-slate-950"}`}>
            <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${index === 1 ? "text-amber-200" : "text-pine-800"}`}>{plan.name}</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{plan.price}</h3>
            <p className={`mt-3 text-sm leading-6 ${index === 1 ? "text-white/70" : "text-slate-600"}`}>{plan.description}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className={`h-4 w-4 ${index === 1 ? "text-emerald-300" : "text-emerald-600"}`} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="bg-white px-4 py-20 md:px-8">
      <SectionIntro
        eyebrow="Trust by design"
        title="Serious enough for school operations. Calm enough for parents."
        description="No inflated claims, no gimmicks. Pine X is built around the operational realities and privacy expectations schools need to handle properly."
      />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-5">
        {trust.map((item) => (
          <InfoCard key={item.title} {...item} tone="light" />
        ))}
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section id="book-demo" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-[radial-gradient(circle_at_10%_20%,rgba(242,201,76,0.28),transparent_28%),linear-gradient(135deg,#111c34,#1b2a4f)] p-8 text-center text-white shadow-[0_30px_90px_rgba(17,28,52,0.32)] md:p-14">
        <Clock3 className="mx-auto h-8 w-8 text-amber-200" />
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">See how your school could run from one system.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-white/70">
          Walk through the admin dashboard, parent app, attendance alerts, forms, fees, transport, and aftercare workflows with realistic demo data.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="mailto:hello@pine-x.local?subject=Book%20a%20Pine%20X%20School%20OS%20demo" className="rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-pine-900 hover:-translate-y-0.5 hover:bg-amber-200">
            Book Demo
          </Link>
          <Link href="/dashboard" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-white/20">
            View Dashboard Demo
          </Link>
          <Link href="/parent" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-white/10">
            View Parent App
          </Link>
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

function InfoCard({
  title,
  description,
  icon: Icon,
  tone
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "dark" | "light";
}) {
  return (
    <article className={`group rounded-[1.5rem] border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${tone === "dark" ? "border-slate-200 bg-white" : "border-slate-200 bg-white"}`}>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pine-50 text-pine-800 transition group-hover:bg-pine-900 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-pine-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function workflowCopy(index: number) {
  const copy = [
    "Attendance is captured once by the classroom team.",
    "The family sees a clear alert instead of chasing the school office.",
    "The school sends targeted communication from one place.",
    "Consent is recorded with a signature and timestamp.",
    "Finance sees the account context and proof status.",
    "Transport keeps families reassured with route updates."
  ];
  return copy[index] ?? "";
}
