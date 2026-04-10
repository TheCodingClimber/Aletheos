import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const CYAN = "#00F0FF";
const CYAN_DIM = "rgba(0,240,255,0.05)";
const CYAN_MID = "rgba(0,240,255,0.12)";
const CYAN_GLOW = "rgba(0,240,255,0.3)";
const RED = "#FF3B5C";
const GREEN = "#00E676";
const AMBER = "#FFB300";
const BG = "#06080C";
const BG_CARD = "#0A0E15";
const BG_SURFACE = "#0D1219";
const TEXT = "#E4EAF0";
const TEXT_DIM = "#445066";
const BORDER = "rgba(0,240,255,0.06)";
const DISPLAY = "'Rajdhani', sans-serif";
const MONO = "'Share Tech Mono', monospace";
const SANS = "'Exo 2', sans-serif";

/* ─── THREE.JS HUD HERO ─── */
function HUDScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    let frame, renderer;
    const w = el.clientWidth, h = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 7);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ringGeo1 = new THREE.RingGeometry(2.2, 2.25, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    group.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(1.6, 1.63, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    group.add(ring2);

    const ringGeo3 = new THREE.RingGeometry(2.8, 2.82, 6);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    group.add(ring3);

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = 2.8;
      const dotGeo = new THREE.CircleGeometry(0.06, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.5 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      group.add(dot);
    }

    const coreGeo = new THREE.CircleGeometry(0.5, 6);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.08 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    const coreRingGeo = new THREE.RingGeometry(0.48, 0.52, 6);
    const coreRingMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    group.add(coreRing);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const len = i % 2 === 0 ? 0.3 : 0.15;
      const geo = new THREE.BufferGeometry();
      const inner = 2.25;
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
        Math.cos(a) * inner, Math.sin(a) * inner, 0,
        Math.cos(a) * (inner + len), Math.sin(a) * (inner + len), 0,
      ]), 3));
      const mat = new THREE.LineBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.25 });
      group.add(new THREE.LineSegments(geo, mat));
    }

    const scanGeo = new THREE.BufferGeometry();
    const scanVerts = [];
    for (let i = 0; i <= 30; i++) {
      const a = (i / 30) * Math.PI * 0.5;
      scanVerts.push(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0);
      scanVerts.push(Math.cos(a) * 2.25, Math.sin(a) * 2.25, 0);
    }
    scanGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(scanVerts), 3));
    const scanMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    const scan = new THREE.Mesh(scanGeo, scanMat);
    group.add(scan);

    const dataNodes = [];
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 1.2;
      const geo = new THREE.CircleGeometry(0.03, 8);
      const mat = new THREE.MeshBasicMaterial({ color: i < 6 ? 0x00E676 : 0xFF3B5C, transparent: true, opacity: 0.6 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      group.add(mesh);
      dataNodes.push({ mesh, angle: a, radius: r, speed: 0.2 + Math.random() * 0.3, mat });
    }

    const mouseRef = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseRef.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    el.addEventListener("mousemove", onMove);

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      ring1.rotation.z = t * 0.1;
      ring2.rotation.z = -t * 0.15;
      ring3.rotation.z = t * 0.05;
      coreRing.rotation.z = -t * 0.3;
      scan.rotation.z = t * 0.4;

      const pulse = Math.sin(t * 2) * 0.05 + 0.1;
      coreMat.opacity = 0.08 + pulse;

      dataNodes.forEach(n => {
        n.angle += n.speed * 0.01;
        n.mesh.position.x = Math.cos(n.angle) * n.radius;
        n.mesh.position.y = Math.sin(n.angle) * n.radius;
        n.mat.opacity = 0.4 + Math.sin(t * 3 + n.angle) * 0.3;
      });

      group.rotation.x = mouseRef.y * 0.15;
      group.rotation.y = mouseRef.x * 0.15;

      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("mousemove", onMove);
      if (renderer && el.contains(renderer.domElement)) { renderer.dispose(); el.removeChild(renderer.domElement); }
    };
  }, []);
  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />;
}

/* ─── UTILITIES ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Pulse({ color = GREEN, size = 8 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
      <div style={{
        position: "absolute", inset: -3, borderRadius: "50%", border: `1px solid ${color}`, opacity: 0,
        animation: "alPulse 2s ease-out infinite",
      }} />
    </div>
  );
}

/* ─── HASH VISUALIZER ─── */
function HashStream() {
  const [hashes, setHashes] = useState([]);
  useEffect(() => {
    const chars = "0123456789abcdef";
    const gen = () => Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * 16)]).join("");
    const interval = setInterval(() => {
      setHashes(prev => {
        const next = [{ hash: gen(), status: Math.random() > 0.12 ? "VALID" : "STALE", time: Date.now() }, ...prev];
        return next.slice(0, 6);
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {hashes.map((h, i) => (
        <div key={h.time} style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.35rem 0.75rem", background: i === 0 ? CYAN_DIM : "transparent",
          fontFamily: MONO, fontSize: 11,
          opacity: 1 - i * 0.12,
          animation: i === 0 ? "hashSlide 0.3s ease" : "none",
        }}>
          <Pulse color={h.status === "VALID" ? GREEN : AMBER} size={5} />
          <span style={{ color: CYAN, opacity: 0.6 }}>{h.hash}</span>
          <span style={{ color: h.status === "VALID" ? GREEN : AMBER, fontSize: 9, letterSpacing: 1 }}>{h.status}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── MOCK CONSOLE ─── */
function ConsoleMockup() {
  const [ref, vis] = useReveal(0.2);
  const [activeMetric, setActiveMetric] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setActiveMetric(p => (p + 1) % 4), 2500);
    return () => clearInterval(i);
  }, []);
  const metrics = [
    { label: "ENTITIES GOVERNED", value: "4", status: "ACTIVE" },
    { label: "STATE INTEGRITY", value: "100%", status: "VERIFIED" },
    { label: "DRIFT DETECTED", value: "0", status: "CLEAN" },
    { label: "AUDIT ENTRIES", value: "12,847", status: "LOGGING" },
  ];
  return (
    <div ref={ref} style={{
      background: BG_CARD, border: `1px solid ${BORDER}`, overflow: "hidden",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        padding: "0.5rem 1rem", background: BG_SURFACE,
        borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Pulse color={GREEN} size={6} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: GREEN, letterSpacing: 1 }}>ALETHEOS CONTROL PLANE</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 9, color: TEXT_DIM }}>v2.4.1 · LIVE</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `1px solid ${BORDER}` }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            padding: "1rem 1.25rem",
            borderRight: i < 3 ? `1px solid ${BORDER}` : "none",
            background: activeMetric === i ? CYAN_DIM : "transparent",
            transition: "background 0.5s",
          }}>
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 2, color: TEXT_DIM, marginBottom: "0.35rem" }}>{m.label}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: TEXT }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem" }}>
              <Pulse color={GREEN} size={4} />
              <span style={{ fontFamily: MONO, fontSize: 8, color: GREEN, letterSpacing: 1 }}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 160 }}>
        <div style={{ padding: "1rem 1.25rem", borderRight: `1px solid ${BORDER}` }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 2, color: CYAN, marginBottom: "0.75rem" }}>CRYPTOGRAPHIC VALIDATION</div>
          <HashStream />
        </div>
        <div style={{ padding: "1rem 1.25rem" }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 2, color: CYAN, marginBottom: "0.75rem" }}>ACTIVE WORKSTREAMS</div>
          {["Platform deployment v2.4", "Entity governance sync", "Infrastructure audit cycle", "Security policy enforcement"].map((w, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.35rem 0", borderBottom: `1px solid ${BORDER}`,
            }}>
              <Pulse color={i === 0 ? CYAN : GREEN} size={4} />
              <span style={{ fontFamily: MONO, fontSize: 10, color: i === 0 ? CYAN : TEXT_DIM }}>{w}</span>
              <span style={{
                marginLeft: "auto", fontFamily: MONO, fontSize: 8,
                color: i === 0 ? CYAN : TEXT_DIM, letterSpacing: 1,
              }}>{i === 0 ? "IN PROGRESS" : "NOMINAL"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "1rem 2.5rem",
      background: scrolled ? "rgba(6,8,12,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
      transition: "all 0.3s",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: 24, height: 24, border: `1.5px solid ${CYAN}`, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 6, height: 6, background: CYAN, borderRadius: "50%" }} />
        </div>
        <span style={{ fontFamily: DISPLAY, fontSize: 18, color: TEXT, fontWeight: 700, letterSpacing: 2 }}>
          ALETHEOS
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: TEXT_DIM, letterSpacing: 1 }}>BY M20R1</span>
        <a href="#contact" style={{
          fontFamily: SANS, fontSize: 12, color: BG, textDecoration: "none", fontWeight: 700,
          padding: "0.5rem 1.5rem", background: CYAN, letterSpacing: 0.5,
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.boxShadow = `0 0 20px ${CYAN_GLOW}`; }}
          onMouseLeave={e => { e.target.style.boxShadow = "none"; }}
        >Request Access</a>
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 300); }, []);
  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <HUDScene />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(6,8,12,0.85) 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", textAlign: "center", padding: "0 2rem",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, color: CYAN, letterSpacing: 5, marginBottom: "2rem",
          opacity: vis ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
        }}>
          <Pulse color={CYAN} size={6} /> <span style={{ marginLeft: 8 }}>SYSTEM ONLINE · GOVERNANCE ACTIVE</span>
        </div>
        <h1 style={{
          fontFamily: DISPLAY, fontSize: "clamp(3rem, 7vw, 6rem)",
          fontWeight: 700, lineHeight: 0.95, color: TEXT, margin: 0,
          letterSpacing: 3,
          opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(0.94)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.5s",
        }}>
          THE TRUTH<br />
          <span style={{ color: CYAN, textShadow: `0 0 40px ${CYAN_GLOW}` }}>ENGINE.</span>
        </h1>
        <p style={{
          fontFamily: SANS, fontSize: 17, lineHeight: 1.7, color: TEXT_DIM,
          maxWidth: 520, marginTop: "1.5rem",
          opacity: vis ? 1 : 0, transition: "opacity 0.6s ease 1s",
        }}>
          A command-grade operations platform for operators who need to know
          what is actually true right now. Not what someone entered last week.
          Not what a status report claims. What the machine can prove.
        </p>
        <div style={{
          position: "absolute", bottom: "3rem",
          opacity: vis ? 0.4 : 0, transition: "opacity 1s ease 2s",
        }}>
          <svg width="20" height="40" viewBox="0 0 20 40">
            <rect x="2" y="2" width="16" height="36" rx="8" fill="none" stroke={CYAN} strokeWidth="0.5" opacity="0.4" />
            <circle cx="10" cy="12" r="2" fill={CYAN}>
              <animate attributeName="cy" values="10;28;10" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes alPulse { 0% { opacity:0.5; transform:scale(0.8); } 100% { opacity:0; transform:scale(2.2); } }
        @keyframes hashSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </section>
  );
}

/* ─── FULL SCREEN STATEMENT ─── */
function Statement() {
  const [ref, vis] = useReveal(0.3);
  return (
    <section ref={ref} style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "6rem 2rem", borderTop: `1px solid ${BORDER}`,
    }}>
      <div style={{
        maxWidth: 850, textAlign: "center",
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
          fontWeight: 700, lineHeight: 1.35, color: TEXT, letterSpacing: 1,
        }}>
          The tools that exist for business operations are designed for{" "}
          <span style={{ color: TEXT_DIM, textDecoration: "line-through" }}>visibility</span>.
          <br />
          Aletheos is designed for{" "}
          <span style={{ color: CYAN, textShadow: `0 0 20px ${CYAN_GLOW}` }}>truth</span>.
        </div>
      </div>
    </section>
  );
}

/* ─── CONSOLE MOCKUP SECTION ─── */
function ConsoleSection() {
  const [ref, vis] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      maxWidth: 1100, margin: "0 auto", padding: "4rem 2.5rem 6rem",
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: CYAN, marginBottom: "1rem",
        textAlign: "center",
        opacity: vis ? 1 : 0, transition: "opacity 0.6s ease 0.2s",
      }}>LIVE CONSOLE PREVIEW</div>
      <h2 style={{
        fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: TEXT, margin: "0 0 2.5rem",
        textAlign: "center", letterSpacing: 1,
        opacity: vis ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
      }}>See everything. In real time.</h2>
      <ConsoleMockup />
    </section>
  );
}

/* ─── FEATURE BLOCKS ─── */
function FeatureSection() {
  const features = [
    {
      icon: "◆", label: "STATE INTEGRITY",
      title: "Cryptographic proof, not promises.",
      desc: "Aletheos validates state integrity against cryptographic hashes. It detects stale data and labels it stale instead of presenting it as current. You see what's real — not what someone forgot to update.",
      detail: "SHA-256 validation · Stale data detection · Hash chain verification · Tamper-evident logging",
    },
    {
      icon: "◈", label: "RULE ENFORCEMENT",
      title: "Hard gates, not suggestions.",
      desc: "Business rules enforced at the system level. Not as suggestions. Not as warning dialogs. As hard gates that block unauthorized actions and log every attempt.",
      detail: "Role-based enforcement · Action authorization · Attempt logging · Policy drift detection",
    },
    {
      icon: "◇", label: "OPERATOR CONTROL",
      title: "The truth, on any device.",
      desc: "Real-time view of every active workstream with priority ranking, phase tracking, blocker visibility, and artifact binding — from a desk or from a phone.",
      detail: "Desktop + mobile · Priority ranking · Phase tracking · Blocker alerts · Artifact binding",
    },
  ];
  return (
    <section style={{
      maxWidth: 1100, margin: "0 auto", padding: "4rem 2.5rem 6rem",
      borderTop: `1px solid ${BORDER}`,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: CYAN, marginBottom: "3rem", textAlign: "center" }}>
        CORE CAPABILITIES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {features.map((f, i) => {
          const [ref, vis] = useReveal(0.15);
          const [hovered, setHovered] = useState(false);
          return (
            <div ref={ref} key={i}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                display: "grid", gridTemplateColumns: "80px 1fr",
                gap: "2rem", padding: "3rem 2rem",
                borderBottom: `1px solid ${BORDER}`,
                background: hovered ? CYAN_DIM : "transparent",
                opacity: vis ? 1 : 0,
                transform: vis ? "translateX(0)" : "translateX(-30px)",
                transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, background 0.3s`,
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  fontSize: 28, color: CYAN, opacity: hovered ? 0.8 : 0.3,
                  transition: "opacity 0.3s",
                }}>{f.icon}</span>
                <span style={{
                  fontFamily: MONO, fontSize: 8, letterSpacing: 2, color: CYAN,
                  opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s",
                }}>{f.label}</span>
              </div>
              <div>
                <h3 style={{
                  fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: TEXT,
                  margin: "0 0 0.75rem", letterSpacing: 0.5,
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: SANS, fontSize: 14, lineHeight: 1.7, color: TEXT_DIM,
                  margin: 0, maxWidth: 550,
                }}>{f.desc}</p>
                <div style={{
                  marginTop: "1rem", fontFamily: MONO, fontSize: 10, color: CYAN,
                  letterSpacing: 0.5, lineHeight: 1.8,
                  maxHeight: hovered ? 40 : 0, overflow: "hidden",
                  opacity: hovered ? 0.6 : 0,
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}>{f.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── NOT COMPETING ─── */
function NotCompeting() {
  const [ref, vis] = useReveal(0.3);
  return (
    <section ref={ref} style={{
      padding: "6rem 2.5rem",
      background: BG_SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto", textAlign: "center",
        opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(0.96)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: CYAN, marginBottom: "2rem" }}>
          MARKET POSITION
        </div>
        <div style={{
          fontFamily: DISPLAY, fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
          fontWeight: 700, lineHeight: 1.4, color: TEXT, letterSpacing: 0.5,
        }}>
          We are not competing with{" "}
          <span style={{ color: TEXT_DIM, opacity: 2 }}>Notion</span>,{" "}
          <span style={{ color: TEXT_DIM, opacity: 2 }}>Monday</span>, or{" "}
          <span style={{ color: TEXT_DIM, opacity: 2 }}>Jira</span>.
        </div>
        <div style={{
          fontFamily: DISPLAY, fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
          fontWeight: 700, lineHeight: 1.4, color: TEXT, letterSpacing: 0.5,
          marginTop: "1rem",
        }}>
          We are building the{" "}
          <span style={{ color: CYAN, textShadow: `0 0 15px ${CYAN_GLOW}` }}>control plane</span>{" "}
          that sits above all of them.
        </div>
        <div style={{
          display: "flex", justifyContent: "center", gap: "3rem", marginTop: "3rem",
          fontFamily: MONO, fontSize: 9, letterSpacing: 2,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: TEXT_DIM, marginBottom: "0.25rem" }}>REPORTING</div>
            <div style={{ color: TEXT_DIM, opacity: 0.4 }}>What happened</div>
          </div>
          <div style={{ color: CYAN, fontSize: 16, alignSelf: "center" }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: CYAN }}>GOVERNANCE</div>
            <div style={{ color: CYAN, opacity: 0.6 }}>What happens next</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── GOVERNANCE vs REPORTING ─── */
function GovDiff() {
  const rows = [
    { reporting: "Shows you charts", governance: "Validates state integrity" },
    { reporting: "Displays colored statuses", governance: "Detects if data is stale" },
    { reporting: "Trusts manual entry", governance: "Enforces cryptographic proof" },
    { reporting: "Suggests best practices", governance: "Blocks unauthorized actions" },
    { reporting: "Generates after-the-fact reports", governance: "Surfaces truth in real time" },
  ];
  const [ref, vis] = useReveal(0.15);
  return (
    <section ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem 2.5rem" }}>
      <div style={{
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(25px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: CYAN, marginBottom: "1rem", textAlign: "center" }}>
          THE DIFFERENCE
        </div>
        <h2 style={{
          fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: TEXT,
          margin: "0 0 3rem", textAlign: "center", letterSpacing: 1,
        }}>Reporting tells you. Governance ensures.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 60px 1fr",
            padding: "0.75rem 0", marginBottom: "0.5rem",
          }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: TEXT_DIM, letterSpacing: 2, textAlign: "center" }}>REPORTING TOOLS</span>
            <span />
            <span style={{ fontFamily: MONO, fontSize: 9, color: CYAN, letterSpacing: 2, textAlign: "center" }}>ALETHEOS</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 60px 1fr",
              padding: "1rem 1.5rem", borderTop: `1px solid ${BORDER}`,
              alignItems: "center",
            }}>
              <span style={{
                fontFamily: SANS, fontSize: 14, color: TEXT_DIM,
                textAlign: "center", textDecoration: "line-through", opacity: 0.5,
              }}>{r.reporting}</span>
              <div style={{ textAlign: "center" }}>
                <svg width="24" height="12" viewBox="0 0 24 12">
                  <line x1="0" y1="6" x2="20" y2="6" stroke={CYAN} strokeWidth="1" />
                  <polyline points="16,2 22,6 16,10" fill="none" stroke={CYAN} strokeWidth="1" />
                </svg>
              </div>
              <span style={{
                fontFamily: SANS, fontSize: 14, color: CYAN, textAlign: "center", fontWeight: 600,
              }}>{r.governance}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [ref, vis] = useReveal(0.15);
  const inp = (f) => ({
    width: "100%", padding: "0.875rem 1rem", fontFamily: SANS, fontSize: 14,
    background: BG_CARD, border: `1px solid ${focused === f ? CYAN : BORDER}`,
    color: TEXT, outline: "none", transition: "all 0.2s", boxSizing: "border-box",
    boxShadow: focused === f ? `0 0 0 2px ${CYAN_DIM}` : "none",
  });
  return (
    <section id="contact" ref={ref} style={{
      maxWidth: 1100, margin: "0 auto", padding: "6rem 2.5rem 8rem",
      borderTop: `1px solid ${BORDER}`,
    }}>
      <div style={{
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(25px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: CYAN, marginBottom: "1.5rem" }}>
              REQUEST ACCESS
            </div>
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, color: TEXT,
              margin: "0 0 1rem", letterSpacing: 1,
            }}>Ready to see the truth?</h2>
            <p style={{ fontFamily: SANS, fontSize: 14, color: TEXT_DIM, lineHeight: 1.7 }}>
              Aletheos is built for operators who run complex, multi-entity,
              high-accountability operations. If that's you — request access.
            </p>
            <div style={{
              marginTop: "2rem", padding: "1.5rem",
              background: BG_CARD, border: `1px solid ${BORDER}`,
            }}>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 2, color: CYAN, marginBottom: "1rem" }}>
                PLATFORM INCLUDES
              </div>
              {["Real-time state validation", "Cryptographic audit trails", "Multi-entity governance", "Desktop + mobile control", "Rule enforcement engine"].map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.35rem 0",
                }}>
                  <Pulse color={GREEN} size={4} />
                  <span style={{ fontFamily: MONO, fontSize: 11, color: TEXT_DIM }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} style={inp("name")} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} style={inp("email")} />
            <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
              onFocus={() => setFocused("company")} onBlur={() => setFocused(null)} style={inp("company")} />
            <textarea placeholder="Tell us about your operations" rows={5} value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
              style={{ ...inp("message"), resize: "vertical" }} />
            <button style={{
              padding: "0.8rem 2.5rem", background: CYAN, border: "none", color: BG,
              fontFamily: SANS, fontSize: 14, fontWeight: 700, cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              letterSpacing: 0.5,
            }}
              onMouseEnter={e => { e.target.style.boxShadow = `0 0 30px ${CYAN_GLOW}`; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.boxShadow = "none"; e.target.style.transform = "translateY(0)"; }}
            >Request Access</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{
      maxWidth: 1100, margin: "0 auto", padding: "2rem 2.5rem",
      borderTop: `1px solid ${BORDER}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 16, height: 16, border: `1px solid ${CYAN}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 4, height: 4, background: CYAN, borderRadius: "50%" }} />
        </div>
        <span style={{ fontFamily: SANS, fontSize: 12, color: TEXT_DIM }}>© {new Date().getFullYear()} Aletheos · Built by M20R1</span>
      </div>
      <span style={{ fontFamily: MONO, fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>A NOVE MANI PRODUCT</span>
    </footer>
  );
}

/* ─── APP ─── */
export default function AletheosLanding() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Exo+2:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Nav />
      <Hero />
      <Statement />
      <ConsoleSection />
      <FeatureSection />
      <NotCompeting />
      <GovDiff />
      <ContactForm />
      <Footer />
    </div>
  );
}
