import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Tag
} from 'lucide-react';

export interface QuakeStageData {
  stage: number;
  name: string;
  title: string;
  desc: string;
  timeRange: [number, number]; // normalized 0 to 1
}

export const QUAKE_STAGES: QuakeStageData[] = [
  {
    stage: 1,
    name: 'Plate Motion',
    title: 'Tectonic Plates Slowly Move Against Each Other',
    desc: 'Deep in the Earth, massive tectonic plates grind past each other very slowly, carried by thermal currents deep in Earth\'s mantle.',
    timeRange: [0.0, 0.14]
  },
  {
    stage: 2,
    name: 'Stress Buildup',
    title: 'Stress Builds Up in Rocks Along a Fault',
    desc: 'Friction locks the rock edges together along a fault line, preventing smooth motion. Tremendous elastic strain and mechanical stress accumulate.',
    timeRange: [0.14, 0.28]
  },
  {
    stage: 3,
    name: 'Fault Rupture',
    title: 'Rocks Suddenly Break or Slip',
    desc: 'When the built-up stress exceeds the strength of the rock, the locked fault suddenly breaks and snaps, slipping violently.',
    timeRange: [0.28, 0.43]
  },
  {
    stage: 4,
    name: 'Energy Release',
    title: 'Energy is Released from the Focus (Hypocenter)',
    desc: 'Centuries of trapped elastic energy explode outward from the subterranean focus (hypocenter), the precise underground origin point of the rupture.',
    timeRange: [0.43, 0.58]
  },
  {
    stage: 5,
    name: 'Seismic Waves',
    title: 'Seismic Waves Travel Through the Earth',
    desc: 'Compressional Primary (P) waves and shearing Secondary (S) waves race rapidly through the Earth\'s crust, carrying energy upward.',
    timeRange: [0.58, 0.72]
  },
  {
    stage: 6,
    name: 'Ground Shaking',
    title: 'The Ground Shakes and Damage May Occur',
    desc: 'Seismic waves strike the surface epicenter! Strong rolling surface waves violently shake buildings, open ground cracks, and rattle terrain.',
    timeRange: [0.72, 0.86]
  },
  {
    stage: 7,
    name: 'Aftershocks',
    title: 'Aftershocks May Occur as the Crust Adjusts',
    desc: 'Smaller secondary tremors (aftershocks) rumble intermittently for hours or days as the disturbed Earth\'s crust readjusts and settles along the fault.',
    timeRange: [0.86, 1.0]
  }
];

function getQuakeStage(progress: number): QuakeStageData {
  const p = Math.min(Math.max(progress, 0), 0.999);
  for (const s of QUAKE_STAGES) {
    if (p >= s.timeRange[0] && p < s.timeRange[1]) {
      return s;
    }
  }
  return QUAKE_STAGES[QUAKE_STAGES.length - 1];
}

export const Earthquake3DSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [progress, setProgress] = useState<number>(0);
  const [quakeStrength, setQuakeStrength] = useState<number>(7.2);
  const [showScientificTerms, setShowScientificTerms] = useState<boolean>(false);

  // Animation & Control Refs
  const progressRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const simSpeedRef = useRef<number>(1.0);
  const strengthRef = useRef<number>(7.2);
  const reqIdRef = useRef<number>(0);

  // Dynamic 3D Objects refs
  const fissuresGroupRef = useRef<THREE.Group | null>(null);
  const bouldersGroupRef = useRef<THREE.Group | null>(null);
  const epicenterMarkerRef = useRef<THREE.Group | null>(null);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    strengthRef.current = quakeStrength;
  }, [quakeStrength]);

  const currentStage = getQuakeStage(progress);
  const pgaValue = (Math.pow(10, (quakeStrength - 5.0) * 0.42) * 0.06).toFixed(2);

  // Jump to specific stage without moving the fixed camera
  const jumpToStage = useCallback((stageIndex: number) => {
    const s = QUAKE_STAGES[stageIndex];
    if (!s) return;
    const midTime = (s.timeRange[0] + s.timeRange[1]) / 2;
    progressRef.current = midTime;
    setProgress(midTime);
  }, []);

  const handleRestart = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setIsPlaying(true);
  }, []);

  // Main Three.js Scene Setup (FIXED 3D CAMERA, NO ORBIT CONTROLS)
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
    scene.background = new THREE.Color(0xbbe5fd); // Light pastel blue sky
    scene.fog = new THREE.FogExp2(0xbbe5fd, 0.012);

    // 2. Camera: Fixed 3D presentation (NO OrbitControls, NO camera movement)
    // Shifted slightly so underground fault on left-center and village are perfectly framed
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(-2, 14, 32);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Lighting Rig
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(25, 45, 30);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x334155, 1.1);
    scene.add(hemiLight);

    // 4. Procedural Landscape, Mountain, Beach & Coastline (Continuous Natural Surface)
    const landscapeGroup = new THREE.Group();
    scene.add(landscapeGroup);

    // Procedural Natural Grass Texture so horizontal & rolling ground motion is unmistakably clear
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 256;
    grassCanvas.height = 256;
    const gCtx = grassCanvas.getContext('2d')!;
    gCtx.fillStyle = '#86efac';
    gCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) {
      const gx = Math.random() * 256;
      const gy = Math.random() * 256;
      const tone = Math.random();
      gCtx.fillStyle = tone < 0.35 ? 'rgba(74, 222, 128, 0.45)' : tone < 0.7 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(187, 247, 208, 0.35)';
      gCtx.fillRect(gx, gy, 3 + Math.random() * 4, 2 + Math.random() * 3);
    }
    const grassTex = new THREE.CanvasTexture(grassCanvas);
    grassTex.colorSpace = THREE.SRGBColorSpace;
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(12, 8);
    grassTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Continuous Coastal Grass Surface (high-resolution grid for physical ground heave & shaking)
    const groundGeo = new THREE.PlaneGeometry(104, 72, 64, 48);
    const groundPosAttr = groundGeo.attributes.position as THREE.BufferAttribute;
    const groundBasePos = new Float32Array(groundPosAttr.array);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0.04
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, 0);
    ground.receiveShadow = !isSoftwareGl;
    landscapeGroup.add(ground);

    // Mountain Hillside on West flank
    const hillGeo = new THREE.ConeGeometry(14, 11, 24, 8);
    const hillMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.92,
      flatShading: true
    });
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.set(-22, 5.4, -4);
    hill.scale.set(1.4, 1, 1.2);
    hill.castShadow = !isSoftwareGl;
    hill.receiveShadow = !isSoftwareGl;
    landscapeGroup.add(hill);

    // Sandy Shoreline band (offset slightly above ground to prevent coplanar Z-fighting)
    const beachGeo = new THREE.PlaneGeometry(16, 72, 16, 16);
    const beachMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.9,
      metalness: 0.02
    });
    const beach = new THREE.Mesh(beachGeo, beachMat);
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(25, 0.03, 0);
    landscapeGroup.add(beach);

    // Ocean Water Plane
    const oceanGeo = new THREE.PlaneGeometry(46, 72, 24, 24);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(49, 0.06, 0);
    landscapeGroup.add(ocean);

    // Tectonic Plate Directional Motion Indicators (clean flat arrows on ground showing plate shear direction)
    const platesGroup = new THREE.Group();
    landscapeGroup.add(platesGroup);

    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(-0.45, -1.8);
    arrowShape.lineTo(0.45, -1.8);
    arrowShape.lineTo(0.45, 0.6);
    arrowShape.lineTo(1.05, 0.6);
    arrowShape.lineTo(0, 2.2);
    arrowShape.lineTo(-1.05, 0.6);
    arrowShape.lineTo(-0.45, 0.6);
    arrowShape.closePath();

    const plateArrowGeo = new THREE.ExtrudeGeometry(arrowShape, {
      depth: 0.08,
      bevelEnabled: false
    });
    plateArrowGeo.rotateX(Math.PI / 2);

    const plateArrowMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.45,
      metalness: 0.15
    });

    // Plate A Arrow (West plate moving North/+Z)
    const plate1Arrow = new THREE.Mesh(plateArrowGeo, plateArrowMat);
    plate1Arrow.position.set(-12, 0.1, 2);
    platesGroup.add(plate1Arrow);

    // Plate B Arrow (East plate moving South/-Z)
    const plate2Arrow = new THREE.Mesh(plateArrowGeo, plateArrowMat);
    plate2Arrow.rotation.y = Math.PI;
    plate2Arrow.position.set(2, 0.1, -2);
    platesGroup.add(plate2Arrow);

    // 3D SEISMOGRAPH STATION WITH RECORDING DRUM
    const seismographGroup = new THREE.Group();
    seismographGroup.position.set(16, 0.05, -3);
    landscapeGroup.add(seismographGroup);

    const seismoBaseGeo = new THREE.BoxGeometry(3.6, 0.35, 2.6);
    const seismoBaseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const seismoBase = new THREE.Mesh(seismoBaseGeo, seismoBaseMat);
    seismoBase.position.y = 0.175;
    seismographGroup.add(seismoBase);

    // Drum texture with seismogram waveform
    const drumCanvas = document.createElement('canvas');
    drumCanvas.width = 256;
    drumCanvas.height = 128;
    const dCtx = drumCanvas.getContext('2d')!;
    dCtx.fillStyle = '#ffffff';
    dCtx.fillRect(0, 0, 256, 128);
    dCtx.strokeStyle = '#cbd5e1';
    dCtx.lineWidth = 1;
    for (let x = 0; x < 256; x += 16) {
      dCtx.beginPath(); dCtx.moveTo(x, 0); dCtx.lineTo(x, 128); dCtx.stroke();
    }
    for (let y = 0; y < 128; y += 16) {
      dCtx.beginPath(); dCtx.moveTo(0, y); dCtx.lineTo(256, y); dCtx.stroke();
    }
    dCtx.strokeStyle = '#dc2626';
    dCtx.lineWidth = 2.5;
    dCtx.beginPath();
    dCtx.moveTo(0, 64);
    for (let x = 0; x < 256; x += 4) {
      const isBurst = x > 70 && x < 190;
      const amp = isBurst ? Math.sin(x * 0.45) * 38 * Math.sin(x * 0.12) : (Math.random() - 0.5) * 4;
      dCtx.lineTo(x, 64 + amp);
    }
    dCtx.stroke();
    const drumTex = new THREE.CanvasTexture(drumCanvas);

    // Cylindrical Recording Drum
    const drumGeo = new THREE.CylinderGeometry(0.52, 0.52, 1.6, 24);
    const drumMat = new THREE.MeshStandardMaterial({ map: drumTex, roughness: 0.5 });
    const recordingDrum = new THREE.Mesh(drumGeo, drumMat);
    recordingDrum.rotation.z = Math.PI / 2;
    recordingDrum.position.set(0, 0.95, -0.2);
    seismographGroup.add(recordingDrum);

    // Frame supports
    const supportGeo = new THREE.BoxGeometry(0.12, 1.0, 0.12);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
    const supL = new THREE.Mesh(supportGeo, metalMat);
    supL.position.set(-0.9, 0.65, -0.2);
    seismographGroup.add(supL);
    const supR = new THREE.Mesh(supportGeo, metalMat);
    supR.position.set(0.9, 0.65, -0.2);
    seismographGroup.add(supR);

    // Suspended pendulum mass & stylus
    const pendulumGroup = new THREE.Group();
    pendulumGroup.position.set(0, 1.4, 0.4);
    seismographGroup.add(pendulumGroup);

    const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6);
    const wireMesh = new THREE.Mesh(wireGeo, metalMat);
    wireMesh.position.y = -0.32;
    pendulumGroup.add(wireMesh);

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
    const weightGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const weightMesh = new THREE.Mesh(weightGeo, brassMat);
    weightMesh.position.y = -0.65;
    pendulumGroup.add(weightMesh);

    const stylusGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6);
    const stylusMesh = new THREE.Mesh(stylusGeo, metalMat);
    stylusMesh.rotation.x = Math.PI / 2;
    stylusMesh.position.set(0, -0.65, -0.32);
    pendulumGroup.add(stylusMesh);

    // Surface Epicenter Marker Pin (solid 3D marker, no expanding wave rings)
    const epicGroup = new THREE.Group();
    epicGroup.position.set(-6, 0.06, 0);
    landscapeGroup.add(epicGroup);
    epicenterMarkerRef.current = epicGroup;

    const epicPadGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.1, 16);
    const epicPadMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.4 });
    const epicPad = new THREE.Mesh(epicPadGeo, epicPadMat);
    epicPad.position.y = 0.05;
    epicGroup.add(epicPad);

    const epicPostGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8);
    const epicPostMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.4, roughness: 0.3 });
    const epicPost = new THREE.Mesh(epicPostGeo, epicPostMat);
    epicPost.position.y = 0.6;
    epicGroup.add(epicPost);

    const epicOrbGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const epicOrbMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 1.2,
      roughness: 0.2
    });
    const epicOrb = new THREE.Mesh(epicOrbGeo, epicOrbMat);
    epicOrb.position.y = 1.2;
    epicGroup.add(epicOrb);

    // 7. VILLAGE HOUSES, TREES & ROAD
    const villageGroup = new THREE.Group();
    landscapeGroup.add(villageGroup);

    const roadGeo = new THREE.PlaneGeometry(42, 4, 40, 4);
    const roadPosAttr = roadGeo.attributes.position as THREE.BufferAttribute;
    const roadBasePos = new Float32Array(roadPosAttr.array);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(-4, 0.05, 3);
    villageGroup.add(road);

    const dashGeo = new THREE.PlaneGeometry(2.5, 0.25);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const roadDashes: { mesh: THREE.Mesh; baseX: number }[] = [];
    for (let r = -22; r <= 14; r += 5) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(r, 0.065, 3);
      villageGroup.add(dash);
      roadDashes.push({ mesh: dash, baseX: r });
    }

    interface HouseObject {
      group: THREE.Group;
      chimney: THREE.Mesh;
      baseX: number;
      baseZ: number;
      baseRotY: number;
    }
    const houses: HouseObject[] = [];

    const createVillageHouse = (x: number, z: number, rotation: number) => {
      const house = new THREE.Group();
      house.position.set(x, 0, z);
      house.rotation.y = rotation;

      const wallGeo = new THREE.BoxGeometry(2.6, 2.0, 2.2);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
      const walls = new THREE.Mesh(wallGeo, wallMat);
      walls.position.y = 1.0;
      walls.castShadow = !isSoftwareGl;
      walls.receiveShadow = !isSoftwareGl;
      house.add(walls);

      // Door & windows so structural tilt & shaking are vividly readable
      const doorGeo = new THREE.BoxGeometry(0.55, 0.95, 0.08);
      const doorMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, 0.48, 1.11);
      house.add(door);

      const winGeo = new THREE.BoxGeometry(0.45, 0.45, 0.08);
      const winMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.2 });
      const winL = new THREE.Mesh(winGeo, winMat);
      winL.position.set(-0.75, 1.15, 1.11);
      house.add(winL);
      const winR = new THREE.Mesh(winGeo, winMat);
      winR.position.set(0.75, 1.15, 1.11);
      house.add(winR);

      const roofGeo = new THREE.ConeGeometry(2.2, 1.3, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 2.65;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.1, 1, 0.95);
      roof.castShadow = !isSoftwareGl;
      house.add(roof);

      const chimGeo = new THREE.BoxGeometry(0.35, 0.9, 0.35);
      const chimMat = new THREE.MeshStandardMaterial({ color: 0x78716c });
      const chimney = new THREE.Mesh(chimGeo, chimMat);
      chimney.position.set(0.7, 2.8, 0.3);
      house.add(chimney);

      villageGroup.add(house);
      houses.push({ group: house, chimney, baseX: x, baseZ: z, baseRotY: rotation });
    };

    createVillageHouse(4, 8, 0.1);
    createVillageHouse(10, 8, -0.15);
    createVillageHouse(7, -3, 0.2);

    interface TreeObject {
      group: THREE.Group;
      baseX: number;
      baseZ: number;
    }
    const treeObjects: TreeObject[] = [];

    const createTree = (x: number, z: number, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      tree.scale.setScalar(scale);

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.75;
      trunk.castShadow = !isSoftwareGl;
      tree.add(trunk);

      const folGeo = new THREE.SphereGeometry(1.0, 10, 8);
      const folMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 });
      const fol = new THREE.Mesh(folGeo, folMat);
      fol.position.y = 2.0;
      fol.castShadow = !isSoftwareGl;
      tree.add(fol);

      villageGroup.add(tree);
      treeObjects.push({ group: tree, baseX: x, baseZ: z });
    };

    [
      [-2, 8], [1, 7], [8, 12], [3, -4], [9, -5], [-8, 6], [-12, -2]
    ].forEach(([tx, tz], i) => {
      createTree(tx, tz, 0.85 + (i % 3) * 0.15);
    });

    // 8. GROUND FISSURES (Surface cracks hugging terrain) & LANDSLIDE BOULDERS
    const fissuresGroup = new THREE.Group();
    fissuresGroup.visible = false;
    landscapeGroup.add(fissuresGroup);
    fissuresGroupRef.current = fissuresGroup;

    const fissMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.98 });
    const crackSegments = [
      { x: -3.2, z: 2.2, len: 3.4, rot: 0.35 },
      { x: -0.4, z: 3.2, len: 3.2, rot: -0.22 },
      { x: 2.2, z: 2.8, len: 2.8, rot: 0.42 },
      { x: 5.2, z: 5.5, len: 2.4, rot: -0.35 }
    ];
    crackSegments.forEach((seg) => {
      const fGeo = new THREE.BoxGeometry(seg.len, 0.05, 0.35);
      const fMesh = new THREE.Mesh(fGeo, fissMat);
      fMesh.position.set(seg.x, 0.075, seg.z);
      fMesh.rotation.y = seg.rot;
      fissuresGroup.add(fMesh);
    });

    const bouldersGroup = new THREE.Group();
    landscapeGroup.add(bouldersGroup);
    bouldersGroupRef.current = bouldersGroup;

    interface Boulder3D {
      mesh: THREE.Mesh;
      active: boolean;
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      rotSpeed: THREE.Vector3;
    }
    const boulderCount = 6;
    const boulders: Boulder3D[] = [];
    const bldGeo = new THREE.DodecahedronGeometry(0.7, 0);
    const bldMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.95 });

    for (let b = 0; b < boulderCount; b++) {
      const bMesh = new THREE.Mesh(bldGeo, bldMat);
      bMesh.visible = false;
      bMesh.castShadow = !isSoftwareGl;
      bouldersGroup.add(bMesh);
      boulders.push({
        mesh: bMesh,
        active: false,
        pos: new THREE.Vector3(-20, 8, -4),
        vel: new THREE.Vector3(0, 0, 0),
        rotSpeed: new THREE.Vector3(0, 0, 0)
      });
    }

    // Helper: Physical surface heave displacement propagating across terrain during quake
    const getSurfaceHeave = (wx: number, wz: number, timeSec: number, rippleAmp: number) => {
      if (rippleAmp <= 0.0005) return 0;
      const coastFade = wx <= 14 ? 1.0 : Math.max(0.0, 1.0 - (wx - 14) / 5.0);
      if (coastFade <= 0.001) return 0;
      const dist = Math.hypot(wx + 6, wz);
      const atten = Math.exp(-dist * 0.025) * coastFade;
      const w1 = Math.sin(dist * 0.65 - timeSec * 14.0);
      const w2 = 0.45 * Math.cos(wx * 0.42 + wz * 0.35 - timeSec * 19.0);
      return (w1 + w2) * atten * rippleAmp;
    };

    // 9. Animation Loop
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isPlayingRef.current) {
        const speed = simSpeedRef.current;
        const deltaProgress = (dt / 35) * speed;
        let nextP = progressRef.current + deltaProgress;
        if (nextP > 1.0) nextP = 1.0;
        progressRef.current = nextP;
        setProgress(nextP);
      }

      const p = progressRef.current;
      const mw = strengthRef.current;
      const timeSec = now * 0.001 * simSpeedRef.current;
      // Nonlinear magnitude scaling: Mw 4.0 is very mild (~0.12), Mw 7.2 is strong (~0.75), Mw 9.0 is severe (~1.45)
      const intensityScale = 0.12 + Math.pow(Math.max(0, (mw - 4.0) / 5.0), 1.35) * 1.35;
      const damageRatio = Math.max(0, (mw - 4.5) / 4.5);

      // Stage-synchronized shaking envelope
      let stageEnv = 0.0;
      if (p < 0.14) {
        // Stage 1: Tectonic plates slowly creeping
        stageEnv = 0.0;
      } else if (p < 0.28) {
        // Stage 2: Faint micro-tremors as stress builds
        stageEnv = 0.06;
      } else if (p < 0.43) {
        // Stage 3: Sudden fault rupture jolt & initial quake onset
        const ruptureSpike = Math.exp(-Math.pow((p - 0.30) / 0.035, 2)) * 0.35;
        stageEnv = 0.34 + ruptureSpike;
      } else if (p < 0.58) {
        // Stage 4: Strong energy release from focus
        stageEnv = 0.65;
      } else if (p < 0.72) {
        // Stage 5: Seismic energy surging through the crust
        stageEnv = 0.85;
      } else if (p < 0.86) {
        // Stage 6: Main earthquake peak ground shaking & damage
        stageEnv = 1.15;
      } else {
        // Stage 7: Gradually settling with two distinct intermittent aftershock bursts
        const decay = Math.max(0, 1 - (p - 0.86) / 0.14) * 0.25;
        const aftershock1 = Math.exp(-Math.pow((p - 0.895) / 0.016, 2)) * 0.52;
        const aftershock2 = Math.exp(-Math.pow((p - 0.945) / 0.015, 2)) * 0.36;
        stageEnv = decay + aftershock1 + aftershock2;
      }

      const activeShake = isPlayingRef.current ? stageEnv * intensityScale : 0;
      const rumbleAmp = activeShake * 0.36;
      const rippleAmp = activeShake * 0.26;

      // Plate motion arrows slowly slide slightly during Stage 1-2 before snapping in Stage 3
      const creep = p < 0.28 ? (p / 0.28) * 0.45 : 0.45 - Math.min(1, (p - 0.28) / 0.1) * 0.25;
      plate1Arrow.position.z = 2 + creep;
      plate2Arrow.position.z = -2 - creep;

      // Shake the ENTIRE terrain group physically (camera remains 100% FIXED and motionless!)
      if (activeShake > 0.001) {
        const rx = (Math.sin(timeSec * 31.0) * 0.55 + Math.cos(timeSec * 53.0) * 0.45) * rumbleAmp;
        const ry = (Math.sin(timeSec * 41.0 + 1.1) * 0.5 + Math.sin(timeSec * 67.0) * 0.35) * rumbleAmp * 0.55;
        const rz = (Math.cos(timeSec * 27.0 + 0.7) * 0.55 + Math.sin(timeSec * 47.0) * 0.45) * rumbleAmp;
        landscapeGroup.position.set(rx, ry, rz);
      } else {
        landscapeGroup.position.set(0, 0, 0);
      }

      // Displace physical ground & road vertices so earth visibly ripples and heaves
      for (let i = 0; i < groundPosAttr.count; i++) {
        const bx = groundBasePos[i * 3];
        const by = groundBasePos[i * 3 + 1]; // becomes -worldZ when rotated -90 deg around X
        const heave = getSurfaceHeave(bx, -by, timeSec, rippleAmp);
        groundPosAttr.setZ(i, groundBasePos[i * 3 + 2] + heave);
      }
      groundPosAttr.needsUpdate = true;
      groundGeo.computeVertexNormals();

      for (let i = 0; i < roadPosAttr.count; i++) {
        const bx = roadBasePos[i * 3] - 4; // road centered at x = -4
        const by = roadBasePos[i * 3 + 1];
        const heave = getSurfaceHeave(bx, 3 - by, timeSec, rippleAmp);
        roadPosAttr.setZ(i, roadBasePos[i * 3 + 2] + heave);
      }
      roadPosAttr.needsUpdate = true;
      roadGeo.computeVertexNormals();

      roadDashes.forEach((d) => {
        const heave = getSurfaceHeave(d.baseX, 3, timeSec, rippleAmp);
        d.mesh.position.y = 0.065 + heave;
      });

      // Epicenter pin rides the ground surface without pulsing wave rings
      if (epicenterMarkerRef.current) {
        const epicHeave = getSurfaceHeave(-6, 0, timeSec, rippleAmp);
        epicenterMarkerRef.current.position.y = 0.06 + epicHeave;
      }

      // Animate Village Houses (Riding ground heave + rocking/tilting + chimney damage on strong quakes)
      houses.forEach((h, idx) => {
        const groundY = getSurfaceHeave(h.baseX, h.baseZ, timeSec, rippleAmp);
        const tiltX = (getSurfaceHeave(h.baseX, h.baseZ + 1, timeSec, rippleAmp) - getSurfaceHeave(h.baseX, h.baseZ - 1, timeSec, rippleAmp)) * 0.25;
        const tiltZ = (getSurfaceHeave(h.baseX - 1, h.baseZ, timeSec, rippleAmp) - getSurfaceHeave(h.baseX + 1, h.baseZ, timeSec, rippleAmp)) * 0.25;

        const sway = activeShake > 0.01 ? Math.sin(timeSec * 23.0 + idx * 2.1) * activeShake * 0.08 : 0;
        const swayX = activeShake > 0.01 ? Math.cos(timeSec * 19.0 + idx * 1.7) * activeShake * 0.06 : 0;

        h.group.position.set(
          h.baseX + Math.sin(timeSec * 29.0 + idx) * rumbleAmp * 0.35,
          groundY,
          h.baseZ + Math.cos(timeSec * 26.0 + idx) * rumbleAmp * 0.35
        );

        const permanentTilt = p >= 0.68 && mw >= 6.0 ? damageRatio * 0.14 * (idx % 2 === 0 ? 1 : -1) : 0;
        h.group.rotation.z = tiltZ + sway + permanentTilt;
        h.group.rotation.x = tiltX + swayX;

        // Chimney topples slightly at severe magnitudes during main shock/aftermath
        if (p >= 0.72 && mw >= 6.8) {
          h.chimney.position.set(0.95, 2.55, 0.35);
          h.chimney.rotation.z = -0.55;
        } else {
          h.chimney.position.set(0.7, 2.8, 0.3);
          h.chimney.rotation.z = 0;
        }
      });

      // Animate Trees whipping naturally with ground shaking
      treeObjects.forEach((t, idx) => {
        const groundY = getSurfaceHeave(t.baseX, t.baseZ, timeSec, rippleAmp);
        t.group.position.y = groundY;
        if (activeShake > 0.01) {
          t.group.rotation.z = Math.sin(timeSec * 17.0 + idx * 1.4) * activeShake * 0.22;
          t.group.rotation.x = Math.cos(timeSec * 15.0 + idx * 0.9) * activeShake * 0.16;
        } else {
          t.group.rotation.z = 0;
          t.group.rotation.x = 0;
        }
      });

      // Animate 3D Seismograph (Riding ground + spinning drum + swinging pendulum proportional to shaking)
      const seismoGroundY = getSurfaceHeave(16, -3, timeSec, rippleAmp);
      seismographGroup.position.y = 0.05 + seismoGroundY;
      if (recordingDrum) {
        recordingDrum.rotation.x += dt * 1.6 * simSpeedRef.current;
      }
      if (pendulumGroup) {
        const seismoShake = activeShake > 0.01 ? Math.sin(timeSec * 36.0) * Math.min(0.42, activeShake * 0.32) : 0;
        pendulumGroup.position.x = seismoShake;
      }

      // Animate Ground Fissures (opening cleanly along ground/road in severe stages)
      if (fissuresGroupRef.current) {
        const showFiss = p >= 0.58 && mw >= 5.5;
        fissuresGroupRef.current.visible = showFiss;
        if (showFiss) {
          const openScale = Math.min(1.0, (p - 0.58) / 0.15) * damageRatio;
          fissuresGroupRef.current.scale.set(1, 1, Math.max(0.25, openScale * 2.2));
          fissuresGroupRef.current.position.y = getSurfaceHeave(0, 3, timeSec, rippleAmp);
        }
      }

      // Animate Landslide Boulders tumbling down hillside during severe shaking
      if (bouldersGroupRef.current) {
        const showLandslides = p >= 0.58 && p < 0.88 && mw >= 6.2;
        boulders.forEach((bld) => {
          if (showLandslides) {
            if (!bld.active && Math.random() < 0.03) {
              bld.active = true;
              bld.mesh.visible = true;
              bld.pos.set(-20 + (Math.random() - 0.5) * 4, 7 + Math.random() * 3, -4 + (Math.random() - 0.5) * 3);
              bld.vel.set(2 + Math.random() * 3, -1, 1 + (Math.random() - 0.5) * 2);
              bld.rotSpeed.set(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2);
            }

            if (bld.active) {
              bld.pos.x += bld.vel.x * dt * 4;
              bld.pos.y += bld.vel.y * dt * 4;
              bld.pos.z += bld.vel.z * dt * 4;
              bld.vel.y -= 9.8 * dt;

              bld.mesh.position.copy(bld.pos);
              bld.mesh.rotation.x += bld.rotSpeed.x;
              bld.mesh.rotation.y += bld.rotSpeed.y;

              if (bld.pos.y <= 0.3) {
                bld.active = false;
                bld.mesh.visible = false;
              }
            }
          } else {
            bld.mesh.visible = false;
            bld.active = false;
          }
        });
      }

      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(tick);
    };

    reqIdRef.current = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Fixed 3D Presentation Viewport */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner select-none bg-slate-950">
        <div ref={mountRef} className="w-full h-full block" />

        {/* 1. EDUCATIONAL PANEL: MOVED TO THE RIGHT SIDE OF THE SCREEN (Matching Volcano panel styling) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 max-w-[270px] sm:max-w-[320px] bg-slate-950/85 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/20 shadow-xl pointer-events-auto z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                Stage {currentStage.stage} of 7: SEISMIC EVENT
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700/50">
                Mw {quakeStrength.toFixed(1)}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              {currentStage.title}
            </h4>

            <p className="text-[11px] text-slate-300 leading-snug">
              {currentStage.desc}
            </p>

            <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono text-slate-300 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[9px]">Peak Accel</span>
                <span className="font-bold text-amber-300">{pgaValue} g</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Focus</span>
                <span className="font-bold text-sky-300">12 km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Epicenter</span>
                <span className="font-bold text-emerald-300">12 km</span>
              </div>
            </div>

            {/* 7-Stage Jump Indicators */}
            <div className="pt-1.5 border-t border-white/10 flex items-center gap-1">
              {QUAKE_STAGES.map((stg) => (
                <button
                  key={stg.stage}
                  onClick={() => jumpToStage(stg.stage - 1)}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                    stg.stage === currentStage.stage
                      ? 'bg-purple-400 ring-2 ring-purple-300 shadow-sm'
                      : stg.stage < currentStage.stage
                      ? 'bg-purple-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Stage ${stg.stage}: ${stg.name}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. SCIENTIFIC TERMS GRAPHIC: VISIBLE ARROWS & LABELS POINTING TO STRUCTURES */}
        {showScientificTerms && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* SVG Connecting Arrows */}
            <svg className="w-full h-full absolute inset-0">
              <defs>
                <marker
                  id="quake-arrow-purple"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#A855F7" />
                </marker>
                <marker
                  id="quake-arrow-red"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
                </marker>
                <marker
                  id="quake-arrow-amber"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
                </marker>
                <marker
                  id="quake-arrow-sky"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
                </marker>
                <marker
                  id="quake-arrow-green"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#22C55E" />
                </marker>
                <marker
                  id="quake-arrow-blue"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#3B82F6" />
                </marker>
                <marker
                  id="quake-arrow-rose"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#F43F5E" />
                </marker>
              </defs>

              {/* Arrow to Epicenter Target */}
              <line
                x1="26%"
                y1="32%"
                x2="38%"
                y2="41%"
                stroke="#A855F7"
                strokeWidth="2.5"
                markerEnd="url(#quake-arrow-purple)"
              />

              {/* Arrow to Underground Focus (Hypocenter) */}
              <line
                x1="24%"
                y1="78%"
                x2="38%"
                y2="78%"
                stroke="#EF4444"
                strokeWidth="2.5"
                markerEnd="url(#quake-arrow-red)"
              />

              {/* Arrow to Fault Line */}
              <line
                x1="24%"
                y1="56%"
                x2="36%"
                y2="60%"
                stroke="#F59E0B"
                strokeWidth="2.5"
                markerEnd="url(#quake-arrow-amber)"
              />

              {/* Arrow to Tectonic Plates */}
              <line
                x1="18%"
                y1="44%"
                x2="28%"
                y2="46%"
                stroke="#3B82F6"
                strokeWidth="2"
                markerEnd="url(#quake-arrow-blue)"
              />

              {/* Arrow to Earth's Crust */}
              <line
                x1="15%"
                y1="67%"
                x2="24%"
                y2="68%"
                stroke="#F59E0B"
                strokeWidth="2"
                markerEnd="url(#quake-arrow-amber)"
              />

              {/* Arrow to Seismic Waves (pointing to shaking ground surface energy) */}
              <line
                x1="48%"
                y1="62%"
                x2="40%"
                y2="47%"
                stroke="#38BDF8"
                strokeWidth="2"
                markerEnd="url(#quake-arrow-sky)"
              />

              {/* Arrow to Earth's Ground Surface */}
              <line
                x1="20%"
                y1="14%"
                x2="48%"
                y2="40%"
                stroke="#22C55E"
                strokeWidth="2"
                markerEnd="url(#quake-arrow-green)"
              />

              {/* Arrow to 3D Seismograph */}
              <line
                x1="52%"
                y1="25%"
                x2="64%"
                y2="34%"
                stroke="#F43F5E"
                strokeWidth="2"
                markerEnd="url(#quake-arrow-rose)"
              />

              {/* Aftershocks arrow in Stage 7 */}
              {currentStage.stage === 7 && (
                <line
                  x1="50%"
                  y1="52%"
                  x2="42%"
                  y2="46%"
                  stroke="#A855F7"
                  strokeWidth="2"
                  markerEnd="url(#quake-arrow-purple)"
                />
              )}
            </svg>

            {/* Term 1: Epicenter */}
            <div className="absolute top-[28%] left-[6%] sm:left-[9%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-purple-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-purple-300">Epicenter</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">The spot on Earth's surface directly above underground focus</div>
              </div>
            </div>

            {/* Term 2: Focus (hypocenter) */}
            <div className="absolute top-[75%] left-[2%] sm:left-[5%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-red-500 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-red-300">Focus (hypocenter)</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">The exact underground point where rocks break & snap</div>
              </div>
            </div>

            {/* Term 3: Fault line */}
            <div className="absolute top-[52%] left-[3%] sm:left-[6%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-amber-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-amber-300">Fault line</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">A deep fracture where blocks of Earth slip past each other</div>
              </div>
            </div>

            {/* Term 4: Tectonic plates */}
            <div className="absolute top-[40%] left-[2%] sm:left-[4%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-blue-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-blue-300">Tectonic plates</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">Massive drifting puzzle pieces of Earth's outer shell</div>
              </div>
            </div>

            {/* Term 5: Earth's crust */}
            <div className="absolute top-[64%] left-[2%] sm:left-[4%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-amber-500 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-amber-200">Earth's crust</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">Solid rocky outer layer of our planet that we stand on</div>
              </div>
            </div>

            {/* Term 6: Seismic waves */}
            <div className="absolute top-[60%] left-[48%] sm:left-[47%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-sky-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-sky-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-sky-200">Seismic waves</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">Ripples of energy carrying vibrations through rock</div>
              </div>
            </div>

            {/* Term 7: Ground surface */}
            <div className="absolute top-[10%] left-[4%] sm:left-[7%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-emerald-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-emerald-200">Ground surface</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">The visible landscape with towns, roads & trees</div>
              </div>
            </div>

            {/* Term 8: Seismograph */}
            <div className="absolute top-[21%] left-[46%] sm:left-[50%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-rose-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-rose-300">Seismograph</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">Scientific instrument that measures ground shaking</div>
              </div>
            </div>

            {/* Term 9: Aftershocks (in stage 7) */}
            {currentStage.stage === 7 && (
              <div className="absolute top-[48%] left-[50%] sm:left-[52%] bg-purple-950/95 text-white px-2.5 py-1.5 rounded-xl border border-purple-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 animate-pulse max-w-[210px]">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-purple-200">Aftershocks</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Smaller tremors as broken crust settles into place</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TIMELINE & SIMULATION CONTROLS DECK (MATCHING VOLCANO DESIGN) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-200 shadow-xs space-y-3.5">
        
        {/* Scrubber Timeline Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-900">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              Earthquake Timeline Scrubber
            </span>
            <span className="font-mono text-purple-700 font-black">
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
            }}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          {/* 7 Stage markers */}
          <div className="grid grid-cols-7 gap-1 text-center pt-1">
            {QUAKE_STAGES.map((s, idx) => (
              <button
                key={s.stage}
                onClick={() => jumpToStage(idx)}
                className={`text-[9px] sm:text-[10px] font-bold p-1 rounded-lg transition-all cursor-pointer truncate ${
                  s.stage === currentStage.stage
                    ? 'bg-purple-100 text-purple-950 font-black border border-purple-400'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {s.stage}. {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Magnitude Slider & Quick Summary */}
        <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-black text-purple-950">Moment Magnitude (Mw):</span>
            <span className="font-mono text-xs font-black text-purple-700 bg-white px-2 py-0.5 rounded-lg border border-purple-300">
              Mw {quakeStrength.toFixed(1)}
            </span>
          </div>

          <div className="flex-1 min-w-[200px] max-w-sm">
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.1"
              value={quakeStrength}
              onChange={(e) => setQuakeStrength(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-purple-200 rounded-lg"
            />
          </div>

          <span className="text-[11px] font-bold text-purple-800">
            {quakeStrength < 5.0 ? 'Minor wobble' : quakeStrength < 6.5 ? 'Moderate cracks' : 'Severe destruction & landslides'}
          </span>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs text-xs sm:text-sm"
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
                  ? 'bg-purple-100 border-purple-400 text-purple-950 shadow-xs'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Tag className="w-4 h-4 text-purple-600" />
              <span>{showScientificTerms ? 'Hide Terms' : 'Scientific Terms'}</span>
            </button>
          </div>

          {/* Speed Multipliers */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 px-1.5">Speed:</span>
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
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
