import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'

import './App.css'

export default function App() {
  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <Physics gravity={[0, -9.81, 0]}>
        {/* 固定地面：平面网格 + 显式 CuboidCollider 碰撞体 */}
        <RigidBody type="fixed" colliders={false}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
        </RigidBody>

        {/* 三个自由下落的刚体：方块（左）、球体（中）、圆柱体（右） */}
        <RigidBody position={[-2, 6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
        </RigidBody>

        <RigidBody position={[0, 8, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#3498db" />
          </mesh>
        </RigidBody>

        <RigidBody position={[2, 10, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            <meshStandardMaterial color="#2ecc71" />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls makeDefault />
    </Canvas>
  )
}
