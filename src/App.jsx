import { useEffect, useRef, useState } from "react";
import "./App.css";

const CYAN = "#00F0FF";
const CYAN_DIM = "rgba(0, 240, 255, 0.05)";
const GREEN = "#00E676";
const AMBER = "#FFB300";
const BG_CARD = "#0A0E15";
const BG_SURFACE = "#0D1219";
const TEXT = "#E4EAF0";
const TEXT_DIM = "#7D8AA4";
const BORDER = "rgba(0, 240, 255, 0.08)";
const DISPLAY = "'Rajdhani', sans-serif";
const MONO = "'Share Tech Mono', monospace";

const heroSignals = [
  "Truth over reporting",
  "Command-grade governance",
  "Live state validation",
];

const proofMetrics = [
  {
    value: "4",
    target: 4,
    label: "entities governed",
    status: "active",
    note: "live entities linked",
    accent: CYAN,
  },
  {
    value: "100%",
    target: 100,
    suffix: "%",
    label: "state integrity",
    status: "verified",
    note: "fresh across every surface",
    accent: GREEN,
  },
  {
    value: "0",
    target: 0,
    label: "drift detected",
    status: "clean",
    note: "no unresolved divergence",
    accent: GREEN,
  },
  {
    value: "12,847",
    target: 12847,
    format: "comma",
    label: "audit entries",
    status: "logging",
    note: "append-only proof stream",
    accent: AMBER,
  },
];

const features = [
  {
    label: "STATE INTEGRITY",
    title: "Cryptographic proof, not promises.",
    desc: "Aletheos validates state integrity against cryptographic hashes. It detects stale data and labels it stale instead of presenting it as current. You see what is real, not what someone forgot to update.",
    detail: "SHA-256 validation, stale data detection, hash chain verification, tamper-evident logging.",
  },
  {
    label: "RULE ENFORCEMENT",
    title: "Hard gates, not suggestions.",
    desc: "Business rules are enforced at the system level. Not as suggestions. Not as warning dialogs. As hard gates that block unauthorized actions and log every attempt.",
    detail: "Role-based enforcement, action authorization, attempt logging, policy drift detection.",
  },
  {
    label: "OPERATOR CONTROL",
    title: "The truth, on any device.",
    desc: "Real-time visibility across active workstreams with priority ranking, phase tracking, blocker visibility, and artifact binding from a desk or from a phone.",
    detail: "Desktop and mobile control, ranked priorities, blocker alerts, artifact binding.",
  },
];

const protocolLayers = [
  {
    step: "01",
    title: "Observe",
    tag: "Multi-source intake",
    body: "Continuously ingest operational signals from the systems teams already use.",
  },
  {
    step: "02",
    title: "Verify",
    tag: "Integrity checks",
    body: "Validate freshness, integrity, and permissions before state can be trusted.",
  },
  {
    step: "03",
    title: "Govern",
    tag: "Policy lock",
    body: "Route decisions through hard rules so the next action is enforced, not suggested.",
  },
];

const protocolNetworkPaths = [
  { d: "M50 50 C46 41 40 32 28 24", endpointX: "28", endpointY: "24" },
  { d: "M50 50 C54 41 60 32 72 24", endpointX: "72", endpointY: "24" },
  { d: "M50 50 C50 60 50 70 50 82", endpointX: "50", endpointY: "82" },
];

const controlPlaneFeeds = [
  { label: "OPERATIONS", detail: "Live workflows" },
  { label: "RECORDS", detail: "Current state" },
  { label: "POLICY", detail: "Rule locks" },
];

const controlPlanePaths = [
  { d: "M20 78 C25 68 30 57 36 45 C39 39 41 33 43 27", sourceX: "20", sourceY: "78", endpointX: "43", endpointY: "27" },
  { d: "M50 78 C50 66 50 54 50 42 C50 35 50 30 50 27", sourceX: "50", sourceY: "78", endpointX: "50", endpointY: "27" },
  { d: "M80 78 C75 68 70 57 64 45 C61 39 59 33 57 27", sourceX: "80", sourceY: "78", endpointX: "57", endpointY: "27" },
];

const governanceRows = [
  { reporting: "Shows you charts", governance: "Validates state integrity" },
  { reporting: "Displays colored statuses", governance: "Detects stale data" },
  { reporting: "Trusts manual entry", governance: "Requires cryptographic proof" },
  { reporting: "Suggests best practices", governance: "Blocks unauthorized actions" },
  { reporting: "Reports after the fact", governance: "Surfaces truth in real time" },
];

const requestIncludes = [
  "Real-time state validation",
  "Cryptographic audit trails",
  "Multi-entity governance",
  "Desktop and mobile control",
  "Rule enforcement engine",
];

const bridgeSequences = [
  {
    eyebrow: "STATE PROPAGATION",
    items: ["source locked", "proof streaming", "control layer ready"],
  },
  {
    eyebrow: "TRUTH SYNC",
    items: ["console verified", "operators aligned", "enforcement primed"],
  },
];

function HUDScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;

    if (!el) {
      return undefined;
    }

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed || !el) {
        return;
      }

      let frame = 0;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      el.appendChild(renderer.domElement);

      const resize = () => {
        const width = Math.max(el.clientWidth, 1);
        const height = Math.max(el.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      resize();

      const group = new THREE.Group();
      scene.add(group);

      const disposableMaterials = [];
      const disposableGeometries = [];

      const trackMaterial = (material) => {
        disposableMaterials.push(material);
        return material;
      };

      const trackGeometry = (geometry) => {
        disposableGeometries.push(geometry);
        return geometry;
      };

      const ring1 = new THREE.Mesh(
        trackGeometry(new THREE.RingGeometry(2.2, 2.25, 64)),
        trackMaterial(
          new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
          }),
        ),
      );
      group.add(ring1);

      const ring2 = new THREE.Mesh(
        trackGeometry(new THREE.RingGeometry(1.6, 1.63, 64)),
        trackMaterial(
          new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
          }),
        ),
      );
      group.add(ring2);

      const ring3 = new THREE.Mesh(
        trackGeometry(new THREE.RingGeometry(2.8, 2.82, 6)),
        trackMaterial(
          new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.08,
            side: THREE.DoubleSide,
          }),
        ),
      );
      group.add(ring3);

      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2;
        const dot = new THREE.Mesh(
          trackGeometry(new THREE.CircleGeometry(0.06, 16)),
          trackMaterial(
            new THREE.MeshBasicMaterial({
              color: 0x00f0ff,
              transparent: true,
              opacity: 0.5,
            }),
          ),
        );

        dot.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0);
        group.add(dot);
      }

      const coreMat = trackMaterial(
        new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.08,
        }),
      );

      const core = new THREE.Mesh(trackGeometry(new THREE.CircleGeometry(0.5, 6)), coreMat);
      group.add(core);

      const coreRing = new THREE.Mesh(
        trackGeometry(new THREE.RingGeometry(0.48, 0.52, 6)),
        trackMaterial(
          new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
          }),
        ),
      );
      group.add(coreRing);

      for (let index = 0; index < 12; index += 1) {
        const angle = (index / 12) * Math.PI * 2;
        const lineLength = index % 2 === 0 ? 0.3 : 0.15;
        const geometry = trackGeometry(new THREE.BufferGeometry());
        const inner = 2.25;

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([
              Math.cos(angle) * inner,
              Math.sin(angle) * inner,
              0,
              Math.cos(angle) * (inner + lineLength),
              Math.sin(angle) * (inner + lineLength),
              0,
            ]),
            3,
          ),
        );

        group.add(
          new THREE.LineSegments(
            geometry,
            trackMaterial(
              new THREE.LineBasicMaterial({
                color: 0x00f0ff,
                transparent: true,
                opacity: 0.25,
              }),
            ),
          ),
        );
      }

      const scanGeo = trackGeometry(new THREE.BufferGeometry());
      const scanVerts = [];

      for (let index = 0; index <= 30; index += 1) {
        const angle = (index / 30) * Math.PI * 0.5;
        scanVerts.push(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0);
        scanVerts.push(Math.cos(angle) * 2.25, Math.sin(angle) * 2.25, 0);
      }

      scanGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(scanVerts), 3));

      const scan = new THREE.Mesh(
        scanGeo,
        trackMaterial(
          new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.04,
            side: THREE.DoubleSide,
          }),
        ),
      );
      group.add(scan);

      const dataNodes = [];

      for (let index = 0; index < 8; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.8 + Math.random() * 1.2;
        const material = trackMaterial(
          new THREE.MeshBasicMaterial({
            color: index < 6 ? 0x00e676 : 0xff3b5c,
            transparent: true,
            opacity: 0.6,
          }),
        );
        const mesh = new THREE.Mesh(trackGeometry(new THREE.CircleGeometry(0.03, 8)), material);

        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        group.add(mesh);
        dataNodes.push({
          mesh,
          angle,
          radius,
          speed: 0.2 + Math.random() * 0.3,
          material,
        });
      }

      const mouse = { x: 0, y: 0 };

      const onMove = (event) => {
        const rect = el.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        mouse.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      el.addEventListener("mousemove", onMove);
      window.addEventListener("resize", resize);

      const animate = () => {
        frame = window.requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        ring1.rotation.z = time * 0.1;
        ring2.rotation.z = -time * 0.15;
        ring3.rotation.z = time * 0.05;
        coreRing.rotation.z = -time * 0.3;
        scan.rotation.z = time * 0.4;

        coreMat.opacity = 0.08 + (Math.sin(time * 2) * 0.05 + 0.1);

        dataNodes.forEach((node) => {
          node.angle += node.speed * 0.01;
          node.mesh.position.x = Math.cos(node.angle) * node.radius;
          node.mesh.position.y = Math.sin(node.angle) * node.radius;
          node.material.opacity = 0.4 + Math.sin(time * 3 + node.angle) * 0.3;
        });

        group.rotation.x = mouse.y * 0.15;
        group.rotation.y = mouse.x * 0.15;

        renderer.render(scene, camera);
      };

      animate();

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        el.removeEventListener("mousemove", onMove);

        scene.traverse((object) => {
          if ("geometry" in object && object.geometry) {
            object.geometry.dispose?.();
          }

          if ("material" in object && object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose?.());
            } else {
              object.material.dispose?.();
            }
          }
        });

        disposableGeometries.forEach((geometry) => geometry.dispose?.());
        disposableMaterials.forEach((material) => material.dispose?.());

        renderer.dispose();

        if (el.contains(renderer.domElement)) {
          el.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className="hud-scene" aria-hidden="true" />;
}

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function useCountUp(target, enabled, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let frame = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [duration, enabled, target]);

  return enabled ? value : 0;
}

function formatMetricValue(metric, value) {
  const formatted = metric.format === "comma" ? value.toLocaleString() : value.toString();
  return `${formatted}${metric.suffix ?? ""}`;
}

function Pulse({ color = GREEN, size = 8 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 14px ${color}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          opacity: 0,
          animation: "alPulse 2s ease-out infinite",
        }}
      />
    </div>
  );
}

function HashStream() {
  const [hashes, setHashes] = useState([]);

  useEffect(() => {
    const chars = "0123456789abcdef";
    const createHash = () =>
      Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const interval = window.setInterval(() => {
      setHashes((previous) => {
        const next = [
          {
            hash: createHash(),
            status: Math.random() > 0.12 ? "VALID" : "STALE",
            time: Date.now(),
          },
          ...previous,
        ];

        return next.slice(0, 6);
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {hashes.map((entry, index) => (
        <div
          key={entry.time}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.35rem 0.75rem",
            background: index === 0 ? CYAN_DIM : "transparent",
            fontFamily: MONO,
            fontSize: 11,
            opacity: 1 - index * 0.12,
            animation: index === 0 ? "hashSlide 0.3s ease" : "none",
          }}
        >
          <Pulse color={entry.status === "VALID" ? GREEN : AMBER} size={5} />
          <span style={{ color: CYAN, opacity: 0.6 }}>{entry.hash}</span>
          <span
            style={{
              color: entry.status === "VALID" ? GREEN : AMBER,
              fontSize: 9,
              letterSpacing: 1,
            }}
          >
            {entry.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConsoleMockup() {
  const [ref, visible] = useReveal(0.2);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMetric((previous) => (previous + 1) % 4);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        minWidth: 780,
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div
        style={{
          padding: "0.5rem 1rem",
          background: BG_SURFACE,
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Pulse color={GREEN} size={6} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: GREEN, letterSpacing: 1 }}>
            ALETHEOS CONTROL PLANE
          </span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 9, color: TEXT_DIM }}>v2.4.1 | LIVE</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `1px solid ${BORDER}` }}>
        {proofMetrics.map((metric, index) => (
          <div
            key={metric.label}
            style={{
              padding: "1rem 1.25rem",
              borderRight: index < proofMetrics.length - 1 ? `1px solid ${BORDER}` : "none",
              background: activeMetric === index ? CYAN_DIM : "transparent",
              transition: "background 0.5s",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 8,
                letterSpacing: 2,
                color: TEXT_DIM,
                marginBottom: "0.35rem",
                textTransform: "uppercase",
              }}
            >
              {metric.label}
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: TEXT }}>
              {metric.value}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem" }}>
              <Pulse color={GREEN} size={4} />
              <span style={{ fontFamily: MONO, fontSize: 8, color: GREEN, letterSpacing: 1 }}>
                {metric.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 160 }}>
        <div style={{ padding: "1rem 1.25rem", borderRight: `1px solid ${BORDER}` }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 2, color: CYAN, marginBottom: "0.75rem" }}>
            CRYPTOGRAPHIC VALIDATION
          </div>
          <HashStream />
        </div>
        <div style={{ padding: "1rem 1.25rem" }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 2, color: CYAN, marginBottom: "0.75rem" }}>
            ACTIVE WORKSTREAMS
          </div>
          {[
            "Platform deployment v2.4",
            "Entity governance sync",
            "Infrastructure audit cycle",
            "Security policy enforcement",
          ].map((workstream, index) => (
            <div
              key={workstream}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <Pulse color={index === 0 ? CYAN : GREEN} size={4} />
              <span style={{ fontFamily: MONO, fontSize: 10, color: index === 0 ? CYAN : TEXT_DIM }}>
                {workstream}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: MONO,
                  fontSize: 8,
                  color: index === 0 ? CYAN : TEXT_DIM,
                  letterSpacing: 1,
                }}
              >
                {index === 0 ? "IN PROGRESS" : "NOMINAL"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body, align = "center" }) {
  return (
    <div className={`section-intro section-intro--${align}`}>
      <p className="section-intro__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p className="section-intro__body">{body}</p> : null}
    </div>
  );
}

function LogoMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <span className="logo-mark__ring" />
      <span className="logo-mark__core" />
    </div>
  );
}

function ControlPlaneLiftVisual() {
  const [activeFeed, setActiveFeed] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveFeed((current) => (current + 1) % controlPlaneFeeds.length);
    }, 2100);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="control-plane" aria-hidden="true">
      <div className="control-plane__halo" />
      <div className="control-plane__grid" />

      <div className="control-plane__plane">
        <div className="control-plane__plane-shell">
          <span className="control-plane__eyebrow">ALETHEOS</span>
          <strong>CONTROL LAYER</strong>
          <small>Governance above your stack</small>
        </div>
        <div className="control-plane__plane-glow" />
      </div>

      <div className="control-plane__scan" />

      <svg className="control-plane__network" viewBox="0 0 100 100" preserveAspectRatio="none">
        {controlPlanePaths.map((path, index) => {
          const isActive = activeFeed === index;

          return (
            <g
              key={path.d}
              className={`control-plane__trace control-plane__trace--${index + 1}${isActive ? " is-active" : ""}`}
            >
              <path className="control-plane__path" d={path.d} />
              <circle className="control-plane__source-dot" cx={path.sourceX} cy={path.sourceY} r="1.45" />
              <circle className="control-plane__endpoint" cx={path.endpointX} cy={path.endpointY} r="1.65" />
              <circle className="control-plane__packet" r="1.25">
                <animateMotion
                  dur="3.1s"
                  repeatCount="indefinite"
                  begin={`${index * 0.4}s`}
                  path={path.d}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      <div className="control-plane__sources">
        {controlPlaneFeeds.map((feed, index) => (
          <article
            key={feed.label}
            className={`control-plane__source control-plane__source--${index + 1}${activeFeed === index ? " is-active" : ""}`}
          >
            <span>{feed.label}</span>
            <small>{feed.detail}</small>
            <div className="control-plane__bars">
              <i />
              <i />
              <i />
            </div>
          </article>
        ))}
      </div>

      <div className="control-plane__status">
        {controlPlaneFeeds.map((feed, index) => (
          <span
            key={feed.label}
            className={`control-plane__status-pill${activeFeed === index ? " is-active" : ""}`}
          >
            {feed.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProtocolEngineVisual() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % protocolLayers.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="protocol-engine" aria-hidden="true">
      <div className="protocol-engine__wash" />
      <div className="protocol-engine__grid" />
      <div className="protocol-engine__rings">
        <span className="protocol-engine__ring protocol-engine__ring--outer" />
        <span className="protocol-engine__ring protocol-engine__ring--mid" />
        <span className="protocol-engine__ring protocol-engine__ring--inner" />
      </div>
      <div className="protocol-engine__sweep" />

      <svg className="protocol-engine__network" viewBox="0 0 100 100" preserveAspectRatio="none">
        {protocolNetworkPaths.map((path, index) => {
          const isActive = activeStage === index;

          return (
            <g
              key={path.d}
              className={`protocol-engine__trace protocol-engine__trace--${index + 1}${isActive ? " is-active" : ""}`}
            >
              <path className="protocol-engine__path" d={path.d} />
              <circle className="protocol-engine__endpoint" cx={path.endpointX} cy={path.endpointY} r="1.7" />
              <circle className="protocol-engine__packet" r="1.2">
                <animateMotion
                  dur="3.4s"
                  repeatCount="indefinite"
                  begin={`${index * 0.45}s`}
                  path={path.d}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      <div className="protocol-engine__core">
        <div className="protocol-engine__core-shell">
          <span>TRUTH</span>
          <small>engine</small>
        </div>
        <div className="protocol-engine__core-flare" />
      </div>

      {protocolLayers.map((layer, index) => (
        <article
          key={layer.step}
          className={`protocol-engine__node protocol-engine__node--${index + 1}${activeStage === index ? " is-active" : ""}`}
        >
          <span className="protocol-engine__node-step">{layer.step}</span>
          <strong>{layer.title}</strong>
          <small>{layer.tag}</small>
        </article>
      ))}

      <div className="protocol-engine__ticker">
        {protocolLayers.map((layer, index) => (
          <span
            key={layer.title}
            className={`protocol-engine__ticker-item${activeStage === index ? " is-active" : ""}`}
          >
            {layer.title}
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}>
      <div className="site-nav__inner container">
        <a className="brand" href="#top" aria-label="Aletheos home">
          <LogoMark />
          <span className="brand__text">
            <strong>ALETHEOS</strong>
            <span>truth engine</span>
          </span>
        </a>

        <div className="site-nav__links" aria-label="Primary navigation">
          <a href="#architecture">Architecture</a>
          <a href="#console">Console</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#difference">Difference</a>
        </div>

        <a className="button button--small" href="#contact">
          Request Access
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="top">
      <HUDScene />
      <div className="hero__veil" />
      <div className="hero__grid-lines" aria-hidden="true" />

      <div className="hero__content container">
        <div className={`hero__copy${visible ? " is-visible" : ""}`}>
          <div className="hero__badge">
            <Pulse color={CYAN} size={6} />
            <span>SYSTEM ONLINE | GOVERNANCE ACTIVE</span>
          </div>

          <p className="hero__eyebrow">Command-grade operational truth for high-accountability teams</p>

          <h1>
            THE TRUTH
            <br />
            <span>ENGINE.</span>
          </h1>

          <p className="hero__body">
            Aletheos is a control plane for operators who need to know what is actually true right now.
            Not what someone entered last week. Not what a status report claims. What the machine can
            prove.
          </p>

          <div className="hero__actions">
            <a className="button" href="#contact">
              Request Access
            </a>
            <a className="button button--ghost" href="#difference">
              See the difference
            </a>
          </div>

          <div className="hero__signals" aria-label="Platform signals">
            {heroSignals.map((signal) => (
              <span key={signal} className="signal-chip">
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#architecture">
        Scroll to inspect
      </a>
    </section>
  );
}

function Statement() {
  const [ref, visible] = useReveal(0.25);

  return (
    <section className="statement container" ref={ref}>
      <div className={`statement__card${visible ? " is-visible" : ""}`}>
        <p className="section-intro__eyebrow">CORE PREMISE</p>
        <p className="statement__copy">
          The tools built for business operations optimize for <span>visibility</span>.
          <br />
          Aletheos is built for <strong>truth</strong>.
        </p>
      </div>
    </section>
  );
}

function ProofMetricCard({ metric, index, visible, active }) {
  const value = useCountUp(metric.target, visible, 1300 + index * 140);

  return (
    <article
      className={`proof-card${active ? " is-active" : ""}`}
      style={{ "--proof-accent": metric.accent, transitionDelay: `${index * 90}ms` }}
    >
      <div className="proof-card__status">
        <Pulse color={metric.accent} size={5} />
        <span>{metric.status}</span>
      </div>

      <div className="proof-card__value-row">
        <strong>{formatMetricValue(metric, value)}</strong>
        <em>{active ? "tracking" : "stable"}</em>
      </div>

      <p>{metric.label}</p>
      <small>{metric.note}</small>

      <div className="proof-card__meter" aria-hidden="true">
        {Array.from({ length: 7 }, (_, meterIndex) => (
          <span key={meterIndex} style={{ animationDelay: `${meterIndex * 0.12}s` }} />
        ))}
      </div>
    </article>
  );
}

function ProofStrip() {
  const [ref, visible] = useReveal(0.2);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMetric((current) => (current + 1) % proofMetrics.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="proof-strip container" ref={ref}>
      <div className={`proof-strip__header${visible ? " is-visible" : ""}`}>
        <span className="proof-strip__eyebrow">LIVE PROOF STRIP</span>
        <div className="proof-strip__feed">
          <Pulse color={GREEN} size={5} />
          <span>telemetry synchronized</span>
        </div>
      </div>

      <div className={`proof-strip__grid${visible ? " is-visible" : ""}`}>
        {proofMetrics.map((metric, index) => (
          <ProofMetricCard
            key={metric.label}
            metric={metric}
            index={index}
            visible={visible}
            active={activeMetric === index}
          />
        ))}
      </div>
    </section>
  );
}

function SignalBridge({ eyebrow, items }) {
  const [ref, visible] = useReveal(0.35);

  return (
    <section className="signal-bridge container" ref={ref}>
      <div className={`signal-bridge__inner${visible ? " is-visible" : ""}`}>
        <p className="signal-bridge__eyebrow">{eyebrow}</p>
        <div className="signal-bridge__track" aria-hidden="true">
          <span className="signal-bridge__pulse" />
        </div>
        <div className="signal-bridge__items">
          {items.map((item) => (
            <span key={item} className="signal-bridge__item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProtocolBanner() {
  const [ref, visible] = useReveal(0.18);

  return (
    <section className="protocol-banner container" ref={ref}>
      <div className={`protocol-banner__inner${visible ? " is-visible" : ""}`}>
        <div className="protocol-banner__copy">
          <div className="protocol-banner__status">
            <Pulse color={GREEN} size={6} />
            <span>Proof protocol online</span>
          </div>
          <h2>One layer above the tools you already have.</h2>
          <p>
            Aletheos sits above reporting systems, verifies incoming truth, and turns governance into
            an active machine instead of a policy document.
          </p>
          <dl className="protocol-banner__stats">
            {proofMetrics.slice(0, 3).map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="protocol-banner__visual">
          <ControlPlaneLiftVisual />
        </div>
      </div>
    </section>
  );
}

function EditorialBreak() {
  const [ref, visible] = useReveal(0.26);

  return (
    <section className="manifesto" ref={ref}>
      <div className={`manifesto__inner container${visible ? " is-visible" : ""}`}>
        <div className="manifesto__beam" aria-hidden="true" />
        <p className="section-intro__eyebrow">EDITORIAL BREAK</p>
        <div className="manifesto__grid">
          <h2>
            Truth is not a dashboard.
            <br />
            It is the gate between signal and action.
          </h2>

          <div className="manifesto__support">
            <p>
              Every system below the line can speak. Aletheos decides what counts before operators move,
              commit, approve, or deploy.
            </p>
            <div className="manifesto__tokens" aria-label="Editorial themes">
              <span>SIGNAL</span>
              <span>PROOF</span>
              <span>ACTION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const [ref, visible] = useReveal(0.18);

  return (
    <section className="architecture section-frame" id="architecture" ref={ref}>
      <div className="container architecture__grid">
        <div className={`architecture__copy${visible ? " is-visible" : ""}`}>
          <SectionIntro
            eyebrow="TRUTH PROTOCOL"
            title="Observe. Verify. Govern."
            body="Aletheos does not replace the software stack underneath your operation. It makes that stack accountable."
            align="left"
          />

          <div className="architecture__layers">
            {protocolLayers.map((layer) => (
              <article key={layer.step} className="layer-card">
                <span>{layer.step}</span>
                <div>
                  <h3>{layer.title}</h3>
                  <p>{layer.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={`architecture__visual${visible ? " is-visible" : ""}`}>
          <div className="architecture__screen">
            <ProtocolEngineVisual />
          </div>
          <div className="architecture__panel">
            <p className="section-intro__eyebrow">WHY THIS MATTERS</p>
            <p>
              When every source of truth can drift, the winning system is the one that detects drift,
              labels stale state, and blocks the wrong next move before it happens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConsoleSection() {
  const [ref, visible] = useReveal(0.1);

  return (
    <section className="console-section container" id="console" ref={ref}>
      <div className={`console-section__intro${visible ? " is-visible" : ""}`}>
        <SectionIntro
          eyebrow="LIVE CONSOLE PREVIEW"
          title="See everything. In real time."
          body="The console remains the center of gravity: live state, active workstreams, and proof signals in one place."
        />
      </div>

      <div className="console-shell">
        <ConsoleMockup />
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const [ref, visible] = useReveal(0.15);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      ref={ref}
      className={`feature-card${visible ? " is-visible" : ""}${hovered ? " is-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="feature-card__rail" aria-hidden="true">
        <span />
      </div>
      <div className="feature-card__content">
        <p className="section-intro__eyebrow">{feature.label}</p>
        <h3>{feature.title}</h3>
        <p>{feature.desc}</p>
        <small>{feature.detail}</small>
      </div>
    </article>
  );
}

function FeatureSection() {
  return (
    <section className="feature-section section-frame" id="capabilities">
      <div className="container">
        <SectionIntro
          eyebrow="CORE CAPABILITIES"
          title="Built to remove ambiguity from operations."
          body="Every surface on the page now tells the same story: Aletheos is for teams that need proof, control, and enforced next actions."
        />

        <div className="feature-section__grid">
          {features.map((feature, index) => (
            <FeatureCard key={feature.label} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PositioningSection() {
  const [ref, visible] = useReveal(0.22);

  return (
    <section className="positioning" ref={ref}>
      <div className={`positioning__inner container${visible ? " is-visible" : ""}`}>
        <div>
          <p className="section-intro__eyebrow">MARKET POSITION</p>
          <h2>Not another reporting layer.</h2>
          <p className="positioning__copy">
            Aletheos is not competing with Notion, Monday, or Jira. It is the governance layer that
            sits above them and determines what counts as true before a team acts on it.
          </p>
        </div>

        <div className="positioning__callout">
          <span>Reporting</span>
          <strong>What happened</strong>
          <div className="positioning__arrow" aria-hidden="true" />
          <span>Aletheos governance</span>
          <strong>What happens next</strong>
        </div>
      </div>
    </section>
  );
}

function DifferenceSection() {
  const [ref, visible] = useReveal(0.15);

  return (
    <section className="difference container" id="difference" ref={ref}>
      <div className={`difference__inner${visible ? " is-visible" : ""}`}>
        <SectionIntro
          eyebrow="THE DIFFERENCE"
          title="Reporting tells you. Governance ensures."
          body="This is the strategic separation the page needed to make clearer."
        />

        <div className="difference-table" role="table" aria-label="Reporting tools compared with Aletheos">
          <div className="difference-table__header" role="row">
            <span role="columnheader">Reporting tools</span>
            <span role="columnheader">Aletheos</span>
          </div>

          {governanceRows.map((row) => (
            <div className="difference-table__row" role="row" key={row.reporting}>
              <span role="cell">{row.reporting}</span>
              <span role="cell">{row.governance}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [ref, visible] = useReveal(0.15);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact section-frame" id="contact" ref={ref}>
      <div className={`container contact__grid${visible ? " is-visible" : ""}`}>
        <div className="contact__content">
          <SectionIntro
            eyebrow="REQUEST ACCESS"
            title="Ready to run on proof instead of reporting?"
            body="This page now sets the right expectation for high-accountability operators. The only missing piece is wiring the form to the intake destination you want to use."
            align="left"
          />

          <div className="contact__includes">
            <p className="section-intro__eyebrow">PLATFORM INCLUDES</p>
            <ul>
              {requestIncludes.map((item) => (
                <li key={item}>
                  <Pulse color={GREEN} size={5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input type="text" value={form.name} onChange={updateField("name")} required />
          </label>

          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={updateField("email")} required />
          </label>

          <label>
            <span>Company</span>
            <input type="text" value={form.company} onChange={updateField("company")} required />
          </label>

          <label>
            <span>Tell us about your operation</span>
            <textarea rows={5} value={form.message} onChange={updateField("message")} required />
          </label>

          <button className="button" type="submit">
            Request Access
          </button>

          <p className={`contact-form__message${submitted ? " is-visible" : ""}`} role="status">
            Prototype submission captured locally. Connect this action to your CRM, email intake, or
            backend endpoint when you are ready to make requests live.
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <LogoMark />
          <span>Aletheos | Built by M20R1</span>
        </div>
        <span className="site-footer__meta">A Nove Mani product</span>
      </div>
    </footer>
  );
}

export default function AletheosLanding() {
  return (
    <div className="app-shell">
      <Nav />
      <main>
        <Hero />
        <Statement />
        <ProofStrip />
        <SignalBridge {...bridgeSequences[0]} />
        <ProtocolBanner />
        <ArchitectureSection />
        <ConsoleSection />
        <SignalBridge {...bridgeSequences[1]} />
        <FeatureSection />
        <EditorialBreak />
        <PositioningSection />
        <DifferenceSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
