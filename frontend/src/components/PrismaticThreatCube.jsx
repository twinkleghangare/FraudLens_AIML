import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Sparkles, Activity, Lock, Cpu, Eye, Radio, RefreshCw, Mouse, Layers } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import CircuitOverlayHUD from './CircuitOverlayHUD';

export default function PrismaticThreatCube({ riskScore = 15, classification = 'Safe' }) {
  const mountRef = useRef(null);
  // Default to 3D Prismatic Crystal Cube matching the 3Dverse reference image!
  const [modelMode, setModelMode] = useState('cube'); // 'cube' | 'hardware' | 'shield' | 'neural'
  const [showCircuitHUD, setShowCircuitHUD] = useState(true);
  const [simThreat, setSimThreat] = useState(classification === 'High Risk' ? 'critical' : classification === 'Suspicious' ? 'warning' : 'safe');
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeOnly, setWireframeOnly] = useState(false);
  const [telemetry, setTelemetry] = useState({ yaw: -35, pitch: 36, roll: 24 });

  const sceneRef = useRef(null);
  const activeMeshGroupRef = useRef(null);
  const lightsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic color palette matching 3Dverse reference image
    const getColors = (threat) => {
      if (threat === 'critical') {
        return { c1: 0xf43f5e, c2: 0xef4444, c3: 0x9333ea, spot: 0xf87171, amber: 0xff4d6d };
      } else if (threat === 'warning') {
        return { c1: 0xf59e0b, c2: 0xfbbf24, c3: 0xd97706, spot: 0xfcd34d, amber: 0xf59e0b };
      }
      // Exact palette from 3Dverse reference image: Deep Magenta/Pink + Electric Cyan + Soft Violet
      return { c1: 0xd946ef, c2: 0x0ea5e9, c3: 0x8b5cf8, spot: 0xa5b4fc, amber: 0xff7a00 };
    };

    const colors = getColors(simThreat);

    // 1. Studio Lighting Setup matching 3Dverse spotlight beam
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Top vertical spotlight
    const spotLight = new THREE.SpotLight(colors.spot, 12, 30, Math.PI / 4, 0.35);
    spotLight.position.set(0, 9, 3);
    scene.add(spotLight);

    // Magenta internal/rim light
    const magentaLight = new THREE.PointLight(colors.c1, 16, 12);
    magentaLight.position.set(-1.8, 1.2, 1.8);
    scene.add(magentaLight);

    // Cyan internal/rim light
    const cyanLight = new THREE.PointLight(colors.c2, 16, 12);
    cyanLight.position.set(1.8, -1.2, 1.4);
    scene.add(cyanLight);

    // Soft top fill
    const topLight = new THREE.PointLight(0xffffff, 6, 10);
    topLight.position.set(0, 3, 2.5);
    scene.add(topLight);

    lightsRef.current = { spotLight, magentaLight, cyanLight, topLight };

    // 2. Soft Studio Bokeh Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 7;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.038,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 3. Dynamic Model Builder
    const buildModel = (mode, threat, isWire) => {
      const group = new THREE.Group();
      const pal = getColors(threat);

      if (mode === 'cube') {
        // =========================================================================
        // 🧊 3D PRISMATIC CRYSTAL CUBE (1:1 MATCH TO 3DVERSE REFERENCE IMAGE)
        // =========================================================================
        const boxGeo = new THREE.BoxGeometry(2.25, 2.25, 2.25);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.04,
          roughness: 0.02,
          transmission: isWire ? 0.2 : 0.96,
          wireframe: isWire,
          ior: 1.58,
          thickness: 2.2,
          specularIntensity: 1.6,
          specularColor: 0xffffff,
          transparent: true,
          opacity: isWire ? 0.7 : 0.9,
        });
        const cubeMesh = new THREE.Mesh(boxGeo, glassMat);
        group.add(cubeMesh);

        // 1. Magenta Facet (Upper/Left)
        const magentaGeo = new THREE.OctahedronGeometry(1.22, 0);
        const magentaMat = new THREE.MeshPhysicalMaterial({
          color: pal.c1,
          emissive: pal.c1,
          emissiveIntensity: threat === 'critical' ? 0.85 : 0.5,
          roughness: 0.1,
          metalness: 0.85,
          wireframe: isWire,
          transparent: true,
          opacity: 0.82,
        });
        const magentaFacet = new THREE.Mesh(magentaGeo, magentaMat);
        magentaFacet.position.set(-0.15, 0.2, 0.12);
        magentaFacet.rotation.set(Math.PI / 4, 0, Math.PI / 4);
        group.add(magentaFacet);

        // 2. Cyan Facet (Lower/Right)
        const cyanGeo = new THREE.OctahedronGeometry(1.18, 0);
        const cyanMat = new THREE.MeshPhysicalMaterial({
          color: pal.c2,
          emissive: pal.c2,
          emissiveIntensity: 0.45,
          roughness: 0.1,
          metalness: 0.85,
          wireframe: isWire,
          transparent: true,
          opacity: 0.78,
        });
        const cyanFacet = new THREE.Mesh(cyanGeo, cyanMat);
        cyanFacet.position.set(0.18, -0.22, -0.12);
        cyanFacet.rotation.set(0, Math.PI / 4, Math.PI / 4);
        group.add(cyanFacet);

        // Sharp Specular Edge Glints
        const edges = new THREE.EdgesGeometry(boxGeo);
        const lineMat = new THREE.LineBasicMaterial({
          color: threat === 'critical' ? 0xff4d6d : 0xffffff,
          transparent: true,
          opacity: 0.75,
        });
        const edgeLines = new THREE.LineSegments(edges, lineMat);
        group.add(edgeLines);

      } else if (mode === 'hardware') {
        // =========================================================================
        // 🖲️ CYBER HARDWARE SENTINEL (TRANSLUCENT CHASSIS)
        // =========================================================================
        const mouseShape = new THREE.Shape();
        mouseShape.moveTo(0, 1.95);
        mouseShape.quadraticCurveTo(0.9, 1.7, 0.95, 0.7);
        mouseShape.quadraticCurveTo(1.15, -0.1, 0.95, -1.2);
        mouseShape.quadraticCurveTo(0.65, -1.9, 0, -1.9);
        mouseShape.quadraticCurveTo(-0.8, -1.9, -1.35, -1.1);
        mouseShape.quadraticCurveTo(-1.45, -0.1, -1.05, 0.7);
        mouseShape.quadraticCurveTo(-0.9, 1.7, 0, 1.95);

        const extrudeSettings = { depth: 0.7, bevelEnabled: true, bevelSegments: 6, steps: 3, bevelSize: 0.32, bevelThickness: 0.32 };
        const chassisGeo = new THREE.ExtrudeGeometry(mouseShape, extrudeSettings);
        const chassisMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.05,
          roughness: 0.18,
          transmission: isWire ? 0.2 : 0.88,
          wireframe: isWire,
          ior: 1.52,
          thickness: 2.2,
          specularIntensity: 1.6,
          transparent: true,
          opacity: isWire ? 0.7 : 0.82,
        });
        const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
        chassisMesh.position.z = -0.35;
        group.add(chassisMesh);

        // Click plates
        const leftClickShape = new THREE.Shape();
        leftClickShape.moveTo(-0.06, 0.4);
        leftClickShape.lineTo(-0.06, 1.9);
        leftClickShape.quadraticCurveTo(-0.85, 1.65, -0.92, 0.7);
        leftClickShape.lineTo(-0.06, 0.4);

        const clickSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.04, bevelThickness: 0.04 };
        const leftClickGeo = new THREE.ExtrudeGeometry(leftClickShape, clickSettings);
        const clickMat = new THREE.MeshStandardMaterial({ color: 0x242838, metalness: 0.75, roughness: 0.32, wireframe: isWire });
        const leftClickMesh = new THREE.Mesh(leftClickGeo, clickMat);
        leftClickMesh.position.z = 0.65;
        group.add(leftClickMesh);

        const rightClickShape = new THREE.Shape();
        rightClickShape.moveTo(0.06, 0.4);
        rightClickShape.lineTo(0.06, 1.9);
        rightClickShape.quadraticCurveTo(0.85, 1.65, 0.92, 0.7);
        rightClickShape.lineTo(0.06, 0.4);
        const rightClickGeo = new THREE.ExtrudeGeometry(rightClickShape, clickSettings);
        const rightClickMesh = new THREE.Mesh(rightClickGeo, clickMat);
        rightClickMesh.position.z = 0.65;
        group.add(rightClickMesh);

        // Scroll Wheel
        const wheelGroup = new THREE.Group();
        const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 32);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2, wireframe: isWire });
        const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
        wheelMesh.rotation.z = Math.PI / 2;
        wheelGroup.add(wheelMesh);
        wheelGroup.position.set(0, 1.15, 0.75);
        group.add(wheelGroup);

        // Internal Tubes
        const blueCoreGeo = new THREE.CapsuleGeometry(0.18, 0.9, 8, 16);
        const blueCoreMat = new THREE.MeshBasicMaterial({ color: pal.c2, transparent: true, opacity: 0.85 });
        const blueCore = new THREE.Mesh(blueCoreGeo, blueCoreMat);
        blueCore.position.set(-0.4, -0.2, 0.15);
        group.add(blueCore);

        const amberCoreGeo = new THREE.CapsuleGeometry(0.18, 0.9, 8, 16);
        const amberCoreMat = new THREE.MeshBasicMaterial({ color: pal.amber, transparent: true, opacity: 0.85 });
        const amberCore = new THREE.Mesh(amberCoreGeo, amberCoreMat);
        amberCore.position.set(0.35, -0.1, 0.15);
        group.add(amberCore);

      } else if (mode === 'shield') {
        const shieldShape = new THREE.Shape();
        shieldShape.moveTo(0, 1.4);
        shieldShape.quadraticCurveTo(1.2, 1.3, 1.3, 0.4);
        shieldShape.quadraticCurveTo(1.3, -0.6, 0, -1.5);
        shieldShape.quadraticCurveTo(-1.3, -0.6, -1.3, 0.4);
        shieldShape.quadraticCurveTo(-1.2, 1.3, 0, 1.4);

        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
        const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
        const shieldMat = new THREE.MeshPhysicalMaterial({
          color: pal.c2,
          emissive: pal.c2,
          emissiveIntensity: 0.3,
          roughness: 0.2,
          metalness: 0.6,
          transmission: isWire ? 0.1 : 0.8,
          wireframe: isWire,
          transparent: true,
          opacity: 0.85,
        });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldMesh.position.z = -0.1;
        group.add(shieldMesh);

        const ringGeo1 = new THREE.TorusGeometry(1.85, 0.02, 16, 100);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: pal.c1, wireframe: true, transparent: true, opacity: 0.7 });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = Math.PI / 2.2;
        group.add(ring1);

      } else if (mode === 'neural') {
        const nodeTokens = [
          { word: 'KYC', pos: [0, 1.2, 0], color: pal.c1, size: 0.24 },
          { word: 'Refund', pos: [1.3, 0.5, 0.5], color: pal.c2, size: 0.2 },
          { word: 'UPI-Pay', pos: [-1.2, 0.6, -0.4], color: pal.c3, size: 0.22 },
          { word: 'Blocked', pos: [0.8, -0.9, 0.6], color: pal.c1, size: 0.2 },
          { word: 'Urgent', pos: [-0.9, -0.8, 0.7], color: pal.c2, size: 0.18 },
          { word: 'Lottery', pos: [1.1, -0.2, -1.0], color: pal.c1, size: 0.2 },
          { word: 'OTP-Auth', pos: [-1.1, 0.1, -0.9], color: pal.c3, size: 0.22 },
          { word: 'Cashback', pos: [0, -1.3, -0.5], color: pal.c2, size: 0.2 },
        ];
        const nodeMeshGroup = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
        nodeTokens.forEach((tok) => {
          const mat = new THREE.MeshStandardMaterial({
            color: tok.color,
            emissive: tok.color,
            emissiveIntensity: 0.6,
            roughness: 0.3,
            metalness: 0.7,
            wireframe: isWire,
          });
          const sphere = new THREE.Mesh(sphereGeo, mat);
          sphere.position.set(...tok.pos);
          sphere.scale.set(tok.size, tok.size, tok.size);
          nodeMeshGroup.add(sphere);
        });
        group.add(nodeMeshGroup);

        const lineCoords = [];
        for (let i = 0; i < nodeTokens.length; i++) {
          for (let j = i + 1; j < nodeTokens.length; j++) {
            lineCoords.push(...nodeTokens[i].pos);
            lineCoords.push(...nodeTokens[j].pos);
          }
        }
        const synapseGeo = new THREE.BufferGeometry();
        synapseGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
        const synapseMat = new THREE.LineBasicMaterial({
          color: pal.c1,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
        });
        const synapseLines = new THREE.LineSegments(synapseGeo, synapseMat);
        group.add(synapseLines);
      }

      // Initial angle matching 3Dverse photo reference
      if (mode === 'cube') {
        group.rotation.x = 0.65;
        group.rotation.y = -0.78;
        group.rotation.z = 0.44;
      } else if (mode === 'hardware') {
        group.rotation.x = 0.85;
        group.rotation.y = -0.4;
        group.rotation.z = 0.45;
      } else {
        group.rotation.x = 0.55;
        group.rotation.y = -0.7;
        group.rotation.z = 0.35;
      }
      return group;
    };

    if (activeMeshGroupRef.current) {
      scene.remove(activeMeshGroupRef.current);
    }
    const modelGroup = buildModel(modelMode, simThreat, wireframeOnly);
    activeMeshGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // 4. Interactive Drag-to-Rotate Physics
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
      if (!isDragging || !activeMeshGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      activeMeshGroupRef.current.rotation.y += deltaX * 0.01;
      activeMeshGroupRef.current.rotation.x += deltaY * 0.01;

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
      if (!isDragging || e.touches.length !== 1 || !activeMeshGroupRef.current) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      activeMeshGroupRef.current.rotation.y += deltaX * 0.01;
      activeMeshGroupRef.current.rotation.x += deltaY * 0.01;
      velX = deltaX * 0.005;
      velY = deltaY * 0.005;
    };
    const onTouchEnd = () => { isDragging = false; };

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 5. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      dustParticles.rotation.y = elapsed * 0.04;
      dustParticles.rotation.x = Math.sin(elapsed * 0.15) * 0.05;

      if (activeMeshGroupRef.current) {
        if (!isDragging) {
          if (isRotating) {
            activeMeshGroupRef.current.rotation.y += 0.0035;
            activeMeshGroupRef.current.rotation.x += Math.sin(elapsed * 0.4) * 0.0008;
          }
          activeMeshGroupRef.current.rotation.y += velX;
          activeMeshGroupRef.current.rotation.x += velY;
          velX *= 0.94;
          velY *= 0.94;
        }

        const radToDeg = 180 / Math.PI;
        setTelemetry({
          yaw: Math.round(((activeMeshGroupRef.current.rotation.y * radToDeg) % 360)),
          pitch: Math.round(((activeMeshGroupRef.current.rotation.x * radToDeg) % 360)),
          roll: Math.round(((activeMeshGroupRef.current.rotation.z * radToDeg) % 360)),
        });

        const pulse = Math.sin(elapsed * 2.2) * 0.2 + 1.0;
        magentaLight.intensity = 16 * pulse;
        cyanLight.intensity = 16 * pulse;
      }

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
  }, [modelMode, simThreat, wireframeOnly, isRotating]);

  return (
    <div className="relative w-full h-[470px] sm:h-[550px] flex items-center justify-center select-none">
      
      {/* 1. 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Click & Drag to Rotate 3D Core"
      />

      {/* 2. Precision Cyber Circuit Schematic Overlay HUD (Only shown for Hardware Sentinel) */}
      {modelMode === 'hardware' && showCircuitHUD && <CircuitOverlayHUD />}

      {/* 3. Top 3D Mode Selector HUD */}
      <div className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-6 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Model Switcher Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md pointer-events-auto shadow-xl">
          <button
            onClick={() => {
              soundFX.playClick();
              setModelMode('cube');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              modelMode === 'cube'
                ? 'bg-gradient-to-r from-purple-600/70 via-fuchsia-600/70 to-indigo-600/70 text-white border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3 w-3 text-fuchsia-300" />
            <span>3D Crystal Cube</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setModelMode('hardware');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              modelMode === 'hardware'
                ? 'bg-gradient-to-r from-cyan-600/70 to-blue-600/70 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mouse className="h-3 w-3 text-cyan-300" />
            <span className="hidden sm:inline">Hardware Sentinel</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setModelMode('shield');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              modelMode === 'shield'
                ? 'bg-cyan-600/60 text-white border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">Shield</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setModelMode('neural');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              modelMode === 'neural'
                ? 'bg-emerald-600/60 text-white border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="h-3 w-3" />
            <span className="hidden sm:inline">Synapse</span>
          </button>
        </div>

        {/* Live Gyroscope Euler Angle HUD */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-black/65 border border-white/10 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-md">
          <Radio className="h-3 w-3 animate-pulse text-cyan-400" />
          <span>YAW: {telemetry.yaw}°</span>
          <span className="text-slate-600">|</span>
          <span>PITCH: {telemetry.pitch}°</span>
        </div>
      </div>

      {/* Floating Hologram Telemetry Badge (Left) */}
      <div className="absolute -left-2 sm:left-2 bottom-12 z-20 pointer-events-none hidden sm:block">
        <div className="p-3 rounded-2xl bg-[#090b14]/85 border border-white/10 backdrop-blur-xl shadow-2xl space-y-1.5 min-w-[150px]">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>HOLD-OUT ROC</span>
            <span className="text-emerald-400 font-bold">99.86%</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[99.8%]" />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span>F1-SCORE</span>
            <span className="text-violet-400 font-bold">95.65%</span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Threat Simulator & Controls HUD */}
      <div className="absolute bottom-2 inset-x-2 sm:inset-x-6 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Threat State Inversion Trigger */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400 px-2 hidden sm:inline">SIM:</span>
          
          <button
            onClick={() => {
              soundFX.playClick();
              setSimThreat('safe');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              simThreat === 'safe'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
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
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
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
                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ATTACK
          </button>
        </div>

        {/* Viewport Toggles: Circuit Overlay, Spin & Wireframe */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md">
          {/* Circuit HUD Graphic Toggle */}
          {modelMode === 'hardware' && (
            <button
              onClick={() => {
                soundFX.playClick();
                setShowCircuitHUD(!showCircuitHUD);
              }}
              title="Toggle Circuit Traces Overlay"
              className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                showCircuitHUD ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Auto-Spin Toggle */}
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

          {/* Wireframe Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setWireframeOnly(!wireframeOnly);
            }}
            title="Toggle Holographic Wireframe"
            className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
              wireframeOnly ? 'text-violet-300 bg-violet-500/25 border border-violet-400/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <span className="text-[10px] font-mono text-slate-400 px-1 hidden md:inline">DRAG TO ORBIT</span>
        </div>
      </div>

    </div>
  );
}
