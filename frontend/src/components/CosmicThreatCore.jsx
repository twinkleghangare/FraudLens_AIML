import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function CosmicThreatCore({ riskScore = 15, classification = 'Safe' }) {
  const mountRef = useRef(null);

  const colors = useMemo(() => {
    if (classification === 'High Risk') {
      return {
        core: 0xf43f5e,
        rings: 0xfb7185,
        planetAtmosphere: 0x881337,
        particles: 0xfca5a5,
        glow: 'rgba(244, 63, 94, 0.4)'
      };
    }
    if (classification === 'Suspicious') {
      return {
        core: 0xf59e0b,
        rings: 0xfcd34d,
        planetAtmosphere: 0x78350f,
        particles: 0xfde68a,
        glow: 'rgba(245, 158, 11, 0.4)'
      };
    }
    // Safe / Default cosmic warm palette (matching Dribbble reference)
    return {
      core: 0x38bdf8,
      rings: 0xfb923c, // Warm orange orbital rings like reference
      planetAtmosphere: 0xc2410c, // Warm glowing planet
      particles: 0xffedd5,
      glow: 'rgba(251, 146, 60, 0.35)'
    };
  }, [classification]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffedd5, 2.5);
    dirLight1.position.set(5, 4, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(colors.rings, 3, 20);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 2. Giant Celestial Sphere (Background Planet from Dribbble shot)
    const planetGeo = new THREE.SphereGeometry(3.6, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.2,
      emissive: colors.planetAtmosphere,
      emissiveIntensity: 0.45,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(0, 0, -2.5);
    scene.add(planet);

    // Atmosphere Glow Rim around planet
    const atmosGeo = new THREE.SphereGeometry(3.75, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: colors.planetAtmosphere,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    atmosphere.position.set(0, 0, -2.5);
    scene.add(atmosphere);

    // 3. Central Dimensional Floating Monogram / Shield Core
    // We construct a sharp multi-faceted dimensional geometric core with metallic bevels
    const coreGroup = new THREE.Group();

    // Dimensional Central Prism (Metallic, Chrome, High Specular)
    const prismGeo = new THREE.OctahedronGeometry(1.15, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.9,
      emissive: colors.core,
      emissiveIntensity: 0.35,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    coreGroup.add(prism);

    // Inner glowing core
    const innerGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colors.core,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(inner);

    scene.add(coreGroup);

    // 4. Elliptical Orbital Rings (exactly like the Dribbble shot)
    const ringsGroup = new THREE.Group();

    const createOrbitRing = (radiusX, radiusY, tiltX, tiltY, tiltZ) => {
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: colors.rings,
        transparent: true,
        opacity: 0.6,
        linewidth: 1
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      ring.rotation.z = tiltZ;
      return ring;
    };

    const ring1 = createOrbitRing(2.8, 1.4, Math.PI / 3, 0.2, -0.4);
    const ring2 = createOrbitRing(3.4, 1.7, -Math.PI / 3.5, -0.3, 0.5);
    const ring3 = createOrbitRing(4.0, 2.0, Math.PI / 2.8, 0.4, -0.2);

    ringsGroup.add(ring1);
    ringsGroup.add(ring2);
    ringsGroup.add(ring3);
    scene.add(ringsGroup);

    // 5. Revolving Satellites / Nodes on Orbits
    const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: colors.rings,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.8
    });

    const satellites = [
      { mesh: new THREE.Mesh(nodeGeo, nodeMat), radiusX: 2.8, radiusY: 1.4, speed: 0.015, angle: 0, ring: ring1 },
      { mesh: new THREE.Mesh(nodeGeo, nodeMat), radiusX: 3.4, radiusY: 1.7, speed: -0.012, angle: Math.PI / 2, ring: ring2 },
      { mesh: new THREE.Mesh(nodeGeo, nodeMat), radiusX: 4.0, radiusY: 2.0, speed: 0.009, angle: Math.PI, ring: ring3 }
    ];

    satellites.forEach(s => scene.add(s.mesh));

    // 6. Deep Cosmic Starfield Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 16;
      starCoords[i + 1] = (Math.random() - 0.5) * 12;
      starCoords[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.035,
      transparent: true,
      opacity: 0.75
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Core rotation & gentle levitation float
      coreGroup.rotation.y += delta * 0.45;
      coreGroup.rotation.x = Math.sin(time * 0.8) * 0.12;
      coreGroup.position.y = Math.sin(time * 1.2) * 0.08;

      // Inner wireframe counter-rotation
      inner.rotation.y -= delta * 0.6;
      inner.rotation.z += delta * 0.3;

      // Orbital rings dynamic rotation
      ringsGroup.rotation.z += delta * 0.05;

      // Planet slow rotation
      planet.rotation.y += delta * 0.03;

      // Move satellites along their elliptical orbits
      satellites.forEach(s => {
        s.angle += s.speed;
        const x = Math.cos(s.angle) * s.radiusX;
        const y = Math.sin(s.angle) * s.radiusY;
        const pos = new THREE.Vector3(x, y, 0);
        pos.applyEuler(s.ring.rotation);
        pos.add(ringsGroup.position);
        s.mesh.position.copy(pos);
      });

      // Twinkle starfield
      starfield.rotation.y += delta * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [colors, classification]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}

