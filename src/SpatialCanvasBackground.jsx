import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

import { useSpatial, TABS } from "./SpatialContext";
import { useSystemCommand } from "./context/SystemCommandContext";

const MODE_COLORS = {
  [TABS.VECTOR]: new THREE.Color("#00F0FF"),
  [TABS.POINT_CLOUD]: new THREE.Color("#00FF87"),
  [TABS.AIRSPACE]: new THREE.Color("#FFB700"),
  [TABS.TRUST_CENTER]: new THREE.Color("#4ade80"),
};

function PointCloudVisualizer({ count = 4200 }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const morphDirty = useRef(false);
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

    const rotSpeed = targetLock ? 0.018 : 0.048;
    pointsRef.current.rotation.y += delta * rotSpeed;

    const morphing = activeTab === TABS.POINT_CLOUD || activeTab === TABS.AIRSPACE;
    if (!morphing) {
      morphDirty.current = false;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const n = noiseOffsets[i];
        const wave = Math.sin(time * 0.7 + n) * 0.32;
        positionAttr.array[i3 + 1] = basePositions[i3 + 1] + wave;
      }
      positionAttr.needsUpdate = true;
      return;
    }
    morphDirty.current = true;

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

function BrandCore({ color }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.22;
  });
  const tint = useMemo(() => new THREE.Color(color), [color]);

  return (
    <Float speed={1.35} rotationIntensity={0.28} floatIntensity={0.55}>
      <group ref={group} position={[0, 0.4, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshPhysicalMaterial
            color={tint}
            emissive={tint}
            emissiveIntensity={0.18}
            roughness={0.12}
            metalness={0.15}
            transmission={0.86}
            thickness={1.35}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.12}
            transparent
            opacity={0.95}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.18, 0]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function CameraRig() {
  const { targetLock } = useSpatial();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x * 2.1;
    const py = state.pointer.y * 0.9;
    const lockX = targetLock ? ((targetLock.x - 200) / 200) * 1.6 : 0;
    const tx = px + lockX;
    const ty = 7.6 + Math.sin(t * 0.22) * 0.38 + py;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, tx, 0.045);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, ty, 0.045);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 12, 0.045);
    state.camera.lookAt(0, 0.25, 0);
  });

  return null;
}

export default function SpatialCanvasBackground() {
  const { activeTab } = useSpatial();
  const [pointCount, setPointCount] = useState(4200);

  useEffect(() => {
    const wide = typeof window !== "undefined" && window.innerWidth >= 768;
    const finePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    setPointCount(wide && finePointer ? 4200 : 1200);
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
      <Canvas camera={{ position: [0, 7.6, 12], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 7, 24]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[8, 12, 6]} intensity={2.1} color={accentHex} />
        <pointLight position={[-10, 4, -8]} intensity={1.1} color="#00f0ff" />
        <spotLight position={[0, 14, 4]} intensity={1.4} angle={0.5} penumbra={0.6} color="#ffffff" />
        <Grid
          position={[0, -2, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.45}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1.4}
          sectionColor={accentHex}
          fadeDistance={22}
          fadeStrength={1.1}
          infiniteGrid
        />
        <Sparkles count={140} size={2.2} speed={0.42} opacity={0.5} color={accentHex} scale={16} />
        <BrandCore color={accentHex} />
        <PointCloudVisualizer count={pointCount} />
        <CameraRig />
      </Canvas>
    </div>
  );
}
