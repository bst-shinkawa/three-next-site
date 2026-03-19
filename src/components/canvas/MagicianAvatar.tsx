'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function MagicianAvatar({ scrollOffset = 0, ...props }) {
  const group = useRef<THREE.Group>(null)
  const leftHand = useRef<THREE.Mesh>(null)
  const rightHand = useRef<THREE.Mesh>(null)
  const hatGroup = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    
    // 基本的な浮遊感
    group.current.position.y = Math.sin(t * 1.5) * 0.05
    
    // スクロールに応じたポーズの変化
    // 0-0.2: 挨拶（手を少し広げる）
    // 0.2-0.4: マジック中（手を忙しく動かす）
    // 0.4-0.6: 驚きのポーズ（手を広げる）
    // 0.6-0.8: セミナー中（片手で指差し）
    // 0.8-1.0: お辞儀（頭を少し下げる）

    if (leftHand.current && rightHand.current) {
        if (scrollOffset < 0.2) {
            // 挨拶
            leftHand.current.position.lerp(new THREE.Vector3(-0.6, 0.4, 0.2), 0.1)
            rightHand.current.position.lerp(new THREE.Vector3(0.6, 0.4, 0.2), 0.1)
        } else if (scrollOffset < 0.4) {
            // マジック
            leftHand.current.position.x = -0.5 + Math.sin(t * 10) * 0.1
            leftHand.current.position.y = 0.5 + Math.cos(t * 10) * 0.1
            rightHand.current.position.x = 0.5 + Math.cos(t * 10) * 0.1
            rightHand.current.position.y = 0.5 + Math.sin(t * 10) * 0.1
        } else if (scrollOffset < 0.6) {
            // 驚き
            leftHand.current.position.lerp(new THREE.Vector3(-0.8, 0.8, 0.5), 0.1)
            rightHand.current.position.lerp(new THREE.Vector3(0.8, 0.8, 0.5), 0.1)
        } else {
            // セミナー
            leftHand.current.position.lerp(new THREE.Vector3(-0.6, 0.2, 0.2), 0.1)
            rightHand.current.position.lerp(new THREE.Vector3(0.6, 0.5, 0.5), 0.1)
        }
    }

    if (hatGroup.current) {
        // お辞儀の時にハットを傾ける
        const hatTargetRotation = scrollOffset > 0.85 ? -0.5 : 0
        hatGroup.current.rotation.x = THREE.MathUtils.lerp(hatGroup.current.rotation.x, hatTargetRotation, 0.1)
    }
  })

  return (
    <group ref={group} {...props}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* ボディー */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.4, 0.8, 4, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.5} />
        </mesh>

        {/* 頭 */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#f5d0c0" />
        </mesh>

        {/* シルクハット */}
        <group ref={hatGroup} position={[0, 1.1, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.5, 32]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.1, 32]} />
            <meshStandardMaterial color="#880000" />
          </mesh>
        </group>

        {/* 手 */}
        <mesh ref={leftHand} position={[-0.6, 0.2, 0.2]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#f5d0c0" />
        </mesh>
        <mesh ref={rightHand} position={[0.6, 0.2, 0.2]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#f5d0c0" />
        </mesh>

        {/* 魔法のオーラ */}
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.015, 16, 100]} />
          <MeshWobbleMaterial color="#c3c14e" factor={0.6} speed={3} transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  )
}
