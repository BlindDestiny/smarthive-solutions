'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  MeshTransmissionMaterial,
  MeshReflectorMaterial,
} from '@react-three/drei'
import * as THREE from 'three'

/* ══════════════════════════════════════════════════════════
   MARTINI GLASS
══════════════════════════════════════════════════════════ */
function Glass() {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.52, -3.1),
      new THREE.Vector2(0.52, -2.9),
      new THREE.Vector2(0.09, -2.68),
      new THREE.Vector2(0.052, -2.4),
      new THREE.Vector2(0.050,  0.0),
      new THREE.Vector2(0.064,  0.14),
      new THREE.Vector2(0.20,   0.50),
      new THREE.Vector2(0.59,   1.08),
      new THREE.Vector2(1.02,   1.68),
      new THREE.Vector2(1.22,   2.02),
      new THREE.Vector2(1.25,   2.08),
    ]
    return new THREE.LatheGeometry(pts, 96)
  }, [])

  const baseGeo = useMemo(() =>
    new THREE.CylinderGeometry(0.52, 0.52, 0.05, 64), [])

  const mat = {
    samples: 12 as const, resolution: 512 as const,
    transmission: 1 as const, roughness: 0 as const,
    thickness: 0.055, ior: 1.52,
    chromaticAberration: 0.02,
    anisotropy: 0.06,
    distortion: 0.035, distortionScale: 0.12,
    temporalDistortion: 0.01,
    color: '#ffffff' as const,
    attenuationColor: '#ddeeff' as const,
    attenuationDistance: 0.28,
    side: THREE.DoubleSide,
  }

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <MeshTransmissionMaterial {...mat} />
      </mesh>
      <mesh geometry={baseGeo} position={[0, -3.1, 0]}>
        <MeshTransmissionMaterial {...mat} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   LIQUID — already full
══════════════════════════════════════════════════════════ */
function Liquid() {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0,    0.0),
      new THREE.Vector2(0.04, 0.12),
      new THREE.Vector2(0.18, 0.46),
      new THREE.Vector2(0.56, 1.01),
      new THREE.Vector2(0.97, 1.58),
      new THREE.Vector2(1.16, 1.90),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  return (
    <mesh geometry={geo} position={[0, 0.10, 0]}>
      <meshPhysicalMaterial
        color="#cc2855"
        emissive="#440010"
        emissiveIntensity={0.06}
        transparent opacity={0.92}
        roughness={0} metalness={0}
        ior={1.33} transmission={0.10}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   POUR STREAM
   Shaker center: [3.5, 3.5, 0.3], rotation.z = 2.05
   Opening offset in local: (0, +2.8, 0)
   World opening ≈ [0.99, 2.26, 0.3]
══════════════════════════════════════════════════════════ */
function PourStream() {
  const geo = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.96, 2.22, 0.28),   // shaker mouth
      new THREE.Vector3(0.82, 1.70, 0.18),
      new THREE.Vector3(0.48, 0.85, 0.08),
      new THREE.Vector3(0.20, 0.18, 0.00),   // into glass
    )
    return new THREE.TubeGeometry(curve, 40, 0.052, 10, false)
  }, [])

  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial
        color="#dd3060"
        transparent opacity={0.80}
        roughness={0} metalness={0}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   ICE CUBE
══════════════════════════════════════════════════════════ */
function IceCube({
  position, rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const geo = useMemo(() => new THREE.BoxGeometry(0.36, 0.36, 0.36), [])
  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow>
      <MeshTransmissionMaterial
        samples={6}
        transmission={0.92}
        roughness={0.03}
        thickness={0.36}
        ior={1.31}
        chromaticAberration={0.007}
        color="#cce6ff"
        attenuationColor="#a8d0ff"
        attenuationDistance={0.55}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   BOSTON SHAKER
   rotation.z = 2.05 → mouth (+Y end) points lower-left → pours
══════════════════════════════════════════════════════════ */
function Shaker() {
  const bodyGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.22, -2.6),
      new THREE.Vector2(0.30, -2.4),
      new THREE.Vector2(0.36, -1.4),
      new THREE.Vector2(0.38,  0.0),
      new THREE.Vector2(0.40,  1.6),
      new THREE.Vector2(0.41,  2.2),
      new THREE.Vector2(0.44,  2.35),
      new THREE.Vector2(0.44,  2.58),
      new THREE.Vector2(0.40,  2.70),
      new THREE.Vector2(0.40,  2.80),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  const capGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.22, 0.14, 32), [])

  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.94,
    roughness: 0.08,
    color: new THREE.Color('#b2bac8'),
    envMapIntensity: 2.8,
  }), [])

  return (
    <group position={[3.5, 3.5, 0.3]} rotation={[0.10, 0, 2.05]}>
      <mesh geometry={bodyGeo} material={metal} castShadow />
      <mesh geometry={capGeo}  material={metal} position={[0, -2.67, 0]} castShadow />
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   OLIVE GARNISH — resting on right rim
══════════════════════════════════════════════════════════ */
function Olive() {
  return (
    <group position={[1.14, 2.38, 0.30]} rotation={[0, 0.4, -0.18]}>
      <mesh>
        <cylinderGeometry args={[0.013, 0.013, 2.6, 8]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.88}
          roughness={0.12} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0, -1.0, 0]} castShadow>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial color="#3d7035" roughness={0.3}
          metalness={0.0} envMapIntensity={0.5} />
      </mesh>
      <mesh position={[0, -1.0, 0.155]}>
        <circleGeometry args={[0.065, 20]} />
        <meshStandardMaterial color="#cc2020" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#e8e0d0" metalness={0.5} roughness={0.1} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   REFLECTIVE FLOOR
══════════════════════════════════════════════════════════ */
function Floor() {
  return (
    <mesh position={[0, -3.65, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[500, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={55}
        roughness={0.96}
        depthScale={1.0}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#030303"
        metalness={0.55}
        mirror={0}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   CAMERA RIG — very subtle cinematic drift
══════════════════════════════════════════════════════════ */
function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x += (0.5 + Math.sin(t * 0.08) * 0.06 - camera.position.x) * 0.012
    camera.position.y += (1.0 + Math.sin(t * 0.06) * 0.04 - camera.position.y) * 0.012
    camera.lookAt(0.4, 0.3, 0)
  })
  return null
}

/* ══════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <color attach="background" args={['#000000']} />

      {/* ── Studio lighting ── */}
      <ambientLight intensity={0.04} />

      {/* Key: strong warm from upper-right */}
      <directionalLight
        position={[5, 7, 3.5]}
        intensity={5.0}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Fill: cool blue from left */}
      <pointLight position={[-5, 2, 2]} intensity={0.5} color="#2858cc" />
      {/* Rim: back-left separation */}
      <pointLight position={[-3, 5, -4]} intensity={1.0} color="#6080cc" />
      {/* Liquid glow */}
      <pointLight position={[0.2, -0.5, 1.5]} intensity={0.5} color="#cc2050" />

      {/* ── Environment ── */}
      <Environment preset="studio" />

      {/* ── Glass + liquid + stream ── */}
      <group position={[0.2, 0, 0]}>
        <Glass />
        <Liquid />
        <PourStream />
      </group>

      {/* ── 5 ice cubes — mid-air, matching reference diagonal ── */}
      <IceCube
        position={[1.55, 3.30,  0.20]}
        rotation={[0.6, 1.2, 0.4]}
      />
      <IceCube
        position={[0.95, 2.65, -0.30]}
        rotation={[1.4, 0.5, 1.8]}
      />
      <IceCube
        position={[0.32, 2.05,  0.48]}
        rotation={[0.3, 2.2, 0.9]}
      />
      <IceCube
        position={[0.72, 1.45, -0.22]}
        rotation={[1.8, 1.1, 0.3]}
      />
      <IceCube
        position={[0.45, 0.85,  0.38]}
        rotation={[0.9, 1.8, 1.5]}
      />

      {/* ── Shaker ── */}
      <Shaker />

      {/* ── Olive ── */}
      <Olive />

      {/* ── Floor reflection ── */}
      <Floor />

      {/* ── Camera ── */}
      <CameraRig />
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
export default function CocktailHero3D() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0.5, 1.0, 9.5], fov: 44 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
