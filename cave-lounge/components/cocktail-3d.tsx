'use client'

import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  MeshTransmissionMaterial,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/* ══════════════════════════════════════════════════════════
   COSMOPOLITAN GLASS
   LatheGeometry traces the outer profile:
   base → thin stem → bowl flare → rim
══════════════════════════════════════════════════════════ */
function CocktailGlass({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.56, -2.85),
      new THREE.Vector2(0.56, -2.65),
      new THREE.Vector2(0.10, -2.44),
      new THREE.Vector2(0.056, -2.2),
      new THREE.Vector2(0.054, 0.0),
      new THREE.Vector2(0.068, 0.12),
      new THREE.Vector2(0.24,  0.52),
      new THREE.Vector2(0.63,  1.08),
      new THREE.Vector2(1.02,  1.64),
      new THREE.Vector2(1.21,  1.98),
      new THREE.Vector2(1.23,  2.04),
    ]
    return new THREE.LatheGeometry(pts, 96)
  }, [])

  const baseDisk = useMemo(() =>
    new THREE.CylinderGeometry(0.56, 0.56, 0.05, 64), [])

  return (
    <group ref={groupRef}>
      <mesh geometry={geo} castShadow>
        <MeshTransmissionMaterial
          samples={12}
          resolution={512}
          transmission={1}
          roughness={0}
          thickness={0.06}
          ior={1.52}
          chromaticAberration={0.02}
          anisotropy={0.08}
          distortion={0.04}
          distortionScale={0.15}
          temporalDistortion={0.015}
          color="#ffffff"
          attenuationColor="#e8f4ff"
          attenuationDistance={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={baseDisk} position={[0, -2.85, 0]}>
        <MeshTransmissionMaterial
          transmission={1} roughness={0} thickness={0.05} ior={1.52}
          color="#ffffff" side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   LIQUID
   Cone matching inside of the bowl, scale-y animated 0→1
══════════════════════════════════════════════════════════ */
function Liquid({ liquidRef }: { liquidRef: React.RefObject<THREE.Mesh> }) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0,    0.0),
      new THREE.Vector2(0.04, 0.1),
      new THREE.Vector2(0.22, 0.48),
      new THREE.Vector2(0.58, 1.02),
      new THREE.Vector2(0.97, 1.56),
      new THREE.Vector2(1.15, 1.88),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  return (
    <mesh ref={liquidRef} geometry={geo}
      position={[0, 0.08, 0]}
      scale={[1, 0.001, 1]}>
      <meshPhysicalMaterial
        color="#d42858"
        transparent
        opacity={0.9}
        roughness={0.0}
        metalness={0.0}
        ior={1.33}
        transmission={0.12}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   POUR STREAM
   TubeGeometry along a Bezier curve — scale-y animated
══════════════════════════════════════════════════════════ */
function PourStream({ streamRef }: { streamRef: React.RefObject<THREE.Mesh> }) {
  const geo = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.55, 3.8, 0),
      new THREE.Vector3(0.7,  2.4, 0),
      new THREE.Vector3(0.35, 1.2, 0),
      new THREE.Vector3(0.0,  0.15, 0),
    )
    return new THREE.TubeGeometry(curve, 32, 0.038, 8, false)
  }, [])

  return (
    <mesh ref={streamRef} geometry={geo} visible={false} scale={[1, 0.001, 1]}>
      <meshPhysicalMaterial
        color="#e0406a"
        transparent opacity={0.75}
        roughness={0.0}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   ICE CUBE — single cube
══════════════════════════════════════════════════════════ */
function IceCube({ meshRef }: { meshRef: (el: THREE.Mesh | null) => void }) {
  const geo = useMemo(() => new THREE.BoxGeometry(0.3, 0.3, 0.3), [])
  return (
    <mesh ref={meshRef} geometry={geo} castShadow>
      <MeshTransmissionMaterial
        samples={6}
        transmission={0.9}
        roughness={0.04}
        thickness={0.3}
        ior={1.31}
        chromaticAberration={0.007}
        color="#d5eeff"
        attenuationColor="#b8d8ff"
        attenuationDistance={0.6}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ══════════════════════════════════════════════════════════
   STAINLESS STEEL SHAKER
   3 parts via LatheGeometry: body, strainer collar, cap dome
══════════════════════════════════════════════════════════ */
function Shaker({ shakerRef }: { shakerRef: React.RefObject<THREE.Group> }) {
  const bodyGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.28, -2.1),
      new THREE.Vector2(0.30, -1.7),
      new THREE.Vector2(0.38, -0.6),
      new THREE.Vector2(0.40,  0.2),
      new THREE.Vector2(0.37,  1.2),
      new THREE.Vector2(0.30,  1.85),
      new THREE.Vector2(0.27,  2.0),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  const strainerGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.27, 0.0),
      new THREE.Vector2(0.30, 0.1),
      new THREE.Vector2(0.30, 0.44),
      new THREE.Vector2(0.27, 0.52),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  const capGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.27, 0.0),
      new THREE.Vector2(0.28, 0.18),
      new THREE.Vector2(0.22, 0.55),
      new THREE.Vector2(0.14, 0.85),
      new THREE.Vector2(0.06, 1.05),
      new THREE.Vector2(0.04, 1.12),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.92,
    roughness: 0.1,
    color: new THREE.Color('#b2bac8'),
    envMapIntensity: 2.0,
  }), [])

  const metalDark = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.95,
    roughness: 0.08,
    color: new THREE.Color('#a8b0c0'),
    envMapIntensity: 2.2,
  }), [])

  return (
    <group ref={shakerRef} position={[5, 7, 0.5]}>
      <mesh geometry={bodyGeo} material={metal} castShadow />
      <mesh geometry={strainerGeo} material={metalDark}
        position={[0, 2.0, 0]} castShadow />
      <mesh geometry={capGeo} material={metal}
        position={[0, 2.52, 0]} castShadow />
      {/* base disc */}
      <mesh position={[0, -2.1, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 32]} />
        <primitive object={metal} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   OLIVE GARNISH — pick + olive + pimento
══════════════════════════════════════════════════════════ */
function OliveGarnish({ oliveRef }: { oliveRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={oliveRef} position={[6, 6, 0]}>
      {/* golden pick */}
      <mesh rotation={[0, 0, Math.PI * 0.06]}>
        <cylinderGeometry args={[0.013, 0.013, 2.6, 8]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.85} roughness={0.15}
          envMapIntensity={1.5} />
      </mesh>
      {/* olive body */}
      <mesh position={[0.08, -1.0, 0]} castShadow>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial color="#4a7c42" roughness={0.35}
          metalness={0.0} envMapIntensity={0.4} />
      </mesh>
      {/* pimento */}
      <mesh position={[0.08, -1.0, 0.155]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.065, 16]} />
        <meshStandardMaterial color="#cc2218" roughness={0.45} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════
   AMBIENT PARTICLES — subtle pink/warm dust
══════════════════════════════════════════════════════════ */
function Particles() {
  return (
    <>
      <Sparkles count={60} scale={[5, 7, 3]} position={[0, 0.5, -1]}
        size={0.5} speed={0.15} opacity={0.12} color="#ff6688" />
      <Sparkles count={30} scale={[3, 5, 3]} position={[0, 1, 0]}
        size={0.3} speed={0.08} opacity={0.08} color="#ffffff" />
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   CAMERA RIG — subtle cinematic drift
══════════════════════════════════════════════════════════ */
function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x += (Math.sin(t * 0.10) * 0.12 - camera.position.x) * 0.018
    camera.position.y += (0.4 + Math.sin(t * 0.07) * 0.08 - camera.position.y) * 0.018
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ══════════════════════════════════════════════════════════
   MAIN SCENE — GSAP timeline orchestration
══════════════════════════════════════════════════════════ */
function Scene() {
  const glassRef  = useRef<THREE.Group>(null)
  const liquidRef = useRef<THREE.Mesh>(null)
  const streamRef = useRef<THREE.Mesh>(null)
  const shakerRef = useRef<THREE.Group>(null)
  const oliveRef  = useRef<THREE.Group>(null)
  const iceRefs   = useRef<(THREE.Mesh | null)[]>(Array(5).fill(null))

  const iceFinal: [number, number, number][] = [
    [-0.32, 0.60,  0.10],
    [ 0.28, 0.48, -0.10],
    [-0.08, 0.38,  0.22],
    [ 0.22, 0.68,  0.14],
    [-0.22, 0.52, -0.18],
  ]
  const iceStart: [number, number, number][] = [
    [-5, 6,  0.8],
    [ 5, 7, -0.6],
    [-4, 8,  1.0],
    [ 6, 5, -0.8],
    [ 0.5, 9, 0.4],
  ]
  const iceRotStart = [
    [1.2, 2.4, 0.8],
    [2.1, 0.6, 1.8],
    [0.5, 3.2, 2.1],
    [1.8, 1.4, 0.3],
    [3.0, 2.0, 1.2],
  ]

  useEffect(() => {
    // ── Set initial states ──────────────────────────────
    iceRefs.current.forEach((ice, i) => {
      if (!ice) return
      ice.position.set(...iceStart[i])
      ice.rotation.set(iceRotStart[i][0], iceRotStart[i][1], iceRotStart[i][2])
    })

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

    // ── PHASE 1: Ice cubes (0 → 2s) ─────────────────────
    iceRefs.current.forEach((ice, i) => {
      if (!ice) return
      const delay = 0.08 + i * 0.22

      // Arc trajectory: first go up slightly then curve down
      tl.to(ice.position, {
        x: iceFinal[i][0] * 0.6,
        y: iceFinal[i][1] + 1.8,
        z: iceFinal[i][2],
        duration: 0.55,
        ease: 'power1.out',
      }, delay)
      tl.to(ice.position, {
        x: iceFinal[i][0],
        y: iceFinal[i][1],
        z: iceFinal[i][2],
        duration: 0.45,
        ease: 'power3.in',
      }, delay + 0.55)

      // Tumble during flight
      tl.to(ice.rotation, {
        x: `+=${Math.PI * (1.5 + i * 0.3)}`,
        y: `+=${Math.PI * (1.2 + i * 0.4)}`,
        z: `+=${Math.PI * 0.8}`,
        duration: 1.0,
        ease: 'power1.out',
      }, delay)
    })

    // Glass vibration on ice impact
    tl.to(glassRef.current!.position, {
      x: 0.07, duration: 0.04, yoyo: true, repeat: 8, ease: 'power1.inOut',
    }, 1.65)
    tl.to(glassRef.current!.rotation, {
      z: 0.018, duration: 0.04, yoyo: true, repeat: 8, ease: 'power1.inOut',
    }, 1.65)

    // ── PHASE 2: Shaker pours (2 → 5s) ──────────────────
    // Shaker sweeps in from upper-right
    tl.to(shakerRef.current!.position, {
      x: 1.35, y: 3.4, z: 0.35,
      duration: 1.0, ease: 'power3.out',
    }, 2.1)

    // Rotate into pouring position
    tl.to(shakerRef.current!.rotation, {
      z: Math.PI * 0.52,
      x: -0.18,
      duration: 0.85, ease: 'power2.inOut',
    }, 2.9)

    // Settle slightly downward
    tl.to(shakerRef.current!.position, {
      y: 3.0,
      duration: 0.4, ease: 'power1.out',
    }, 3.6)

    // Stream appears and liquid fills
    tl.set(streamRef.current!, { visible: true }, 3.25)
    tl.to((streamRef.current! as THREE.Mesh).scale, {
      y: 1, duration: 0.28, ease: 'power1.out',
    }, 3.25)

    tl.to(liquidRef.current!.scale, {
      y: 1.0, duration: 1.65, ease: 'power1.out',
    }, 3.35)

    // Stream stops
    tl.to((streamRef.current! as THREE.Mesh).scale, {
      y: 0.001, duration: 0.22, ease: 'power2.in',
    }, 4.75)
    tl.set(streamRef.current!, { visible: false }, 4.98)

    // Shaker exits upper right
    tl.to(shakerRef.current!.position, {
      x: 6, y: 6, z: 0.5,
      duration: 0.85, ease: 'power2.in',
    }, 4.85)
    tl.to(shakerRef.current!.rotation, {
      z: 0, x: 0, duration: 0.85, ease: 'power2.in',
    }, 4.85)

    // ── PHASE 3: Olive garnish (5 → 6.5s) ───────────────
    tl.to(oliveRef.current!.position, {
      x: 1.08, y: 2.45, z: 0.28,
      duration: 1.0, ease: 'power3.out',
    }, 5.1)
    tl.to(oliveRef.current!.rotation, {
      y: Math.PI * 1.4,
      z: -0.18,
      duration: 1.0, ease: 'power3.out',
    }, 5.1)
    // slight bounce settle
    tl.to(oliveRef.current!.position, {
      y: 2.38,
      duration: 0.25, ease: 'bounce.out',
    }, 5.95)

    return () => { tl.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.06} />

      {/* Key light: warm from upper-left */}
      <directionalLight
        position={[-3.5, 5.5, 3]}
        intensity={2.8}
        color="#fff6ee"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Rim light: cool blue from back-right */}
      <pointLight position={[3.5, 3.5, -3]} intensity={2.0} color="#3870ff" />

      {/* Pink fill under glass (liquid glow) */}
      <pointLight position={[0, -1.2, 1]} intensity={0.8} color="#e83060" />

      {/* Top spot */}
      <spotLight
        position={[0, 7, 2]}
        intensity={1.8}
        angle={0.28}
        penumbra={0.9}
        color="#fff8f4"
        castShadow
      />

      {/* ── Environment map (HDRI reflections) ── */}
      <Environment preset="night" />

      {/* ── Glass group ── */}
      <group position={[0, 0, 0]}>
        <CocktailGlass groupRef={glassRef} />
        <Liquid liquidRef={liquidRef} />
        <PourStream streamRef={streamRef} />
      </group>

      {/* ── Ice cubes ── */}
      {Array.from({ length: 5 }, (_, i) => (
        <IceCube key={i} meshRef={el => { iceRefs.current[i] = el }} />
      ))}

      {/* ── Shaker ── */}
      <Shaker shakerRef={shakerRef} />

      {/* ── Olive ── */}
      <OliveGarnish oliveRef={oliveRef} />

      {/* ── Floor shadow ── */}
      <ContactShadows
        position={[0, -3.6, 0]}
        opacity={0.45}
        scale={9}
        blur={2.5}
        far={5}
        color="#000000"
      />

      {/* ── Ambient particles ── */}
      <Particles />

      {/* ── Camera cinematic drift ── */}
      <CameraRig />
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   EXPORT — drop into right side of hero
══════════════════════════════════════════════════════════ */
export default function CocktailHero3D() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 7.5], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
