"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles with color variation
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    // More vibrant pastel RGB colors
    const colors = [
      [1.0, 0.4, 0.8],  // Vibrant Pink
      [0.4, 1.0, 0.6],  // Vibrant Green
      [0.4, 0.6, 1.0],  // Vibrant Blue
    ];

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 5;
      posArray[i + 1] = (Math.random() - 0.5) * 5;
      posArray[i + 2] = (Math.random() - 0.5) * 5;

      // Color - randomly select one of the pastel colors
      const colorSet = colors[Math.floor(Math.random() * colors.length)];
      colorsArray[i] = colorSet[0];
      colorsArray[i + 1] = colorSet[1];
      colorsArray[i + 2] = colorSet[2];
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Create material with vertex colors
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 2;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;  // For horizontal rotation
    let targetRotationX = 0;  // For vertical rotation

    const handleMouseMove = (event: MouseEvent) => {
      // X movement controls Y rotation (left/right rotation)
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      // Y movement controls X rotation (up/down rotation)
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth rotation transitions
      targetRotationY += (mouseX * 0.5 - targetRotationY) * 0.1;
      targetRotationX += (mouseY * 0.3 - targetRotationX) * 0.1;

      // Base rotation for constant movement
      const elapsedTime = Date.now() * 0.0001;
      particlesMesh.rotation.y = elapsedTime * 0.15 + targetRotationY;
      
      // Apply rotations
      particlesMesh.rotation.x = targetRotationX;

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

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        zIndex: 1
      }}
    />
  );
} 