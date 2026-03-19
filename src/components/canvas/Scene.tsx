"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, ContactShadows } from "@react-three/drei";
import VoxelBlock from "./VoxelBlock";
import Particles from "./Particles";

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#112f4f"]} />
          <fog attach="fog" args={["#112f4f", 10, 25]} />

          {/* 環境マップ：反射と大域照明をリッチに */}
          <Environment preset="city" />

          {/* 全体的に自然な影を底上げする半球光 */}
          <hemisphereLight intensity={0.8} groundColor="#112f4f" color="#ffffff" />

          {/* メインの太陽光 */}
          <directionalLight
            position={[10, 20, 15]}
            intensity={2.5}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* 反対側からの補助光 */}
          <pointLight position={[-15, 10, 5]} intensity={1.5} color="#c3c14e" />
          
          {/* 設置面に近い影を柔らかく落とす */}
          <ContactShadows 
            position={[0, -5, 0]} 
            opacity={0.3} 
            scale={20} 
            blur={2} 
            far={10} 
          />

          <VoxelBlock />
          <Particles count={150} />
        </Suspense>
      </Canvas>
    </div>
  );
}
