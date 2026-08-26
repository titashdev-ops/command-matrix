import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Radio, 
  Layers, 
  Cpu, 
  Activity, 
  ArrowUpRight, 
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { CASE_STUDIES } from "../data/missions";

const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * Glass3DTiltCard Component
 * Implements mouse proximity 3D perspective tilt with spring physics (overshoot & settling)
 */
function Glass3DTiltCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  badge, 
  badgeColor = "text-cyan-electric border-cyan-electric/30 bg-cyan-electric/10",
  accentColor = "from-cyan-electric/30 via-emerald-glow/20 to-transparent",
  metrics, 
  description, 
  ctaText, 
  onCtaClick,
  layoutId,
  index = 0 
}) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXRelative = useMotionValue(0.5);
  const mouseYRelative = useMotionValue(0.5);

  // Spring Physics for mouse release overshoot & settling
  const springConfig = { stiffness: 240, damping: 16, mass: 0.75, bounce: 0.22 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);
  const scale = useSpring(isHovered ? 1.045 : 1, springConfig);

  // Radial highlight gradient origin
  const spotlightX = useSpring(useTransform(mouseXRelative, [0, 1], ["0%", "100%"]), springConfig);
  const spotlightY = useSpring(useTransform(mouseYRelative, [0, 1], ["0%", "100%"]), springConfig);

  // Particle Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;
    const ctx = canvas.getContext("2d");

    const updateCanvasSize = () => {
      if (cardRef.current && canvas) {
        const rect = cardRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    updateCanvasSize();

    let running = true;
    const render = () => {
      if (!running) return;
      
      const particles = particlesRef.current;
      
      // Only clear and render if there are particles or we are hovered
      if (particles.length > 0 || isHovered) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.022;
          p.size *= 0.97;

          if (p.alpha <= 0 || p.size <= 0.2) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw subtle spatial constellation links between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 45) {
              ctx.save();
              ctx.globalAlpha = (1 - dist / 45) * 0.25 * Math.min(particles[i].alpha, particles[j].alpha);
              ctx.strokeStyle = "#00f0ff";
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      if (particles.length > 0 || isHovered) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    if (isHovered || particlesRef.current.length > 0) {
      render();
    }

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovered]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized coordinates (-0.5 to 0.5) from center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = (mouseX / width) - 0.5;
    const normY = (mouseY / height) - 0.5;

    x.set(normX);
    y.set(normY);

    mouseXRelative.set(mouseX / width);
    mouseYRelative.set(mouseY / height);

    // Spawn Spatial Particles at cursor
    if (particlesRef.current.length < 35) {
      const colors = ["#00f0ff", "#10b981", "#38bdf8", "#6366f1"];
      particlesRef.current.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8 - 0.4,
        size: Math.random() * 2.2 + 1.2,
        alpha: 0.9,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }, [x, y, mouseXRelative, mouseYRelative]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to center with spring overshoot & settling
    x.set(0);
    y.set(0);
    mouseXRelative.set(0.5);
    mouseYRelative.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        mass: 0.85,
        delay: index * 0.08,
      }}
      className="perspective-1000 w-full pointer-events-auto"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onCtaClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCtaClick?.();
          }
        }}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-obsidian-border/90 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 group cursor-pointer",
          isHovered
            ? "border-cyan-electric/55 shadow-[0_0_40px_rgba(0,240,255,0.18),inset_0_1px_0_rgba(255,255,255,0.12)]"
            : "hover:border-cyan-electric/25"
        )}
      >
        <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-cyan-electric/40" />
        <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-cyan-electric/40" />
        <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-cyan-electric/40" />
        <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-cyan-electric/40" />
        {/* Dynamic Glass Top Highlight Bar */}
        <div className={cn("absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r transition-opacity duration-500", accentColor, isHovered ? "opacity-100" : "opacity-40")} />

        {/* Dynamic Mouse Proximity Spotlight Radial Glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          style={{
            background: `radial-gradient(420px circle at ${spotlightX.get()} ${spotlightY.get()}, rgba(0, 240, 255, 0.14), transparent 80%)`,
          }}
        />

        {/* Spatial Interactive Particle Canvas Trail */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-20 w-full h-full"
        />

        {/* Floating Parallax Card Content */}
        <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }} className="relative z-10 space-y-4">
          
          {/* Module Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-obsidian-border bg-obsidian-surface/90 text-cyan-electric shadow-inner group-hover:scale-110 group-hover:border-cyan-electric/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-sans text-base font-bold text-white tracking-tight group-hover:text-cyan-electric transition-colors duration-200">
                  <motion.span layoutId={layoutId} className="inline-block">
                    {title}
                  </motion.span>
                </h3>
                <p className="font-sans font-medium text-slate-400 uppercase tracking-wider">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            {badge && (
              <span className={cn("font-sans text-xs uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1 font-bold shrink-0", badgeColor)}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {badge}
              </span>
            )}
          </div>

          {/* Module Description */}
          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            {description}
          </p>

          {/* Metrics Matrix */}
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 ">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/60">
                  <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 block">
                    {m.label}
                  </span>
                  <span className="font-sans text-xs font-bold text-slate-200 mt-0.5 block">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Interactive CTA Trigger */}
          <div className="pt-2 flex items-center justify-between ">
            <button type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCtaClick?.();
              }}
              className="font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-200 group/btn cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <span>{ctaText}</span>
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-cyan-electric" />
            </button>
            <span className="font-sans font-medium text-slate-400 uppercase tracking-wider">
              CASE STUDY
            </span>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * FloatingIntelligenceModules Component
 * Set of semi-transparent, glass-effect floating modules with 3D tilt physics
 */
export default function FloatingIntelligenceModules() {
  const { openFlagships, playClickSound } = useSystemCommand();

  const MODULES = [
    {
      title: "ops.dronly.in",
      subtitle: "UAV command & telemetry",
      icon: Radio,
      badge: "SIMULATION",
      badgeColor: "text-cyan-electric border-cyan-electric/40 bg-cyan-electric/10",
      accentColor: "from-cyan-electric via-emerald-glow/40 to-transparent",
      description: "Command-and-control architecture for commercial drone fleets. Modeled MQTT, WebRTC, and spatial viewport — not a live fleet controller.",
      metrics: [
        { label: "DOMAIN", value: "UAV C2" },
        { label: "STATUS", value: "Case study" }
      ],
      ctaText: "Open case study",
      layoutId: "case-title-ops-dronly",
      onCtaClick: () => {
        playClickSound();
        openFlagships(CASE_STUDIES.find((m) => m.missionId === "ops-dronly"));
      }
    },
    {
      title: "Healthcare Systems",
      subtitle: "Clinical movement & physio",
      icon: Activity,
      badge: "PROTOTYPE",
      badgeColor: "text-amber-400 border-amber-400/40 bg-amber-400/10",
      accentColor: "from-amber-400 via-rose-500/30 to-transparent",
      description: "Physiotherapy discovery, biomechanics analysis, and patient biofeedback interfaces. Documented prototypes, not a clinic network.",
      metrics: [
        { label: "DOMAIN", value: "Clinical" },
        { label: "STATUS", value: "Prototype" }
      ],
      ctaText: "Open case study",
      layoutId: "case-title-sports-physio",
      onCtaClick: () => {
        playClickSound();
        openFlagships(CASE_STUDIES.find((m) => m.missionId === "sports-physio"));
      }
    },
    {
      title: "Prodent OS",
      subtitle: "Multi-clinic clinical OS",
      icon: Cpu,
      badge: "MODELED",
      badgeColor: "text-violet-400 border-violet-400/40 bg-violet-400/10",
      accentColor: "from-violet-400 via-cyan-electric/30 to-transparent",
      description: "Event-sourced EMR architecture for multi-clinic operations. Modeled CQRS and GraphQL federation — not a production clinical network.",
      metrics: [
        { label: "DOMAIN", value: "EMR / ITSM" },
        { label: "STATUS", value: "Modeled" }
      ],
      ctaText: "Open case study",
      layoutId: "case-title-prodent-os",
      onCtaClick: () => {
        playClickSound();
        openFlagships(CASE_STUDIES.find((m) => m.missionId === "prodent-os"));
      }
    },
    {
      title: "Career OS",
      subtitle: "Talent graph engine",
      icon: Layers,
      badge: "PROTOTYPE",
      badgeColor: "text-emerald-glow border-emerald-glow/40 bg-emerald-glow/10",
      accentColor: "from-emerald-glow via-cyan-electric/40 to-transparent",
      description: "Internal engine that turns unstructured project notes into structured engineering dossiers. Used for this portfolio’s own evidence model.",
      metrics: [
        { label: "DOMAIN", value: "Talent graph" },
        { label: "STATUS", value: "Internal" }
      ],
      ctaText: "Open case study",
      layoutId: "case-title-career-os",
      onCtaClick: () => {
        playClickSound();
        openFlagships(CASE_STUDIES.find((m) => m.missionId === "career-os"));
      }
    }
  ];

  return (
    <section className="relative w-full py-2">
      {/* Section Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-obsidian-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-electric tracking-widest uppercase mb-1">
            <Sparkles size={14} className="text-cyan-electric" />
            <span>CASE STUDIES</span>
          </div>
          <h2 className="font-sans text-2xl font-extrabold text-white sm:text-3xl tracking-tight drop-shadow-[0_0_24px_rgba(0,240,255,0.12)]">
            Selected work
          </h2>
        </div>
        <p className="font-sans text-sm text-slate-400 max-w-md leading-relaxed">
          Four architecture dossiers. Each is labeled honestly: simulation, prototype, or modeled.
        </p>
      </div>

      {/* Grid of 3D Tilt Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MODULES.map((mod, index) => (
          <Glass3DTiltCard key={mod.title} index={index} {...mod} />
        ))}
      </div>
    </section>
  );
}
