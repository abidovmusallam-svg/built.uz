import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, Box, RotateCcw, Sparkles } from 'lucide-react';

type SceneMode = 'pavilion' | 'exploded' | 'wireframe';

/**
 * Real-time interactive Three.js 3D Architectural Pavilion & Material Showcase.
 * Follows WebGL PBR studio lighting, RoomEnvironment IBL, software-WebGL pacing,
 * bottom dock controls, and zero-GC animation loop standards.
 */
export const Hero3DScene: React.FC<{ regionLabel?: string }> = ({ regionLabel }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SceneMode>('pavilion');
  const [webglFailed, setWebglFailed] = useState(false);

  const modeRef = useRef<SceneMode>('pavilion');
  const resetCameraFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 360;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d241e);
    scene.fog = new THREE.FogExp2(0x0d241e, 0.045);

    // Environment reflection for steel/glass PBR realism
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(6.4, 4.4, 6.8);
    camera.position.copy(defaultCamPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4.5;
    controls.maxDistance = 12;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.target.set(0, 1.0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.85;

    resetCameraFnRef.current = () => {
      camera.position.copy(defaultCamPos);
      controls.target.set(0, 1.0, 0);
      controls.update();
    };

    // 3-Point Studio Lighting + Hemisphere
    const hemiLight = new THREE.HemisphereLight(0xd7f3ea, 0x091813, 0.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    keyLight.position.set(7, 11, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 28;
    const d = 5.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.3);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Subtle procedural blueprint grid floor
    const gridHelper = new THREE.GridHelper(18, 24, 0x2f7d68, 0x163d33);
    gridHelper.position.y = -0.02;
    scene.add(gridHelper);

    // Architectural Materials (varied roughness/metalness)
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd4d7d0,
      roughness: 0.85,
      metalness: 0.05
    });
    const darkSlateMat = new THREE.MeshStandardMaterial({
      color: 0x1b3f36,
      roughness: 0.65,
      metalness: 0.15
    });
    const brushedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xc2ccd4,
      roughness: 0.24,
      metalness: 0.92
    });
    const amberGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.28,
      metalness: 0.78
    });
    const terracottaBrickMat = new THREE.MeshStandardMaterial({
      color: 0xc8643c,
      roughness: 0.78,
      metalness: 0.04
    });
    const cedarWoodMat = new THREE.MeshStandardMaterial({
      color: 0xa46b3e,
      roughness: 0.72,
      metalness: 0.02
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa7f3d0,
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.48,
      transmission: isSoftwareGl ? 0 : 0.65,
      ior: 1.5,
      clearcoat: 1.0
    });

    const wireframeTargets: THREE.MeshStandardMaterial[] = [
      concreteMat,
      darkSlateMat,
      brushedSteelMat,
      amberGoldMat,
      terracottaBrickMat,
      cedarWoodMat
    ];

    // Composite Multi-Part Architectural Pavilion Group (12+ parts across silhouette tiers)
    const buildingRoot = new THREE.Group();
    scene.add(buildingRoot);

    // 1. Stepped Foundation Plinth (Primary silhouette base)
    const foundationGroup = new THREE.Group();
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-2.3, -1.8);
    baseShape.lineTo(2.3, -1.8);
    baseShape.lineTo(2.3, 1.8);
    baseShape.lineTo(-2.3, 1.8);
    baseShape.closePath();

    const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2
    });
    baseGeo.rotateX(-Math.PI / 2);
    const basePlinth = new THREE.Mesh(baseGeo, darkSlateMat);
    basePlinth.position.y = 0.02;
    basePlinth.receiveShadow = true;
    basePlinth.castShadow = true;
    foundationGroup.add(basePlinth);

    const upperDeckGeo = new THREE.BoxGeometry(4.1, 0.16, 3.1);
    const upperDeck = new THREE.Mesh(upperDeckGeo, concreteMat);
    upperDeck.position.y = 0.36;
    upperDeck.receiveShadow = true;
    upperDeck.castShadow = true;
    foundationGroup.add(upperDeck);
    buildingRoot.add(foundationGroup);

    // 2. Structural Brushed-Steel Columns & Rebar Truss Frame
    const frameGroup = new THREE.Group();
    const colGeo = new THREE.BoxGeometry(0.18, 2.1, 0.18);
    const colPositions: [number, number][] = [
      [-1.8, -1.3],
      [1.8, -1.3],
      [-1.8, 1.3],
      [1.8, 1.3],
      [0, -1.3]
    ];
    colPositions.forEach(([x, z]) => {
      const col = new THREE.Mesh(colGeo, brushedSteelMat);
      col.position.set(x, 1.48, z);
      col.castShadow = true;
      col.receiveShadow = true;
      frameGroup.add(col);
    });

    // Horizontal Amber Steel Perimeter Beams
    const beamXGeo = new THREE.BoxGeometry(3.85, 0.14, 0.16);
    [-1.3, 1.3].forEach(z => {
      const beam = new THREE.Mesh(beamXGeo, amberGoldMat);
      beam.position.set(0, 2.52, z);
      beam.castShadow = true;
      frameGroup.add(beam);
    });
    buildingRoot.add(frameGroup);

    // 3. Masonry Brick / Gazoblok Cutaway Wall & Timber Louvers
    const wallsGroup = new THREE.Group();
    const brickWallGeo = new THREE.BoxGeometry(1.75, 1.85, 0.24);
    const brickWall = new THREE.Mesh(brickWallGeo, terracottaBrickMat);
    brickWall.position.set(-0.92, 1.37, -1.12);
    brickWall.castShadow = true;
    brickWall.receiveShadow = true;
    wallsGroup.add(brickWall);

    // Individual stacked modular gasblocks (accent detail)
    const blockGeo = new THREE.BoxGeometry(0.52, 0.3, 0.26);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        const blk = new THREE.Mesh(blockGeo, concreteMat);
        blk.position.set(0.55 + col * 0.56, 0.6 + row * 0.34, -1.12);
        blk.castShadow = true;
        blk.receiveShadow = true;
        wallsGroup.add(blk);
      }
    }

    // Timber Facade Louvers on right flank
    const louverGeo = new THREE.BoxGeometry(0.08, 1.9, 0.28);
    for (let i = 0; i < 6; i++) {
      const louver = new THREE.Mesh(louverGeo, cedarWoodMat);
      louver.position.set(1.78, 1.42, -0.9 + i * 0.36);
      louver.castShadow = true;
      wallsGroup.add(louver);
    }
    buildingRoot.add(wallsGroup);

    // 4. Optical Glass Atrium Core
    const glassGroup = new THREE.Group();
    const glassPaneGeo = new THREE.BoxGeometry(2.1, 1.85, 0.08);
    const frontGlass = new THREE.Mesh(glassPaneGeo, glassMat);
    frontGlass.position.set(-0.4, 1.38, 1.15);
    frontGlass.renderOrder = 2;
    glassGroup.add(frontGlass);

    const sideGlassGeo = new THREE.BoxGeometry(0.08, 1.85, 1.6);
    const sideGlass = new THREE.Mesh(sideGlassGeo, glassMat);
    sideGlass.position.set(-1.62, 1.38, 0.2);
    sideGlass.renderOrder = 2;
    glassGroup.add(sideGlass);
    buildingRoot.add(glassGroup);

    // 5. Cantilevered Architectural Roof Crown + Solar Trim
    const roofGroup = new THREE.Group();
    const roofSlabGeo = new THREE.BoxGeometry(4.45, 0.2, 3.45);
    const roofSlab = new THREE.Mesh(roofSlabGeo, concreteMat);
    roofSlab.position.y = 2.68;
    roofSlab.castShadow = true;
    roofSlab.receiveShadow = true;
    roofGroup.add(roofSlab);

    const roofTrimGeo = new THREE.BoxGeometry(4.55, 0.08, 3.55);
    const roofTrim = new THREE.Mesh(roofTrimGeo, amberGoldMat);
    roofTrim.position.y = 2.8;
    roofTrim.castShadow = true;
    roofGroup.add(roofTrim);

    // Architectural Skylight Lantern on roof
    const skylightGeo = new THREE.BoxGeometry(1.7, 0.24, 1.1);
    const skylight = new THREE.Mesh(skylightGeo, glassMat);
    skylight.position.set(-0.3, 2.94, 0.1);
    roofGroup.add(skylight);
    buildingRoot.add(roofGroup);

    // 6. Floating Orbiting Material Satellites (Cement Sack, Rebar Rod Bundle, Timber Prism)
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const sat1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.32), concreteMat);
    sat1.position.set(2.9, 1.65, 1.4);
    sat1.castShadow = true;

    const sat2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.72, 16), brushedSteelMat);
    sat2.position.set(-2.9, 1.9, 1.1);
    sat2.rotation.z = Math.PI / 5;
    sat2.castShadow = true;

    const sat3 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), amberGoldMat);
    sat3.position.set(2.6, 2.2, -1.7);
    sat3.castShadow = true;

    orbitGroup.add(sat1, sat2, sat3);

    // Track geometries & materials for clean disposal
    const geometries: THREE.BufferGeometry[] = [
      baseGeo,
      upperDeckGeo,
      colGeo,
      beamXGeo,
      brickWallGeo,
      blockGeo,
      louverGeo,
      glassPaneGeo,
      sideGlassGeo,
      roofSlabGeo,
      roofTrimGeo,
      skylightGeo,
      sat1.geometry,
      sat2.geometry,
      sat3.geometry
    ];

    const materials: THREE.Material[] = [
      concreteMat,
      darkSlateMat,
      brushedSteelMat,
      amberGoldMat,
      terracottaBrickMat,
      cedarWoodMat,
      glassMat
    ];

    // Context lost handler
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // ResizeObserver for crisp responsiveness
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation loop with exponential damping (no GC allocations inside loop)
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let explodeFactor = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const currentMode = modeRef.current;
      const targetExplode = currentMode === 'exploded' ? 1 : 0;
      explodeFactor = THREE.MathUtils.damp(explodeFactor, targetExplode, 5.5, delta);

      const isWire = currentMode === 'wireframe';
      wireframeTargets.forEach(mat => {
        if (mat.wireframe !== isWire) {
          mat.wireframe = isWire;
        }
      });

      // Smooth architectural exploded layer separation
      roofGroup.position.y = explodeFactor * 1.15;
      glassGroup.position.z = explodeFactor * 0.55;
      wallsGroup.position.x = -explodeFactor * 0.45;
      frameGroup.position.y = explodeFactor * 0.35;

      // Floating material satellites bob gently
      sat1.position.y = 1.65 + Math.sin(elapsed * 1.6) * 0.16;
      sat1.rotation.y += delta * 0.7;

      sat2.position.y = 1.9 + Math.cos(elapsed * 1.4) * 0.18;
      sat2.rotation.x += delta * 0.5;

      sat3.position.y = 2.2 + Math.sin(elapsed * 1.9 + 1.2) * 0.15;
      sat3.rotation.y -= delta * 0.65;
      sat3.rotation.x += delta * 0.35;

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-[#0f2721] via-[#173B32] to-[#0a1a16] border border-emerald-800/70 flex flex-col items-center justify-center p-6 text-center">
        <Box className="w-12 h-12 text-[#F59E0B] mb-3" />
        <h4 className="text-sm font-bold text-white">BUILT 3D Arxitektura Modeli</h4>
        <p className="text-xs text-emerald-200 mt-1">
          {regionLabel || "O'zbekiston bo'ylab qurilish logistikasi"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-emerald-700/60 bg-[#0d241e] shadow-2xl select-none">
      {/* Top minimal spec badge (static, zero pulsating dots) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-[#0d241e]/85 border border-emerald-700/60 px-3 py-1.5 text-[11px] font-semibold text-emerald-100">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span>3D Interaktiv Pavilyon</span>
        <span className="text-emerald-500">·</span>
        <span className="text-amber-300">360° Aylantiring</span>
      </div>

      {/* Isolated WebGL Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Compact Bottom Control Dock (Zero backdrop-blur over WebGL, zero side clutter) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-xl bg-[#0a1d18]/92 border border-emerald-700/70 p-1 shadow-xl">
        <button
          type="button"
          onClick={() => setMode('pavilion')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
            mode === 'pavilion'
              ? 'bg-[#F59E0B] text-[#173B32]'
              : 'text-emerald-100 hover:bg-emerald-900/70'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Bino</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('exploded')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
            mode === 'exploded'
              ? 'bg-[#F59E0B] text-[#173B32]'
              : 'text-emerald-100 hover:bg-emerald-900/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Qatlamlar</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('wireframe')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
            mode === 'wireframe'
              ? 'bg-[#F59E0B] text-[#173B32]'
              : 'text-emerald-100 hover:bg-emerald-900/70'
          }`}
        >
          <span>Karkas</span>
        </button>

        <button
          type="button"
          onClick={() => resetCameraFnRef.current?.()}
          title="Kamerani tiklash"
          className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/70 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
