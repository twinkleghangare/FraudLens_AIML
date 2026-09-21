import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function NeuralGraph3D() {
  const mountRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(7);

  const nodesData = [
    { id: 0, label: 'upi pin', weight: 5.0, cat: 'Credential Theft', coords: [0, 0.4, 0], color: 0xf43f5e, radius: 0.28 },
    { id: 1, label: 'enter pin', weight: 5.0, cat: 'Credential Theft', coords: [-1.2, 0.9, 0.5], color: 0xf43f5e, radius: 0.26 },
    { id: 2, label: 'apk download', weight: 4.8, cat: 'Malware Dropper', coords: [1.3, 0.8, -0.6], color: 0xf43f5e, radius: 0.25 },
    { id: 3, label: 'kyc suspend', weight: 4.6, cat: 'Impersonation', coords: [0.9, -0.8, 0.7], color: 0xf59e0b, radius: 0.24 },
    { id: 4, label: 'electricity cut', weight: 4.2, cat: 'Urgency Tactic', coords: [-1.4, -0.7, -0.4], color: 0xf59e0b, radius: 0.23 },
    { id: 5, label: 'blocked acct', weight: 3.9, cat: 'Fear Exploitation', coords: [0.1, -1.5, -0.2], color: 0xf59e0b, radius: 0.22 },
    { id: 6, label: 'turant / urgent', weight: 3.5, cat: 'Urgency Tactic', coords: [-0.6, 1.6, -0.5], color: 0x38bdf8, radius: 0.21 },
    { id: 7, label: 'cashback reward', weight: 3.2, cat: 'Greed / Reverse Trap', coords: [1.5, -0.1, 0.8], color: 0x818cf8, radius: 0.20 },
    { id: 8, label: 'otp verify', weight: 2.9, cat: 'Auth Hijacking', coords: [-1.6, 0.1, -1.0], color: 0x34d399, radius: 0.19 },
    { id: 9, label: 'pan card update', weight: 2.7, cat: 'Identity Harvesting', coords: [0.5, 1.4, 0.9], color: 0x38bdf8, radius: 0.18 },
  ];

  // Interconnected edges (semantic relationships)
  const edgesData = [
    [0, 1], [0, 7], [0, 8],
    [1, 7], [1, 8],
    [2, 0], [2, 3],
    [3, 5], [3, 9], [3, 6],
    [4, 5], [4, 6],
    [5, 0],
    [6, 3], [6, 4],
    [7, 0],
    [8, 0], [8, 1],
    [9, 3], [9, 0]
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomLevel);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x38bdf8, 8, 15);
    light1.position.set(4, 4, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xf43f5e, 8, 15);
    light2.position.set(-4, -4, 4);
    scene.add(light2);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Create 3D Nodes
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);
    const nodeMeshes = [];

    nodesData.forEach((node) => {
      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.coords);
      mesh.scale.set(node.radius, node.radius, node.radius);
      mesh.userData = node;
      graphGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Inner glowing core
      const glowGeo = new THREE.SphereGeometry(node.radius * 1.35, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.22,
        wireframe: true,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.set(...node.coords);
      graphGroup.add(glowMesh);
    });

    // Create 3D Edges
    const linePositions = [];
    const lineColors = [];

    edgesData.forEach(([i, j]) => {
      const n1 = nodesData[i];
      const n2 = nodesData[j];
      linePositions.push(...n1.coords);
      linePositions.push(...n2.coords);

      const c1 = new THREE.Color(n1.color);
      const c2 = new THREE.Color(n2.color);
      lineColors.push(c1.r, c1.g, c1.b);
      lineColors.push(c2.r, c2.g, c2.b);
    });

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    edgeGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    graphGroup.add(edgeLines);

    // Traveling Synaptic Energy Packets
    const packetCount = 14;
    const packetGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const packets = [];

    for (let k = 0; k < packetCount; k++) {
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      const edge = edgesData[k % edgesData.length];
      packets.push({
        mesh,
        start: new THREE.Vector3(...nodesData[edge[0]].coords),
        end: new THREE.Vector3(...nodesData[edge[1]].coords),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.008,
      });
      graphGroup.add(mesh);
    }

    // Raycasting for Node Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        soundFX.playClick();
        setSelectedNode(intersects[0].object.userData);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // Drag to Rotate
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0.002;
    let velY = 0.002;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      graphGroup.rotation.y += dx * 0.008;
      graphGroup.rotation.x += dy * 0.008;
      velX = dx * 0.003;
      velY = dy * 0.003;
    };

    const onMouseUp = () => { isDragging = false; };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        graphGroup.rotation.y += 0.003 + velX;
        graphGroup.rotation.x += velY;
        velX *= 0.95;
        velY *= 0.95;
      }

      // Update traveling synaptic packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 700;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [zoomLevel]);

  return (
    <div className="relative w-full rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl p-4 overflow-hidden shadow-2xl">
      {/* Top Overlay Controls */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md pointer-events-auto">
          <Cpu className="h-4 w-4 text-cyan-400 ml-1.5" />
          <span className="text-xs font-mono font-bold text-white pr-2">
            3D NLP Synapse Graph (Feature Space)
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 4))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 10))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[400px] cursor-grab active:cursor-grabbing"
        title="Click on any node to inspect linguistic weight; drag to rotate"
      />

      {/* Selected Node Inspector Flyout */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-20 p-3.5 rounded-xl bg-[#090b14]/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl space-y-1.5 min-w-[240px] pointer-events-auto">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider">TOKEN: "{selectedNode.label}"</span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <div className="text-[11px] font-mono text-cyan-300 flex items-center justify-between">
            <span>Threat Weight Coefficient:</span>
            <span className="font-bold">+{selectedNode.weight.toFixed(1)}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Semantic Taxonomy:</span>
            <span className="text-violet-300">{selectedNode.cat}</span>
          </div>
        </div>
      )}

      {/* Bottom Subtext */}
      <div className="text-center text-[10px] font-mono text-slate-500 pt-2">
        ROTATE TO ORBIT • CLICK ANY SPHERE TO INSPECT FEATURE WEIGHT • SIMULATES HIGH-DIMENSIONAL TF-IDF EMBEDDINGS
      </div>
    </div>
  );
}

