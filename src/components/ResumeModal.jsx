import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Code2, Mail, CheckCircle2, Github, Linkedin } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useModal } from "../hooks/useModal";
import { overlayFade, modalReveal } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

const SKILLS = [
  "Enterprise SaaS Support",
  "Client Operations",
  "Case Investigation",
  "Root Cause Analysis",
  "Escalation Management",
  "Stakeholder Communication",
  "ServiceNow",
  "Salesforce",
  "SAP",
  "React",
  "TypeScript",
  "Framer Motion",
  "Three.js",
  "Tailwind CSS",
  "GraphQL",
  "Figma",
];

const EXPERIENCE = [
  {
    company: "LTIMindtree (Client: Autodesk)",
    role: "Senior Consultant – Enterprise Application Support & Client Operations",
    dates: "Nov 2024 – Sep 2025",
    bullets: [
      "Owned the full case lifecycle for 220–250 enterprise cases per month across email, chat, and phone.",
      "Investigated licensing, subscription, authentication, configuration, and account access issues.",
      "Coordinated escalations with Engineering, Product, Licensing, Finance, and Operations.",
      "Maintained detailed case documentation and knowledge reuse across the support organization.",
    ],
  },
  {
    company: "Concentrix Services Pvt. Ltd.",
    role: "Operations Representative",
    dates: "Jul 2022 – Aug 2023",
    bullets: [
      "Handled account servicing, billing disputes, payment concerns, and account investigations.",
      "Resolved customer enquiries through structured investigation and escalation management.",
      "Maintained compliance-focused documentation and reporting in a regulated environment.",
    ],
  },
  {
    company: "Firstsource Solutions Ltd.",
    role: "Customer Support Associate",
    dates: "Nov 2021 – May 2022",
    bullets: [
      "Handled healthcare-related service requests, referral coordination, and insurance workflows.",
      "Maintained confidentiality, accurate case notes, and process adherence.",
      "Built discipline in issue resolution, communication, and operational follow-through.",
    ],
  },
];

const WORK_ITEMS = [
  {
    title: "ops.dronly.in",
    status: "Simulation",
    lede: "A modeled spatial command surface for fleet telemetry. Not a live operations desk.",
  },
  {
    title: "Healthcare Systems Initiative",
    status: "Prototype",
    lede: "Clinical movement and recovery systems with clear visual feedback.",
  },
  {
    title: "Prodent OS",
    status: "Simulation",
    lede: "A modeled clinical OS for multi-location practice workflows. Not a live EMR.",
  },
  {
    title: "Career OS",
    status: "Prototype",
    lede: "Notes become a graph. A prototype, not a live HR system.",
  },
];

function Pill({ children }) {
  return (
    <span className="rounded-full border border-obsidian-border bg-obsidian-surface px-3 py-1.5 text-xs font-medium text-slate-300">
      {children}
    </span>
  );
}

function ExperienceCard({ item }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-lg font-bold tracking-[-0.03em] text-white">
              {item.company}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.role}</p>
          </div>
          <span className="rounded-full border border-obsidian-border bg-obsidian-surface px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">
            {item.dates}
          </span>
        </div>
        <ul className="space-y-2">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-electric/70" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ResumeModal() {
  const { isResumeOpen, closeResume, playClickSound, openContact } = useSystemCommand();
  const modalRef = useRef(null);

  useModal({ isOpen: isResumeOpen, onClose: closeResume, ref: modalRef });

  if (!isResumeOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        {...overlayFade}
        className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/60 p-2 backdrop-blur-sm sm:p-4 md:p-6"
        onClick={closeResume}
        role="presentation"
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-title"
          onClick={(e) => e.stopPropagation()}
          initial={modalReveal.initial}
          animate={modalReveal.animate}
          exit={modalReveal.exit}
          transition={modalReveal.transition}
          className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden overscroll-contain rounded-xl border border-slate-700 bg-slate-900 shadow-2xl sm:max-h-[90vh]"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
            <h2 id="resume-title" className="font-sans text-xl font-bold tracking-tight text-white">
              Resume <span className="ml-2 font-normal text-slate-500">| Professional profile</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                closeResume();
              }}
              aria-label="Close resume"
              className="relative flex min-h-[32px] min-w-[32px] items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 after:absolute after:-inset-3 after:content-[''] hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-900 p-6 sm:p-8 custom-scrollbar">
            <div className="mx-auto max-w-3xl space-y-10">
              <header className="space-y-5">
                <div className="space-y-2">
                  <p className="kicker text-cyan-electric/70">Enterprise SaaS Support · Bengaluru</p>
                  <h1 className="font-display text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                    Titash Dev
                  </h1>
                </div>
                <p className="max-w-3xl text-base leading-relaxed text-slate-300">
                  I work across enterprise support, investigations, and client operations, then translate that discipline into premium frontend systems and evidence-led product surfaces. The portfolio below is modeled and documented; the work history above is real experience.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="https://github.com/titashdev-ops"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md p-1 text-sm text-slate-400 transition-colors duration-200 hover:text-slate-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/titashdeb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md p-1 text-sm text-slate-400 transition-colors duration-200 hover:text-slate-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              </header>

              <section className="space-y-4" aria-labelledby="experience-heading">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Briefcase size={16} className="text-cyan-electric" />
                  <h3 id="experience-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Real experience
                  </h3>
                </div>
                <div className="grid gap-3">
                  {EXPERIENCE.map((item) => (
                    <ExperienceCard key={`${item.company}-${item.role}`} item={item} />
                  ))}
                </div>
              </section>

              <section className="space-y-4" aria-labelledby="how-i-work-heading">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Code2 size={16} className="text-cyan-electric" />
                  <h3 id="how-i-work-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    How I work
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <article className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
                    <p className="kicker text-slate-500 mb-2">Honesty</p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      Keep the public story clear. Simulation stays simulation.
                    </p>
                  </article>
                  <article className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
                    <p className="kicker text-slate-500 mb-2">Clarity</p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      Compress complexity until the next step is obvious.
                    </p>
                  </article>
                  <article className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
                    <p className="kicker text-slate-500 mb-2">Motion</p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      Use motion, hierarchy, and spacing where they earn attention.
                    </p>
                  </article>
                </div>
              </section>

              <section className="space-y-4" aria-labelledby="skills-heading">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Briefcase size={16} className="text-cyan-electric" />
                  <h3 id="skills-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    What I use
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {SKILLS.map((skill) => (
                    <Pill key={skill}>{skill}</Pill>
                  ))}
                </div>
              </section>

              <section className="space-y-4" aria-labelledby="work-heading">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <h3 id="work-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Selected work
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {WORK_ITEMS.map((item) => (
                    <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display text-lg font-bold tracking-[-0.03em] text-white">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-slate-300">
                            {item.lede}
                          </p>
                        </div>
                        <span className={cn(
                          "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]",
                          item.status === "Prototype"
                            ? "border-violet-400/30 bg-violet-400/10 text-violet-300"
                            : item.status === "Internal"
                              ? "border-slate-700 bg-slate-800/60 text-slate-300"
                              : "border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-800 bg-slate-900 p-4 sm:px-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                closeResume();
                openContact();
              }}
              aria-label="Request resume by email"
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-slate-700 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <Mail size={16} />
              Request resume by email
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
