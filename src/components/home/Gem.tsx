"use client";

import { useEffect, useRef } from "react";

/*
 * A slowly turning cut gem for the stealth venture. three.js loads only when
 * the card is near the viewport; until then (or without WebGL) a CSS facet
 * drawing stands in.
 */
export const Gem = () => {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    let dispose = () => {};
    let started = false;

    const start = async () => {
      if (started) return;
      started = true;
      const THREE = await import("three");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      el.appendChild(renderer.domElement);
      el.dataset.ready = "true";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0.2, 6);

      // A brilliant-ish cut: a short crown on a deep pavilion.
      const points = [
        new THREE.Vector2(0, -1.25),
        new THREE.Vector2(0.62, -0.5),
        new THREE.Vector2(1.05, 0.05),
        new THREE.Vector2(1.08, 0.12),
        new THREE.Vector2(0.86, 0.42),
        new THREE.Vector2(0.58, 0.6),
        new THREE.Vector2(0, 0.6),
      ];
      const geometry = new THREE.LatheGeometry(points, 12).toNonIndexed();
      geometry.computeVertexNormals();

      // Mirror-like facets reflecting hard light strips read as a cut stone.
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffeadb,
        metalness: 0.92,
        roughness: 0.06,
        iridescence: 0.7,
        iridescenceIOR: 1.8,
        clearcoat: 1,
        clearcoatRoughness: 0,
        flatShading: true,
        envMapIntensity: 1.8,
      });
      const gem = new THREE.Mesh(geometry, material);
      gem.rotation.x = 0.32;
      scene.add(gem);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 1),
        new THREE.LineBasicMaterial({ color: 0xf5c69a, transparent: true, opacity: 0.35 }),
      );
      gem.add(edges);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x0e0f12);
      const panel = (color: number, x: number, y: number, z: number) => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 4), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
        mesh.position.set(x, y, z);
        mesh.lookAt(0, 0, 0);
        envScene.add(mesh);
      };
      // Hard light strips on black give the facets their flashes.
      const strips = [0xffffff, 0xffe0c0, 0xe8772e, 0xffffff, 0xd9c8ff, 0xc2410c, 0xffffff, 0xffd2a8, 0xffffff, 0xe8772e];
      strips.forEach((color, i) => {
        const a = (i / strips.length) * Math.PI * 2;
        panel(color, Math.cos(a) * 4, ((i % 4) - 1.5) * 2, Math.sin(a) * 4);
      });
      panel(0xffffff, 0, 5, 0);
      scene.environment = pmrem.fromScene(envScene, 0.02).texture;

      const key = new THREE.PointLight(0xffd2a8, 30, 20);
      key.position.set(2, 3, 4);
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.3));

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let hover = 0;
      let spin = 0.004;
      let lastScroll = window.scrollY;
      const onScroll = () => {
        spin += Math.min(0.06, Math.abs(window.scrollY - lastScroll) * 0.0004);
        lastScroll = window.scrollY;
      };
      const card = el.closest("[data-jewel]") ?? el;
      const enter = () => {
        hover = 1;
      };
      const leave = () => (hover = 0);
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      window.addEventListener("scroll", onScroll, { passive: true });

      let frame = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);
      const render = () => {
        frame = requestAnimationFrame(render);
        if (!visible) return;
        spin += (0.004 + hover * 0.01 - spin) * 0.03;
        if (!reduce) gem.rotation.y += spin;
        key.color.setHSL(0.07 + hover * 0.02, 1, 0.75 - hover * 0.1);
        renderer.render(scene, camera);
      };
      render();

      dispose = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        io.disconnect();
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
        window.removeEventListener("scroll", onScroll);
        geometry.dispose();
        material.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const near = new IntersectionObserver(([entry]) => entry.isIntersecting && start(), { rootMargin: "400px" });
    near.observe(el);
    return () => {
      near.disconnect();
      dispose();
    };
  }, []);

  return (
    <div ref={host} className="group/gem relative h-full w-full [&>canvas]:h-full [&>canvas]:w-full">
      <div
        aria-hidden
        className="absolute inset-[22%] rotate-45 bg-gradient-to-br from-[#f5c69a] via-rising to-[#3a1405] opacity-70 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] group-data-[ready=true]/gem:hidden"
      />
    </div>
  );
};
