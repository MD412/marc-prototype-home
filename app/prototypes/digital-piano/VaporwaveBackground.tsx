'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  bgStart: string;
  bgEnd: string;
  accent: string;
}

interface VaporwaveBackgroundProps {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  theme: Theme;
}

export default function VaporwaveBackground({ audioContext, analyser, waveform, theme }: VaporwaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>();
  const gridRef = useRef<THREE.Mesh | null>(null);
  const planeGeometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const gridMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Store refs for cleanup
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create infinite grid
    const size = 60;
    const divisions = 60;
    const scrollSpeed = 0.2;

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.primary),
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    gridMaterialRef.current = gridMaterial;

    // Generate noise function
    const noise2D = createNoise2D();
    
    // Create a single large plane for the grid
    const planeGeometry = new THREE.PlaneGeometry(size * 2, size * 4, divisions * 2, divisions * 4);
    planeGeometry.rotateX(-Math.PI / 2);
    planeGeometryRef.current = planeGeometry;
    
    const grid = new THREE.Mesh(planeGeometry, gridMaterial);
    grid.position.set(0, -4, -30);
    scene.add(grid);
    gridRef.current = grid;

    // Set up audio analysis
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const audioData = new Uint8Array(bufferLength);
    
    // Function to update terrain based on audio
    const updateTerrain = () => {
      analyser.getByteFrequencyData(audioData);
      
      // Calculate overall audio intensity
      let totalIntensity = 0;
      let highFreqIntensity = 0;
      let lowFreqIntensity = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        totalIntensity += audioData[i];
        if (i < bufferLength / 3) {
          lowFreqIntensity += audioData[i];
        } else if (i > (bufferLength * 2) / 3) {
          highFreqIntensity += audioData[i];
        }
      }
      
      const avgIntensity = totalIntensity / (bufferLength * 255);
      const bassIntensity = lowFreqIntensity / ((bufferLength / 3) * 255);
      const trebleIntensity = highFreqIntensity / ((bufferLength / 3) * 255);
      
      // Update grid opacity based on audio and time
      const time = Date.now() * 0.001;
      const baseOpacity = 0.15;
      const breathingEffect = Math.sin(time * 0.5) * 0.05;
      const audioEffect = avgIntensity * 0.15;
      gridMaterial.opacity = baseOpacity + breathingEffect + audioEffect;
      
      const vertices = planeGeometry.attributes.position.array;
      const offset = (time * scrollSpeed) % 2;

      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        
        const nx = x * 0.05;
        const nz = (z + offset * size) * 0.05;
        const baseHeight = noise2D(nx + (waveform === 'sine' ? time * 0.1 : 0), 
                               nz + (waveform === 'sine' ? time * 0.1 : 0)) * 0.2;

        let deformation = 0;
        const distanceFromCenter = Math.sqrt(x * x + z * z);

        if (waveform === 'sine') {
          const radialWave = Math.sin(distanceFromCenter * 0.5 - time * 2) * avgIntensity;
          const freqWave = Math.sin(x * 0.2 + time * 3) * trebleIntensity +
                          Math.cos(z * 0.2 + time * 2) * bassIntensity;
          deformation = (radialWave * 12.0) + (freqWave * 6.0);
        } else {
          const wave = Math.sin(distanceFromCenter * 0.5 - avgIntensity * 10) * avgIntensity;
          const intensity = waveform === 'square' ? 6.0 : 
                          waveform === 'sawtooth' ? 4.0 : 3.0;
          deformation = wave * intensity;
        }
        
        vertices[i + 1] = baseHeight + deformation;
      }
      planeGeometry.attributes.position.needsUpdate = true;
      planeGeometry.computeVertexNormals();
    };

    // Position camera
    camera.position.y = 6;
    camera.position.z = 12;
    camera.rotation.x = -0.4;

    // Animation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      updateTerrain();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Remove event listener
      window.removeEventListener('resize', handleResize);

      // Dispose of Three.js resources
      if (planeGeometryRef.current) {
        planeGeometryRef.current.dispose();
      }
      if (gridMaterialRef.current) {
        gridMaterialRef.current.dispose();
      }
      if (gridRef.current) {
        sceneRef.current?.remove(gridRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current.domElement.remove();
      }
    };
  }, [theme]); // Only theme is in dependencies to trigger recreation on theme change

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        background: `linear-gradient(to bottom, ${theme.bgStart}, ${theme.bgEnd})`
      }}
    />
  );
} 