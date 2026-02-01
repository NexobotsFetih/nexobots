import { Canvas } from '@react-three/fiber';
import { HeroScene } from './HeroScene';
import { OrbitControls } from '@react-three/drei';

export const Experience = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-0 bg-void-black">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <HeroScene />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};
