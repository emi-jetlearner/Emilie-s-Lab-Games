import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Zap,
  Flame,
  Tag
} from 'lucide-react';

export type VolcanoMode = 'explosive' | 'effusive';

export interface VolcanoStageData {
  stage: number;
  name: string;
  title: string;
  desc: string;
  temp: string;
  speedOrPlume: string;
  pressure: string;
  timeRange: [number, number]; // normalized 0 to 1
}

export const VOLCANO_STAGES_EXPLOSIVE: VolcanoStageData[] = [
  {
    stage: 1,
    name: 'Magma Chamber',
    title: 'Deep underground, magma collects in a large magma chamber.',
    desc: 'Deep underground, melted rock (magma) gathers in a giant underground reservoir called the magma chamber.',
    temp: '900 °C',
    speedOrPlume: 'Rising magma',
    pressure: 'Increasing (65 MPa)',
    timeRange: [0.0, 0.14]
  },
  {
    stage: 2,
    name: 'Magma Ascent',
    title: 'Magma begins to rise through the main vent (conduit), moving upward toward the surface.',
    desc: 'Molten magma begins ascending upwards through the volcano\'s central pipe, called the main vent or conduit.',
    temp: '960 °C',
    speedOrPlume: 'Ascending magma',
    pressure: 'Rising (95 MPa)',
    timeRange: [0.14, 0.28]
  },
  {
    stage: 3,
    name: 'Pressure Buildup',
    title: 'Pressure builds inside the volcano as gases expand in the rising magma.',
    desc: 'As magma climbs higher toward the surface, trapped gas bubbles rapidly expand, building intense pressure under the summit crater.',
    temp: '1030 °C',
    speedOrPlume: 'Expanding bubbles',
    pressure: 'Critical (145 MPa)',
    timeRange: [0.28, 0.43]
  },
  {
    stage: 4,
    name: 'Violent Eruption',
    title: 'The volcano erupts violently, releasing ash, rocks, and gases.',
    desc: 'The summit blasts open with enormous explosive power! Volcanic ash, volcanic gases, and hot rocks violently shoot into the sky.',
    temp: '1120 °C',
    speedOrPlume: 'Explosive blast',
    pressure: 'Violent release',
    timeRange: [0.43, 0.58]
  },
  {
    stage: 5,
    name: 'Volcanic Bombs',
    title: 'Volcanic bombs (hot rocks) are thrown high into the air and land across the mountain slopes.',
    desc: 'Hot glowing chunks of molten rock, called volcanic bombs, are hurled high into the air and crash down across the mountain slopes.',
    temp: '880 °C',
    speedOrPlume: 'Hurled rocks',
    pressure: 'Sustained venting',
    timeRange: [0.58, 0.72]
  },
  {
    stage: 6,
    name: 'Ash & Pyroclastic',
    title: 'A massive ash cloud forms in the sky, and fast-moving pyroclastic flows surge down the volcano\'s sides.',
    desc: 'A colossal dark ash cloud looms in the sky, while scorching hurricane-fast pyroclastic flows sweep down the volcano slopes.',
    temp: '720 °C',
    speedOrPlume: '180 km/h surge',
    pressure: 'Surge phase',
    timeRange: [0.72, 0.86]
  },
  {
    stage: 7,
    name: 'Ash Settles',
    title: 'Ash falls like gray snow over the land, while the volcano continues to smoke and cool down.',
    desc: 'Volcanic ash gently carpets the land like gray snow, while the volcano continues to smoke, cool down, and settle.',
    temp: '240 °C',
    speedOrPlume: 'Settling fallout',
    pressure: 'Normalizing',
    timeRange: [0.86, 1.0]
  }
];

export const VOLCANO_STAGES_EFFUSIVE: VolcanoStageData[] = [
  {
    stage: 1,
    name: 'Magma Chamber',
    title: 'Magma collects in the magma chamber deep beneath the volcano.',
    desc: 'Runny basaltic magma gathers peacefully inside the deep underground magma chamber beneath the volcano.',
    temp: '1120 °C',
    speedOrPlume: 'Conduit rise',
    pressure: 'Gentle (20 MPa)',
    timeRange: [0.0, 0.14]
  },
  {
    stage: 2,
    name: 'Vent Ascent',
    title: 'Magma rises through the main vent and side vents without explosive pressure.',
    desc: 'Fluid magma flows smoothly upward through both the main central vent and side vents without building explosive pressure.',
    temp: '1150 °C',
    speedOrPlume: 'Gentle venting',
    pressure: 'Venting (15 MPa)',
    timeRange: [0.14, 0.28]
  },
  {
    stage: 3,
    name: 'Crater Overflow',
    title: 'Lava gently overflows the crater and begins moving down the mountain.',
    desc: 'Glowing red molten lava reaches the summit crater and begins spilling gently over the rocky rim down the mountainside.',
    temp: '1180 °C',
    speedOrPlume: 'Crater overflow',
    pressure: 'Active vent',
    timeRange: [0.28, 0.43]
  },
  {
    stage: 4,
    name: 'Lava Rivers',
    title: 'Rivers of glowing red-orange lava stream down the volcano\'s slopes.',
    desc: 'Bright glowing rivers of red-orange molten rock stream steadily down the outer slopes of the volcanic cone.',
    temp: '1160 °C',
    speedOrPlume: '1.2 km/h flow',
    pressure: 'Continuous stream',
    timeRange: [0.43, 0.58]
  },
  {
    stage: 5,
    name: 'Lava Advances',
    title: 'Lava flows advance across the terrain, burning trees and slowly spreading.',
    desc: 'The thick molten lava pushes across the landscape, slowly consuming trees and spreading out across the lower ground.',
    temp: '1060 °C',
    speedOrPlume: '2.8 km/h spread',
    pressure: 'Steady feed',
    timeRange: [0.58, 0.72]
  },
  {
    stage: 6,
    name: 'Cooling Basalt',
    title: 'Lava reaches cooler areas, turning darker as it begins to solidify into dark basalt rock.',
    desc: 'As the molten rock touches cooler air and ground, its outer crust darkens and hardens into solid dark basalt rock.',
    temp: '680 °C',
    speedOrPlume: 'Hardening crust',
    pressure: 'Subsiding',
    timeRange: [0.72, 0.86]
  },
  {
    stage: 7,
    name: 'Solid Rock Land',
    title: 'Lava flows cool into solid dark volcanic rock, creating new land while gentle steam rises from vents.',
    desc: 'The cooled lava flows turn into new solid volcanic land, while gentle white steam and volcanic gases rise from vents.',
    temp: '320 °C',
    speedOrPlume: 'New basalt rock',
    pressure: 'Quiescent',
    timeRange: [0.86, 1.0]
  }
];

function getStage(progress: number, mode: VolcanoMode): VolcanoStageData {
  const p = Math.min(Math.max(progress, 0), 0.999);
  const stages = mode === 'explosive' ? VOLCANO_STAGES_EXPLOSIVE : VOLCANO_STAGES_EFFUSIVE;
  for (const s of stages) {
    if (p >= s.timeRange[0] && p < s.timeRange[1]) {
      return s;
    }
  }
  return stages[stages.length - 1];
}

export const Volcano3DSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [progress, setProgress] = useState<number>(0);
  const [volcanoMode, setVolcanoMode] = useState<VolcanoMode>('explosive');
  const [showUnderSurface, setShowUnderSurface] = useState<boolean>(false);
  const [showScientificTerms, setShowScientificTerms] = useState<boolean>(false);

  // Animation & Control Refs
  const progressRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const simSpeedRef = useRef<number>(1.0);
  const modeRef = useRef<VolcanoMode>('explosive');
  const reqIdRef = useRef<number>(0);

  // Dynamic 3D Objects refs
  const volcanoGroupRef = useRef<THREE.Group | null>(null);
  const underSurfaceGroupRef = useRef<THREE.Group | null>(null);
  const ashParticlesRef = useRef<THREE.Points | null>(null);
  const volcanicBombsGroupRef = useRef<THREE.Group | null>(null);
  const lightningLinesRef = useRef<THREE.LineSegments | null>(null);
  const lavaStreamsGroupRef = useRef<THREE.Group | null>(null);
  const pyroclasticGroupRef = useRef<THREE.Group | null>(null);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    modeRef.current = volcanoMode;
  }, [volcanoMode]);

  // Under the Surface visibility (strictly independent from scientific terms)
  useEffect(() => {
    if (underSurfaceGroupRef.current) {
      underSurfaceGroupRef.current.visible = showUnderSurface;
    }
    if (volcanoGroupRef.current) {
      const cutawayMat = volcanoGroupRef.current.userData.cutawayMaterial as THREE.Material | undefined;
      if (cutawayMat) {
        cutawayMat.opacity = showUnderSurface ? 0.35 : 1.0;
        cutawayMat.transparent = showUnderSurface;
      }
    }
  }, [showUnderSurface]);

  const currentStage = getStage(progress, volcanoMode);

  // Jump to specific stage without moving the fixed camera
  const jumpToStage = useCallback((stageIndex: number) => {
    const stages = modeRef.current === 'explosive' ? VOLCANO_STAGES_EXPLOSIVE : VOLCANO_STAGES_EFFUSIVE;
    const s = stages[stageIndex];
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

    // 1. Scene & Sky Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbbe5fd); // Light pastel blue sky
    scene.fog = new THREE.FogExp2(0xbbe5fd, 0.012);

    // 2. Camera: Fixed 3D presentation (NO OrbitControls, NO camera movement)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(-2, 16, 36);
    camera.lookAt(-1, 3.5, 0);

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
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x334155, 1.1);
    scene.add(hemiLight);

    const craterGlow = new THREE.PointLight(0xff5500, 4.0, 30);
    craterGlow.position.set(-3, 11, 0);
    scene.add(craterGlow);

    // 4. Procedural Landscape, Volcanic Cone & Terrain
    const landscapeGroup = new THREE.Group();
    scene.add(landscapeGroup);

    // Coastal Grass Plain
    const groundGeo = new THREE.PlaneGeometry(80, 60, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x86efac,
      roughness: 0.85,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, 0);
    ground.receiveShadow = !isSoftwareGl;
    landscapeGroup.add(ground);

    // Sandy Shoreline band
    const beachGeo = new THREE.PlaneGeometry(16, 60, 16, 16);
    const beachMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.9,
      metalness: 0.02
    });
    const beach = new THREE.Mesh(beachGeo, beachMat);
    beach.rotation.x = -Math.PI / 2;
    beach.position.set(24, 0.02, 0);
    landscapeGroup.add(beach);

    // Ocean Water Plane
    const oceanGeo = new THREE.PlaneGeometry(40, 60, 24, 24);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(44, 0.05, 0);
    landscapeGroup.add(ocean);

    // Volcanic Mountain Cone (Composite 3D Model with Crater Rim & Summit Lake)
    const volcanoGroup = new THREE.Group();
    landscapeGroup.add(volcanoGroup);
    volcanoGroupRef.current = volcanoGroup;

    // Shift volcano slightly to the left (-3) so the right-side information panel never obscures it!
    const volcanoCenterX = -3;

    // Main Volcanic Cone Slopes
    const coneGeo = new THREE.CylinderGeometry(2.4, 15, 11, 36, 12, true);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: true
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(volcanoCenterX, 5.5, 0);
    coneMesh.castShadow = !isSoftwareGl;
    coneMesh.receiveShadow = !isSoftwareGl;
    volcanoGroup.add(coneMesh);
    volcanoGroup.userData.cutawayMaterial = coneMat;

    // Crater Caldera Rim
    const rimGeo = new THREE.TorusGeometry(2.4, 0.45, 12, 32);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.95
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.set(volcanoCenterX, 11, 0);
    volcanoGroup.add(rimMesh);

    // Glowing Lava Lake in Crater (animated molten surface)
    const lavaUniforms = {
      uFlowTime: { value: 0 },
      uCoolAmount: { value: 0 }
    };

    const createMoltenLavaMaterial = (isPool = false) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff3300,
        emissiveIntensity: 1.0,
        roughness: 0.45,
        metalness: 0.05
      });
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uFlowTime = lavaUniforms.uFlowTime;
        shader.uniforms.uCoolAmount = lavaUniforms.uCoolAmount;
        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `#include <common>
            varying vec2 vLavaUv;`
          )
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            vLavaUv = uv;`
          );
        shader.fragmentShader = shader.fragmentShader
          .replace(
            '#include <common>',
            `#include <common>
            uniform float uFlowTime;
            uniform float uCoolAmount;
            varying vec2 vLavaUv;`
          )
          .replace(
            '#include <color_fragment>',
            `#include <color_fragment>
            float flowCoord = ${isPool ? 'length(vLavaUv - vec2(0.5)) * 12.0 - uFlowTime * 1.4' : 'vLavaUv.y * 12.0 - uFlowTime * 2.5'};
            float wave1 = sin(flowCoord + sin(vLavaUv.x * 9.0 + uFlowTime * 1.2) * 1.3);
            float wave2 = sin(flowCoord * 2.2 - vLavaUv.x * 11.0 + uFlowTime * 1.8);
            float wave3 = cos(vLavaUv.y * 20.0 - uFlowTime * 3.0 + sin(vLavaUv.x * 15.0));
            float lavaNoise = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * 0.5 + 0.5;
            float edgeDist = ${isPool ? 'clamp(length(vLavaUv - vec2(0.5)) * 2.0, 0.0, 1.0)' : 'abs(vLavaUv.x - 0.5) * 2.0'};
            float crustEdge = smoothstep(0.42 - uCoolAmount * 0.32, 0.98 - uCoolAmount * 0.18, edgeDist + (1.0 - lavaNoise) * 0.34);
            float lavaTemp = clamp((1.0 - crustEdge) * (0.65 + 0.35 * lavaNoise) * (1.0 - uCoolAmount * 0.78), 0.0, 1.0);
            vec3 colCrust = vec3(0.11, 0.09, 0.09);
            vec3 colRed = vec3(0.86, 0.09, 0.01);
            vec3 colOrange = vec3(1.0, 0.42, 0.02);
            vec3 colYellow = vec3(1.0, 0.93, 0.36);
            vec3 lavaCol = mix(colCrust, colRed, smoothstep(0.05, 0.34, lavaTemp));
            lavaCol = mix(lavaCol, colOrange, smoothstep(0.32, 0.68, lavaTemp));
            lavaCol = mix(lavaCol, colYellow, smoothstep(0.66, 0.98, lavaTemp));
            diffuseColor.rgb = lavaCol;`
          )
          .replace(
            '#include <emissivemap_fragment>',
            `#include <emissivemap_fragment>
            float glowPow = pow(lavaTemp, 1.1) * (2.6 - uCoolAmount * 1.85);
            totalEmissiveRadiance = lavaCol * glowPow;`
          );
      };
      return mat;
    };

    const lavaLakeGeo = new THREE.CircleGeometry(2.3, 32);
    const lavaLakeMat = createMoltenLavaMaterial(true);
    const lavaLake = new THREE.Mesh(lavaLakeGeo, lavaLakeMat);
    lavaLake.rotation.x = -Math.PI / 2;
    lavaLake.position.set(volcanoCenterX, 10.6, 0);
    volcanoGroup.add(lavaLake);

    // 5. UNDER THE SURFACE: Magma Chamber, Conduit & Natural Earth Strata Cross-section
    const underSurfaceGroup = new THREE.Group();
    underSurfaceGroup.visible = false;
    scene.add(underSurfaceGroup);
    underSurfaceGroupRef.current = underSurfaceGroup;

    // Natural Earth Strata Cross-section (Warm natural geological layers, NO black block!)
    const strataWidth = 26;
    const strataDepth = 16;
    const strataLayers = [
      { color: 0x8b5a2b, y: -1.3, h: 2.4 }, // Topsoil & volcanic loam
      { color: 0xcd853f, y: -3.6, h: 2.2 }, // Upper sandstone / ash tuff
      { color: 0xd2b48c, y: -5.8, h: 2.2 }, // Clay & siltstone strata
      { color: 0xa0522d, y: -8.0, h: 2.2 }, // Deep crustal rock
      { color: 0x6b4226, y: -10.2, h: 2.2 } // Basement crust
    ];
    strataLayers.forEach((layer) => {
      const bGeo = new THREE.BoxGeometry(strataWidth, layer.h, strataDepth);
      const bMat = new THREE.MeshStandardMaterial({
        color: layer.color,
        roughness: 0.92,
        metalness: 0.04
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(volcanoCenterX, layer.y, 0);
      bMesh.receiveShadow = !isSoftwareGl;
      underSurfaceGroup.add(bMesh);
    });

    // Magma Chamber (Glowing pulsating subterranean cavity)
    const chamberGeo = new THREE.SphereGeometry(4.2, 24, 24);
    const chamberMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xff2200,
      emissiveIntensity: 2.2,
      roughness: 0.3
    });
    const chamberMesh = new THREE.Mesh(chamberGeo, chamberMat);
    chamberMesh.scale.set(1.4, 0.85, 1.2);
    chamberMesh.position.set(volcanoCenterX, -6.5, 0);
    underSurfaceGroup.add(chamberMesh);

    // Glowing Core inside Chamber
    const chamberCoreGeo = new THREE.SphereGeometry(2.4, 16, 16);
    const chamberCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 3.5,
      roughness: 0.1
    });
    const chamberCore = new THREE.Mesh(chamberCoreGeo, chamberCoreMat);
    chamberCore.position.set(volcanoCenterX, -6.5, 0);
    underSurfaceGroup.add(chamberCore);

    // Magma Tube (Vertical Conduit connecting Chamber directly to Crater at y=11)
    const conduitGeo = new THREE.CylinderGeometry(0.95, 1.2, 17.5, 20);
    const conduitMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xf97316,
      emissiveIntensity: 1.8,
      roughness: 0.4,
      transparent: true,
      opacity: 0.82
    });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.position.set(volcanoCenterX, 2.2, 0);
    underSurfaceGroup.add(conduit);

    // Side Vent (Branching conduit reaching eastern slope surface)
    const sideVentStart = new THREE.Vector3(volcanoCenterX + 0.5, 2.2, 0);
    const sideVentEnd = new THREE.Vector3(volcanoCenterX + 8.9, 5.2, 1.5);
    const sideVentDir = new THREE.Vector3().subVectors(sideVentEnd, sideVentStart);
    const sideVentGeo = new THREE.CylinderGeometry(0.46, 0.65, sideVentDir.length(), 16);
    const sideVentMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xf97316,
      emissiveIntensity: 1.8,
      roughness: 0.4
    });
    const sideVent = new THREE.Mesh(sideVentGeo, sideVentMat);
    sideVent.position.copy(sideVentStart).addScaledVector(sideVentDir, 0.5);
    sideVent.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sideVentDir.clone().normalize());
    underSurfaceGroup.add(sideVent);

    // Side vent opening rim on slope
    const sideVentRimGeo = new THREE.TorusGeometry(0.65, 0.18, 10, 20);
    const sideVentRim = new THREE.Mesh(sideVentRimGeo, rimMat);
    sideVentRim.rotation.y = Math.PI / 2;
    sideVentRim.rotation.x = Math.PI / 4;
    sideVentRim.position.copy(sideVentEnd);
    underSurfaceGroup.add(sideVentRim);

    // ANIMATED RISING MAGMA: Molten droplets moving upwards inside conduit
    const magmaBolusCount = 12;
    const bolusesGroup = new THREE.Group();
    underSurfaceGroup.add(bolusesGroup);

    const bolusGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const bolusMat = new THREE.MeshStandardMaterial({
      color: 0xfff08a,
      emissive: 0xff4400,
      emissiveIntensity: 3.5,
      roughness: 0.2
    });
    const bolusMeshes: { mesh: THREE.Mesh; speed: number; y: number }[] = [];
    for (let i = 0; i < magmaBolusCount; i++) {
      const bMesh = new THREE.Mesh(bolusGeo, bolusMat);
      const initY = -6.5 + (i / magmaBolusCount) * 17.5;
      bMesh.position.set(
        volcanoCenterX + (Math.random() - 0.5) * 0.45,
        initY,
        (Math.random() - 0.5) * 0.45
      );
      bolusesGroup.add(bMesh);
      bolusMeshes.push({ mesh: bMesh, speed: 2.2 + Math.random() * 1.5, y: initY });
    }

    // ANIMATED EXPANDING GAS BUBBLES (Explosive Mode):
    // As magma ascends, pressure drops so trapped gas bubbles visibly expand!
    const bubbleCount = 14;
    const bubblesGroup = new THREE.Group();
    underSurfaceGroup.add(bubblesGroup);

    const bubbleGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    const bubbleMeshes: { mesh: THREE.Mesh; speed: number; y: number }[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const bMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      const initY = -6.5 + (i / bubbleCount) * 17.5;
      bMesh.position.set(
        volcanoCenterX + (Math.random() - 0.5) * 0.4,
        initY,
        (Math.random() - 0.5) * 0.4
      );
      bubblesGroup.add(bMesh);
      bubbleMeshes.push({ mesh: bMesh, speed: 1.8 + Math.random() * 1.6, y: initY });
    }

    // 6. 3D VILLAGE & TREES (Coastal foothills)
    const villageGroup = new THREE.Group();
    landscapeGroup.add(villageGroup);

    const createHouse = (x: number, z: number, rotation: number) => {
      const house = new THREE.Group();
      house.position.set(x, 0, z);
      house.rotation.y = rotation;

      const wallGeo = new THREE.BoxGeometry(2.4, 1.8, 2.0);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
      const walls = new THREE.Mesh(wallGeo, wallMat);
      walls.position.y = 0.9;
      walls.castShadow = !isSoftwareGl;
      walls.receiveShadow = !isSoftwareGl;
      house.add(walls);

      const roofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 2.4;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.1, 1, 0.9);
      roof.castShadow = !isSoftwareGl;
      house.add(roof);

      return house;
    };

    villageGroup.add(createHouse(10, 6, 0.2));
    villageGroup.add(createHouse(13, 2, -0.15));
    villageGroup.add(createHouse(12, -6, 0.4));

    const createTree = (x: number, z: number, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      tree.scale.setScalar(scale);

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.4, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.7;
      trunk.castShadow = !isSoftwareGl;
      tree.add(trunk);

      const folGeo = new THREE.SphereGeometry(0.9, 10, 8);
      const folMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 });
      const fol = new THREE.Mesh(folGeo, folMat);
      fol.position.y = 1.8;
      fol.castShadow = !isSoftwareGl;
      tree.add(fol);

      return tree;
    };

    const treePositions = [
      [8.5, 11.5], [10.5, 7], [11.5, 1.5], [10.5, -5], [9, -9],
      [14.5, 8], [16, -2], [5.5, 13.5]
    ];
    const effusiveTreeMats: { mat: THREE.MeshStandardMaterial; distFromRightToe: number }[] = [];
    treePositions.forEach(([tx, tz], i) => {
      const tree = createTree(tx, tz, 0.8 + (i % 3) * 0.2);
      const folMesh = tree.children[1] as THREE.Mesh;
      const folMat = (folMesh.material as THREE.MeshStandardMaterial).clone();
      folMesh.material = folMat;
      const dist = Math.hypot(tx - 6.8, tz - 14.5);
      effusiveTreeMats.push({ mat: folMat, distFromRightToe: dist });
      villageGroup.add(tree);
    });

    // Wooden Pier extending into the ocean
    const pierGroup = new THREE.Group();
    pierGroup.position.set(27, 0.15, 0);
    const plankGeo = new THREE.BoxGeometry(6, 0.2, 1.8);
    const plankMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
    const plank = new THREE.Mesh(plankGeo, plankMat);
    plank.position.set(3, 0, 0);
    pierGroup.add(plank);
    landscapeGroup.add(pierGroup);

    // 7. ERUPTION PARTICLES & DYNAMICS
    const ashCount = isSoftwareGl ? 200 : 500;
    const ashGeo = new THREE.BufferGeometry();
    const ashPos = new Float32Array(ashCount * 3);
    for (let i = 0; i < ashCount; i++) {
      ashPos[i * 3] = volcanoCenterX + (Math.random() - 0.5) * 4;
      ashPos[i * 3 + 1] = 11 + Math.random() * 2;
      ashPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3));

    const ashCanvas = document.createElement('canvas');
    ashCanvas.width = 64;
    ashCanvas.height = 64;
    const ashCtx = ashCanvas.getContext('2d')!;
    const radGrad = ashCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    radGrad.addColorStop(0, 'rgba(60, 70, 85, 0.9)');
    radGrad.addColorStop(0.5, 'rgba(40, 50, 65, 0.6)');
    radGrad.addColorStop(1, 'rgba(20, 25, 35, 0)');
    ashCtx.fillStyle = radGrad;
    ashCtx.fillRect(0, 0, 64, 64);
    const ashTexture = new THREE.CanvasTexture(ashCanvas);

    const ashMat = new THREE.PointsMaterial({
      size: 4.5,
      map: ashTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const ashPoints = new THREE.Points(ashGeo, ashMat);
    ashPoints.visible = false;
    scene.add(ashPoints);
    ashParticlesRef.current = ashPoints;

    // Volcanic Bombs
    const bombCount = 10;
    const bombsGroup = new THREE.Group();
    scene.add(bombsGroup);
    volcanicBombsGroupRef.current = bombsGroup;

    const bombGeo = new THREE.DodecahedronGeometry(0.35, 0);
    const bombMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff6600,
      emissiveIntensity: 2.5
    });

    interface BombState {
      mesh: THREE.Mesh;
      active: boolean;
      pos: THREE.Vector3;
      vel: THREE.Vector3;
    }
    const bombStates: BombState[] = [];
    for (let i = 0; i < bombCount; i++) {
      const bMesh = new THREE.Mesh(bombGeo, bombMat);
      bMesh.visible = false;
      bombsGroup.add(bMesh);
      bombStates.push({
        mesh: bMesh,
        active: false,
        pos: new THREE.Vector3(volcanoCenterX, 11, 0),
        vel: new THREE.Vector3(0, 0, 0)
      });
    }

    // Volcanic Lightning
    const maxLightningLines = 20;
    const lightningGeo = new THREE.BufferGeometry();
    const lightningPos = new Float32Array(maxLightningLines * 6);
    lightningGeo.setAttribute('position', new THREE.BufferAttribute(lightningPos, 3));
    const lightningMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      linewidth: 2,
      transparent: true,
      opacity: 0
    });
    const lightningMesh = new THREE.LineSegments(lightningGeo, lightningMat);
    scene.add(lightningMesh);
    lightningLinesRef.current = lightningMesh;

    // Pyroclastic Surge
    const pyroGroup = new THREE.Group();
    pyroGroup.visible = false;
    scene.add(pyroGroup);
    pyroclasticGroupRef.current = pyroGroup;

    for (let p = 0; p < 6; p++) {
      const puffGeo = new THREE.SphereGeometry(1.6 + Math.random() * 1.2, 8, 8);
      const puffMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.95,
        transparent: true,
        opacity: 0.75
      });
      const puff = new THREE.Mesh(puffGeo, puffMat);
      puff.position.set(volcanoCenterX - 5 - p * 1.5, 3 + Math.random() * 2, (Math.random() - 0.5) * 5);
      pyroGroup.add(puff);
    }

    // Effusive Lava Streams (Visibly pouring straight out of crater rim, hugging slope down to floor & spreading)
    const lavaStreamsGroup = new THREE.Group();
    lavaStreamsGroup.visible = false;
    landscapeGroup.add(lavaStreamsGroup);
    lavaStreamsGroupRef.current = lavaStreamsGroup;

    const lavaStreamMat = createMoltenLavaMaterial(false);
    const lavaPoolMat = createMoltenLavaMaterial(true);

    // Helper: Build a continuous mounded lava stream BufferGeometry tracing crater -> rim -> cone surface -> ground
    const buildLavaStreamGeometry = (
      angleRad: number,
      groundRun: number,
      wigglePhase: number,
      rimWidth: number,
      groundWidth: number
    ) => {
      const segs = 96;
      const profilePts = 7; // 6 quads across width
      const coneSurfaceR = (y: number) => 15.0 - 12.6 * (Math.min(11.0, Math.max(0.0, y)) / 11.0);

      const centerPoints: THREE.Vector3[] = [];
      const widths: number[] = [];

      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        let r = 0;
        let y = 0;
        let theta = angleRad;
        let w = rimWidth;

        if (t <= 0.08) {
          // Emerges from inside the crater lava lake directly up and over the rim notch
          const u = t / 0.08;
          r = 1.0 + u * 1.65;
          y = 11.18 + Math.sin(u * Math.PI) * 0.34;
          w = rimWidth * (0.75 + 0.25 * u);
        } else if (t <= 0.72) {
          // Hugs the outer slope of the volcanic cone all the way down to the floor
          const u = (t - 0.08) / 0.64;
          y = 11.18 * (1 - u) + 0.16 * u;
          r = coneSurfaceR(y) + 0.26;
          theta = angleRad + Math.sin(u * Math.PI * 2.4 + wigglePhase) * 0.13 * u;
          w = rimWidth + (groundWidth * 0.55 - rimWidth) * u;
        } else {
          // Spreads naturally onto the flat terrain at the base of the mountain
          const u = (t - 0.72) / 0.28;
          const endTheta = angleRad + Math.sin(Math.PI * 2.4 + wigglePhase) * 0.13;
          theta = endTheta + Math.sin(u * Math.PI) * 0.05;
          r = 15.26 + u * groundRun;
          y = 0.16 * (1 - u) + 0.08;
          w = groundWidth * (0.55 + 0.55 * Math.sin(u * Math.PI * 0.65));
        }

        centerPoints.push(
          new THREE.Vector3(volcanoCenterX + Math.cos(theta) * r, y, Math.sin(theta) * r)
        );
        widths.push(w);
      }

      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i <= segs; i++) {
        const p = centerPoints[i];
        const prev = centerPoints[Math.max(0, i - 1)];
        const next = centerPoints[Math.min(segs, i + 1)];
        const tangent = new THREE.Vector3().subVectors(next, prev).normalize();
        // Horizontal lateral direction perpendicular to flow direction
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x);
        if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
        side.normalize();
        // Surface normal perpendicular to tangent & side
        const normal = new THREE.Vector3().crossVectors(side, tangent).normalize();
        if (normal.y < 0) normal.negate();

        const halfW = widths[i] * 0.5;
        const thickness = i / segs > 0.72 ? 0.22 : 0.34;

        for (let j = 0; j < profilePts; j++) {
          const u = j / (profilePts - 1); // 0..1 across width
          const lat = (u - 0.5) * 2.0; // -1..1
          const arch = Math.sqrt(Math.max(0, 1 - lat * lat)); // rounded molten lava dome
          const vx = p.x + side.x * lat * halfW + normal.x * arch * thickness;
          const vy = p.y + side.y * lat * halfW + normal.y * arch * thickness;
          const vz = p.z + side.z * lat * halfW + normal.z * arch * thickness;
          positions.push(vx, vy, vz);
          uvs.push(u, i / segs);
        }
      }

      for (let i = 0; i < segs; i++) {
        for (let j = 0; j < profilePts - 1; j++) {
          const a = i * profilePts + j;
          const b = (i + 1) * profilePts + j;
          const c = (i + 1) * profilePts + (j + 1);
          const d = i * profilePts + (j + 1);
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return { geo, segs, indicesPerSeg: (profilePts - 1) * 6, toePos: centerPoints[segs] };
    };

    // Organic spreading lava lobe geometry for when lava pools on the ground
    const buildLavaPoolGeometry = (radius: number) => {
      const geo = new THREE.CircleGeometry(radius, 36);
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 1; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const ang = Math.atan2(y, x);
        const wobble = 1.0 + 0.22 * Math.sin(ang * 3.0) + 0.14 * Math.cos(ang * 5.0);
        pos.setXY(i, x * wobble, y * wobble);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      return geo;
    };

    // Primary Front-Left Hero Lava River (unobstructed view down front-left slope to meadow)
    const leftStream = buildLavaStreamGeometry(Math.PI * 0.66, 5.5, 0.4, 1.35, 3.2);
    const leftStreamMesh = new THREE.Mesh(leftStream.geo, lavaStreamMat);
    leftStreamMesh.castShadow = !isSoftwareGl;
    lavaStreamsGroup.add(leftStreamMesh);

    const leftPoolMesh = new THREE.Mesh(buildLavaPoolGeometry(3.4), lavaPoolMat);
    leftPoolMesh.rotation.x = -Math.PI / 2;
    leftPoolMesh.position.set(leftStream.toePos.x, 0.08, leftStream.toePos.z);
    leftPoolMesh.scale.setScalar(0.01);
    lavaStreamsGroup.add(leftPoolMesh);

    // Secondary Front-Right Lava River (flows down front-right slope toward foothills & trees)
    const rightStream = buildLavaStreamGeometry(Math.PI * 0.34, 5.2, 2.1, 1.15, 2.8);
    const rightStreamMesh = new THREE.Mesh(rightStream.geo, lavaStreamMat);
    rightStreamMesh.castShadow = !isSoftwareGl;
    lavaStreamsGroup.add(rightStreamMesh);

    const rightPoolMesh = new THREE.Mesh(buildLavaPoolGeometry(3.0), lavaPoolMat);
    rightPoolMesh.rotation.x = -Math.PI / 2;
    rightPoolMesh.position.set(rightStream.toePos.x, 0.08, rightStream.toePos.z);
    rightPoolMesh.scale.setScalar(0.01);
    lavaStreamsGroup.add(rightPoolMesh);

    // Effusive Escaping Gas / Gentle Steam Wisps (from crater and cooling lava)
    const steamGroup = new THREE.Group();
    steamGroup.visible = false;
    landscapeGroup.add(steamGroup);
    const steamGeo = new THREE.SphereGeometry(0.7, 8, 8);
    const steamMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.9,
      transparent: true,
      opacity: 0.45
    });
    const steamPuffs: THREE.Mesh[] = [];
    for (let s = 0; s < 10; s++) {
      const sp = new THREE.Mesh(steamGeo, steamMat);
      sp.position.set(
        volcanoCenterX + (Math.random() - 0.5) * 2.5,
        11 + Math.random() * 2,
        (Math.random() - 0.5) * 2.5
      );
      steamGroup.add(sp);
      steamPuffs.push(sp);
    }

    // 8. Animation Loop
    let lastTime = performance.now();
    let lightningTimer = 0;

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
      const isEffusive = modeRef.current === 'effusive';

      // Pulse Magma Chamber core
      if (chamberCore) {
        const pulse = Math.sin(now * 0.005) * 0.15;
        chamberCore.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      }

      // Animate Rising Magma droplets inside conduit (visible when Under the Surface is active)
      bolusMeshes.forEach((b) => {
        b.y += dt * b.speed * simSpeedRef.current;
        if (b.y > 11) {
          b.y = -6.5;
          b.mesh.position.x = volcanoCenterX + (Math.random() - 0.5) * 0.45;
          b.mesh.position.z = (Math.random() - 0.5) * 0.45;
        }
        b.mesh.position.y = b.y;
      });

      // Animate Expanding Gas Bubbles (Explosive mode: bubbles expand as pressure drops with height!)
      bubblesGroup.visible = !isEffusive;
      if (!isEffusive) {
        bubbleMeshes.forEach((b) => {
          b.y += dt * b.speed * simSpeedRef.current;
          if (b.y > 11) {
            b.y = -6.5;
            b.mesh.position.x = volcanoCenterX + (Math.random() - 0.5) * 0.4;
            b.mesh.position.z = (Math.random() - 0.5) * 0.4;
          }
          b.mesh.position.y = b.y;
          const normH = Math.max(0, (b.y - (-6.5)) / 17.5);
          const expansionScale = 0.22 + Math.pow(normH, 1.2) * 0.75;
          b.mesh.scale.set(expansionScale, expansionScale, expansionScale);
        });
      }

      // Animate molten lava shaders continuously
      lavaUniforms.uFlowTime.value = now * 0.001 * simSpeedRef.current;

      if (isEffusive) {
        if (ashParticlesRef.current) ashParticlesRef.current.visible = false;
        if (volcanicBombsGroupRef.current) volcanicBombsGroupRef.current.visible = false;
        if (lightningLinesRef.current) lightningLinesRef.current.visible = false;
        if (pyroclasticGroupRef.current) pyroclasticGroupRef.current.visible = false;

        // Crater lava lake rises from deep inside crater up to the rim as magma arrives (Stages 1-3)
        const lakeRise = Math.min(p / 0.28, 1.0);
        lavaLake.position.y = p < 0.72 ? 9.9 + lakeRise * 1.35 : 11.25 - ((p - 0.72) / 0.28) * 0.35;

        // Cooling transitions smoothly in Stages 6 & 7 (p >= 0.72)
        const coolAmount = p >= 0.72 ? Math.min((p - 0.72) / 0.24, 0.85) : 0.0;
        lavaUniforms.uCoolAmount.value = coolAmount;

        // Crater point light intensity matches molten glow
        craterGlow.intensity = 4.5 * (1.0 - coolAmount * 0.7);

        // Gentle escaping steam wisps (Stage 2 onwards, including Stage 7 cooling vents)
        steamGroup.visible = p >= 0.14;
        if (steamGroup.visible) {
          steamPuffs.forEach((sp, i) => {
            sp.position.y += dt * (1.4 + (i % 3) * 0.45);
            sp.position.x += Math.sin(now * 0.002 + i) * 0.02;
            if (sp.position.y > 16.5) {
              sp.position.y = 11.0 + Math.random() * 0.5;
              sp.position.x = volcanoCenterX + (Math.random() - 0.5) * 2.4;
            }
          });
        }

        // Lava visibly pours over crater rim (Stage 3, p >= 0.28), streams down slopes to ground (Stage 4-5), and remains as cooled rock (Stage 6-7)
        if (lavaStreamsGroupRef.current) {
          const showStreams = p >= 0.28;
          lavaStreamsGroupRef.current.visible = showStreams;
          if (showStreams) {
            const flowFrac = Math.min((p - 0.28) / 0.36, 1.0);
            const leftSegs = Math.max(2, Math.floor(flowFrac * leftStream.segs));
            const rightSegs = Math.max(2, Math.floor(Math.max(0, flowFrac - 0.04) / 0.96 * rightStream.segs));
            leftStream.geo.setDrawRange(0, leftSegs * leftStream.indicesPerSeg);
            rightStream.geo.setDrawRange(0, rightSegs * rightStream.indicesPerSeg);

            // Spread naturally on ground once the lava rivers reach the floor (flowFrac >= 0.72)
            const poolSpread = flowFrac >= 0.72 ? Math.min((flowFrac - 0.72) / 0.28, 1.0) : 0;
            leftPoolMesh.visible = poolSpread > 0.02;
            rightPoolMesh.visible = poolSpread > 0.02;
            leftPoolMesh.scale.set(0.15 + poolSpread * 0.85, 0.15 + poolSpread * 0.85, 1);
            rightPoolMesh.scale.set(0.15 + poolSpread * 0.85, 0.15 + poolSpread * 0.85, 1);
          }
        }

        // Nearby foothills trees scorch/char as advancing lava spreads close (Stage 5-7)
        const advanceScorch = p >= 0.58 ? Math.min((p - 0.58) / 0.16, 1.0) : 0;
        effusiveTreeMats.forEach(({ mat, distFromRightToe }) => {
          if (distFromRightToe < 8.5 && advanceScorch > 0) {
            const closeness = 1 - distFromRightToe / 8.5;
            const burn = closeness * advanceScorch;
            mat.color.setRGB(
              0.13 * (1 - burn) + 0.38 * burn,
              0.77 * (1 - burn) + 0.18 * burn,
              0.37 * (1 - burn) + 0.08 * burn
            );
            mat.emissive.setHex(0xff3300);
            mat.emissiveIntensity = burn * (1 - coolAmount) * 0.45;
          } else {
            mat.color.setHex(0x22c55e);
            mat.emissiveIntensity = 0;
          }
        });
      } else {
        lavaLake.position.y = 10.6;
        lavaUniforms.uCoolAmount.value = 0;
        craterGlow.intensity = 4.0;
        effusiveTreeMats.forEach(({ mat }) => {
          mat.color.setHex(0x22c55e);
          mat.emissiveIntensity = 0;
        });
        steamGroup.visible = false;
        if (lavaStreamsGroupRef.current) lavaStreamsGroupRef.current.visible = false;

        if (ashParticlesRef.current) {
          const showAsh = p >= 0.38;
          ashParticlesRef.current.visible = showAsh;

          if (showAsh) {
            const posAttr = ashParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
            const positions = posAttr.array as Float32Array;
            const maxH = p < 0.58 ? 11 + (p - 0.38) * 55 : 26;

            for (let i = 0; i < ashCount; i++) {
              positions[i * 3 + 1] += dt * (5 + (i % 5) * 1.5) * simSpeedRef.current;
              const drift = Math.sin(now * 0.001 + i) * 0.06;
              positions[i * 3] += drift;
              positions[i * 3 + 2] += drift;

              if (positions[i * 3 + 1] > maxH) {
                positions[i * 3] = volcanoCenterX + (Math.random() - 0.5) * 1.5;
                positions[i * 3 + 1] = 11 + Math.random() * 1.5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
              }
            }
            posAttr.needsUpdate = true;
          }
        }

        if (volcanicBombsGroupRef.current) {
          const showBombs = p >= 0.43 && p < 0.65;
          volcanicBombsGroupRef.current.visible = showBombs;

          if (showBombs) {
            bombStates.forEach((b) => {
              if (!b.active && Math.random() < 0.04) {
                b.active = true;
                b.pos.set(volcanoCenterX, 11, 0);
                const angle = Math.random() * Math.PI * 2;
                const speed = 6 + Math.random() * 7;
                b.vel.set(Math.cos(angle) * speed, 11 + Math.random() * 5, Math.sin(angle) * speed);
                b.mesh.visible = true;
              }

              if (b.active) {
                b.pos.x += b.vel.x * dt;
                b.pos.y += b.vel.y * dt;
                b.pos.z += b.vel.z * dt;
                b.vel.y -= 18 * dt;
                b.mesh.position.copy(b.pos);
                if (b.pos.y <= 0) {
                  b.active = false;
                  b.mesh.visible = false;
                }
              }
            });
          }
        }

        if (lightningLinesRef.current) {
          const hasLightning = p >= 0.55 && p < 0.74;
          lightningLinesRef.current.visible = hasLightning;
          if (hasLightning) {
            lightningTimer += dt;
            if (lightningTimer > 0.4) {
              lightningTimer = 0;
              const posAttr = lightningLinesRef.current.geometry.attributes.position as THREE.BufferAttribute;
              const pos = posAttr.array as Float32Array;
              let curX = volcanoCenterX + (Math.random() - 0.5) * 3;
              let curY = 21 + Math.random() * 3;
              let curZ = (Math.random() - 0.5) * 3;

              for (let s = 0; s < maxLightningLines; s++) {
                pos[s * 6] = curX;
                pos[s * 6 + 1] = curY;
                pos[s * 6 + 2] = curZ;
                curX += (Math.random() - 0.5) * 2;
                curY -= 1.2 + Math.random() * 1.5;
                curZ += (Math.random() - 0.5) * 2;
                pos[s * 6 + 3] = curX;
                pos[s * 6 + 4] = curY;
                pos[s * 6 + 5] = curZ;
              }
              posAttr.needsUpdate = true;
              (lightningLinesRef.current.material as THREE.LineBasicMaterial).opacity = 1.0;
            } else {
              const mat = lightningLinesRef.current.material as THREE.LineBasicMaterial;
              mat.opacity = Math.max(0, mat.opacity - dt * 4);
            }
          }
        }

        if (pyroclasticGroupRef.current) {
          const showSurge = p >= 0.70 && p < 0.88;
          pyroclasticGroupRef.current.visible = showSurge;
          if (showSurge) {
            const surgeProgress = (p - 0.70) / 0.16;
            pyroclasticGroupRef.current.position.x = -surgeProgress * 7;
            pyroclasticGroupRef.current.scale.setScalar(1 + surgeProgress * 0.7);
          }
        }
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

        {/* 1. EDUCATIONAL PANEL: ON THE RIGHT SIDE OF THE SCREEN */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 max-w-[270px] sm:max-w-[320px] bg-slate-950/85 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/20 shadow-xl pointer-events-auto z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Stage {currentStage.stage} of 7: {volcanoMode.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50">
                {currentStage.temp}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              {currentStage.title}
            </h4>

            <p className="text-[11px] text-slate-300 leading-snug">
              {currentStage.desc}
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-slate-300 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[9px]">
                  {volcanoMode === 'explosive' ? 'Plume Height' : 'Lava Speed'}
                </span>
                <span className="font-bold text-amber-200">{currentStage.speedOrPlume}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Gas Pressure</span>
                <span className="font-bold text-sky-200">{currentStage.pressure}</span>
              </div>
            </div>

            {/* 7-Stage Jump Indicators */}
            <div className="pt-1.5 border-t border-white/10 flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((stg) => (
                <button
                  key={stg}
                  onClick={() => jumpToStage(stg - 1)}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                    stg === currentStage.stage
                      ? 'bg-amber-400 ring-2 ring-amber-300 shadow-sm'
                      : stg < currentStage.stage
                      ? 'bg-amber-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Jump to Stage ${stg}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. SCIENTIFIC TERMS GRAPHIC: EDUCATIONAL ARROWS POINTING TO STRUCTURES */}
        {showScientificTerms && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* SVG Connecting Arrows */}
            <svg className="w-full h-full absolute inset-0">
              <defs>
                <marker
                  id="volcano-arrow-red"
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
                  id="volcano-arrow-amber"
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
                  id="volcano-arrow-orange"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#FB923C" />
                </marker>
                <marker
                  id="volcano-arrow-slate"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                </marker>
                <marker
                  id="volcano-arrow-emerald"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
                </marker>
              </defs>

              {/* Arrow to Crater (all stages) */}
              <line
                x1="24%"
                y1="20%"
                x2="44%"
                y2="27%"
                stroke="#EF4444"
                strokeWidth="2.5"
                markerEnd="url(#volcano-arrow-red)"
              />

              {/* Arrow to Volcanic Cone (Mountain slope - all stages) */}
              <line
                x1="18%"
                y1="34%"
                x2="34%"
                y2="38%"
                stroke="#10B981"
                strokeWidth="2"
                markerEnd="url(#volcano-arrow-emerald)"
              />

              {/* Arrow to Main Vent (Conduit - relevant stages 1-5 or when cutaway active) */}
              {(currentStage.stage <= 5 || showUnderSurface) && (
                <line
                  x1="22%"
                  y1="46%"
                  x2="44%"
                  y2="48%"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  markerEnd="url(#volcano-arrow-amber)"
                />
              )}

              {/* Arrow to Magma (rising inside conduit/vent - relevant early stages or cutaway) */}
              {((volcanoMode === 'explosive' ? currentStage.stage <= 4 : currentStage.stage <= 3) || showUnderSurface) && (
                <line
                  x1="22%"
                  y1="62%"
                  x2="44%"
                  y2="62%"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  markerEnd="url(#volcano-arrow-orange)"
                />
              )}

              {/* Arrow to Magma Chamber (subterranean reservoir) */}
              {(currentStage.stage <= 4 || showUnderSurface) && (
                <line
                  x1="24%"
                  y1="80%"
                  x2="43%"
                  y2="80%"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  markerEnd="url(#volcano-arrow-red)"
                />
              )}

              {/* Arrow to Ash Cloud (Explosive mode, stages 4-7) */}
              {volcanoMode === 'explosive' && currentStage.stage >= 4 && (
                <line
                  x1="22%"
                  y1="9%"
                  x2="42%"
                  y2="13%"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  markerEnd="url(#volcano-arrow-slate)"
                />
              )}

              {/* Arrow to Pyroclastic Flow (Explosive mode, stage 6 & 7) */}
              {volcanoMode === 'explosive' && currentStage.stage >= 6 && (
                <line
                  x1="18%"
                  y1="72%"
                  x2="28%"
                  y2="60%"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  markerEnd="url(#volcano-arrow-slate)"
                />
              )}

              {/* Arrow to Lava (Effusive mode, stages 3-7) */}
              {volcanoMode === 'effusive' && currentStage.stage >= 3 && (
                <line
                  x1="62%"
                  y1="56%"
                  x2="54%"
                  y2="54%"
                  stroke="#FB923C"
                  strokeWidth="2.5"
                  markerEnd="url(#volcano-arrow-orange)"
                />
              )}

              {/* Arrow to Side Vent (Effusive mode, stages 3 & 4) */}
              {volcanoMode === 'effusive' && (currentStage.stage === 3 || currentStage.stage === 4) && (
                <line
                  x1="60%"
                  y1="34%"
                  x2="52%"
                  y2="38%"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  markerEnd="url(#volcano-arrow-amber)"
                />
              )}
            </svg>

            {/* Term: Crater */}
            <div className="absolute top-[17%] left-[4%] sm:left-[7%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-red-500 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-red-300">Crater</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">Bowl-shaped summit opening where eruption emerges</div>
              </div>
            </div>

            {/* Term: Volcanic Cone */}
            <div className="absolute top-[31%] left-[2%] sm:left-[4%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-emerald-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
              <div>
                <div className="text-[11px] font-black text-emerald-300">Volcanic Cone</div>
                <div className="text-[9px] text-slate-300 font-medium leading-tight">Mountain cone built from cooled layers of ash & lava</div>
              </div>
            </div>

            {/* Term: Main Vent (Conduit) */}
            {(currentStage.stage <= 5 || showUnderSurface) && (
              <div className="absolute top-[43%] left-[2%] sm:left-[4%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-amber-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-amber-300">Main Vent (Conduit)</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Central pipe where magma travels up to the surface</div>
                </div>
              </div>
            )}

            {/* Term: Magma */}
            {((volcanoMode === 'explosive' ? currentStage.stage <= 4 : currentStage.stage <= 3) || showUnderSurface) && (
              <div className="absolute top-[59%] left-[3%] sm:left-[5%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-orange-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
                <span className="w-2 h-2 rounded-full bg-orange-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-orange-300">Magma</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Hot liquid melted rock while still trapped underground</div>
                </div>
              </div>
            )}

            {/* Term: Magma Chamber */}
            {(currentStage.stage <= 4 || showUnderSurface) && (
              <div className="absolute top-[77%] left-[4%] sm:left-[6%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-red-500 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-red-300">Magma Chamber</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Deep pool where liquid melted rock pools below</div>
                </div>
              </div>
            )}

            {/* Term: Ash Cloud (Explosive mode, stages 4-7) */}
            {volcanoMode === 'explosive' && currentStage.stage >= 4 && (
              <div className="absolute top-[6%] left-[4%] sm:left-[7%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-slate-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 animate-pulse max-w-[220px]">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-slate-200">Ash Cloud</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Colossal billowing cloud of crushed rock, pumice & gas</div>
                </div>
              </div>
            )}

            {/* Term: Pyroclastic Flow (Explosive mode, stage 6 & 7) */}
            {volcanoMode === 'explosive' && currentStage.stage >= 6 && (
              <div className="absolute top-[70%] left-[2%] sm:left-[3%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-slate-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 animate-pulse max-w-[220px]">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-slate-200">Pyroclastic Flow</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Superheated avalanches of gas & ash racing down slopes</div>
                </div>
              </div>
            )}

            {/* Term: Lava (Effusive mode, stages 3-7) */}
            {volcanoMode === 'effusive' && currentStage.stage >= 3 && (
              <div className="absolute top-[54%] left-[60%] sm:left-[62%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-orange-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
                <span className="w-2 h-2 rounded-full bg-orange-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-orange-200">Lava</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Red-hot molten rock streaming across ground</div>
                </div>
              </div>
            )}

            {/* Term: Side Vent (Effusive mode, stages 3 & 4) */}
            {volcanoMode === 'effusive' && (currentStage.stage === 3 || currentStage.stage === 4) && (
              <div className="absolute top-[31%] left-[56%] sm:left-[58%] bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-amber-400 shadow-xl backdrop-blur-sm pointer-events-auto flex items-start gap-1.5 max-w-[210px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-amber-200">Side Vent</div>
                  <div className="text-[9px] text-slate-300 font-medium leading-tight">Branch opening where lava & steam escape sideways</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TIMELINE & SIMULATION CONTROLS DECK */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-xs space-y-3.5">
        
        {/* Scrubber Timeline Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-900">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Volcano Timeline Scrubber
            </span>
            <span className="font-mono text-amber-700 font-black">
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
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          {/* 7 Stage markers */}
          <div className="grid grid-cols-7 gap-1 text-center pt-1">
            {(volcanoMode === 'explosive' ? VOLCANO_STAGES_EXPLOSIVE : VOLCANO_STAGES_EFFUSIVE).map((s, idx) => (
              <button
                key={s.stage}
                onClick={() => jumpToStage(idx)}
                className={`text-[9px] sm:text-[10px] font-bold p-1 rounded-xl transition-all cursor-pointer truncate ${
                  s.stage === currentStage.stage
                    ? 'bg-amber-100 text-amber-950 font-black border border-amber-400'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {s.stage}. {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs text-xs sm:text-sm"
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

            {/* Eruption Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => {
                  setVolcanoMode('explosive');
                  handleRestart();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  volcanoMode === 'explosive'
                    ? 'bg-white text-amber-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Explosive
              </button>
              <button
                onClick={() => {
                  setVolcanoMode('effusive');
                  handleRestart();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  volcanoMode === 'effusive'
                    ? 'bg-white text-orange-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                Effusive
              </button>
            </div>

            {/* Under the Surface Button */}
            <button
              onClick={() => setShowUnderSurface(!showUnderSurface)}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                showUnderSurface
                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-700" />
              <span>{showUnderSurface ? 'Hide Under Surface' : 'Under the Surface'}</span>
            </button>

            {/* Scientific Terms Button */}
            <button
              onClick={() => setShowScientificTerms(!showScientificTerms)}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                showScientificTerms
                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Tag className="w-4 h-4 text-amber-600" />
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
                    ? 'bg-white text-amber-700 shadow-xs border border-slate-200'
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
