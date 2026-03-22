import React, { useEffect, useRef } from "react";

export function Bee3DParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof (window as any).THREE === 'undefined') return;
    const THREE = (window as any).THREE;

    const width = 80;
    const height = 80;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targets = new Float32Array(particleCount * 3);
    const starts = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Target shape (small cluster)
        targets[i * 3] = (Math.random() - 0.5) * 2;
        targets[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
        targets[i * 3 + 2] = (Math.random() - 0.5) * 2;

        // Start from random wide positions
        starts[i * 3] = (Math.random() - 0.5) * 20;
        starts[i * 3 + 1] = (Math.random() - 0.5) * 20 + 10;
        starts[i * 3 + 2] = (Math.random() - 0.5) * 20;

        positions[i * 3] = starts[i * 3];
        positions[i * 3 + 1] = starts[i * 3 + 1];
        positions[i * 3 + 2] = starts[i * 3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Circular texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(8, 8, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB800';
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({ 
      size: 0.25, 
      map: texture, 
      transparent: true, 
      alphaTest: 0.5,
      color: 0xffffff
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    let animationId: number;
    let time = 0;
    let isHidden = false;

    const handleVisibilityChange = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (isHidden) return;

      time += 0.016;

      const positionAttribute = geometry.getAttribute('position');
      const array = positionAttribute.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const progress = Math.min(time / 2.0, 1.0);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentX = starts[i3] + (targets[i3] - starts[i3]) * ease;
        const currentY = starts[i3+1] + (targets[i3+1] - starts[i3+1]) * ease;
        const currentZ = starts[i3+2] + (targets[i3+2] - starts[i3+2]) * ease;

        const angle = time * 0.5 + i;
        const radius = 0.4;
        const orbitX = Math.cos(angle) * radius * progress;
        const orbitZ = Math.sin(angle) * radius * progress;

        // Gentle float up and down
        const floatY = Math.sin(time * 2 + i) * 0.1 * progress;

        array[i3] = currentX + orbitX;
        array[i3+1] = currentY + floatY;
        array[i3+2] = currentZ + orbitZ;
      }

      positionAttribute.needsUpdate = true;
      particles.rotation.y = time * 0.3; 

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-[80px] h-[80px] pointer-events-none -ml-4" />;
}
