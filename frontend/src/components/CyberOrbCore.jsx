import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Radio, RefreshCw, Eye, Zap } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function CyberOrbCore({ riskScore = 15, classification = 'Safe' }) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [simThreat, setSimThreat] = useState(classification === 'High Risk' ? 'critical' : classification === 'Suspicious' ? 'warning' : 'safe');
  const [telemetry, setTelemetry] = useState({ yaw: -30, pitch: 25, roll: 15 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Color tones (VRDOT neon cyan & hot magenta/fuchsia)
    let colorCyan = 0x00f5d4;
    let colorMagenta = 0xf72585;
    let colorViolet = 0x7209b7;

    if (simThreat === 'critical') {
      colorCyan = 0xf43f5e;
      colorMagenta = 0xef4444;
      colorViolet = 0x9333ea;
    } else if (simThreat === 'warning') {
      colorCyan = 0xf59e0b;
      colorMagenta = 0xfbbf24;
      colorViolet = 0xd97706;
    }

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Cyan Neon Point Light
    const cyanLight = new THREE.PointLight(colorCyan, 20, 15);
    cyanLight.position.set(-1.8, 1.2, 2.0);
    scene.add(cyanLight);

    // Magenta Neon Point Light
    const magentaLight = new THREE.PointLight(colorMagenta, 22, 15);
    magentaLight.position.set(1.8, -1.0, 1.8);
    scene.add(magentaLight);

    // Rear rim light
    const rimLight = new THREE.PointLight(colorViolet, 12, 15);
    rimLight.position.set(0, 2.5, -2.5);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // =========================================================================
    // 🌌 VRDOT SIGNATURE 3D CYBER ORB CORE
    // 1. Central Glossy Dark Obsidian Sphere
    // =========================================================================
    const innerSphereGeo = new THREE.SphereGeometry(1.4, 64, 64);
    const innerSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x090a14,
      roughness: 0.12,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      transparent: true,
      opacity: 0.92,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    rootGroup.add(innerSphere);

    // =========================================================================
    // 2. Glowing Hexagonal / Digital Quantum Cyber Ring (Bright Cyan & Magenta)
    // =========================================================================
    const ringGroup = new THREE.Group();

    // Segmented Hexagonal Quantum Core Ring
    const hexRadius = 1.05;
    const segments = 24;
    for (let s = 0; s < segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      const x = Math.cos(angle) * hexRadius;
      const y = Math.sin(angle) * hexRadius;

      // Color interpolation: Cyan on left to Magenta on right
      const isCyanSide = Math.cos(angle) < 0;
      const segColor = isCyanSide ? colorCyan : colorMagenta;

      const segGeo = new THREE.BoxGeometry(0.08, 0.18, 0.04);
      const segMat = new THREE.MeshBasicMaterial({
        color: segColor,
        transparent: true,
        opacity: 0.95,
      });
      const segMesh = new THREE.Mesh(segGeo, segMat);
      segMesh.position.set(x, y, 0.5);
      segMesh.rotation.z = angle + Math.PI / 2;
      ringGroup.add(segMesh);
    }

    // Inner Glowing Halo Disc
    const haloGeo = new THREE.RingGeometry(0.85, 1.15, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: colorCyan,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.z = 0.48;
    ringGroup.add(haloMesh);

    // Inner Magenta Halo Disc
    const haloMat2 = new THREE.MeshBasicMaterial({
      color: colorMagenta,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh2 = new THREE.Mesh(haloGeo, haloMat2);
    haloMesh2.position.z = 0.49;
    haloMesh2.scale.set(0.9, 0.9, 0.9);
    ringGroup.add(haloMesh2);

    ringGroup.rotation.x = Math.PI / 6;
    ringGroup.rotation.y = -Math.PI / 8;
    rootGroup.add(ringGroup);

    // =========================================================================
    // 3. Outer Geodesic Wireframe Lattice Cage (Dark Gunmetal Wrapping)
    // =========================================================================
    const cageGroup = new THREE.Group();

    // Outer Icosahedron Geodesic Cage
    const cageGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const cageWireGeo = new THREE.WireframeGeometry(cageGeo);
    const cageLineMat = new THREE.LineBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.55,
      linewidth: 1.5,
    });
    const cageWire = new THREE.LineSegments(cageWireGeo, cageLineMat);
    cageGroup.add(cageWire);

    // Additional Orbital Latitude Rings (wrapping like the VRDOT image)
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.022, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.z = Math.PI / 5;
    cageGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.45, 0.018, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 2.6;
    ring2.rotation.x = -Math.PI / 6;
    cageGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.15, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: colorMagenta,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 2.2;
    ring3.rotation.x = Math.PI / 4;
    cageGroup.add(ring3);

    rootGroup.add(cageGroup);

    // =========================================================================
    // 4. Orbiting Geometric Chevron & Shard Particles
    // =========================================================================
    const shardGroup = new THREE.Group();
    const shardGeo = new THREE.ConeGeometry(0.12, 0.35, 3);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    });

    const shardCount = 12;
    const shards = [];
    for (let i = 0; i < shardCount; i++) {
      const mesh = new THREE.Mesh(shardGeo, shardMat);
      const theta = (i / shardCount) * Math.PI * 2;
      const radius = 2.8 + (Math.random() - 0.5) * 0.6;
      mesh.position.set(
        Math.cos(theta) * radius,
        (Math.random() - 0.5) * 2.2,
        Math.sin(theta) * radius
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      shardGroup.add(mesh);
      shards.push({ mesh, theta, speed: 0.006 + Math.random() * 0.006, radius });
    }
    rootGroup.add(shardGroup);

    // 5. Volumetric Dust Motes
    const particleCount = 160;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 8;
      pPos[i + 1] = (Math.random() - 0.5) * 8;
      pPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    // Initial tilted orientation matching VRDOT
    rootGroup.rotation.x = 0.25;
    rootGroup.rotation.y = -0.35;
    rootGroup.rotation.z = 0.15;

    // 6. Interactive Drag-to-Rotate Physics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velX = 0.003;
    let velY = 0.004;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velX = 0;
      velY = 0;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x += deltaY * 0.01;

      velX = deltaX * 0.005;
      velY = deltaY * 0.005;
    };

    const onMouseUp = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        velX = 0;
        velY = 0;
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x += deltaY * 0.01;
      velX = deltaX * 0.005;
      velY = deltaY * 0.005;
    };
    const onTouchEnd = () => { isDragging = false; };

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 7. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow drift for background motes
      pSystem.rotation.y = elapsed * 0.03;

      if (!isDragging) {
        if (isRotating) {
          rootGroup.rotation.y += 0.004;
          rootGroup.rotation.x += Math.sin(elapsed * 0.4) * 0.0008;
        }
        rootGroup.rotation.y += velX;
        rootGroup.rotation.x += velY;
        velX *= 0.94;
        velY *= 0.94;
      }

      // Independent counter-rotation for inner quantum ring & cage
      ringGroup.rotation.z = elapsed * 0.35;
      cageGroup.rotation.y = -elapsed * 0.06;
      cageGroup.rotation.z = Math.sin(elapsed * 0.2) * 0.08;

      // Orbiting chevron shards
      shards.forEach((s) => {
        s.theta += s.speed;
        s.mesh.position.x = Math.cos(s.theta) * s.radius;
        s.mesh.position.z = Math.sin(s.theta) * s.radius;
        s.mesh.rotation.y += 0.02;
      });

      // Pulse neon lights
      const pulse = Math.sin(elapsed * 3.0) * 0.25 + 1.0;
      cyanLight.intensity = 20 * pulse;
      magentaLight.intensity = 22 * pulse;

      // Telemetry calculation
      const radToDeg = 180 / Math.PI;
      setTelemetry({
        yaw: Math.round(((rootGroup.rotation.y * radToDeg) % 360)),
        pitch: Math.round(((rootGroup.rotation.x * radToDeg) % 360)),
        roll: Math.round(((rootGroup.rotation.z * radToDeg) % 360)),
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 580;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [simThreat, isRotating]);

  return (
    <div className="relative w-full h-[470px] sm:h-[550px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Click & Drag to Rotate 3D Quantum Orb"
      />

      {/* Top Telemetry Overlay */}
      <div className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/75 border border-white/10 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-md pointer-events-auto">
          <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white">QUANTUM ORB CORE</span>
          <span className="text-slate-500">|</span>
          <span>HEX-LOCK 128-BIT</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/65 border border-white/10 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-md">
          <Radio className="h-3 w-3 animate-pulse text-cyan-400" />
          <span>YAW: {telemetry.yaw}°</span>
          <span className="text-slate-600">|</span>
          <span>PITCH: {telemetry.pitch}°</span>
        </div>
      </div>

      {/* Bottom Interactive Controls */}
      <div className="absolute bottom-2 inset-x-2 sm:inset-x-6 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Threat State Inversion */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400 px-2 hidden sm:inline">STATE:</span>
          <button
            onClick={() => {
              soundFX.playClick();
              setSimThreat('safe');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              simThreat === 'safe'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,245,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SAFE
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setSimThreat('warning');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              simThreat === 'warning'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WARN
          </button>
          <button
            onClick={() => {
              soundFX.playAlert();
              setSimThreat('critical');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              simThreat === 'critical'
                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ATTACK
          </button>
        </div>

        {/* Spin & Orbit Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsRotating(!isRotating);
            }}
            title={isRotating ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
              isRotating ? 'text-cyan-300 bg-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>
          <span className="text-[10px] font-mono text-slate-400 px-1 hidden md:inline">DRAG TO ORBIT</span>
        </div>
      </div>
    </div>
  );
}

