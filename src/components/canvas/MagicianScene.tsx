'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Environment, Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { MagicianAvatar } from './MagicianAvatar'
import { Audience } from './Audience'

function SceneContent({ progress }: { progress: number }) {
  const { viewport } = useThree()
  const magicianRef = useRef<THREE.Group>(null)
  const audienceRef = useRef<THREE.Group>(null)

  // シーンごとのカメラ設定 (pos, lookAt)
  const cameraSettings = useMemo(() => [
    { pos: [0, 0, 5], look: [0, 0, 0] },         // Scene 1: Hero (Front)
    { pos: [-2, 2, 4], look: [2, 0, -2] },       // Scene 2: Seminar (Magician's Side POV)
    { pos: [0, 0.5, 2], look: [0, 0.2, 0] },     // Scene 3: Breakthrough (Close up)
    { pos: [3, 1, 3], look: [-1, 0, 0] },        // Scene 4: Party (Audience POV)
    { pos: [0, 0, 4], look: [0, 0, 0] },         // Scene 5: Profile (Medium)
  ], [])

  useFrame((state) => {
    // 現在のフェーズを計算 (6つのセクションに合わせて 0 to 5)
    const phase = progress * 5 
    const index = Math.floor(phase)
    const subProgress = phase % 1

    // カメラのスムーズな移動
    if (index < cameraSettings.length - 1) {
        const current = cameraSettings[index]
        const next = cameraSettings[index + 1]
        
        state.camera.position.x = THREE.MathUtils.lerp(current.pos[0], next.pos[0], subProgress)
        state.camera.position.y = THREE.MathUtils.lerp(current.pos[1], next.pos[1], subProgress)
        state.camera.position.z = THREE.MathUtils.lerp(current.pos[2], next.pos[2], subProgress)

        const targetLookX = THREE.MathUtils.lerp(current.look[0], next.look[0], subProgress)
        const targetLookY = THREE.MathUtils.lerp(current.look[1], next.look[1], subProgress)
        const targetLookZ = THREE.MathUtils.lerp(current.look[2], next.look[2], subProgress)
        state.camera.lookAt(targetLookX, targetLookY, targetLookZ)
    } else {
        const last = cameraSettings[cameraSettings.length - 1]
        state.camera.position.set(last.pos[0], last.pos[1], last.pos[2])
        state.camera.lookAt(last.look[0], last.look[1], last.look[2])
    }

    // キャラクターのポーズと配置
    if (magicianRef.current) {
      const targetX = progress < 0.2 ? 0 : 
                      progress < 0.4 ? 2 : 
                      progress < 0.6 ? 0 : 
                      progress < 0.8 ? -1 : 0
      
      magicianRef.current.position.x = THREE.MathUtils.lerp(magicianRef.current.position.x, targetX, 0.1)
      magicianRef.current.rotation.y = THREE.MathUtils.lerp(magicianRef.current.rotation.y, (progress - 0.5) * Math.PI, 0.1)
    }

    // 観客の表示制御
    if (audienceRef.current) {
        // セミナーシーン(0.2-0.4)とパーティーシーン(0.6-0.8)で観客を出す
        const audienceOpacity = (progress > 0.15 && progress < 0.45) || (progress > 0.55 && progress < 0.85) ? 1 : 0
        audienceRef.current.scale.setScalar(THREE.MathUtils.lerp(audienceRef.current.scale.x, audienceOpacity, 0.1))
    }
  })

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5, 20]} />
      
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" castShadow />
      <pointLight position={[-10, 5, -5]} intensity={1} color="#c3c14e" />
      
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />

      {/* マジシャン */}
      <MagicianAvatar 
        ref={magicianRef} 
        scrollOffset={progress}
        scale={0.8} 
      />

      {/* 観客 (セミナー用) */}
      <Audience 
        ref={audienceRef}
        count={6} 
        position={[2, -0.6, -2]} 
        rotation={[0, -Math.PI / 4, 0]}
        scale={0} // 初期は非表示
      />

      {/* 観客 (パティー用) */}
      <Audience 
         count={8}
         position={[-3, -0.6, 1]}
         rotation={[0, Math.PI / 3, 0]}
         scale={progress > 0.55 && progress < 0.85 ? 1 : 0}
      />

      <MagicEffects scrollOffset={progress} />
    </>
  )
}

function MagicEffects({ scrollOffset }: { scrollOffset: number }) {
    const cardsOpacity = THREE.MathUtils.smoothstep(scrollOffset, 0.18, 0.3) * (1 - THREE.MathUtils.smoothstep(scrollOffset, 0.35, 0.45))
    const burstScale = Math.max(0, (scrollOffset - 0.4) * 20)

    return (
        <group>
            {/* シーン2: カード */}
            <group position={[1.5, 0.5, -1]} scale={cardsOpacity}>
                {[...Array(5)].map((_, i) => (
                    <Float key={i} speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                        <mesh position={[i * 0.2 - 0.4, Math.sin(i) * 0.1, 0]} rotation={[0.4, 0.2, 0.1]}>
                            <boxGeometry args={[0.2, 0.3, 0.005]} />
                            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                        </mesh>
                    </Float>
                ))}
            </group>
            
            {/* シーン3: ブレイクスルー演出 */}
            {scrollOffset > 0.4 && scrollOffset < 0.65 && (
                <group>
                    <mesh scale={burstScale}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial 
                            color="#c3c14e" 
                            transparent 
                            opacity={0.08 * (1 - (scrollOffset - 0.4) * 4)} 
                            wireframe
                        />
                    </mesh>
                </group>
            )}
        </group>
    )
}

export default function MagicianScene({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505]">
      <Canvas shadows>
        <SceneContent progress={progress} />
      </Canvas>
    </div>
  )
}
