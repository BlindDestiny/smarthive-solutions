'use client'

import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  MeshTransmissionMaterial,
  MeshReflectorMaterial,
  useTexture,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'

/* ─────────────────────────────────────────────────────────
   GLASS
   128-segment lathe for ultra-smooth silhouette
   MeshTransmissionMaterial at max quality
───────────────────────────────────────────────────────── */
function Glass({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.50, -3.05),
      new THREE.Vector2(0.50, -2.85),
      new THREE.Vector2(0.09, -2.64),
      new THREE.Vector2(0.046, -2.40),
      new THREE.Vector2(0.044,  0.00),
      new THREE.Vector2(0.058,  0.13),
      new THREE.Vector2(0.19,   0.48),
      new THREE.Vector2(0.57,   1.07),
      new THREE.Vector2(1.01,   1.68),
      new THREE.Vector2(1.21,   2.02),
      new THREE.Vector2(1.235,  2.08),
    ]
    return new THREE.LatheGeometry(pts, 128)
  }, [])

  const diskGeo = useMemo(() =>
    new THREE.CylinderGeometry(0.50, 0.50, 0.055, 64), [])

  const mat = useMemo(() => ({
    samples: 16,
    resolution: 1024,
    transmission: 1 as const,
    roughness: 0 as const,
    thickness: 0.07,
    ior: 1.52,
    chromaticAberration: 0.028,
    anisotropy: 0.05,
    distortion: 0.04,
    distortionScale: 0.15,
    temporalDistortion: 0.015,
    color: '#ffffff' as const,
    attenuationColor: '#ddeeff' as const,
    attenuationDistance: 0.3,
    side: THREE.DoubleSide,
  }), [])

  return (
    <group ref={groupRef}>
      <mesh geometry={geo} castShadow receiveShadow>
        <MeshTransmissionMaterial {...mat} />
      </mesh>
      <mesh geometry={diskGeo} position={[0, -3.05, 0]}>
        <MeshTransmissionMaterial {...mat} />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────
   LIQUID  —  scale-y 0 → 1 during animation
───────────────────────────────────────────────────────── */
function Liquid({ meshRef }: { meshRef: React.RefObject<THREE.Mesh> }) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0,    0.00),
      new THREE.Vector2(0.04, 0.12),
      new THREE.Vector2(0.18, 0.46),
      new THREE.Vector2(0.55, 1.01),
      new THREE.Vector2(0.97, 1.58),
      new THREE.Vector2(1.15, 1.88),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  return (
    <mesh ref={meshRef} geometry={geo}
      position={[0, 0.10, 0]}
      scale={new THREE.Vector3(1, 0.001, 1)}>
      <meshPhysicalMaterial
        color="#cc2855"
        emissive="#550010"
        emissiveIntensity={0.12}
        transparent
        opacity={0.92}
        roughness={0}
        metalness={0}
        ior={1.33}
        transmission={0.08}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────
   POUR STREAM  —  Bezier tube, scale-y 0 → 1
   Shaker center [3.5, 3.8, 0.4], rotation.z=2.0
   Opening ≈ [0.95, 2.64, 0.4]
───────────────────────────────────────────────────────── */
function PourStream({ meshRef }: { meshRef: React.RefObject<THREE.Mesh> }) {
  const geo = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.92, 2.60, 0.38),
      new THREE.Vector3(0.78, 1.95, 0.26),
      new THREE.Vector3(0.46, 0.95, 0.10),
      new THREE.Vector3(0.10, 0.18, 0.00),
    )
    return new THREE.TubeGeometry(curve, 48, 0.050, 10, false)
  }, [])

  return (
    <mesh ref={meshRef} geometry={geo}
      visible={false}
      scale={new THREE.Vector3(1, 0.001, 1)}>
      <meshPhysicalMaterial
        color="#dd3060"
        transparent opacity={0.78}
        roughness={0}
        metalness={0}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────
   ICE CUBE
   Slightly non-uniform scale per cube for realism
───────────────────────────────────────────────────────── */
function IceCube({ r, scale = [1, 1, 1] }: {
  r: (el: THREE.Mesh | null) => void
  scale?: [number, number, number]
}) {
  const geo = useMemo(() => new THREE.BoxGeometry(0.34, 0.34, 0.34), [])
  return (
    <mesh ref={r} geometry={geo} scale={scale} castShadow>
      <MeshTransmissionMaterial
        samples={8}
        resolution={256}
        transmission={0.92}
        roughness={0.04}
        thickness={0.34}
        ior={1.31}
        chromaticAberration={0.015}
        color="#c8e2ff"
        attenuationColor="#a0caff"
        attenuationDistance={0.5}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────
   SHAKER
   Boston-style: slightly tapered cylinder, prominent collar
   rotation.z = 2.0  →  opening faces lower-left → pours
───────────────────────────────────────────────────────── */
function Shaker({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const bodyGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.24, -2.65),
      new THREE.Vector2(0.30, -2.48),
      new THREE.Vector2(0.37, -1.50),
      new THREE.Vector2(0.39,  0.00),
      new THREE.Vector2(0.41,  1.60),
      new THREE.Vector2(0.42,  2.20),
      new THREE.Vector2(0.45,  2.34),
      new THREE.Vector2(0.45,  2.60),
      new THREE.Vector2(0.41,  2.72),
      new THREE.Vector2(0.41,  2.82),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  const capGeo = useMemo(() =>
    new THREE.CylinderGeometry(0.24, 0.24, 0.16, 32), [])

  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    metalness: 0.95,
    roughness: 0.06,
    color: new THREE.Color('#b0b8c8'),
    envMapIntensity: 3.0,
  }), [])

  return (
    <group ref={groupRef} position={[7, 9, 0.5]}>
      <mesh geometry={bodyGeo} material={metal} castShadow />
      <mesh geometry={capGeo} material={metal}
        position={[0, -2.73, 0]} castShadow />
    </group>
  )
}

/* ─────────────────────────────────────────────────────────
   OLIVE + PICK
───────────────────────────────────────────────────────── */
function Olive({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={groupRef} position={[8, 7, 0]}>
      {/* gold pick */}
      <mesh rotation={[0, 0, Math.PI * 0.07]}>
        <cylinderGeometry args={[0.013, 0.013, 2.7, 8]} />
        <meshStandardMaterial color="#c9a84c"
          metalness={0.9} roughness={0.1} envMapIntensity={2} />
      </mesh>
      {/* top bead */}
      <mesh position={[0.12, 1.32, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#e8e0d0"
          metalness={0.5} roughness={0.1} />
      </mesh>
      {/* olive */}
      <mesh position={[0.06, -1.02, 0]} castShadow>
        <sphereGeometry args={[0.175, 32, 32]} />
        <meshStandardMaterial color="#3d7035"
          roughness={0.3} envMapIntensity={0.5} />
      </mesh>
      {/* pimento */}
      <mesh position={[0.06, -1.02, 0.162]}>
        <circleGeometry args={[0.068, 20]} />
        <meshStandardMaterial color="#cc2020" roughness={0.4} />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────
   FLOOR  —  dark reflective surface
───────────────────────────────────────────────────────── */
function Floor() {
  return (
    <mesh position={[0, -3.65, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[500, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={50}
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

/* ─────────────────────────────────────────────────────────
   CAMERA  —  subtle drift after animation settles
───────────────────────────────────────────────────────── */
function CameraRig({ active }: { active: React.RefObject<boolean> }) {
  useFrame(({ camera, clock }) => {
    if (!active.current) return
    const t = clock.getElapsedTime()
    camera.position.x += (0.35 + Math.sin(t * 0.07) * 0.04 - camera.position.x) * 0.01
    camera.position.y += (0.9  + Math.sin(t * 0.05) * 0.03 - camera.position.y) * 0.01
    camera.lookAt(0.3, 0.3, 0)
  })
  return null
}

/* ─────────────────────────────────────────────────────────
   SCENE
───────────────────────────────────────────────────────── */
function Scene() {
  const glassRef  = useRef<THREE.Group>(null)
  const liquidRef = useRef<THREE.Mesh>(null)
  const streamRef = useRef<THREE.Mesh>(null)
  const shakerRef = useRef<THREE.Group>(null)
  const oliveRef  = useRef<THREE.Group>(null)
  const iceRefs   = useRef<(THREE.Mesh | null)[]>(Array(5).fill(null))
  const camActive = useRef(false)

  /* Final ice positions — cascade from upper-left to glass */
  const iceFinal: [number, number, number][] = [
    [-0.80, 3.20,  0.20],
    [-0.28, 2.60, -0.22],
    [-0.60, 2.00,  0.45],
    [ 0.02, 1.40, -0.15],
    [ 0.42, 0.82,  0.30],
  ]
  const iceStart: [number, number, number][] = [
    [-6,  8,  1.0],
    [ 5,  7, -0.8],
    [-5,  9,  1.5],
    [ 5,  6, -1.5],
    [ 0.5, 9,  0.5],
  ]
  const iceScales: [number, number, number][] = [
    [1.00, 0.95, 1.05],
    [0.98, 1.02, 0.96],
    [1.03, 0.97, 1.00],
    [0.96, 1.04, 0.98],
    [1.01, 0.98, 1.03],
  ]
  const iceRot0 = [
    [1.2, 2.4, 0.8],
    [2.1, 0.6, 1.9],
    [0.4, 3.0, 2.2],
    [1.9, 1.4, 0.3],
    [3.0, 2.0, 1.2],
  ]

  useEffect(() => {
    /* set start states */
    iceRefs.current.forEach((ice, i) => {
      if (!ice) return
      ice.position.set(...iceStart[i])
      ice.rotation.set(iceRot0[i][0], iceRot0[i][1], iceRot0[i][2])
    })

    const tl = gsap.timeline({
      onComplete: () => { camActive.current = true }
    })

    /* ── Phase 1: Ice (0 → 2s) ── */
    iceRefs.current.forEach((ice, i) => {
      if (!ice) return
      const t0 = 0.06 + i * 0.24

      /* arc trajectory */
      tl.to(ice.position, {
        x: iceFinal[i][0] * 0.55,
        y: iceFinal[i][1] + 2.0,
        z: iceFinal[i][2],
        duration: 0.55, ease: 'power1.out',
      }, t0)
      tl.to(ice.position, {
        x: iceFinal[i][0],
        y: iceFinal[i][1],
        z: iceFinal[i][2],
        duration: 0.50, ease: 'power3.in',
      }, t0 + 0.55)

      /* tumble */
      tl.to(ice.rotation, {
        x: `+=${Math.PI * (1.6 + i * 0.2)}`,
        y: `+=${Math.PI * (1.3 + i * 0.3)}`,
        z: `+=${Math.PI * 0.8}`,
        duration: 1.05, ease: 'power2.inOut',
      }, t0)
    })

    /* glass vibration on ice impact */
    tl.to(glassRef.current!.position, {
      x: 0.06, duration: 0.04, yoyo: true, repeat: 9, ease: 'power1.inOut',
    }, 1.55)

    /* ── Phase 2: Shaker pour (2 → 5s) ── */
    /* enter from upper-right */
    tl.to(shakerRef.current!.position, {
      x: 3.5, y: 3.8, z: 0.4,
      duration: 1.0, ease: 'power3.out',
    }, 2.1)

    /* tilt into pour position: rotation.z=2.0 → mouth faces lower-left */
    tl.to(shakerRef.current!.rotation, {
      z: 2.0, x: 0.10,
      duration: 0.85, ease: 'power2.inOut',
    }, 2.95)

    /* settle slightly */
    tl.to(shakerRef.current!.position, {
      y: 3.5, duration: 0.4, ease: 'power1.out',
    }, 3.7)

    /* stream + fill */
    tl.set(streamRef.current!, { visible: true }, 3.35)
    tl.to((streamRef.current as THREE.Mesh)!.scale, {
      y: 1, duration: 0.28, ease: 'power1.out',
    }, 3.35)
    tl.to(liquidRef.current!.scale, {
      y: 1.0, duration: 1.55, ease: 'power1.out',
    }, 3.42)

    /* stream off */
    tl.to((streamRef.current as THREE.Mesh)!.scale, {
      y: 0.001, duration: 0.22, ease: 'power2.in',
    }, 4.75)
    tl.set(streamRef.current!, { visible: false }, 4.98)

    /* ── Phase 3: Olive (5 → 6.5s) ── */
    tl.to(oliveRef.current!.position, {
      x: 1.14, y: 2.40, z: 0.30,
      duration: 1.0, ease: 'power3.out',
    }, 5.1)
    tl.to(oliveRef.current!.rotation, {
      y: Math.PI * 1.5, z: -0.18,
      duration: 1.0, ease: 'power3.out',
    }, 5.1)
    tl.to(oliveRef.current!.position, {
      y: 2.33, duration: 0.25, ease: 'power2.in',
    }, 5.95)
    tl.to(oliveRef.current!.position, {
      y: 2.40, duration: 0.18, ease: 'bounce.out',
    }, 6.20)

    return () => { tl.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <color attach="background" args={['#000000']} />

      {/* ── Lighting ── */}
      <ambientLight intensity={0.04} />

      {/* KEY: strong warm strobe from upper-right */}
      <directionalLight
        position={[5.0, 7.5, 3.5]}
        intensity={5.5}
        color="#fff6ee"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* fill: cool blue, very dim */}
      <pointLight position={[-5, 2, 2]} intensity={0.45} color="#2050cc" />
      {/* rim: back-left separation */}
      <pointLight position={[-2.5, 5, -4]} intensity={0.9} color="#5070bb" />
      {/* liquid glow */}
      <pointLight position={[0.1, -0.3, 1.8]} intensity={0.55} color="#cc2050" />

      {/* ── Environment (HDRI reflections) ── */}
      <Environment preset="studio" />

      {/* ── Glass group ── */}
      <group position={[0.1, 0, 0]}>
        <Glass groupRef={glassRef} />
        <Liquid meshRef={liquidRef} />
        <PourStream meshRef={streamRef} />
      </group>

      {/* ── Ice cubes ── */}
      {iceScales.map((sc, i) => (
        <IceCube key={i}
          r={el => { iceRefs.current[i] = el }}
          scale={sc}
        />
      ))}

      {/* ── Shaker ── */}
      <Shaker groupRef={shakerRef} />

      {/* ── Olive ── */}
      <Olive groupRef={oliveRef} />

      {/* ── Floor ── */}
      <Floor />

      {/* ── Camera drift (activates after animation) ── */}
      <CameraRig active={camActive} />

      {/* ── Post-processing ── */}
      <EffectComposer>
        {/* Bloom: liquid and glass highlights glow */}
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        {/* Chromatic aberration: glass refraction feel */}
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0006)}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />
        {/* Vignette: darken edges like studio photo */}
        <Vignette
          offset={0.35}
          darkness={0.65}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────────────────── */
export default function CocktailHero3D() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0.35, 0.9, 9.5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
