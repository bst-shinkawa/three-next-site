"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { useGLTF, QuadraticBezierLine, Html } from "@react-three/drei";
import { offices } from "@/data/offices";

export default function VoxelBlock() {
  const groupRef = useRef<THREE.Group>(null);
  const partsRef = useRef<(THREE.Object3D | null)[]>([]);
  const scrollOffset = useRef(0);
  const pathname = usePathname();

  // GLBモデルの読み込み (日本地図 + 各都道府県)
  const { scene: mainMapScene } = useGLTF("/models/japan_map.glb");
  const modelPaths = offices.map(o => o.modelPath);
  const prefectureGltfs = useGLTF(modelPaths) as any[];

  const mapMeshesRef = useRef<THREE.Mesh[]>([]);
  const cachedOfficeMeshesRef = useRef<Map<number, THREE.Mesh[]>>(new Map());
  const cachedMainMapMeshesRef = useRef<THREE.Mesh[]>([]);

  // 各モデルのマテリアルを一括初期化 & メッシュのキャッシュ化
  useEffect(() => {
    if (mainMapScene && prefectureGltfs.length > 0) {
      mapMeshesRef.current = [];
      cachedOfficeMeshesRef.current.clear();

      // 各拠点のメッシュをキャッシュ
      prefectureGltfs.forEach((gltf, i) => {
        if (!gltf) return;
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const material = new THREE.MeshStandardMaterial({
              color: "#1fc726",
              transparent: true,
              opacity: 1,
              roughness: 0.15,
              metalness: 0.45,
              emissive: "#0a3011",
              emissiveIntensity: 0.2
            });
            child.material = material;
            meshes.push(child);
            mapMeshesRef.current.push(child);
          }
        });
        cachedOfficeMeshesRef.current.set(i, meshes);
      });

      // メインマップのメッシュをキャッシュ & マテリアル適用
      const mainMeshes: THREE.Mesh[] = [];
      mainMapScene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          const material = new THREE.MeshStandardMaterial({
            color: "#1fc726",
            transparent: true,
            opacity: 1,
            roughness: 0.15,
            metalness: 0.45,
            emissive: "#0a3011",
            emissiveIntensity: 0.2
          });
          child.material = material;
          mainMeshes.push(child);
        }
      });
      cachedMainMapMeshesRef.current = mainMeshes;
    }
  }, [mainMapScene, prefectureGltfs]);

  // ルートごとの目標設定値を定義
  const getRouteConfig = (path: string) => {
    switch (path) {
      case "/about":
        return {
          targetScale: 0.7,
          targetRotationY: Math.PI / -5,
          targetZ: 11,
          targetY: 0,
          targetX: 0.8,
          type: "about"
        };
      case "/works":
        return {
          targetScale: 0.8,
          targetRotationY: -Math.PI / 2,
          targetZ: 11,
          targetY: 4,
          targetX: 3,
          type: "works"
        };
      default: // Home
        return {
          targetScale: 1.0,
          targetRotationY: 0,
          targetZ: 10,
          targetY: 1.5,
          targetX: 3,
          type: "home"
        };
    }
  };

  const [selectedOfficeName, setSelectedOfficeName] = useState<string | null>(null);
  const selectedOfficeRef = useRef(selectedOfficeName);
  const config = getRouteConfig(pathname);

  // 常に最新の状態を Ref に同期
  useEffect(() => {
    selectedOfficeRef.current = selectedOfficeName;
  }, [selectedOfficeName]);

  // ページ遷移時に選択状態をリセット
  useEffect(() => {
    setSelectedOfficeName(null);
  }, [pathname]);

  // DOM側からの解除・切替キーを購読
  useEffect(() => {
    const handleReset = () => setSelectedOfficeName(null);
    const handleSwitch = (e: any) => {
      const newName = e.detail.name;
      const currentSelected = selectedOfficeRef.current;
      if (currentSelected && currentSelected !== newName) {
        // 拠点間移動のみバウンス遷移（一旦地図へ戻る）
        setSelectedOfficeName(null);
        setTimeout(() => {
          setSelectedOfficeName(newName);
        }, 800);
      } else {
        // 地図からの初回遷移は即座に開始
        setSelectedOfficeName(newName);
      }
    };
    window.addEventListener("office-reset", handleReset);
    window.addEventListener("office-switch", handleSwitch);
    return () => {
      window.removeEventListener("office-reset", handleReset);
      window.removeEventListener("office-switch", handleSwitch);
    };
  }, []);

  useFrame((state) => {
    if (typeof window === "undefined") return;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const targetOffset = window.scrollY / scrollHeight;
      scrollOffset.current = THREE.MathUtils.lerp(scrollOffset.current, targetOffset, 0.1);
    }
    if (!groupRef.current) return;
    const lerpSpeed = 0.05;
    const time = state.clock.getElapsedTime();

    // 拠点選択状態の取得
    const selectedOffice = offices.find(o => o.name === selectedOfficeName);

    // 基本配置の更新
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, config.targetX, lerpSpeed);
    const floatingY = (config.type === "about" && selectedOffice) ? -1 : (config.type === "about" ? 0 : Math.sin(time * 0.5) * 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatingY + (config.type !== "about" ? Math.sin(scrollOffset.current * Math.PI) * 0.5 : 0), lerpSpeed);
    groupRef.current.scale.lerp(new THREE.Vector3(config.targetScale * (selectedOffice ? 1.5 : 1), config.targetScale * (selectedOffice ? 1.5 : 1), config.targetScale * (selectedOffice ? 1.5 : 1)), lerpSpeed);

    // カメラと回転のダイナミック制御
    let targetCamX = 0;
    let targetCamY = config.targetY + (config.type !== "about" ? scrollOffset.current * 1.5 : 0);
    let targetCamZ = config.targetZ - (config.type !== "about" ? scrollOffset.current * 2 : 0);
    let targetLookAt = new THREE.Vector3(0, 0.5, 0);
    let targetRotX = config.type === "about" ? (selectedOffice ? -Math.PI / 2.5 : Math.PI / 10) : (scrollOffset.current * 0.2);
    let targetRotY = config.targetRotationY + (config.type !== "about" ? scrollOffset.current * Math.PI * 0.5 : 0);

    if (config.type === "about") {
      if (selectedOffice) {
        // フォーカス状態: 地図を水平に倒し、拠点の斜め上から見下ろす
        // フォーカス状態: 中央付近に固定して表示
        targetCamX = 0.8;
        targetCamY = 0.5;
        targetCamZ = 3.0;
        targetLookAt.set(0, 0, 0.5);
      } else {
        targetRotY += Math.sin(time * 0.2) * 0.15;
      }
    }

    // カメラターゲットの距離を計算して「引き」を作る
    const distToTarget = state.camera.position.distanceTo(new THREE.Vector3(targetCamX, targetCamY, targetCamZ));
    const smoothLerp = selectedOfficeName ? 0.05 : 0.05;

    // 移動中に少しだけ後ろに下がる（Zを増やす）スウィング効果
    const swingZ = selectedOfficeName && distToTarget > 0.5 ? Math.sin(Math.min(1, distToTarget) * Math.PI) * 1.5 : 0;
    const finalCamPos = new THREE.Vector3(targetCamX, targetCamY, targetCamZ + swingZ);

    state.camera.position.lerp(finalCamPos, smoothLerp);
    state.camera.lookAt(targetLookAt);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

    // Pins Animation
    if (config.type === "about" && partsRef.current.length > 0) {
      partsRef.current.forEach((part, index) => {
        if (part && index >= 100 && index < 200) {
          const officeIdx = index - 100;
          if (offices[officeIdx]) {
            const isSelected = offices[officeIdx].name === selectedOfficeName;
            // 選択されていない拠点は少し下げる
            part.position.z = THREE.MathUtils.lerp(part.position.z, isSelected ? 0.4 : (selectedOffice ? -0.5 : 0.2), 0.1);
            part.scale.setScalar(THREE.MathUtils.lerp(part.scale.x, isSelected ? 1.5 : 1.0, 0.1));
          }
        }
      });
    }
    // High-Tech Red Pulse Animation
    if (selectedOfficeName && partsRef.current.length > 0) {
      partsRef.current.forEach((part, index) => {
        if (part && index >= 200 && index < 202) {
          const i = index - 200;
          // 時間差を持たせたリピートアニメーション (0.0〜1.0)
          const offset = i * 0.5;
          const progress = (time + offset) % 1.5 / 1.5;

          const scale = 1 + progress * 2.5;
          const opacity = Math.max(0, 0.6 * (1 - progress));

          part.scale.setScalar(scale);
          if (part instanceof THREE.Mesh && part.material instanceof THREE.MeshStandardMaterial) {
            part.material.opacity = opacity;
          }
        }
      });

      // Orb Core の強調発光 (到着時に ref 経由で更新)
      const core = partsRef.current[202];
      if (core instanceof THREE.Mesh) {
        const intensity = distToTarget < 0.2 ? 15 : 8;
        if (core.material instanceof THREE.MeshStandardMaterial) {
          core.material.emissiveIntensity = THREE.MathUtils.lerp(core.material.emissiveIntensity, intensity, 0.1);
        }
        core.children.forEach(child => {
          if (child instanceof THREE.PointLight) {
            child.intensity = THREE.MathUtils.lerp(child.intensity, distToTarget < 0.2 ? 4 : 2, 0.1);
          }
        });
      }
    }

    // 地図モデルの個別フェードアニメーション (キャッシュを利用して高速化)
    offices.forEach((office, i) => {
      const isSelected = selectedOfficeName === office.name;
      const targetOpacity = isSelected ? 1.0 : (selectedOfficeName ? 0.0 : 1.0);
      const officeMeshes = cachedOfficeMeshesRef.current.get(i) || [];

      officeMeshes.forEach(mesh => {
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity, 0.08);
          mesh.material.transparent = mesh.material.opacity < 0.99;
          mesh.visible = mesh.material.opacity > 0.01;
        }
      });
    });

    // 日本地図（メイン）のフェード (キャッシュを利用)
    cachedMainMapMeshesRef.current.forEach(mesh => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        const targetOpacity = selectedOfficeName ? 0.0 : 1.0;
        mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity, 0.08);
        mesh.material.transparent = mesh.material.opacity < 0.99;
        mesh.visible = mesh.material.opacity > 0.01;
      }
    });
  });

  // デバッグ用の個別調整ステート
  const [debugParams, setDebugParams] = useState({
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    scale: 0.5,
    orbPos: [0, 0, 0.15]
  });

  // 拠点切り替え時にデバッグ数値を初期化
  useEffect(() => {
    const office = offices.find(o => o.name === selectedOfficeName);
    if (office) {
      setDebugParams({
        pos: (office as any).modelOffset || [0, 0, 0],
        rot: (office as any).modelRotation || [0, 0, 0],
        scale: (office as any).modelScale || 0.5,
        orbPos: (office as any).orbOffset || [0, 0, 0.15]
      });
    }
  }, [selectedOfficeName]);

  return (
    <group ref={groupRef}>
      {/* Home: Voxel Cube UI */}
      {config.type === "home" && (
        <group>
          <group ref={(el) => { if (el) partsRef.current[0] = el }}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4, 2.5, 0.2]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
            </mesh>
            <mesh position={[0, 1.1, 0.11]}>
              <boxGeometry args={[3.8, 0.2, 0.05]} />
              <meshStandardMaterial color="#112f4f" />
            </mesh>
            <mesh position={[0, -0.1, 0.11]}>
              <boxGeometry args={[3.6, 1.8, 0.05]} />
              <meshStandardMaterial color="#0a1d30" emissive="#c3c14e" emissiveIntensity={0.05} />
            </mesh>
          </group>
          {[1, 2].map((i) => (
            <group key={i} ref={(el) => { if (el) partsRef.current[i] = el }}>
              <mesh position={[i === 1 ? -1 : 1.5, i === 1 ? -2 : 1, -0.5]} castShadow>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="#c3c14e" emissive="#c3c14e" emissiveIntensity={0.5} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* About: 3D Japan Map (GLB) & Prefecture Details */}
      {config.type === "about" && (
        <group>
          {/* Main Japan Map (選択時はフェード) */}
          <primitive
            object={mainMapScene}
            scale={selectedOfficeName ? 0.1 : 0.4}
            rotation={[0, 0, 0]}
            position={[0, selectedOfficeName ? -5 : -2.5, 0]}
          />

          {offices.map((office, i) => {
            const isSelected = selectedOfficeName === office.name;
            const prefectureScene = prefectureGltfs[i]?.scene;

            return (
              <group key={office.id}>
                {/* 1. Base Pins (通常時に表示) */}
                {!selectedOfficeName && (
                  <group
                    position={[office.pos[0], office.pos[1], 0.2]}
                    ref={(el) => { if (el) partsRef.current[100 + i] = el }}
                  >
                    <mesh castShadow rotation={[Math.PI, 0, 0]}>
                      <coneGeometry args={[0.1, 0.25, 8]} />
                      <meshStandardMaterial color="#c3c14e" emissive="#c3c14e" emissiveIntensity={2} />
                    </mesh>
                    <mesh position={[0, 0.15, 0]}>
                      <sphereGeometry args={[0.08, 8, 8]} />
                      <meshStandardMaterial color="#ffffff" />
                    </mesh>

                    <mesh
                      visible={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOfficeName(office.name);
                        window.dispatchEvent(new CustomEvent('office-click', { detail: office }));
                      }}
                      onPointerOver={() => (document.body.style.cursor = 'pointer')}
                      onPointerOut={() => (document.body.style.cursor = 'auto')}
                    >
                      <sphereGeometry args={[0.4, 8, 8]} />
                    </mesh>
                  </group>
                )}

                {/* 2. Focused View (都道府県GLB) - 独立座標系 */}
                {isSelected && prefectureScene && (
                  <group position={[0, 0, 0.5]}>
                    <primitive
                      object={prefectureScene}
                      scale={debugParams.scale}
                      position={debugParams.pos as any}
                      rotation={debugParams.rot as any}
                    />

                    {/* High-Tech Red Pulse Orb (個別に調整された位置) */}
                    <group position={debugParams.orbPos as any}>
                      {/* Core */}
                      <mesh ref={(el) => { if (el) partsRef.current[202] = el }}>
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshStandardMaterial
                          color="#ff0000"
                          emissive="#ff0000"
                          emissiveIntensity={8}
                          toneMapped={false}
                        />
                        <pointLight intensity={2} distance={1.5} color="#ff0000" />
                      </mesh>

                      {/* Ripples (Animated in useFrame) */}
                      {[0, 1].map((i) => (
                        <mesh key={i} ref={(el) => { if (el) partsRef.current[200 + i] = el }}>
                          <sphereGeometry args={[0.04, 16, 16]} />
                          <meshStandardMaterial
                            color="#ff0000"
                            transparent
                            opacity={0.5}
                            emissive="#ff0000"
                            emissiveIntensity={2}
                            depthWrite={false}
                          />
                        </mesh>
                      ))}
                    </group>

                  </group>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* Works: Output Devices */}
      {config.type === "works" && (
        <group>
          <group ref={(el) => { if (el) partsRef.current[0] = el }}>
            <mesh castShadow receiveShadow position={[0, 1, 0]}>
              <boxGeometry args={[3.5, 2.2, 0.15]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 1, 0.1]}>
              <boxGeometry args={[3.2, 1.9, 0.02]} />
              <meshStandardMaterial color="#ffffff" emissive="#c3c14e" emissiveIntensity={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, -0.1, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[3.5, 2.2, 0.15]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </group>

          <group ref={(el) => { if (el) partsRef.current[1] = el }}>
            <mesh castShadow receiveShadow position={[2.5, 0, 1.5]}>
              <boxGeometry args={[0.8, 1.6, 0.1]} />
              <meshStandardMaterial color="#112f4f" />
            </mesh>
            <mesh position={[2.5, 0, 1.56]}>
              <boxGeometry args={[0.7, 1.4, 0.02]} />
              <meshStandardMaterial color="#c3c14e" emissive="#c3c14e" emissiveIntensity={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3D Adjustment Debug Panel (Right-Bottom Overlay) */}
      {selectedOfficeName && (
        <Html pointerEvents="auto" style={{ position: 'fixed', bottom: '20px', right: '20px', width: '280px', display: 'none' }}>
          <div
            style={{
              padding: '24px',
              background: 'rgba(17, 47, 79, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(195, 193, 78, 0.3)',
              borderRadius: '16px',
              color: 'white',
              fontSize: '11px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              fontFamily: 'monospace'
            }}
          >
            <div style={{ color: '#c3c14e', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '0.1em' }}>PRECISION TUNER</div>

            {/* Position */}
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>POS {axis}</span>
                  <span style={{ color: '#c3c14e' }}>{debugParams.pos[i].toFixed(2)}</span>
                </div>
                <input
                  type="range" min="-10" max="10" step="0.01"
                  value={debugParams.pos[i]}
                  onChange={(e) => {
                    const newPos = [...debugParams.pos];
                    newPos[i] = parseFloat(e.target.value);
                    setDebugParams({ ...debugParams, pos: newPos });
                  }}
                  style={{ width: '100%', accentColor: '#c3c14e' }}
                />
              </div>
            ))}

            {/* Rotation */}
            {['RX', 'RY', 'RZ'].map((axis, i) => (
              <div key={axis} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>ROT {axis}</span>
                  <span style={{ color: '#c3c14e' }}>{debugParams.rot[i].toFixed(2)}</span>
                </div>
                <input
                  type="range" min="-3.14" max="3.14" step="0.01"
                  value={debugParams.rot[i]}
                  onChange={(e) => {
                    const newRot = [...debugParams.rot];
                    newRot[i] = parseFloat(e.target.value);
                    setDebugParams({ ...debugParams, rot: newRot });
                  }}
                  style={{ width: '100%', accentColor: '#1bd021' }}
                />
              </div>
            ))}

            {/* Scale */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>SCALE</span>
                <span style={{ color: '#c3c14e' }}>{debugParams.scale.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.1" max="10" step="0.1"
                value={debugParams.scale}
                onChange={(e) => setDebugParams({ ...debugParams, scale: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#ffffff' }}
              />
            </div>

            {/* Orb Params */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#ff4444', marginBottom: '8px' }}>--- RED ORB ---</div>
              {['X', 'Y', 'Z'].map((axis, i) => (
                <div key={axis} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                    <span>ORB POS {axis}</span>
                    <span style={{ color: '#ff4444' }}>{debugParams.orbPos[i].toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="-5" max="5" step="0.01"
                    value={debugParams.orbPos[i]}
                    onChange={(e) => {
                      const newPos = [...debugParams.orbPos];
                      newPos[i] = parseFloat(e.target.value);
                      setDebugParams({ ...debugParams, orbPos: newPos });
                    }}
                    style={{ width: '100%', accentColor: '#ff4444' }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const output = `modelOffset: [${debugParams.pos.map(n => n.toFixed(2)).join(', ')}],\nmodelRotation: [${debugParams.rot.map(n => n.toFixed(2)).join(', ')}],\nmodelScale: ${debugParams.scale.toFixed(2)},\norbOffset: [${debugParams.orbPos.map(n => n.toFixed(2)).join(', ')}]`;
                navigator.clipboard.writeText(output);
                alert('Copied to clipboard!\nPaste into src/data/offices.ts');
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: '#c3c14e',
                border: 'none',
                borderRadius: '8px',
                color: '#112f4f',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              COPY JSON TO CLIPBOARD
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
