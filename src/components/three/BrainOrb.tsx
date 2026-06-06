"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface BrainOrbProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

function OrbitingNodes({ mouse }: BrainOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 8;
  const radius = 2.4;

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle * 0.5) * 0.6,
          z: Math.sin(angle) * radius,
          scale: 0.08 + (i % 3) * 0.03,
        };
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.15 + mouse.current.x * 0.3;
    groupRef.current.rotation.x = mouse.current.y * 0.15;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Sphere key={i} args={[node.scale, 16, 16]} position={[node.x, node.y, node.z]}>
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      ))}

      {/* Connection lines between nodes */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                nodes.flatMap((n, i) => {
                  const next = nodes[(i + 1) % nodes.length];
                  return [n.x, n.y, n.z, next.x, next.y, next.z];
                })
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

export default function BrainOrb({ mouse }: BrainOrbProps) {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current) return;
    const t = state.clock.elapsedTime;
    coreRef.current.rotation.y = t * 0.08;
    coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.1 + mouse.current.y * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        <Sphere ref={coreRef} args={[1.1, 64, 64]}>
          <MeshDistortMaterial
            color="#6d28d9"
            emissive="#4c1d95"
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.6}
            distort={0.35}
            speed={2}
          />
        </Sphere>

        {/* Wireframe overlay */}
        <Sphere args={[1.15, 32, 32]}>
          <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.12} />
        </Sphere>

        <OrbitingNodes mouse={mouse} />
      </group>
    </Float>
  );
}
