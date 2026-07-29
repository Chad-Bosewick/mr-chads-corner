"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface ThreejsDeviceAssets {
  body: string;
  screenContent: string;
  screenMask: string;
}

interface ThreejsCanvasProps {
  assets: ThreejsDeviceAssets;
  onReady: () => void;
  onLightPassComplete: () => void;
  runLightPass: boolean;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uBodyTex;
  uniform sampler2D uScreenTex;
  uniform sampler2D uMaskTex;
  uniform vec4 uScreenRect;
  uniform float uLightProgress;
  uniform float uLightEnabled;
  uniform float uOpacity;

  void main() {
    vec4 bodyColor = texture2D(uBodyTex, vUv);
    vec2 topUv = vec2(vUv.x, 1.0 - vUv.y);
    vec2 screenUv = (topUv - uScreenRect.xy) / uScreenRect.zw;
    float inScreen = step(uScreenRect.x, topUv.x) * step(topUv.x, uScreenRect.x + uScreenRect.z)
      * step(uScreenRect.y, topUv.y) * step(topUv.y, uScreenRect.y + uScreenRect.w);
    vec4 screenColor = texture2D(uScreenTex, screenUv);
    float mask = texture2D(uMaskTex, screenUv).r;
    float lightDistance = distance(screenUv, vec2(uLightProgress));
    float lightIntensity = (1.0 - smoothstep(0.0, 0.8, lightDistance)) * 0.15 * uLightEnabled;
    screenColor.rgb *= 1.0 + lightIntensity * mask;
    vec4 finalColor = mix(bodyColor, screenColor, inScreen * screenColor.a * mask);
    finalColor.a *= uOpacity;
    gl_FragColor = finalColor;
  }
`;

function DeviceScene({
  assets,
  onReady,
  onLightPassComplete,
  runLightPass,
  pointer,
  pointerVersion,
}: ThreejsCanvasProps & { pointer: React.MutableRefObject<{ x: number; y: number; active: boolean }>; pointerVersion: number }) {
  const { gl, scene, camera, invalidate } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [textures, setTextures] = useState<{
    body: THREE.Texture;
    screen: THREE.Texture;
    mask: THREE.Texture;
  } | null>(null);
  const entryStart = useRef<number | null>(null);
  const lightStart = useRef<number | null>(null);
  const hasCompletedLight = useRef(!runLightPass);

  useEffect(() => {
    let disposed = false;
    const loader = new THREE.TextureLoader();
    const loadTexture = (url: string) => new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });

    Promise.all([loadTexture(assets.body), loadTexture(assets.screenContent), loadTexture(assets.screenMask)])
      .then(([body, screen, mask]) => {
        if (disposed) {
          body.dispose();
          screen.dispose();
          mask.dispose();
          return;
        }
        // The body uses Three's standard image orientation. The cropped screen
        // textures use top-left UV coordinates matching the Figma screen rect.
        screen.flipY = false;
        mask.flipY = false;
        screen.needsUpdate = true;
        mask.needsUpdate = true;
        setTextures({ body, screen, mask });
      })
      .catch(() => onLightPassComplete());

    return () => {
      disposed = true;
    };
  }, [assets, onLightPassComplete]);

  const material = useMemo(() => {
    if (!textures) return null;
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uBodyTex: { value: textures.body },
        uScreenTex: { value: textures.screen },
        uMaskTex: { value: textures.mask },
        uScreenRect: { value: new THREE.Vector4(0.383, 0.216, 0.234, 0.256) },
        uLightProgress: { value: 0 },
        uLightEnabled: { value: 0 },
        uOpacity: { value: 1 },
      },
      transparent: true,
    });
  }, [textures]);

  useEffect(() => {
    if (material) material.uniforms.uLightEnabled.value = runLightPass ? 1 : 0;
  }, [material, runLightPass]);

  useEffect(() => {
    if (!material || !textures) return;
    gl.compile(scene, camera);
    invalidate();
    const frame = window.requestAnimationFrame(onReady);
    return () => window.cancelAnimationFrame(frame);
  }, [camera, gl, invalidate, material, onReady, scene, textures]);

  useEffect(() => {
    invalidate();
  }, [invalidate, pointerVersion]);

  useEffect(() => () => {
    material?.dispose();
    textures?.body.dispose();
    textures?.screen.dispose();
    textures?.mask.dispose();
  }, [material, textures]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const now = state.clock.elapsedTime;
    if (entryStart.current === null) entryStart.current = now;
    const entryProgress = Math.min((now - (entryStart.current ?? now)) / 0.8, 1);
    const easedEntry = 1 - Math.pow(1 - entryProgress, 3);

    const targetX = pointer.current.active ? pointer.current.y * 0.0436 : 0;
    const targetY = pointer.current.active ? pointer.current.x * 0.0349 : 0;
    const mesh = meshRef.current;
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.15;
    mesh.rotation.y += (targetY - mesh.rotation.y) * 0.15;
    mesh.position.y = (1 - easedEntry) * -0.28;
    materialRef.current.uniforms.uOpacity.value = easedEntry;

    let keepRendering = entryProgress < 1
      || Math.abs(targetX - mesh.rotation.x) > 0.0005
      || Math.abs(targetY - mesh.rotation.y) > 0.0005;

    if (runLightPass && !hasCompletedLight.current) {
      if (lightStart.current === null) lightStart.current = now;
      const progress = Math.min((now - (lightStart.current ?? now)) / 2, 1);
      materialRef.current.uniforms.uLightProgress.value = progress;
      keepRendering = true;
      if (progress === 1) {
        hasCompletedLight.current = true;
        materialRef.current.uniforms.uLightEnabled.value = 0;
        onLightPassComplete();
      }
    }

    if (keepRendering) invalidate();
  });

  if (!material) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[14.4, 10.24]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

export default function ThreejsCanvas({ assets, onReady, onLightPassComplete, runLightPass }: ThreejsCanvasProps) {
  const pointer = useRef({ x: 0, y: 0, active: false });
  const [pointerVersion, setPointerVersion] = useState(0);
  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      active: true,
    };
    setPointerVersion((version) => version + 1);
  }, []);
  const handlePointerLeave = useCallback(() => {
    pointer.current.active = false;
    setPointerVersion((version) => version + 1);
  }, []);

  return (
    <div className="h-full w-full" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 24.1], fov: 24 }}
        aria-label="TODO++ dedicated device — interactive 2.5D presentation"
      >
        <DeviceScene
          assets={assets}
          onReady={onReady}
          onLightPassComplete={onLightPassComplete}
          runLightPass={runLightPass}
          pointer={pointer}
          pointerVersion={pointerVersion}
        />
      </Canvas>
    </div>
  );
}
