import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import { useSpatial, TABS } from "./SpatialContext";
import { useSystemCommand } from "./context/SystemCommandContext";

const MODE_COLORS = {
  [TABS.VECTOR]: new THREE.Color("#00F0FF"),
  [TABS.POINT_CLOUD]: new THREE.Color("#00FF87"),
  [TABS.AIRSPACE]: new THREE.Color("#FFB700"),
  [TABS.TRUST_CENTER]: new THREE.Color("#4ade80"),
};

function PointCloudVisualizer({ count = 8000 }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const { activeTab, targetLock } = useSpatial();
  const { audioPulse } = useSystemCommand();

  const { positions, basePositions, noiseOffsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const noise = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const u = (Math.random() - 0.5) * 12;
      const v = (Math.random() - 0.5) * 12;
      const w = (Math.random() - 0.5) * 2;
      pos[i3] = base[i3] = u;
      pos[i3 + 1] = base[i3 + 1] = w;
      pos[i3 + 2] = base[i3 + 2] = v;
      noise[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, basePositions: base, noiseOffsets: noise };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;
    const time = state.clock.elapsedTime;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const targetColor = MODE_COLORS[activeTab] || MODE_COLORS[TABS.VECTOR];

    materialRef.current.color.lerp(targetColor, delta * 8);
    const targetSize = targetLock ? 0.06 : audioPulse ? 0.08 : 0.04;
    materialRef.current.size += (targetSize - materialRef.current.size) * delta * (audioPulse ? 15 : 5);

    const rotSpeed = targetLock ? 0.012 : 0.05;
    pointsRef.current.rotation.y += delta * rotSpeed;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const n = noiseOffsets[i];
      if (activeTab === TABS.POINT_CLOUD) {
        const wave = Math.sin(time * 2 + n) * 0.8;
        const elevation = Math.cos(basePositions[i3] * 0.5 + time) * 1.2;
        const targetY = basePositions[i3 + 1] + elevation + wave;
        positionAttr.array[i3 + 1] += (targetY - positionAttr.array[i3 + 1]) * delta * 3;
      } else if (activeTab === TABS.AIRSPACE) {
        const radius = 5.5;
        const theta = basePositions[i3] * 0.8;
        const phi = basePositions[i3 + 2] * 0.8;
        const tx = radius * Math.sin(theta) * Math.cos(phi);
        const ty = Math.abs(radius * Math.sin(theta) * Math.sin(phi)) * 0.5;
        const tz = radius * Math.cos(theta);
        positionAttr.array[i3] += (tx - positionAttr.array[i3]) * delta * 2;
        positionAttr.array[i3 + 1] += (ty - positionAttr.array[i3 + 1]) * delta * 2;
        positionAttr.array[i3 + 2] += (tz - positionAttr.array[i3 + 2]) * delta * 2;
      } else {
        positionAttr.array[i3] += (basePositions[i3] - positionAttr.array[i3]) * delta * 4;
        positionAttr.array[i3 + 1] += (0 - positionAttr.array[i3 + 1]) * delta * 4;
        positionAttr.array[i3 + 2] += (basePositions[i3 + 2] - positionAttr.array[i3 + 2]) * delta * 4;
      }
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const controlsRef = useRef();
  const { targetLock } = useSpatial();
  const targetVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;
    if (targetLock) {
      targetVec.set(((targetLock.x - 200) / 200) * 6, 0.5, ((targetLock.y - 200) / 200) * 6);
    } else {
      targetVec.set(0, 0, 0);
    }
    controlsRef.current.target.lerp(targetVec, delta * 2);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate
      autoRotateSpeed={targetLock ? 0.3 : 1.2}
      enableZoom={false}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={5}
      maxDistance={20}
    />
  );
}

export default function SpatialCanvasBackground() {
  const { activeTab } = useSpatial();
  const [pointCount, setPointCount] = useState(2400);

  useEffect(() => {
    const wide = typeof window !== "undefined" && window.innerWidth >= 768;
    const finePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    setPointCount(wide && finePointer ? 6000 : 1800);
  }, []);

  const accentHex =
    activeTab === TABS.VECTOR
      ? "#00f0ff"
      : activeTab === TABS.POINT_CLOUD
        ? "#00ff87"
        : activeTab === TABS.AIRSPACE
          ? "#ffb700"
          : "#4ade80";

  return (
    <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/5 via-obsidian to-obsidian" aria-hidden="true">
      <Canvas camera={{ position: [0, 8, 12], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 5, 25]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={accentHex} />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#00f0ff" />
        <Grid
          position={[0, -2, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1}
          sectionColor={accentHex}
          fadeDistance={25}
          fadeStrength={1}
          infiniteGrid
        />
        <Sparkles count={120} size={2} speed={0.3} opacity={0.4} color={accentHex} scale={15} />
        <PointCloudVisualizer count={pointCount} />
        <CameraRig />
      </Canvas>
    </div>
  );
}
