import React, { useEffect, useRef } from "react";

export function Product3DShowcase() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof (window as any).THREE === 'undefined') return;
    const THREE = (window as any).THREE;

    const width = 300;
    const height = 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 0.5, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.5,
    });
    const cube = new THREE.Mesh(geometry, material);
    
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6B4EFF, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    cube.add(wireframe);

    scene.add(cube);

    const shadowGeo = new THREE.PlaneGeometry(3, 3);
    const shadowMat = new THREE.MeshBasicMaterial({ 
      color: 0x000000, 
      transparent: true, 
      opacity: 0.1,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.7; // Push shadow a bit lower to simulate floating
    scene.add(shadow);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 2);
    scene.add(dirLight);

    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    let baseRotationSpeed = 0.005;
    let targetRotationSpeed = baseRotationSpeed;
    let targetScale = 1;
    let floatOffset = 0;

    let animationId: number;
    let isHidden = false;

    const handleVisibilityChange = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (isHidden) return;

      baseRotationSpeed += (targetRotationSpeed - baseRotationSpeed) * 0.1;
      cube.rotation.y += baseRotationSpeed;
      
      const currentScale = cube.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      cube.scale.set(newScale, newScale, newScale);
      shadow.scale.set(newScale, newScale, newScale);

      // Subtle float
      floatOffset += 0.05;
      cube.position.y = Math.sin(floatOffset) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const onMouseEnter = () => {
      targetRotationSpeed = 0.03;
      targetScale = 1.1;
    };
    const onMouseLeave = () => {
      targetRotationSpeed = 0.005;
      targetScale = 1;
    };

    const currentMount = mountRef.current;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      currentMount.addEventListener('mouseenter', onMouseEnter);
      currentMount.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (currentMount) {
        currentMount.removeEventListener('mouseenter', onMouseEnter);
        currentMount.removeEventListener('mouseleave', onMouseLeave);
        if (currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      geometry.dispose();
      material.dispose();
      edges.dispose();
      lineMaterial.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Return a relative container to hold the canvas cleanly
  return <div ref={mountRef} className="w-[300px] h-[300px] cursor-pointer flex items-center justify-center relative z-10" />;
}
