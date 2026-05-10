'use client'

import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  MeshTransmissionMaterial,
  MeshReflectorMaterial,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/* ══════════════════════════════════════════════════════════
   MARTINI / COSMOPOLITAN GLASS
   Thin-walled LatheGeometry: base → stem → bowl → rim
══════════════════════════════════════════════════════════ */
function Glass({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const bowlGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.52, -3.1),   // base edge
      new THREE.Vector2(0.52, -2.9),   // base thickness
      new THREE.Vector2(0.08, -2.68),  // base → stem
      new THREE.Vector2(0.052, -2.4),  // stem
      new THREE.Vector2(0.050, 0.0),   // stem top
      new THREE.Vector2(0.062, 0.12),  // flare
      new THREE.Vector2(0.20,  0.48),  // lower bowl
      new THREE.Vector2(0.58,  1.05),  // mid bowl
      new THREE.Vector2(1.02,  1.68),  // upper bowl
      new THREE.Vector2(1.22,  2.02),  // near rim
      new THREE.Vector2(1.25,  2.08),  // rim
    ]
    return new THREE.LatheGeometry(pts, 96)
  }, [])

  const baseGeo = useMemo(() => new THREE.CylinderGeometry(0.52, 0.52, 0.05, 64), [])

  const matProps = {
    samples: 10,
    resolution: 512,
    transmission: 1 as const,
    roughness: 0 as const,
    thickness: 0.055,
    ior: 1.52,
    chromaticAberration: 0.018,
    anisotropy: 0.06,
    distortion: 0.04,
    distortionScale: 0.12,
    temporalDistortion: 0.01,
    color: '#ffffff' as const,
    attenuationColor: '#ddf0ff' as const,
    attenuationDistance: 0.3,
    side: THREE.DoubleSide,
  }

  return (
    <group ref={groupRef}>
      <mesh geometry={bowlGeo} castShadow receiveShadow>
        <MeshTransmissionMaterial {...matProps} />
      </mesh>
      <mesh geometry={baseGeo} position={[0, -3.1, 0]}>
        <MeshTransmissionMaterial {...matProps} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   COSMOPOLITAN LIQUID  — cone fill, scale-y 0 → 1
══════════════════════════════════════════════════════════ */
function Liquid({ meshRef }: { meshRef: React.RefObject<THREE.Mesh> }) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.04, 0.1),
      new THREE.Vector2(0.18, 0.44),
      new THREE.Vector2(0.55, 0.98),
      new THREE.Vector2(0.97, 1.58),
      new THREE.Vector2(1.16, 1.90),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  return (
    <mesh ref={meshRef} geometry={geo}
      position={[0, 0.10, 0]} scale={[1, 0.001, 1]}>
      <meshPhysicalMaterial
        color="#cc2855"
        emissive="#550010"
        emissiveIntensity={0.08}
        transparent opacity={0.92}
        roughness={0} metalness={0}
        ior={1.33}
        transmission={0.10}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   POUR STREAM  — Bezier tube, scale-y 0 → 1
══════════════════════════════════════════════════════════ */
function PourStream({ meshRef }: { meshRef: React.RefObject<THREE.Mesh> }) {
  const geo = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3( 0.48, 3.65, 0.2),   // shaker mouth
      new THREE.Vector3( 0.60, 2.80, 0.1),
      new THREE.Vector3( 0.35, 1.60, 0.0),
      new THREE.Vector3( 0.05, 0.18, 0.0),   // glass opening
    )
    return new THREE.TubeGeometry(curve, 40, 0.048, 10, false)
  }, [])

  return (
    <mesh ref={meshRef} geometry={geo}
      visible={false} scale={[1, 0.001, 1]}>
      <meshPhysicalMaterial
        color="#e03565"
        transparent opacity={0.82}
        roughness={0} metalness={0}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   ICE CUBE  — single PBR ice unit
══════════════════════════════════════════════════════════ */
function IceCube({ r = el => {} }: { r?: (el: THREE.Mesh | null) => void }) {
  const geo = useMemo(() => new THREE.BoxGeometry(0.34, 0.34, 0.34), [])
  return (
    <mesh ref={r} geometry={geo} castShadow>
      <MeshTransmissionMaterial
        samples={6}
        transmission={0.92}
        roughness={0.03}
        thickness={0.34}
        ior={1.31}
        chromaticAberration={0.006}
        color="#cce6ff"
        attenuationColor="#a8d0ff"
        attenuationDistance={0.55}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   BOSTON SHAKER  — 3-part LatheGeometry, stainless steel
   Opening at y=+, closed bottom at y=−
   When rotation.z = -1.15: opening points lower-left → pours
══════════════════════════════════════════════════════════ */
function Shaker({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const bodyGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.22, -2.5),  // closed bottom
      new THREE.Vector2(0.30, -2.35), // base widen
      new THREE.Vector2(0.36, -1.5),  // cylinder
      new THREE.Vector2(0.38,  0.0),  // midpoint
      new THREE.Vector2(0.40,  1.8),  // taper toward top
      new THREE.Vector2(0.42,  2.25), // approach collar
      new THREE.Vector2(0.44,  2.35), // collar out
      new THREE.Vector2(0.44,  2.55), // collar top
      new THREE.Vector2(0.40,  2.65), // inner shoulder
      new THREE.Vector2(0.40,  2.80), // opening
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  const capGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32), [])

  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.95,
    roughness: 0.08,
    color: new THREE.Color('#b0b8c8'),
    envMapIntensity: 2.5,
  }), [])

  return (
    <group ref={groupRef} position={[6, 8, 0.5]}>
      <mesh geometry={bodyGeo} material={metal} castShadow />
      {/* closed bottom cap */}
      <mesh geometry={capGeo} material={metal}
        position={[0, -2.56, 0]} castShadow />
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   OLIVE GARNISH  — olive + pimento + gold pick
══════════════════════════════════════════════════════════ */
function Olive({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={groupRef} position={[8, 7, 0]}>
      {/* pick stick */}
      <mesh rotation={[0, 0, Math.PI * 0.07]}>
        <cylinderGeometry args={[0.014, 0.014, 2.8, 8]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.88}
          roughness={0.12} envMapIntensity={1.8} />
      </mesh>
      {/* top pearl */}
      <mesh position={[0.12, 1.35, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#e8e8f0" metalness={0.5}
          roughness={0.1} />
      </mesh>
      {/* olive body */}
      <mesh position={[0.06, -1.05, 0]} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#3d7035" roughness={0.3}
          metalness={0.0} envMapIntensity={0.5} />
      </mesh>
      {/* pimento */}
      <mesh position={[0.06, -1.05, 0.165]}>
        <circleGeometry args={[0.068, 20]} />
        <meshStandardMaterial color="#cc2020" roughness={0.4} />
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
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={60}
        roughness={0.95}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#040404"
        metalness={0.6}
        mirror={0}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   CAMERA — cinematic drift
══════════════════════════════════════════════════════════ */
function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x += (0.15 + Math.sin(t * 0.09) * 0.1 - camera.position.x) * 0.015
    camera.position.y += (-0.1 + Math.sin(t * 0.07) * 0.06 - camera.position.y) * 0.015
    camera.lookAt(0.2, 0.4, 0)
  })
  return null
}

/* ══════════════════════════════════════════════════════════
   MAIN SCENE  + GSAP TIMELINE
   Ice 0-2s | Shaker pour 2-5s | Olive 5-6.5s
══════════════════════════════════════════════════════════ */
function Scene() {
  const glassRef  = useRef<THREE.Group>(null)
  const liquidRef = useRef<THREE.Mesh>(null)
  const streamRef = useRef<THREE.Mesh>(null)
  const shakerRef = useRef<THREE.Group>(null)
  const oliveRef  = useRef<THREE.Group>(null)
  const iceRefs   = useRef<(THREE.Mesh | null)[]>(Array(5).fill(null))

  /* Final mid-air ice positions — match the reference composition */
  const iceFinal: [number,number,number][] = [
    [-1.05,  2.85,  0.35],   // upper-left, highest
    [-0.55,  2.20, -0.25],   // upper center-left
    [-0.80,  1.60,  0.50],   // mid-left
    [-0.12,  1.10, -0.30],   // center
    [ 0.30,  0.60,  0.40],   // lower, near glass opening
  ]
  const iceStart: [number,number,number][] = [
    [-6,  7,  1.0],
    [ 6,  7, -0.8],
    [-5,  9,  1.5],
    [ 6,  5, -1.2],
    [ 0,  9,  0.6],
  ]
  const iceRot0 = [
    [1.4, 2.5, 0.9],
    [2.2, 0.7, 1.9],
    [0.6, 3.1, 2.2],
    [1.9, 1.5, 0.4],
    [3.1, 2.1, 1.3],
  ]

  useEffect(() => {
    iceRefs.current.forEach((ice, i) => {
      if (!ice) return
      ice.position.set(...iceStart[i])
      ice.rotation.set(iceRot0[i][0], iceRot0[i][1], iceRot0[i][2])
    })

    const tl = gsap.timeline()

    /* ── ICE (0 → 2s) ─────────────────────────────────── */
    iceRefs.current.forEach((ice, i) => {
      if (!ice) return
      const t0 = 0.08 + i * 0.24

      /* arc: rise briefly then sweep to final position */
      tl.to(ice.position, {
        x: iceFinal[i][0] * 0.5,
        y: iceFinal[i][1] + 2.2,
        z: iceFinal[i][2],
        duration: 0.6,
        ease: 'power1.out',
      }, t0)
      tl.to(ice.position, {
        x: iceFinal[i][0],
        y: iceFinal[i][1],
        z: iceFinal[i][2],
        duration: 0.5,
        ease: 'power3.in',
      }, t0 + 0.6)

      /* tumble during flight */
      tl.to(ice.rotation, {
        x: `+=${Math.PI * (1.8 + i * 0.25)}`,
        y: `+=${Math.PI * (1.3 + i * 0.35)}`,
        z: `+=${Math.PI * 0.9}`,
        duration: 1.1,
        ease: 'power1.inOut',
      }, t0)

      /* settle: slight rocking to rest */
      tl.to(ice.rotation, {
        x: iceFinal[i][0] * 0.3,
        y: iceFinal[i][1] * 0.1,
        duration: 0.3,
        ease: 'power2.out',
      }, t0 + 1.1)
    })

    /* glass micro-vibration when first ice hits */
    if (glassRef.current) {
      tl.to(glassRef.current.position, {
        x: 0.06, duration: 0.04, yoyo: true, repeat: 8, ease: 'power1.inOut',
      }, 1.55)
      tl.to(glassRef.current.rotation, {
        z: 0.014, duration: 0.04, yoyo: true, repeat: 8, ease: 'power1.inOut',
      }, 1.55)
    }

    /* ── SHAKER (2 → 5s) ───────────────────────────────── */
    /* Enter: slide in from upper-right */
    tl.to(shakerRef.current!.position, {
      x: 2.1, y: 3.6, z: 0.4,
      duration: 0.9, ease: 'power2.out',
    }, 2.1)

    /* Rotate into horizontal pouring position
       rotation.z = -1.15 makes the opening (y+) point lower-left */
    tl.to(shakerRef.current!.rotation, {
      z: -1.15, x: -0.12,
      duration: 0.75, ease: 'power2.inOut',
    }, 2.85)

    /* Tiny nudge downward to pouring height */
    tl.to(shakerRef.current!.position, {
      y: 3.2,
      duration: 0.4, ease: 'power1.out',
    }, 3.5)

    /* Stream on */
    if (streamRef.current) {
      tl.set(streamRef.current, { visible: true }, 3.3)
      tl.to((streamRef.current as THREE.Mesh).scale, {
        y: 1, duration: 0.25, ease: 'power1.out',
      }, 3.3)
    }

    /* Liquid fills glass */
    tl.to(liquidRef.current!.scale, {
      y: 1.0, duration: 1.55, ease: 'power1.out',
    }, 3.38)

    /* Stream off */
    if (streamRef.current) {
      tl.to((streamRef.current as THREE.Mesh).scale, {
        y: 0.001, duration: 0.2, ease: 'power2.in',
      }, 4.7)
      tl.set(streamRef.current, { visible: false }, 4.92)
    }

    /* Shaker holds position (final composition stays) */

    /* ── OLIVE (5 → 6.5s) ──────────────────────────────── */
    tl.to(oliveRef.current!.position, {
      x: 1.12, y: 2.42, z: 0.32,
      duration: 0.95, ease: 'power3.out',
    }, 5.1)
    tl.to(oliveRef.current!.rotation, {
      y: Math.PI * 1.6, z: -0.2,
      duration: 0.95, ease: 'power3.out',
    }, 5.1)
    tl.to(oliveRef.current!.position, {
      y: 2.34,
      duration: 0.22, ease: 'power2.in',
    }, 5.95)
    tl.to(oliveRef.current!.position, {
      y: 2.40,
      duration: 0.15, ease: 'power2.out',
    }, 6.17)

    return () => { tl.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* ── Pure black bg ── */}
      <color attach="background" args={['#000000']} />

      {/* ── Studio lighting ────────────────────────────── */}
      {/* No ambient — keep it dark */}
      <ambientLight intensity={0.03} />

      {/* KEY: strong warm from upper-right (mimics studio strobe) */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={4.5}
        color="#fff8f2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* FILL: cool blue from left, very dim */}
      <pointLight position={[-4, 2, 2]} intensity={0.6} color="#3060cc" />

      {/* RIM: back left to separate glass from bg */}
      <pointLight position={[-2, 4, -3]} intensity={1.2} color="#8090cc" />

      {/* LIQUID GLOW: pink light from inside glass area */}
      <pointLight position={[0.1, -0.5, 1.2]} intensity={0.55} color="#d42855" />

      {/* ── HDRI reflections ── */}
      <Environment preset="studio" />

      {/* ── GLASS ── */}
      <group position={[0.1, 0, 0]}>
        <Glass groupRef={glassRef} />
        <Liquid meshRef={liquidRef} />
        <PourStream meshRef={streamRef} />
      </group>

      {/* ── ICE CUBES ── */}
      {Array.from({ length: 5 }, (_, i) => (
        <IceCube key={i} r={el => { iceRefs.current[i] = el }} />
      ))}

      {/* ── SHAKER ── */}
      <Shaker groupRef={shakerRef} />

      {/* ── OLIVE ── */}
      <Olive groupRef={oliveRef} />

      {/* ── REFLECTIVE FLOOR ── */}
      <Floor />

      {/* ── AMBIENT DUST ── */}
      <Sparkles count={50} scale={[6, 8, 4]} position={[0, 1, -1]}
        size={0.4} speed={0.1} opacity={0.08} color="#ff6688" />

      {/* ── CAMERA ── */}
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
        camera={{ position: [0.2, -0.1, 8.5], fov: 40 }}
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
