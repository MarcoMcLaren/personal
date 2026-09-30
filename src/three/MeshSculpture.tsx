import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createMeshDynamics, createSculptureGeometry, updateSculpture } from './meshGeometry';
import { meshFragmentShader, meshVertexShader } from './meshShaders';
import type { JourneyState } from './journey';
import { sampleMeshFlight, type MeshRole } from './meshFlight';

interface Props {
  journey: MutableRefObject<JourneyState>;
  mobile: boolean;
  paused: boolean;
  role: MeshRole;
  activities: MutableRefObject<Float32Array>;
  status: MutableRefObject<HTMLSpanElement | null>;
}

export function MeshSculpture({ journey, mobile, paused, role, activities, status }: Props) {
  const group = useRef<THREE.Group>(null);
  const stage = useRef((journey.current.stage + role * 2) % 5);
  const progress = useRef(journey.current.progress);
  const time = useRef(0);
  const impulse = useRef(0);
  const lastRelease = useRef(0);
  const { geometry, targets, triangleCount } = useMemo(() => createSculptureGeometry(mobile ? (role === 2 ? 1 : 2) : (role === 0 ? 4 : 2)), [mobile, role]);
  const dynamics = useMemo(() => createMeshDynamics(triangleCount), [triangleCount]);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const localRay = useMemo(() => new THREE.Ray(), []);
  const inverse = useMemo(() => new THREE.Matrix4(), []);
  const pointerPosition = useMemo(() => new THREE.Vector2(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: meshVertexShader,
    fragmentShader: meshFragmentShader,
    uniforms: {
      uTime: { value: 0 }, uStage: { value: 0 }, uFormation: { value: 1 },
      uOpacity: { value: (mobile ? 0.65 : 1) * (role === 1 ? 0.85 : 1) },
      uHue: { value: role === 1 ? 0.32 : role === 2 ? -0.22 : 0 },
    },
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
  }), [mobile, role]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame(({ viewport, camera }, delta) => {
    if (!group.current) return;
    const step = Math.min(delta, 0.05);
    if (paused) {
      if (role === 0 && status.current) status.current.textContent = 'Paused';
      return;
    }
    const state = journey.current;
    const pointer = state.pointer;
    time.current += step;
    // Companion shapes use a different morph sequence without wraparound jumps.
    const targetStage = role === 0 ? state.stage : (role === 1 ? 2 + Math.sin(state.progress * Math.PI * 2) * 1.8 : 4 - state.progress * 3);
    stage.current = THREE.MathUtils.damp(stage.current, targetStage, 7, step);
    progress.current = THREE.MathUtils.damp(progress.current, state.progress, 8, step);
    if (pointer.release !== lastRelease.current) {
      lastRelease.current = pointer.release;
      impulse.current = 1;
    } else {
      impulse.current *= Math.exp(-step * 4);
    }
    const now = performance.now();
    const pointerEnergy = pointer.speed * Math.exp(-(now - pointer.movedAt) / 180);
    // Scrolling under a stationary cursor should only transform and move the mesh.
    // A fresh pointer gesture reactivates its local spring field.
    const interacting = pointer.active && pointer.movedAt > state.scrollTime;
    const scale = (mobile ? Math.min(viewport.width * 0.16, 0.7) : Math.min(viewport.height * 0.14, viewport.width * 0.085)) * [0.9, 0.7, 0.22][role];
    group.current.scale.setScalar(scale);
    const flight = sampleMeshFlight(role, progress.current);
    group.current.position.set(viewport.width * flight.x, viewport.height * flight.y + Math.sin(time.current * 0.55 + role * 2) * scale * 0.09, flight.z);
    group.current.rotation.set(0.22 + Math.sin(stage.current * 1.4 + role) * 0.28, time.current * (role === 1 ? -0.12 : 0.1) + stage.current * 0.65, -0.12 + role * 0.35);
    group.current.updateMatrixWorld(true);
    if (interacting) {
      pointerPosition.set(pointer.x, pointer.y);
      raycaster.setFromCamera(pointerPosition, camera);
      inverse.copy(group.current.matrixWorld).invert();
      localRay.copy(raycaster.ray).applyMatrix4(inverse);
    }
    const activity = updateSculpture(geometry, targets, stage.current, {
      formation: 1,
      time: time.current + role * 11,
      energy: Math.min(2, pointerEnergy * 0.2),
      ray: interacting ? localRay : undefined,
      pressed: pointer.pressed,
      impulse: impulse.current,
      delta: step,
      dynamics,
    });
    material.uniforms.uTime.value = time.current;
    material.uniforms.uStage.value = stage.current;
    material.uniforms.uFormation.value = 1;

    activities.current[role] = activity;
    if (role === 0 && status.current) {
      const active = Math.max(activities.current[0], activities.current[1], activities.current[2]) > 0.22;
      const label = active ? (pointer.pressed ? 'Gathering at your cursor' : 'Responding to your cursor')
        : 'Three meshes · continuous transformation';
      if (status.current.textContent !== label) status.current.textContent = label;
      const completion = '1.00';
      if (status.current.dataset.completion !== completion) status.current.dataset.completion = completion;
      const interaction = active ? (pointer.pressed ? 'gather' : 'repel') : 'idle';
      if (status.current.dataset.interaction !== interaction) status.current.dataset.interaction = interaction;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
