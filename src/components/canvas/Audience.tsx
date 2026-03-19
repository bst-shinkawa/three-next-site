'use client'

import React from 'react'
import { Float } from '@react-three/drei'

export function Audience({ count = 5, ...props }) {
  return (
    <group {...props}>
      {[...Array(count)].map((_, i) => (
        <group key={i} position={[(i - (count - 1) / 2) * 1.5, -0.5, 0]}>
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            {/* 参加者の体 */}
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.3, 0.6, 4, 12]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* 参加者の頭 */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#d4a373" />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  )
}
