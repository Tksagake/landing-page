import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, ArrowLeft, ArrowRight, Award, Bell, BookOpen, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronRight, Clock3, CreditCard, Download, FileCheck2,
  FileText, GraduationCap, Headphones, Home, Library, Menu, Music2, NotebookPen,
  PenLine, Play, Plus, Search, Send, ShieldCheck, Sparkles, Upload, UserRound, Wallet, X, Zap,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

type IconType = typeof Home;
type NavItem = { label: string; path: string; icon: IconType; external?: boolean };

const navItems: NavItem[] = [
  { label: "Overview", path: "/student/dashboard", icon: Home },
  { label: "My coursework", path: "/student/courses", icon: BookOpen },
  { label: "Course enrollment", path: "/student/course-enrollment", icon: Plus },
  { label: "Assessments", path: "/student/assessments", icon: FileCheck2 },
  { label: "Exam portal", path: "https://mitihani.vivaceke.co.ke/", icon: GraduationCap, external: true },
  { label: "Grades & progress", path: "/student/grades", icon: Award },
  { label: "Finance", path: "/student/payments", icon: Wallet },
  { label: "Learning library", path: "/student/resources", icon: Library },
  { label: "Announcements", path: "/student/announcements", icon: Bell },
];
const supportItems: NavItem[] = [
  { label: "School policies", path: "/student/policies", icon: ShieldCheck },
  { label: "Graduation", path: "/student/graduation", icon: GraduationCap },
  { label: "My profile", path: "/student/profile", icon: UserRound },
];

const courses = [
  { id: "piano-3", name: "Piano Performance", level: "Grade 3", teacher: "Grace Wanjiru", progress: 72, units: 8, completed: 5, color: "teal", next: "Scales & arpeggios", cohort: "September 2026" },
  { id: "theory-2", name: "Music Theory", level: "Grade 2", teacher: "David Mwangi", progress: 48, units: 10, completed: 4, color: "rose", next: "Intervals and keys", cohort: "September 2026" },
  { id: "voice-1", name: "Vocal Studies", level: "Foundation", teacher: "Mary Atieno", progress: 86, units: 7, completed: 6, color: "blue", next: "Performance practice", cohort: "September 2026" },
];
const units = [
  { id: "unit-01", title: "Foundations of piano technique", course: "Piano Performance · Grade 3", duration: "3 weeks", progress: 100, classes: 3, assignments: 2, status: "Completed" },
  { id: "unit-02", title: "Scales, arpeggios & coordination", course: "Piano Performance · Grade 3", duration: "4 weeks", progress: 62, classes: 4, assignments: 3, status: "In progress" },
  { id: "unit-03", title: "Reading and musical expression", course: "Piano Performance · Grade 3", duration: "3 weeks", progress: 0, classes: 2, assignments: 2, status: "Not started" },
];
const assignments = [
  { id: "as-01", title: "C major scale — two octaves", unit: "Scales, arpeggios & coordination", course: "Piano Performance", due: "Today · 5:00 PM", status: "Due soon", points: 20, kind: "Performance" },
  { id: "as-02", title: "Interval identification", unit: "Intervals and keys", course: "Music Theory", due: "Tomorrow · 11:59 PM", status: "In progress", points: 15, kind: "Written" },
  { id: "as-03", title: "Sight-reading exercise", unit: "Reading and musical expression", course: "Piano Performance", due: "28 Nov 2026", status: "Not started", points: 25, kind: "Notation" },
];
const classes = [
  { id: "class-01", title: "Building evenness and control", date: "Mon, 23 Nov", time: "10:00 AM", length: "45 min", state: "Available", type: "Lesson" },
  { id: "class-02", title: "Hands together: scale patterns", date: "Wed, 25 Nov", time: "10:00 AM", length: "45 min", state: "Upcoming", type: "Practical" },
  { id: "class-03", title: "Listening and technique clinic", date: "Fri, 27 Nov", time: "2:00 PM", length: "30 min", state: "Upcoming", type: "Workshop" },
];

const money = (n: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);
const titleCase = (value: string) => value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function Status({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}
function ProgressBar({ value, color = "teal" }: { value: number; color?: string }) {
  return <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full progress-${color}`} style={{ width: `${value}%` }} /></div>;
}
function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div>{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">{eyebrow}</p>}<h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{action}</div>;
}
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-border/80 bg-card shadow-[0_5px_24px_rgba(20,52,67,.035)] ${className}`}>{children}</section>;
}
function PanelTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-5 sm:px-6"><div><h2 className="font-semibold text-foreground">{title}</h2>{detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}</div>{action}</div>;
}
function StudentShell({ children, activePath }: { children: ReactNode; activePath: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isActive = (path: string) => activePath === path || (path === "/student/courses" && activePath.startsWith("/student/units")) || (path === "/student/courses" && activePath.startsWith("/student/classes")) || (path === "/student/courses" && activePath.startsWith("/student/assignments"));
  const renderNav = (items: NavItem[]) => items.map((item) => {
    const Icon = item.icon;
    const className = `student-nav-link ${isActive(item.path) ? "student-nav-active" : ""}`;
    const contents = <><Icon size={17} strokeWidth={1.8}/><span>{item.label}</span>{item.label === "Assessments" && <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">2</span>}</>;
    return item.external ? <a key={item.path} href={item.path} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)} className={className}>{contents}</a> : <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={className}>{contents}</Link>;
  });
  return <div className="student-app min-h-screen bg-background text-foreground">
    {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"/>}
    <aside className={`student-sidebar fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-[78px] items-center gap-3 border-b border-border px-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Music2 size={22}/></div>
        <div><p className="text-[15px] font-bold tracking-tight">VIVACE</p><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Student portal</p></div>
        <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-2 text-muted-foreground lg:hidden"><X size={18}/></button>
      </div>
      <div className="px-4 pt-6"><p className="student-nav-label">Learning space</p>{renderNav(navItems)}</div>
      <div className="mt-7 px-4"><p className="student-nav-label">Your account</p>{renderNav(supportItems)}</div>
      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-[linear-gradient(145deg,#e5f5f2,#f1f4fa)] p-4 dark:bg-[linear-gradient(145deg,#153f43,#172a42)]">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-white/80 text-teal-700 dark:bg-white/10 dark:text-teal-200"><Headphones size={16}/></div>
          <p className="text-sm font-semibold">Need a hand?</p><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Your learning support team is one message away.</p>
          <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-800 dark:text-teal-200" onClick={() => navigate("/student/announcements")}>Contact support <ArrowRight size={13}/></button>
        </div>
        <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted"><div className="flex size-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-200">JM</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Jane Mwangi</p><p className="text-xs text-muted-foreground">Student · VIV-2026-014</p></div><ChevronDown size={15} className="text-muted-foreground"/></button>
      </div>
    </aside>
    <div className="min-h-screen lg:pl-[268px]">
      <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-7">
        <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden"><Menu size={19}/></button>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Vivace</span><ChevronRight size={13}/><span className="font-medium text-foreground">{titleCase(activePath.split("/").filter(Boolean).slice(-1)[0] || "dashboard")}</span></div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs text-muted-foreground md:flex"><Search size={14}/><span>Search your portal</span><kbd className="ml-6 rounded border border-border px-1.5 py-0.5 text-[10px]">⌘ K</kbd></div>
          <button className="relative rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-foreground" aria-label="Notifications"><Bell size={17}/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500 ring-2 ring-card"/></button>
          <ModeToggle variant="ghost"/>
          <div className="hidden size-9 items-center justify-center rounded-full bg-[#dceeea] text-xs font-bold text-[#174d4c] sm:flex dark:bg-[#1c4a4c] dark:text-[#bce9df]">JM</div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">{children}</main>
      <footer className="border-t border-border px-7 py-5 text-center text-[11px] text-muted-foreground">© 2026 Vivace Music School · Learn. Create. Perform.</footer>
    </div>
  </div>;
}

function DashboardPage() {
  return <>
    <div className="mb-7 overflow-hidden rounded-[26px] bg-[linear-gradient(112deg,#123e4a_0%,#1c6570_55%,#3d8b8a_100%)] p-6 text-white shadow-[0_18px_45px_rgba(16,78,86,.16)] sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1.35fr_.65fr] md:items-center">
        <div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-teal-50"><Sparkles size={13}/> Monday, 23 November 2026</div><h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-[38px]">Good morning, Jane. <span className="text-[#f4c8cf]">Keep making music.</span></h1><p className="mt-3 max-w-lg text-sm leading-6 text-teal-50/85">Your next practice session is waiting. Pick up where you left off and keep your progress moving.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/student/courses" className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#174d57] hover:bg-teal-50">Continue learning <ArrowRight size={15}/></Link><Link to="/student/assessments" className="inline-flex h-10 items-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10">View assessments</Link></div></div>
        <div className="relative hidden h-40 items-center justify-center md:flex"><div className="absolute size-40 rounded-full border border-white/15"/><div className="absolute size-28 rounded-full border border-white/20"/><div className="flex size-20 items-center justify-center rounded-3xl bg-white/10 shadow-xl backdrop-blur"><Music2 size={38} strokeWidth={1.2}/></div><span className="absolute right-7 top-4 rounded-full bg-[#f0c5ce] px-3 py-1 text-[10px] font-semibold text-[#733e50]">Your rhythm, your pace</span><span className="absolute bottom-2 left-3 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/90">Practice · Learn · Grow</span></div>
      </div>
    </div>
    <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label:"Active courses", value:"3", note:"Across 3 learning tracks", icon:BookOpen, tint:"teal" },
        { label:"Assignments due", value:"2", note:"One due today", icon:NotebookPen, tint:"rose" },
        { label:"Average assessment", value:"84%", note:"Up 4% this term", icon:Award, tint:"blue" },
        { label:"Fee balance", value:money(12500), note:"Next payment due 30 Nov", icon:Wallet, tint:"gold" },
      ].map((stat) => {const Icon=stat.icon;return <Panel key={stat.label} className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-muted-foreground">{stat.label}</p><p className="mt-2 text-[26px] font-semibold tracking-tight">{stat.value}</p></div><span className={`metric-icon metric-${stat.tint}`}><Icon size={18}/></span></div><p className="mt-3 text-[11px] text-muted-foreground">{stat.note}</p></Panel>})}
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
      <div className="space-y-6">
        <Panel><PanelTitle title="Your coursework" detail="A quick look at the courses you're working through" action={<Link to="/student/courses" className="text-xs font-semibold text-primary">All coursework <ArrowRight size={13} className="ml-1 inline"/></Link>}/><div className="space-y-5 px-5 pb-6 sm:px-6">{courses.map(c=><div key={c.id}><div className="mb-2 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className={`course-mark mark-${c.color}`}><Music2 size={17}/></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.level} · {c.teacher}</p></div></div><span className="text-sm font-semibold tabular-nums">{c.progress}%</span></div><ProgressBar value={c.progress} color={c.color}/></div>)}</div></Panel>
        <Panel><PanelTitle title="Coming up next" detail="Classes and deadlines to keep on your radar" action={<Link to="/student/courses" className="text-xs font-semibold text-primary">Open calendar</Link>}/><div className="divide-y divide-border px-5 pb-1 sm:px-6">{assignments.slice(0,2).map((a,i)=><div key={a.id} className="flex items-center gap-3 py-4"><div className={`date-tile ${i===0?"date-rose":"date-teal"}`}><span>{i===0?"23":"24"}</span><small>NOV</small></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{a.title}</p><p className="mt-1 text-xs text-muted-foreground">{a.course} · {a.due}</p></div><Status tone={i===0?"warning":"info"}>{i===0?"Due today":"Tomorrow"}</Status></div>)}</div></Panel>
      </div>
      <div className="space-y-6">
        <Panel><PanelTitle title="Quick access" detail="Jump back into your learning"/><div className="grid grid-cols-2 gap-3 px-5 pb-5 sm:px-6">{[{label:"My coursework",icon:BookOpen,path:"/student/courses",color:"teal"},{label:"IdeaPad",icon:PenLine,path:"/student/ideapad/as-01",color:"rose"},{label:"Grades",icon:Award,path:"/student/grades",color:"blue"},{label:"Fee statement",icon:Wallet,path:"/student/payments",color:"gold"}].map(a=>{const Icon=a.icon;return <Link to={a.path} key={a.label} className="quick-link"><span className={`quick-icon quick-${a.color}`}><Icon size={18}/></span><span className="text-xs font-semibold">{a.label}</span><ArrowRight size={13} className="ml-auto text-muted-foreground"/></Link>})}</div></Panel>
        <Panel className="overflow-hidden"><div className="bg-[linear-gradient(135deg,#f8e8eb,#f5f0ed)] p-5 dark:bg-[linear-gradient(135deg,#422d3b,#28354a)]"><div className="flex items-center gap-2 text-rose-700 dark:text-rose-200"><Zap size={16}/><span className="text-xs font-semibold uppercase tracking-wider">A little reminder</span></div><p className="mt-3 text-lg font-semibold leading-snug text-slate-800 dark:text-slate-100">Small practice sessions add up to big progress.</p><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">Try a focused 20-minute session today. Your future self will thank you.</p><Link to="/student/courses" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-200">Open coursework <ArrowRight size={13}/></Link></div></Panel>
      </div>
    </div>
  </>;
}

function CourseworkPage() {
  const [filter,setFilter]=useState("All courses");
  const filtered=units.filter(u=>filter==="All courses"||u.status===filter);
  return <><PageHeading eyebrow="Your learning" title="My coursework" description="Your enrolled courses, learning units, class materials and assignments—together in one place." action={<Link to="/student/course-enrollment" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Explore courses <ArrowRight size={15}/></Link>}/>
    <div className="mb-5 flex flex-wrap items-center gap-2">{["All courses","In progress","Completed","Not started"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${filter===f?"border-primary bg-primary text-primary-foreground":"border-border bg-card text-muted-foreground hover:border-primary/40"}`}>{f}</button>)}</div>
    <div className="mb-6 grid gap-4 lg:grid-cols-3">{courses.map(c=><Panel key={c.id} className="p-5"><div className="flex items-start justify-between"><span className={`course-mark mark-${c.color}`}><Music2 size={18}/></span><Status tone="success">Enrolled</Status></div><p className="mt-4 text-base font-semibold">{c.name}</p><p className="mt-1 text-xs text-muted-foreground">{c.level} · {c.teacher}</p><div className="mt-5 flex items-center justify-between text-xs"><span className="text-muted-foreground">Course progress</span><strong>{c.progress}%</strong></div><div className="mt-2"><ProgressBar value={c.progress} color={c.color}/></div><p className="mt-3 text-[11px] text-muted-foreground">{c.completed} of {c.units} units completed</p></Panel>)}</div>
    <Panel><PanelTitle title="Learning units" detail="Choose a unit to view its classes, lesson materials and assignments." action={<span className="text-xs text-muted-foreground">{filtered.length} units</span>}/><div className="divide-y divide-border">{filtered.map(u=><Link to={`/student/units/${u.id}?courseId=piano-3`} key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-muted/40 sm:px-6"><span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-200"><BookOpen size={18}/></span><div className="min-w-[180px] flex-1"><p className="text-sm font-semibold">{u.title}</p><p className="mt-1 text-xs text-muted-foreground">{u.course} · {u.duration}</p><div className="mt-3 max-w-xs"><ProgressBar value={u.progress}/></div></div><div className="hidden gap-5 text-center sm:flex"><div><p className="text-sm font-semibold">{u.classes}</p><p className="text-[10px] text-muted-foreground">Classes</p></div><div><p className="text-sm font-semibold">{u.assignments}</p><p className="text-[10px] text-muted-foreground">Tasks</p></div></div><Status tone={u.status==="Completed"?"success":u.status==="In progress"?"info":"neutral"}>{u.status}</Status><ChevronRight size={17} className="text-muted-foreground"/></Link>)}</div></Panel>
  </>;
}

function UnitPage({unitId}:{unitId:string}) {
  const unit=units.find(u=>u.id===unitId)||units[1];
  const [uploadedFile,setUploadedFile]=useState("");
  return <><Link to="/student/courses" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary"><ArrowLeft size={14}/> Back to coursework</Link>
    <PageHeading eyebrow="Course unit" title={unit.title} description="Unit overview, scheduled classes and assignments are shown together so nothing gets lost." action={<Status tone="info">{unit.status}</Status>}/>
    <Panel className="mb-6"><div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Unit information</p><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Build reliable technique through focused practice, guided class sessions and structured assignments. Work through the lesson materials, then submit your work for feedback.</p><div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 size={14}/> {unit.duration}</span><span className="inline-flex items-center gap-1.5"><BookOpen size={14}/> {unit.course}</span><span className="inline-flex items-center gap-1.5"><Activity size={14}/> {unit.progress}% complete</span></div></div><div className="w-full rounded-xl bg-muted p-4 sm:w-44"><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><strong>{unit.progress}%</strong></div><ProgressBar value={unit.progress}/><p className="mt-2 text-[10px] text-muted-foreground">Keep moving at your pace</p></div></div></Panel>
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <Panel><PanelTitle title="Classes" detail="Lessons and materials shared by your teacher" action={<Status tone="info">3 sessions</Status>}/><div className="space-y-3 px-5 pb-5 sm:px-6">{classes.map((c,i)=><div key={c.id} className="rounded-xl border border-border p-4"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"><Play size={17}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{c.title}</p>{i===0&&<Status tone="success">Available</Status>}</div><p className="mt-1 text-xs text-muted-foreground">{c.date} · {c.time} · {c.length}</p><p className="mt-2 text-xs text-muted-foreground">{i===0?"Watch the class recording and review the attached practice notes.":"Join the upcoming session and prepare your instrument."}</p><Link to={`/student/classes/${c.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Open class <ArrowRight size={13}/></Link></div></div></div>)}</div></Panel>
      <Panel><PanelTitle title="Assignments" detail="Tasks linked to this unit stay visible beside your classes" action={<Status tone="warning">2 to do</Status>}/><div className="space-y-3 px-5 pb-5 sm:px-6">{assignments.map((a,i)=><div key={a.id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold">{i===0?a.title:i===1?"Practice log and reflection":"Sight-reading exercise"}</p><p className="mt-1 text-xs text-muted-foreground">{a.kind} · {a.points} marks</p></div><Status tone={i===0?"warning":"info"}>{i===0?"Due today":"In progress"}</Status></div><div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays size={13}/>{a.due}</span><div className="flex flex-wrap gap-2"><label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-foreground hover:bg-muted"><Upload size={13}/>Upload file<input type="file" className="sr-only" onChange={e=>setUploadedFile(e.target.files?.[0]?.name||"")}/></label><Link to={`/student/ideapad/${a.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">Open IdeaPad <ArrowRight size={13}/></Link></div></div>{uploadedFile&&i===0&&<p className="mt-2 truncate text-[10px] text-teal-700 dark:text-teal-300">Selected file: {uploadedFile}</p>}</div></div>)}</div></Panel>
    </div>
  </>;
}

function ClassPage({classId}:{classId:string}) {
  const [question,setQuestion]=useState("");
  const [answer,setAnswer]=useState("");
  const [asked,setAsked]=useState(false);
  const lesson=classes.find(c=>c.id===classId)||classes[0];
  return <><Link to="/student/units/unit-02" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary"><ArrowLeft size={14}/> Back to unit</Link><PageHeading eyebrow="Class lesson" title={lesson.title} description={`${lesson.date} · ${lesson.time} · ${lesson.length} · Piano Performance`} action={<Status tone="success">Published</Status>}/>
    <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]"><div className="space-y-6"><Panel><div className="flex aspect-video items-center justify-center rounded-t-2xl bg-[linear-gradient(135deg,#173e4a,#347f83)] text-white"><div className="text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/30 bg-white/10"><Play size={25}/></span><p className="mt-4 text-sm font-semibold">Class recording preview</p><p className="mt-1 text-xs text-white/70">Video lesson · 42 minutes</p></div></div><div className="p-5"><h2 className="font-semibold">Lesson overview</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Develop a relaxed hand position, consistent tone and even note articulation. Follow the demonstration, then use the practice notes to guide your own session.</p></div></Panel><Panel><PanelTitle title="Lesson materials" detail="Files and links shared for this class"/><div className="space-y-2 px-5 pb-5">{[{name:"Class notes — technique checklist.pdf",kind:"PDF · 240 KB",icon:FileText},{name:"Demonstration recording.mp4",kind:"Video · 18 min",icon:Play},{name:"Practice audio — slow tempo.mp3",kind:"Audio · 4 min",icon:Headphones}].map(m=>{const Icon=m.icon;return <div key={m.name} className="flex items-center gap-3 rounded-xl border border-border p-3"><span className="flex size-9 items-center justify-center rounded-lg bg-muted text-primary"><Icon size={17}/></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{m.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{m.kind}</p></div><button className="rounded-lg border border-border p-2 text-muted-foreground hover:text-primary"><Download size={15}/></button></div>})}</div></Panel></div>
    <div className="space-y-6"><Panel><PanelTitle title="Learning objectives" detail="By the end of this class, you should be able to"/><ul className="space-y-3 px-5 pb-5 text-sm text-muted-foreground">{["Maintain a relaxed playing posture","Play the scale evenly across two octaves","Identify and correct uneven finger transitions"].map(x=><li key={x} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600"/>{x}</li>)}</ul></Panel><Panel className="overflow-hidden"><div className="flex items-center gap-3 px-5 pt-5"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200"><Sparkles size={19}/></span><div><h2 className="font-semibold">Bach AI</h2><p className="text-xs text-muted-foreground">Your class learning companion</p></div></div><div className="space-y-3 p-5"><p className="text-xs leading-5 text-muted-foreground">Ask a question about this lesson, a technique or the materials shared by your teacher.</p><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What should I focus on when practising this scale?" className="min-h-24 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"/><button onClick={()=>{setAsked(true);setAnswer("Focus on an even tone and relaxed movement. Practise slowly first, listening for consistent volume between fingers. Increase the tempo only when the transitions feel comfortable.");}} disabled={!question.trim()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-50"><Send size={14}/> Ask Bach AI</button>{asked&&<div className="rounded-xl bg-muted p-3 text-xs leading-5 text-muted-foreground">{answer}</div>}</div></Panel></div></div>
  </>;
}

function IdeaPadPage() {
  const [tool,setTool]=useState("Text mode");
  const [submitted,setSubmitted]=useState(false);
  const [notes,setNotes]=useState("Practice notes\n\nStart with a slow tempo. Keep the wrist relaxed and listen for an even tone.\n\nThings to revisit\n• Bar 4 — left hand transition\n• Bar 8 — dynamic contrast");
  const [saved,setSaved]=useState(false);
  const [focus,setFocus]=useState(false);
  return <div className={focus?"fixed inset-0 z-[60] overflow-auto bg-background p-4 sm:p-7":""}><div className="mx-auto max-w-[1500px]"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><Link to="/student/units/unit-02" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary"><ArrowLeft size={14}/> Back to assignment</Link><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Vivace IdeaPad</p><h1 className="mt-1 text-2xl font-semibold">C major scale — two octaves</h1><p className="mt-1 text-xs text-muted-foreground">Your private working space · Drafts stay separate from your submitted work</p></div><div className="flex flex-wrap gap-2"><button onClick={()=>setFocus(!focus)} className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-semibold">{focus?"Exit focus":"Focus mode"}</button><button onClick={()=>setSaved(true)} className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground"><Check size={14}/>{saved?"Saved":"Save draft"}</button><button onClick={()=>setSubmitted(true)} className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"><Send size={14}/> {submitted?"Submission previewed":"Submit work"}</button></div></div>
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]"><Panel className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"><div><p className="text-sm font-semibold">Notation workspace</p><p className="text-[10px] text-muted-foreground">Compose and revise your score draft</p></div><div className="flex flex-wrap gap-1.5">{["Select","Note","Rest","Text"].map(t=><button key={t} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${t==="Note"?"bg-primary text-primary-foreground":"border border-border text-muted-foreground"}`}>{t}</button>)}</div></div><div className="min-h-[480px] bg-[#fbfaf7] p-4 text-slate-700 dark:bg-[#18232d] dark:text-slate-100 sm:p-6"><div className="mb-5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400"><span>Untitled score · Grand staff</span><span>Concert pitch · 4/4</span></div><div className="rounded-xl border border-[#e8e2d7] bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="mb-6 text-center font-serif text-lg font-semibold">C Major Scale</p><div className="relative space-y-2">{[0,1].map(n=><div key={n} className="relative h-[82px]"><div className="absolute left-0 top-0 font-serif text-4xl leading-none">{n===0?"𝄞":"𝄢"}</div><div className="absolute left-10 right-0 top-3 space-y-[13px]">{[0,1,2,3,4].map(k=><div key={k} className="h-px bg-slate-400/80 dark:bg-slate-500"/>)}</div><div className="absolute left-[90px] right-8 top-0 flex h-full items-center justify-around font-serif text-[27px] text-slate-800 dark:text-slate-100"><span>♩</span><span>♪</span><span>♫</span><span>♩</span><span>♪</span><span>♩</span><span>♫</span><span>♩</span></div></div>)}</div><div className="mt-5 border-t border-dashed border-slate-200 pt-3 text-center text-[10px] text-slate-400">Notation canvas preview · Your score editor opens here</div></div><div className="mt-4 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400"><span>● 4 measures</span><span>● 2 staves</span><span>● Draft workspace</span></div></div></Panel>
    <Panel className="overflow-hidden"><div className="border-b border-border px-5 py-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Working notes</p><p className="text-[10px] text-muted-foreground">Rich text · Private to you</p></div><span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">{saved?"Saved":"Autosave preview"}</span></div><div className="mt-4 flex flex-wrap gap-1.5">{["Text mode","Draw overlay","Erase"].map(t=><button key={t} onClick={()=>setTool(t)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${tool===t?"bg-primary text-primary-foreground":"border border-border text-muted-foreground"}`}>{t}</button>)}</div></div><div className="p-4"><div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground"><span className="font-semibold">B</span><span className="italic">I</span><span>U</span><span className="mx-1 h-4 w-px bg-border"/><span>• List</span><span>1. List</span><span className="ml-auto">Export .docx</span></div><textarea value={notes} onChange={e=>{setNotes(e.target.value);setSaved(false)}} className="min-h-[390px] w-full resize-y rounded-xl border border-border bg-background p-4 font-serif text-sm leading-7 outline-none focus:border-primary" aria-label="Private working notes"/><div className="mt-3 flex items-center justify-between gap-2"><span className="text-[10px] text-muted-foreground">{tool} · Notes are not submitted with your score</span><button onClick={()=>setSaved(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><Check size={13}/> Save notes</button></div></div></Panel></div>
    <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/30"><p className="text-xs font-semibold text-rose-900 dark:text-rose-100">{submitted?"Submission preview":"Before you submit"}</p><p className="mt-1 text-xs leading-5 text-rose-800/80 dark:text-rose-200/80">Your IdeaPad is your private draft area. The reference preview keeps the final score and your working notes separate; in the live portal, the score file is submitted to your teacher and notes remain revisable until grading.</p></div>
  </div></div>;
}

function GenericPage({page}:{page:string}) {
  const config:Record<string,{title:string;eyebrow:string;description:string}> = {
    "course-enrollment":{title:"Explore courses",eyebrow:"Course registration",description:"Browse available learning tracks, review course details and manage your enrollment."},
    assessments:{title:"Assessments",eyebrow:"Your academic work",description:"See upcoming assessments, completed work and assessment requirements."},
    grades:{title:"Grades & progress",eyebrow:"Your results",description:"Track your assessment performance, feedback and progress across courses."},
    payments:{title:"Finance & payments",eyebrow:"Your account",description:"Review your fee structure, payment history, receipts and outstanding balance."},
    resources:{title:"Learning library",eyebrow:"Study resources",description:"Find learning materials, practice resources and school reference documents."},
    announcements:{title:"Announcements",eyebrow:"Stay informed",description:"Updates, notices and important messages from Vivace Music School."},
    policies:{title:"School policies",eyebrow:"Student handbook",description:"Read the policies that guide learning, assessment, student welfare and school life."},
    graduation:{title:"Graduation & certification",eyebrow:"Your next milestone",description:"Review programme completion, graduation eligibility and certification information."},
    profile:{title:"My profile",eyebrow:"Your account",description:"View your student details, contact information and enrolled courses."},
  };
  const c=config[page]||config.assessments;
  const [tab,setTab]=useState("All");
  const [query,setQuery]=useState("");
  const rows:Record<string,{name:string;detail:string;meta:string;status:string;icon:IconType}[]> = {
    "course-enrollment":[{name:"Piano Performance",detail:"Build technique, repertoire and performance confidence.",meta:"Grade 3 · 12 weeks · 3 credits",status:"Available",icon:Music2},{name:"Music Theory",detail:"Develop a confident understanding of notation and harmony.",meta:"Grade 2 · 10 weeks · 2 credits",status:"Enrolled",icon:BookOpen},{name:"Vocal Studies",detail:"Strengthen vocal technique, musicianship and expression.",meta:"Foundation · 8 weeks · 2 credits",status:"Enrolled",icon:Headphones}],
    assessments:[{name:"C major scale performance",detail:"Practical assessment · Piano Performance",meta:"Due 26 Nov 2026 · 20 marks",status:"Upcoming",icon:Music2},{name:"Intervals and key signatures",detail:"Written assessment · Music Theory",meta:"Due 30 Nov 2026 · 30 marks",status:"Upcoming",icon:FileText},{name:"Sight-reading checkpoint",detail:"Practical assessment · Piano Performance",meta:"Completed 18 Nov 2026 · 25 marks",status:"Completed",icon:Award}],
    grades:[{name:"Piano Performance",detail:"Latest assessment: Scale technique",meta:"84% · Updated 18 Nov 2026",status:"Good standing",icon:Music2},{name:"Music Theory",detail:"Latest assessment: Intervals",meta:"78% · Updated 16 Nov 2026",status:"Good standing",icon:BookOpen},{name:"Vocal Studies",detail:"Latest assessment: Aural skills",meta:"91% · Updated 12 Nov 2026",status:"Excellent",icon:Award}],
    payments:[{name:"Term 3 tuition",detail:"Programme tuition fee",meta:"Invoice · 01 Sep 2026",status:"Part-paid",icon:Wallet},{name:"Payment receipt #VIV-00821",detail:"M-Pesa · 12 Nov 2026",meta:money(15000),status:"Paid",icon:FileCheck2},{name:"Outstanding balance",detail:"Current account balance",meta:money(12500),status:"Due 30 Nov",icon:CreditCard}],
    resources:[{name:"Music theory reference sheets",detail:"Notation, intervals, scales and key signatures.",meta:"PDF collection · 12 files",status:"Available",icon:FileText},{name:"Piano practice library",detail:"Technique demonstrations and guided practice audio.",meta:"Audio & video · 8 resources",status:"Available",icon:Headphones},{name:"Student handbook",detail:"School information and academic guidance.",meta:"PDF · Updated Sep 2026",status:"Available",icon:BookOpen}],
    announcements:[{name:"End-of-term performance showcase",detail:"Student performances will take place in the final week of term.",meta:"Academic office · 22 Nov 2026",status:"New",icon:Music2},{name:"Assessment submission reminders",detail:"Please check your coursework for upcoming deadlines.",meta:"Academic office · 20 Nov 2026",status:"Important",icon:Bell},{name:"Library resources updated",detail:"New repertoire and theory resources are now available.",meta:"Library · 18 Nov 2026",status:"Read",icon:Library}],
    policies:[{name:"Student Code of Conduct",detail:"Expectations for respectful conduct and participation.",meta:"General · PDF",status:"Current",icon:ShieldCheck},{name:"Assessment, Grading & Feedback",detail:"How assessments are marked and feedback is shared.",meta:"Academic · PDF",status:"Current",icon:FileCheck2},{name:"Attendance & Punctuality",detail:"Attendance expectations and reporting procedures.",meta:"General · PDF",status:"Current",icon:CalendarDays},{name:"Academic Integrity & Plagiarism",detail:"Guidance on original work, citations and academic honesty.",meta:"Academic · PDF",status:"Current",icon:BookOpen}],
    graduation:[{name:"Programme completion",detail:"Complete all required units and assessments.",meta:"3 active courses · 1 course nearing completion",status:"In progress",icon:GraduationCap},{name:"Certificates & awards",detail:"Your certificates and earned awards will appear here.",meta:"No certificates issued yet",status:"Pending",icon:Award},{name:"Exit documentation",detail:"Graduation documents and clearance information.",meta:"Available when eligible",status:"Locked",icon:FileText}],
    profile:[{name:"Jane Mwangi",detail:"Student · VIV-2026-014",meta:"jane.mwangi@example.com · +254 712 345 678",status:"Active",icon:UserRound},{name:"September 2026 cohort",detail:"Current student cohort",meta:"Juja campus · Student since Sep 2026",status:"Current",icon:CalendarDays},{name:"Enrolled programmes",detail:"Piano Performance, Music Theory, Vocal Studies",meta:"3 active enrolments",status:"3 courses",icon:BookOpen}],
  };
  const data=rows[page]||rows.assessments;
  const filtered=data.filter(x=>(tab==="All"||x.status.toLowerCase().includes(tab.toLowerCase()))&&(`${x.name} ${x.detail}`.toLowerCase().includes(query.toLowerCase())));
  return <><PageHeading eyebrow={c.eyebrow} title={c.title} description={c.description} action={page==="course-enrollment"?<button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><Plus size={15}/> Request enrollment</button>:page==="payments"?<button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold"><Download size={15}/> Download statement</button>:null}/>
    {page==="payments"&&<div className="mb-6 grid gap-4 sm:grid-cols-3"><Panel className="p-5"><p className="text-xs text-muted-foreground">Total fees</p><p className="mt-2 text-2xl font-semibold">{money(67500)}</p></Panel><Panel className="p-5"><p className="text-xs text-muted-foreground">Paid to date</p><p className="mt-2 text-2xl font-semibold text-teal-700 dark:text-teal-300">{money(55000)}</p></Panel><Panel className="p-5"><p className="text-xs text-muted-foreground">Outstanding</p><p className="mt-2 text-2xl font-semibold text-rose-700 dark:text-rose-300">{money(12500)}</p></Panel></div>}
    {page==="grades"&&<div className="mb-6 grid gap-4 sm:grid-cols-3"><Panel className="p-5"><p className="text-xs text-muted-foreground">Overall average</p><p className="mt-2 text-3xl font-semibold">84%</p><p className="mt-1 text-xs text-teal-700 dark:text-teal-300">↑ 4% this term</p></Panel><Panel className="p-5"><p className="text-xs text-muted-foreground">Assessments completed</p><p className="mt-2 text-3xl font-semibold">8 / 11</p></Panel><Panel className="p-5"><p className="text-xs text-muted-foreground">Highest score</p><p className="mt-2 text-3xl font-semibold">96%</p></Panel></div>}
    <Panel><PanelTitle title={page==="announcements"?"Latest updates":page==="policies"?"Policy documents":page==="payments"?"Account activity":page==="profile"?"Student information":"Your records"} detail={page==="policies"?"Browse current school policies and guidance.": "Information from your Vivace student account."}/><div className="flex flex-wrap items-center gap-2 border-y border-border px-5 py-3"><div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3"><Search size={14} className="text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..." className="h-9 w-full bg-transparent text-xs outline-none"/></div>{["All","Upcoming","Completed"].map(f=><button key={f} onClick={()=>setTab(f)} className={`rounded-lg px-3 py-2 text-[11px] font-semibold ${tab===f?"bg-primary text-primary-foreground":"text-muted-foreground hover:bg-muted"}`}>{f}</button>)}</div><div className="divide-y divide-border">{filtered.map(row=>{const Icon=row.icon;return <div key={row.name} className="flex items-center gap-3 px-5 py-4 sm:px-6"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary"><Icon size={18}/></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{row.detail}</p><p className="mt-1 text-[10px] text-muted-foreground">{row.meta}</p></div><Status tone={row.status==="Paid"||row.status==="Current"||row.status==="Active"||row.status==="Excellent"?"success":row.status==="New"||row.status==="Upcoming"?"info":row.status==="Due 30 Nov"||row.status==="Part-paid"?"warning":"neutral"}>{row.status}</Status><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary" aria-label="Open record"><ChevronRight size={16}/></button></div>})}{filtered.length===0&&<div className="p-10 text-center text-sm text-muted-foreground">No matching records.</div>}</div></Panel>
  </>;
}

export default function StudentPortal() {
  const location=useLocation();
  const path=location.pathname.replace(/\/$/,"")||"/student/dashboard";
  const parts=path.split("/").filter(Boolean);
  const page=parts[1]||"dashboard";
  let content:ReactNode;
  if(page==="dashboard") content=<DashboardPage/>;
  else if(page==="courses") content=<CourseworkPage/>;
  else if(page==="units") content=<UnitPage unitId={parts[2]||"unit-02"}/>;
  else if(page==="classes") content=<ClassPage classId={parts[2]||"class-01"}/>;
  else if(page==="ideapad") content=<IdeaPadPage/>;
  else content=<GenericPage page={page}/>;
  const activePath=page==="units"||page==="classes"||page==="assignments"||page==="ideapad"?"courses":`/student/${page}`;
  return <StudentShell activePath={activePath}>{content}</StudentShell>;
}
