import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer, LoopRepeat } from 'three';

export default function PawPatrolCharacterRocky() {
  const { scene, animations } = useGLTF(`../models/rocky.glb`);
  const { viewport } = useThree(); 
  const mixer = useRef(null);
  const modelRef = useRef();

  useEffect(() => {

    if (animations.length > 0) {
      mixer.current = new AnimationMixer(scene);

      
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        action.loop = LoopRepeat;  
        action.play();  
      });
    }

    return () => {
      
      if (mixer.current) {
        mixer.current.stopAllAction();
        mixer.current = null;
      }
    };
  }, [animations, scene]);

  
  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
    if (modelRef.current) {
      modelRef.current.rotation.y -= delta * 0.15; 
    }
  });

  
  const responsiveScale = viewport.width / 5;

  return (
    <group scale={responsiveScale}>
      <primitive position={[0, 5, 0]} scale={5} ref={modelRef} object={scene} />
    </group>
  );
}
