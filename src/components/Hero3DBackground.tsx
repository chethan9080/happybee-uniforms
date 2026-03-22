import React, { useEffect, useRef } from "react";

export function Hero3DBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Safety check for THREE
    if (typeof (window as any).THREE === 'undefined') return;
    const THREE = (window as any).THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    mountRef.current.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;z-index:0;pointer-events:none';

    // Create particles
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 200;
    
    const sphereGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const material = new THREE.MeshBasicMaterial(); 
    const instancedMesh = new THREE.InstancedMesh(sphereGeo, material, particleCount);
    
    const dummy = new THREE.Object3D();
    const particleData: {x: number, y: number, z: number, vx: number, vy: number, vz: number}[] = [];

    const colorYellow = new THREE.Color('#FFB800');
    const colorPurple = new THREE.Color('#6B4EFF');

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 2;
      
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
      
      const mixedColor = colorYellow.clone().lerp(colorPurple, Math.random());
      instancedMesh.setColorAt(i, mixedColor);

      // Random gentle velocities
      particleData.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() * 0.005) + 0.002, // slowly drift upward
        vz: (Math.random() - 0.5) * 0.002,
      });
    }
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    let isHidden = false;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleVisibilityChange = () => {
      isHidden = document.hidden;
    };

    // Scroll effect - camera pulls back
    const onScroll = () => {
      const scrollY = window.scrollY;
      // move camera back slightly based on scroll
      camera.position.z = 5 + (scrollY * 0.015);
    };

    window.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', onScroll, { passive: true });

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isHidden) return;

      // Mouse repulsion target
      const targetX = mouseX * 10;
      const targetY = mouseY * 10;

      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        
        // Drift upward
        p.y += p.vy;
        p.x += p.vx;
        p.z += p.vz;

        // Reset if it goes too high
        if (p.y > 10) {
          p.y = -10;
          p.x = (Math.random() - 0.5) * 20;
        }

        // Repel from mouse gently
        const dx = p.x - targetX;
        const dy = p.y - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 3) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

        dummy.position.set(p.x, p.y, p.z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
