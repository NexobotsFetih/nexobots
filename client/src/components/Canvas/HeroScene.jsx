import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const DigitalRain = ({ count = 1000 }) => {
    const mesh = useRef();

    // Generate random positions and speeds for rain drops
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 30; // Wider spread x
            const y = Math.random() * 20 - 10;    // Spread y
            const z = (Math.random() - 0.5) * 15; // Spread z
            const speed = Math.random() * 0.3 + 0.2; // Faster, realistic speed
            // Slight angle: X moves with Y to simulate wind
            const angle = 0.1;
            temp.push({ x, y, z, speed, angle });
        }
        return temp;
    }, [count]);

    // Use dummy object for instance styling
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!mesh.current) return; // Guard clause

        particles.forEach((particle, i) => {
            // Update positions
            particle.y -= particle.speed;
            particle.x -= particle.speed * 0.2; // Wind effect to left

            // Reset if below screen
            if (particle.y < -10) {
                particle.y = 10;
                particle.x += 4; // Reset X slightly to create continuous flow illusion
            }

            // Update instance matrix
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.set(0.01, 0.4, 0.01); // Long thin streaks
            dummy.rotation.z = 0.2; // Rotate mesh to match wind direction
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
        </instancedMesh>
    );
};

export const HeroScene = () => {
    const sphereRef = useRef();

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x += 0.002; // Much slower rotation
            sphereRef.current.rotation.y += 0.002;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#06b6d4" />

            <DigitalRain count={1500} />

            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere ref={sphereRef} args={[1.8, 64, 64]}>
                    <MeshDistortMaterial
                        color="#050505"
                        emissive="#a855f7"
                        emissiveIntensity={1.5}
                        roughness={0.1}
                        metalness={1}
                        distort={0.6}
                        speed={0.5} // Slowed down from 3
                        wireframe
                    />
                </Sphere>
            </Float>
        </>
    );
};
