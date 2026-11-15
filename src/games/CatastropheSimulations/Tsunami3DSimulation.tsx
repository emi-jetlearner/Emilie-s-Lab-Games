import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Waves,
  Eye,
  Camera,
  FastForward,
  Info,
  Maximize2,
  Tag
} from 'lucide-react';

interface StageData {
  stage: number;
  name: string;
  shortDesc: string;
  explanation: string;
  depthM: number;
  heightM: number;
  speedKmh: number;
  timeRange: [number, number]; // normalized progress 0 to 1
  cameraTarget: { pos: [number, number, number]; lookAt: [number, number, number] };
}

const TSUNAMI_STAGES: StageData[] = [
  {
    stage: 1,
    name: 'Undersea Earthquake',
    shortDesc: 'Tectonic plates slip & displace seabed',
    explanation:
      'Deep under the ocean, tectonic plates suddenly slip along a subsea fault line. The vertical rupture violently heaves the seafloor upward, displacing billions of tons of seawater in seconds.',
    depthM: 4500,
    heightM: 0.8,
    speedKmh: 820,
    timeRange: [0.0, 0.14],
    cameraTarget: { pos: [-38, 14, 18], lookAt: [-35, -4, 0] }
  },
  {
    stage: 2,
    name: 'Wave Formation',
    shortDesc: 'Uplifted water collapses into waves',
    explanation:
      'Gravity pulls the uplifted water mound back down. The potential energy transforms into concentric tsunami wave pulses spreading outward across the ocean surface in both directions.',
    depthM: 4200,
    heightM: 1.4,
    speedKmh: 790,
    timeRange: [0.14, 0.28],
    cameraTarget: { pos: [-28, 16, 22], lookAt: [-22, 0, 0] }
  },
  {
    stage: 3,
    name: 'Deep Ocean Travel',
    shortDesc: 'High-speed, long wavelength race',
    explanation:
      'In deep water, the tsunami races at jetliner speeds (over 700 km/h). Because the wavelength spans over 100 kilometers, the wave height is barely a meter on the surface, passing ships unnoticed.',
    depthM: 3600,
    heightM: 1.9,
    speedKmh: 710,
    timeRange: [0.28, 0.43],
    cameraTarget: { pos: [-12, 18, 25], lookAt: [-5, 1, 0] }
  },
  {
    stage: 4,
    name: 'Shoaling Effect',
    shortDesc: 'Shallow seabed compresses wave energy',
    explanation:
      'As water gets shallower near the continental slope, friction with the rising seafloor slows the wave front down. The trailing water packs in behind, forcing trapped energy upward into a massive vertical surge.',
    depthM: 120,
    heightM: 7.2,
    speedKmh: 155,
    timeRange: [0.43, 0.58],
    cameraTarget: { pos: [6, 15, 22], lookAt: [8, 2, 0] }
  },
  {
    stage: 5,
    name: 'Coastal Drawback & Surge',
    shortDesc: 'Shoreline retreats, massive surge arrives',
    explanation:
      'The wave trough arrives first, pulling seawater away from the coast and exposing wet sand, reefs, and boats. Soon after, an unstoppable, continuous mountain of water sweeps toward the shore.',
    depthM: 18,
    heightM: 14.5,
    speedKmh: 55,
    timeRange: [0.58, 0.72],
    cameraTarget: { pos: [14, 11, 16], lookAt: [18, 3, 0] }
  },
  {
    stage: 6,
    name: 'Inundation & Destruction',
    shortDesc: 'Relentless flood carrying debris inland',
    explanation:
      'The surge bursts over seawalls and streets as a powerful, continuous current—not a breaking surfing wave. It floods hundreds of meters inland, overturning cars, bending trees, and carrying floating debris.',
    depthM: 6,
    heightM: 11.8,
    speedKmh: 38,
    timeRange: [0.72, 0.86],
    cameraTarget: { pos: [22, 10, 15], lookAt: [26, 3, 0] }
  },
  {
    stage: 7,
    name: 'Aftermath & Receding',
    shortDesc: 'Water drains out, leaving debris & mud',
    explanation:
      'The floodwaters gradually recede back into the ocean with intense backwash undertows, leaving behind flooded roads, sediment, and displaced debris. Dangerous secondary surges may continue for hours.',
    depthM: 2,
    heightM: 3.5,
    speedKmh: 14,
    timeRange: [0.86, 1.0],
    cameraTarget: { pos: [18, 16, 26], lookAt: [20, 2, 0] }
  }
];

// Helper to determine stage from normalized progress (0 to 1)
function getStageFromProgress(progress: number): StageData {
  const p = Math.min(Math.max(progress, 0), 0.999);
  for (const s of TSUNAMI_STAGES) {
    if (p >= s.timeRange[0] && p < s.timeRange[1]) {
      return s;
    }
  }
  return TSUNAMI_STAGES[TSUNAMI_STAGES.length - 1];
}

// Module-level math helpers to avoid garbage collection inside render loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();

export const Tsunami3DSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 0.5, 1.0, 2.0
  const [progress, setProgress] = useState<number>(0); // 0.0 to 1.0
  const [currentStage, setCurrentStage] = useState<StageData>(TSUNAMI_STAGES[0]);
  const [activeCamPreset, setActiveCamPreset] = useState<string>('Overview');
  const [showScientificTerms, setShowScientificTerms] = useState<boolean>(false);

  // Animation Refs
  const progressRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const simSpeedRef = useRef<number>(1.0);
  const reqIdRef = useRef<number>(0);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Dynamic mesh refs
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const faultMeshRef = useRef<THREE.Mesh | null>(null);
  const shockwaveRef = useRef<THREE.Mesh | null>(null);
  const sprayParticlesRef = useRef<THREE.Points | null>(null);
  const debrisGroupRef = useRef<THREE.Group | null>(null);
  const cityGroupRef = useRef<THREE.Group | null>(null);

  // Sync refs with React states
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  // Jump to specific stage
  const jumpToStage = useCallback((stageIndex: number) => {
    const s = TSUNAMI_STAGES[stageIndex];
    if (!s) return;
    const midTime = (s.timeRange[0] + s.timeRange[1]) / 2;
    progressRef.current = midTime;
    setProgress(midTime);
    setCurrentStage(s);

    // Smoothly animate camera to stage position
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.set(
        s.cameraTarget.lookAt[0],
        s.cameraTarget.lookAt[1],
        s.cameraTarget.lookAt[2]
      );
      cameraRef.current.position.set(
        s.cameraTarget.pos[0],
        s.cameraTarget.pos[1],
        s.cameraTarget.pos[2]
      );
      controlsRef.current.update();
    }
  }, []);

  // Set camera view preset
  const setCameraPreset = useCallback((presetName: string) => {
    setActiveCamPreset(presetName);
    if (!controlsRef.current || !cameraRef.current) return;

    if (presetName === 'Fault') {
      cameraRef.current.position.set(-36, 12, 16);
      controlsRef.current.target.set(-34, -4, 0);
    } else if (presetName === 'Ocean') {
      cameraRef.current.position.set(-8, 16, 26);
      controlsRef.current.target.set(0, 1, 0);
    } else if (presetName === 'Coast') {
      cameraRef.current.position.set(15, 9, 14);
      controlsRef.current.target.set(19, 2.5, 0);
    } else if (presetName === 'City') {
      cameraRef.current.position.set(24, 7, 12);
      controlsRef.current.target.set(27, 2, 0);
    } else {
      // Overview
      cameraRef.current.position.set(2, 28, 38);
      controlsRef.current.target.set(3, 1, 0);
    }
    controlsRef.current.update();
  }, []);

  const handleRestart = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentStage(TSUNAMI_STAGES[0]);
    setIsPlaying(true);
    setCameraPreset('Overview');
  }, [setCameraPreset]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3f7);
    scene.fog = new THREE.FogExp2(0xbfe3f7, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(2, 28, 38);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(3, 1, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // prevent going under terrain
    controls.minDistance = 6;
    controls.maxDistance = 110;
    controlsRef.current = controls;

    // 5. Realistic Natural Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xd9efff, 0.65);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xa7f3d0, 0.85);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.position.set(25, 45, 20);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 120;
      sunLight.shadow.camera.left = -40;
      sunLight.shadow.camera.right = 40;
      sunLight.shadow.camera.top = 40;
      sunLight.shadow.camera.bottom = -40;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    // 6. Bathymetric Seabed & Coastal Terrain (X: -45 to +40, Z: -20 to +20)
    // -45 to -22: Deep ocean trench (Y: -8 to -7)
    // -22 to +12: Continental slope & shelf (Y: -7 to 0)
    // +12 to +16: Sandy beach (Y: 0 to 0.6)
    // +16 to +38: Coastal City Plain (Y: 0.8 to 1.5)
    const terrainSegX = 140;
    const terrainSegZ = 60;
    const terrainGeo = new THREE.PlaneGeometry(85, 36, terrainSegX, terrainSegZ);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const vertexCount = posAttr.count;
    const colors = new Float32Array(vertexCount * 3);

    const colorDeepAbyss = new THREE.Color(0x0f2b38);
    const colorShelf = new THREE.Color(0x2d6a4f);
    const colorSand = new THREE.Color(0xfef08a);
    const colorGrass = new THREE.Color(0x86efac);
    const colorCityFloor = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < vertexCount; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      let y = 0;
      let col = colorDeepAbyss;

      if (x < -22) {
        // Deep Trench
        const trenchDip = x < -32 ? Math.sin((x + 32) * 0.4) * 1.8 : 0;
        y = -7.5 + trenchDip + Math.sin(x * 0.5) * 0.2 + Math.cos(z * 0.4) * 0.25;
        col = colorDeepAbyss;
      } else if (x < 12) {
        // Continental Slope
        const slopeProgress = (x - -22) / 34; // 0 to 1
        y = -7.5 + slopeProgress * 7.5 + Math.sin(x * 0.3) * 0.15;
        col = colorDeepAbyss.clone().lerp(colorShelf, slopeProgress);
      } else if (x < 16) {
        // Sand Beach
        const beachProgress = (x - 12) / 4;
        y = 0.0 + beachProgress * 0.7;
        col = colorSand;
      } else {
        // Coastal City Terrain
        const inlandDist = (x - 16) / 22;
        y = 0.7 + inlandDist * 0.8;
        col = Math.abs(z % 6) < 1.2 || Math.abs((x - 16) % 7) < 1.0 ? colorCityFloor : colorGrass;
      }

      posAttr.setY(i, y);
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.1
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);

    // 7. Subsea Tectonic Fault Line Graphic (Undersea Epicenter)
    const faultGeo = new THREE.BoxGeometry(2.5, 4.0, 30);
    const faultMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.8,
      roughness: 0.4
    });
    const faultMesh = new THREE.Mesh(faultGeo, faultMat);
    faultMesh.position.set(-34, -7.0, 0);
    scene.add(faultMesh);
    faultMeshRef.current = faultMesh;

    // Seismic shockwave ring
    const shockRingGeo = new THREE.RingGeometry(0.5, 2.0, 32);
    shockRingGeo.rotateX(-Math.PI / 2);
    const shockRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const shockwaveMesh = new THREE.Mesh(shockRingGeo, shockRingMat);
    shockwaveMesh.position.set(-34, -6.8, 0);
    scene.add(shockwaveMesh);
    shockwaveRef.current = shockwaveMesh;

    // 8. 3D Coastal City Architecture (Houses, Buildings, Trees, Vehicles, Seawall)
    const cityGroup = new THREE.Group();
    cityGroupRef.current = cityGroup;
    scene.add(cityGroup);

    // Seawall along the beach (X = 16)
    const seawallGeo = new THREE.BoxGeometry(0.8, 1.2, 34);
    const seawallMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.7
    });
    const seawallMesh = new THREE.Mesh(seawallGeo, seawallMat);
    seawallMesh.position.set(16, 0.6, 0);
    seawallMesh.castShadow = !isSoftwareGl;
    seawallMesh.receiveShadow = !isSoftwareGl;
    cityGroup.add(seawallMesh);

    // Buildings & Homes (3-6 parts each)
    const buildingColors = [0xffffff, 0xfef08a, 0xbae6fd, 0xfbcfe8, 0xe2e8f0, 0xdcfce7];
    const roofColors = [0xef4444, 0x3b82f6, 0x64748b, 0x059669, 0xd97706];

    interface CityBuilding {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      initialRotZ: number;
    }
    const buildingsList: CityBuilding[] = [];

    for (let bx = 19; bx <= 36; bx += 5.5) {
      for (let bz = -14; bz <= 14; bz += 6.5) {
        // Skip street intersections
        if (Math.abs(bz) < 2.5) continue;

        const bGroup = new THREE.Group();
        const bHeight = 2.0 + Math.random() * 4.5;
        const bWidth = 2.5 + Math.random() * 1.5;
        const bDepth = 2.5 + Math.random() * 1.5;

        // Base ground height
        const bGroundY = 0.7 + ((bx - 16) / 22) * 0.8;

        // Main tower body
        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const colPick = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        const bMat = new THREE.MeshStandardMaterial({
          color: colPick,
          roughness: 0.5,
          metalness: 0.1
        });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(0, bHeight / 2, 0);
        bMesh.castShadow = !isSoftwareGl;
        bMesh.receiveShadow = !isSoftwareGl;
        bGroup.add(bMesh);

        // Roof Accent / Water tank
        const roofCol = roofColors[Math.floor(Math.random() * roofColors.length)];
        const roofGeo = new THREE.BoxGeometry(bWidth * 0.85, 0.4, bDepth * 0.85);
        const roofMat = new THREE.MeshStandardMaterial({ color: roofCol, roughness: 0.6 });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.position.set(0, bHeight + 0.2, 0);
        bGroup.add(roofMesh);

        // Window band strips
        const winGeo = new THREE.BoxGeometry(bWidth + 0.05, 0.35, bDepth * 0.75);
        const winMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.2,
          metalness: 0.7
        });
        const winMesh = new THREE.Mesh(winGeo, winMat);
        winMesh.position.set(0, bHeight * 0.65, 0);
        bGroup.add(winMesh);

        bGroup.position.set(bx, bGroundY, bz);
        cityGroup.add(bGroup);

        buildingsList.push({
          group: bGroup,
          baseX: bx,
          baseY: bGroundY,
          baseZ: bz,
          initialRotZ: 0
        });
      }
    }

    // Coastal Palm Trees & Foliage (2-part procedural groups)
    interface CityTree {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
    }
    const treesList: CityTree[] = [];

    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.18, 1.8, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const foliageGeo = new THREE.ConeGeometry(0.9, 1.4, 6);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });

    for (let tx = 17; tx <= 36; tx += 3.8) {
      for (let tz = -15; tz <= 15; tz += 4.5) {
        if (Math.random() > 0.45) continue;
        const treeGroup = new THREE.Group();

        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(0, 0.9, 0);
        trunk.castShadow = !isSoftwareGl;
        treeGroup.add(trunk);

        const crown = new THREE.Mesh(foliageGeo, foliageMat);
        crown.position.set(0, 2.0, 0);
        crown.castShadow = !isSoftwareGl;
        treeGroup.add(crown);

        const treeY = 0.7 + ((tx - 16) / 22) * 0.8;
        treeGroup.position.set(tx, treeY, tz);
        cityGroup.add(treeGroup);

        treesList.push({
          group: treeGroup,
          baseX: tx,
          baseY: treeY,
          baseZ: tz
        });
      }
    }

    // 9. Floating Debris System (Crates, Cars, Logs swept inland during inundation)
    const debrisGroup = new THREE.Group();
    debrisGroupRef.current = debrisGroup;
    scene.add(debrisGroup);

    interface DebrisItem {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      type: 'crate' | 'car' | 'log';
    }
    const debrisList: DebrisItem[] = [];

    const crateGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    const carGeo = new THREE.BoxGeometry(1.6, 0.7, 0.9);
    const carMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.5 });
    const logGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.5, 6);
    logGeo.rotateZ(Math.PI / 2);
    const logMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });

    for (let d = 0; d < 24; d++) {
      const isCar = d % 3 === 0;
      const isLog = d % 3 === 1;
      const dMesh = new THREE.Mesh(
        isCar ? carGeo : isLog ? logGeo : crateGeo,
        isCar ? carMat : isLog ? logMat : crateMat
      );
      const startX = 16.5 + Math.random() * 12;
      const startZ = -14 + Math.random() * 28;
      const startY = 0.8 + ((startX - 16) / 22) * 0.8;
      dMesh.position.set(startX, startY + 0.3, startZ);
      dMesh.castShadow = !isSoftwareGl;
      debrisGroup.add(dMesh);

      debrisList.push({
        mesh: dMesh,
        baseX: startX,
        baseY: startY + 0.3,
        baseZ: startZ,
        type: isCar ? 'car' : isLog ? 'log' : 'crate'
      });
    }

    // 10. Dynamic Ocean Water Surface (Realistic Mesh Displacement)
    // Segments: 160 x 50 for smooth continuous wave surge displacement
    const waterSegX = 160;
    const waterSegZ = 50;
    const waterGeo = new THREE.PlaneGeometry(85, 36, waterSegX, waterSegZ);
    waterGeo.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x006699,
      emissive: 0x001a33,
      emissiveIntensity: 0.25,
      roughness: 0.12,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, 0, 0);
    waterMesh.receiveShadow = !isSoftwareGl;
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // Base water vertices cache for fast delta computation
    const baseWaterPos = waterGeo.attributes.position.clone();

    // 11. White Foam & Spray Particles at Wave Front
    const sprayCount = 180;
    const sprayGeo = new THREE.BufferGeometry();
    const sprayPositions = new Float32Array(sprayCount * 3);
    for (let s = 0; s < sprayCount * 3; s++) {
      sprayPositions[s] = 0;
    }
    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPositions, 3));

    const sprayMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.75
    });
    const sprayPoints = new THREE.Points(sprayGeo, sprayMat);
    scene.add(sprayPoints);
    sprayParticlesRef.current = sprayPoints;

    // 12. Main Simulation Tick Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      reqIdRef.current = requestAnimationFrame(animate);

      const deltaMs = currentTime - lastTime;
      lastTime = currentTime;
      const dt = Math.min(deltaMs / 1000, 0.1); // clamp delta time

      // Advance simulation time if playing
      if (isPlayingRef.current) {
        // Full loop takes ~35 seconds at 1.0x speed
        const cycleDuration = 35.0;
        const deltaProgress = (dt * simSpeedRef.current) / cycleDuration;
        progressRef.current += deltaProgress;

        if (progressRef.current > 1.0) {
          progressRef.current = 1.0;
          setIsPlaying(false);
        }

        const currentP = progressRef.current;
        setProgress(currentP);

        // Update active stage
        const stage = getStageFromProgress(currentP);
        setCurrentStage(stage);
      }

      const p = progressRef.current;
      controls.update();

      // --- DYNAMIC WATER WAVE DISPLACEMENT PHYSICS ---
      // Wave front advances continuously from deep trench (X: -34) to inland (X: +32)
      // Stages 1-2: X around -34 to -24
      // Stage 3: X around -24 to -2
      // Stage 4: X around -2 to +12 (shoaling, wavelength shrinks, height grows)
      // Stage 5: X around +12 to +18 (coastal drawback before wave crashes)
      // Stage 6: X around +18 to +34 (inundation: continuous horizontal flood surge)
      // Stage 7: X around +34 to +20 (slow retreat, drainage)

      // Calculate wave front X based on normalized progress
      let surgeFrontX = -35 + p * 68; // -35 to +33
      let surgeHeight = 0;
      let drawbackX = 14.5;
      let drawbackDepth = 0;

      if (p < 0.14) {
        // Stage 1: Earthquake tremor & seabed slip
        surgeHeight = 0.8 * (p / 0.14);
        if (faultMeshRef.current) {
          // Fault block vertical shift & jolt
          const slip = Math.sin(currentTime * 0.03) * 0.45;
          faultMeshRef.current.position.y = -7.0 + slip;
          (faultMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.6 + Math.abs(slip) * 1.5;
        }
        if (shockwaveRef.current) {
          const shockProgress = p / 0.14;
          shockwaveRef.current.scale.set(
            1 + shockProgress * 14,
            1 + shockProgress * 14,
            1
          );
          (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity =
            (1 - shockProgress) * 0.9;
        }
      } else if (p < 0.28) {
        // Stage 2: Wave formation
        surgeHeight = 1.4;
        if (shockwaveRef.current) {
          (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      } else if (p < 0.43) {
        // Stage 3: Deep ocean travel (broad wavelength, modest height)
        surgeHeight = 1.9;
      } else if (p < 0.58) {
        // Stage 4: Shoaling (wave slows down, height balloons upward!)
        const shoalFactor = (p - 0.43) / 0.15;
        surgeHeight = 1.9 + shoalFactor * 6.5; // reaches ~8.4m
      } else if (p < 0.72) {
        // Stage 5: Coastal Drawback & Massive Surge
        const s5Factor = (p - 0.58) / 0.14;
        surgeHeight = 8.4 + Math.sin(s5Factor * Math.PI) * 4.0;
        // Beach water pulls back seaward
        drawbackDepth = (1 - s5Factor) * 2.2;
      } else if (p < 0.86) {
        // Stage 6: Inundation & Destruction (continuous high surge water table)
        surgeHeight = 7.5;
      } else {
        // Stage 7: Aftermath & Receding
        const s7Factor = (p - 0.86) / 0.14;
        surgeHeight = 7.5 * (1 - s7Factor * 0.65);
      }

      // Deform Water Mesh Vertices
      const waterPos = waterGeo.attributes.position;
      const count = waterPos.count;
      const sprayPos = sprayGeo.attributes.position;
      let sprayIdx = 0;

      for (let i = 0; i < count; i++) {
        const bx = baseWaterPos.getX(i);
        const bz = baseWaterPos.getZ(i);

        // Distance from current surge wave front
        const distFromFront = bx - surgeFrontX;

        let yDisp = 0;

        // Base gentle ocean chop
        const naturalChop = Math.sin(bx * 0.8 + currentTime * 0.003) * 0.15 +
                            Math.cos(bz * 0.6 + currentTime * 0.002) * 0.12;

        if (bx < surgeFrontX) {
          // BEHIND THE WAVE FRONT
          if (p >= 0.58 && bx > 12) {
            // INLAND SURGE WATER LEVEL: A thick, continuous deep flood table, NOT a thin wave!
            const inlandFloodFactor = Math.min(1.0, (surgeFrontX - bx) / 8.0);
            yDisp = surgeHeight * 0.55 * inlandFloodFactor + naturalChop * 0.5;
          } else {
            // Behind the wave in open ocean
            const tailDecay = Math.max(0, 1 - Math.abs(distFromFront) / 18.0);
            yDisp = Math.sin(distFromFront * 0.4) * (surgeHeight * 0.35) * tailDecay + naturalChop;
          }
        } else {
          // AHEAD OF THE WAVE FRONT
          if (distFromFront < 7.0) {
            // The advancing surge crest: steep front wall that levels into a mountain of water
            const crestFactor = Math.cos((distFromFront / 7.0) * (Math.PI / 2));
            yDisp = surgeHeight * Math.max(0, crestFactor) + naturalChop;

            // Collect spray particle positions along the crest
            if (sprayIdx < sprayCount && i % 4 === 0) {
              sprayPos.setXYZ(
                sprayIdx,
                bx + (Math.random() - 0.5) * 0.8,
                yDisp + Math.random() * 1.4,
                bz + (Math.random() - 0.5) * 0.8
              );
              sprayIdx++;
            }
          } else {
            // Far ahead of wave
            if (p >= 0.50 && p < 0.72 && bx >= 12 && bx <= 16.5) {
              // Drawback trough: water drops below sea level, exposing beach!
              yDisp = -drawbackDepth;
            } else {
              yDisp = naturalChop;
            }
          }
        }

        waterPos.setY(i, yDisp);
      }

      waterPos.needsUpdate = true;
      waterGeo.computeVertexNormals();

      // Clear remaining spray particles
      for (let s = sprayIdx; s < sprayCount; s++) {
        sprayPos.setXYZ(s, 0, -20, 0);
      }
      sprayPos.needsUpdate = true;

      // Dynamic Building & Tree Tilt from flood force (Stages 6 & 7)
      const floodActive = p >= 0.70;
      const floodProgress = floodActive ? Math.min(1.0, (p - 0.70) / 0.16) : 0;

      buildingsList.forEach((b, idx) => {
        if (b.baseX < surgeFrontX && floodActive) {
          // Water force tilts buildings slightly and wobbles
          const tiltAmt = (0.08 + (idx % 3) * 0.04) * floodProgress;
          b.group.rotation.z = Math.sin(currentTime * 0.004 + idx) * (tiltAmt * 0.4) + tiltAmt;
        } else {
          b.group.rotation.z = 0;
        }
      });

      treesList.forEach((t, idx) => {
        if (t.baseX < surgeFrontX && floodActive) {
          // Trees bend heavily under rushing water current
          t.group.rotation.z = 0.45 * floodProgress + Math.sin(currentTime * 0.005 + idx) * 0.08;
        } else {
          t.group.rotation.z = 0;
        }
      });

      // Floating debris movement (bobbing and drifting inland)
      debrisList.forEach((item, idx) => {
        if (item.baseX < surgeFrontX && p >= 0.68) {
          // Debris floats on water surface and moves with surge
          const driftSpeed = 0.03 * (simSpeedRef.current || 1.0);
          item.mesh.position.x += driftSpeed;
          item.mesh.position.y = 1.4 + Math.sin(currentTime * 0.005 + idx) * 0.35;
          item.mesh.rotation.x += 0.015;
          item.mesh.rotation.y += 0.02;
        } else {
          item.mesh.position.x = item.baseX;
          item.mesh.position.y = item.baseY;
        }
      });

      renderer.render(scene, camera);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      sprayGeo.dispose();
      sprayMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col space-y-4">
      {/* 3D WebGL Viewport Container */}
      <div className="relative w-full h-[450px] sm:h-[530px] rounded-3xl overflow-hidden border border-sky-300 shadow-lg bg-sky-950 select-none">
        {/* Three.js Canvas Mount */}
        <div ref={mountRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

        {/* 1. TOP-LEFT EDUCATIONAL SCIENTIFIC HUD PANEL (Semi-Transparent) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 max-w-[280px] sm:max-w-[340px] bg-slate-900/90 text-white backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-sky-400/40 shadow-xl pointer-events-auto">
          {/* Header Title with Stage Badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
              <Waves className="w-3.5 h-3.5" />
              Tsunami Simulation
            </span>
            <span className="text-[10px] font-black bg-sky-500/30 text-sky-200 border border-sky-400/50 px-2 py-0.5 rounded-full">
              Stage {currentStage.stage} of 7
            </span>
          </div>

          {/* Stage Name */}
          <h3 className="text-sm sm:text-base font-black text-white leading-tight">
            {currentStage.name}
          </h3>

          {/* Scientific Stage Description */}
          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug mt-1.5 text-left">
            {currentStage.explanation}
          </p>

          {/* 3 Live Telemetry Badges */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-700/80 text-center">
            <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <span className="text-[9px] font-bold text-slate-400 block">WAVE HEIGHT</span>
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                {currentStage.heightM.toFixed(1)} m
              </span>
            </div>
            <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <span className="text-[9px] font-bold text-slate-400 block">WAVE SPEED</span>
              <span className="text-xs sm:text-sm font-black text-sky-400 font-mono">
                {currentStage.speedKmh} km/h
              </span>
            </div>
            <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <span className="text-[9px] font-bold text-slate-400 block">WATER DEPTH</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                {currentStage.depthM > 999 ? `${(currentStage.depthM / 1000).toFixed(1)} km` : `${currentStage.depthM} m`}
              </span>
            </div>
          </div>

          {/* Interactive 7-Stage Progress Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center gap-1">
            {TSUNAMI_STAGES.map((s, idx) => (
              <button
                key={s.stage}
                onClick={() => jumpToStage(idx)}
                title={`Jump to Stage ${s.stage}: ${s.name}`}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  s.stage === currentStage.stage
                    ? 'bg-sky-400 ring-2 ring-sky-300 shadow-sm'
                    : s.stage < currentStage.stage
                    ? 'bg-sky-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2. TOP-RIGHT CAMERA PRESET SWITCHER */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-md">
          <Camera className="w-3.5 h-3.5 text-sky-400 ml-1.5" />
          {[
            { id: 'Overview', label: 'Overview' },
            { id: 'Fault', label: 'Fault' },
            { id: 'Ocean', label: 'Deep Sea' },
            { id: 'Coast', label: 'Coast' },
            { id: 'City', label: 'City' }
          ].map(cam => (
            <button
              key={cam.id}
              onClick={() => setCameraPreset(cam.id)}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                activeCamPreset === cam.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cam.label}
            </button>
          ))}
        </div>

        {/* 3. SCIENTIFIC TERMS OVERLAY BADGES */}
        {showScientificTerms && (
          <div className="absolute inset-0 pointer-events-none p-4">
            {/* 1. Subsea Fault / Ocean Trench */}
            <div className="absolute bottom-16 left-6 max-w-[190px] bg-slate-900/90 text-white p-2.5 rounded-xl border border-sky-400 shadow-xl backdrop-blur-sm animate-fade-in pointer-events-auto">
              <div className="flex items-center gap-1.5 text-sky-300 font-bold text-xs">
                <span>⚡ Subsea Fault</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                Tectonic plates slip deep under the seabed, displacing water upward.
              </p>
              <div className="text-sky-400 text-xs font-bold mt-1">⬇ Seafloor Rupture</div>
            </div>

            {/* 2. Wave Crest & Surge */}
            <div className="absolute top-20 left-1/3 -translate-x-1/2 max-w-[210px] bg-slate-900/90 text-white p-2.5 rounded-xl border border-amber-400 shadow-xl backdrop-blur-sm animate-fade-in pointer-events-auto">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <span>🌊 Tsunami Wave & Crest</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                <strong>Crest:</strong> The highest peak of the moving water surge as it packs energy.
              </p>
              <div className="text-amber-400 text-xs font-bold mt-1">⬇ High Surge Peak</div>
            </div>

            {/* 3. Shoreline */}
            <div className="absolute bottom-24 right-1/4 max-w-[190px] bg-slate-900/90 text-white p-2.5 rounded-xl border border-emerald-400 shadow-xl backdrop-blur-sm animate-fade-in pointer-events-auto">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                <span>🏖️ Shoreline</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                Where deep water transitions to shallow beach, causing water shoaling.
              </p>
              <div className="text-emerald-400 text-xs font-bold mt-1">⬇ Coastal Transition</div>
            </div>

            {/* 4. Flooded Area (Inundation) */}
            <div className="absolute top-16 right-6 max-w-[190px] bg-slate-900/90 text-white p-2.5 rounded-xl border border-rose-400 shadow-xl backdrop-blur-sm animate-fade-in pointer-events-auto">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                <span>🏘️ Flooded Area</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                <strong>Inundation Zone:</strong> Coastal streets and buildings flooded by the surge.
              </p>
              <div className="text-rose-400 text-xs font-bold mt-1">⬇ Inundated City</div>
            </div>
          </div>
        )}

        {/* 4. INTERACTIVE 3D HINT BANNER */}
        <div className="absolute bottom-3 right-3 text-[10px] font-medium text-slate-300/80 bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-lg pointer-events-none">
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* TIMELINE & SIMULATION CONTROLS DECK */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sky-200 shadow-xs space-y-3.5">
        
        {/* Scrubber Timeline Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-900">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Tsunami Timeline Scrubber
            </span>
            <span className="font-mono text-sky-700 font-black">
              {Math.round(progress * 100)}% ({currentStage.name})
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progress}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              progressRef.current = val;
              setProgress(val);
              setCurrentStage(getStageFromProgress(val));
            }}
            className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          {/* 7 Stage labels below scrubber */}
          <div className="grid grid-cols-7 gap-1 text-center pt-1">
            {TSUNAMI_STAGES.map((s, idx) => (
              <button
                key={s.stage}
                onClick={() => jumpToStage(idx)}
                className={`text-[9px] sm:text-[10px] font-bold p-1 rounded-lg transition-all cursor-pointer truncate ${
                  s.stage === currentStage.stage
                    ? 'bg-sky-100 text-sky-950 font-black border border-sky-300'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {s.stage}. {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons Bar: Play/Pause, Restart, Scientific Terms, Simulation Speed */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs text-xs sm:text-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Play Simulation'}</span>
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Restart</span>
            </button>

            {/* Scientific Terms Button */}
            <button
              onClick={() => setShowScientificTerms(!showScientificTerms)}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                showScientificTerms
                  ? 'bg-sky-100 border-sky-400 text-sky-950 shadow-xs'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Tag className="w-4 h-4 text-sky-600" />
              <span>{showScientificTerms ? 'Hide Terms' : 'Scientific Terms'}</span>
            </button>
          </div>

          {/* Simulation Speed Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 px-1.5">Speed:</span>
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
