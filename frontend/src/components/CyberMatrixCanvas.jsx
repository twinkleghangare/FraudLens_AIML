import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberMatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Particle Grid with Constellation Connections
    const particleCount = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 850;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 650;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350;

      velocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.2,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom circle texture for soft glowing cyber points
    const createCircleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(165, 180, 252, 1)');
      gradient.addColorStop(0.3, 'rgba(129, 140, 248, 0.7)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.CanvasTexture(c);
      return texture;
    };

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 4,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Line segments for close particle constellations
    const maxLineSegments = 180;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.35,
        depthWrite: false,
      })
    );
    scene.add(lineMaterial);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.18;
      targetMouseY = (e.clientY - height / 2) * 0.18;
    };

    // Expanding Click Ripple in 3D
    let rippleRadius = 0;
    let isRippling = false;
    let rippleCenter = new THREE.Vector3();

    const handleClick = (e) => {
      const clickX = (e.clientX - width / 2) * 0.8;
      const clickY = -(e.clientY - height / 2) * 0.8;
      rippleCenter.set(clickX, clickY, 0);
      rippleRadius = 5;
      isRippling = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation toward mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(scene.position);

      // Update particle positions
      const posArray = geometry.attributes.position.array;
      const maxDistance = 75;
      let lineIndex = 0;

      if (isRippling) {
        rippleRadius += 6;
        if (rippleRadius > 500) {
          isRippling = false;
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] += velocities[i].x;
        posArray[i3 + 1] += velocities[i].y;
        posArray[i3 + 2] += velocities[i].z;

        // Bounce within spatial boundary
        if (Math.abs(posArray[i3]) > 450) velocities[i].x *= -1;
        if (Math.abs(posArray[i3 + 1]) > 350) velocities[i].y *= -1;
        if (Math.abs(posArray[i3 + 2]) > 200) velocities[i].z *= -1;

        // Ripple push effect
        if (isRippling) {
          const dx = posArray[i3] - rippleCenter.x;
          const dy = posArray[i3 + 1] - rippleCenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - rippleRadius) < 35) {
            posArray[i3] += (dx / dist) * 4;
            posArray[i3 + 1] += (dy / dist) * 4;
          }
        }

        // Draw connections to nearby particles
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance && lineIndex < maxLineSegments) {
            const alpha = 1 - dist / maxDistance;
            const lIdx = lineIndex * 6;

            linePositions[lIdx] = posArray[i3];
            linePositions[lIdx + 1] = posArray[i3 + 1];
            linePositions[lIdx + 2] = posArray[i3 + 2];

            linePositions[lIdx + 3] = posArray[j3];
            linePositions[lIdx + 4] = posArray[j3 + 1];
            linePositions[lIdx + 5] = posArray[j3 + 2];

            // Cyber purple/cyan gradient lines
            lineColors[lIdx] = 0.5 * alpha;
            lineColors[lIdx + 1] = 0.6 * alpha;
            lineColors[lIdx + 2] = 1.0 * alpha;

            lineColors[lIdx + 3] = 0.7 * alpha;
            lineColors[lIdx + 4] = 0.3 * alpha;
            lineColors[lIdx + 5] = 0.9 * alpha;

            lineIndex++;
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Clear unused lines
      for (let k = lineIndex * 6; k < maxLineSegments * 6; k++) {
        linePositions[k] = 0;
        lineColors[k] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      lineGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-45"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

