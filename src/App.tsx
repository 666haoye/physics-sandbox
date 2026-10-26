import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'

import { useStore } from './useStore'
import ControlPanel from './components/ControlPanel'
import './App.css'

export default function App() {
  const gravity = useStore((state) => state.gravity)
  const resetTrigger = useStore((state) => state.resetTrigger)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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

        <Physics gravity={[0, gravity, 0]}>
          {/* 固定地面：平面网格 + 显式 CuboidCollider 碰撞体 */}
          <RigidBody type="fixed" colliders={false}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
            <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
          </RigidBody>

          {/* resetTrigger 变化时通过 key 强制重建三个刚体，回到初始位置重新下落 */}
          <group key={resetTrigger}>
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
          </group>
        </Physics>

        <OrbitControls makeDefault />
      </Canvas>

      <ControlPanel />
    </div>
  )
}
