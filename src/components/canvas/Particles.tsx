"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ count = 100 }) {
  const mesh = useRef<THREE.Points>(null);
  const lightMesh = useRef<THREE.Points>(null);

  // パーティクルの初期位置をランダムに生成
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * 15;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 15;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 15;
      velocities[i] = Math.random() * 0.02 + 0.01;
    }
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();

    // わずかに回転させて漂っている感を出す
    mesh.current.rotation.y = time * 0.05;
    mesh.current.position.y = Math.sin(time * 0.2) * 0.5;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffe8d6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
