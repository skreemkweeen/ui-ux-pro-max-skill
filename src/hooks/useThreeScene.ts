'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface SceneConfig {
  backgroundColor?: string
  ambientIntensity?: number
  directionalIntensity?: number
  cameraPosition?: [number, number, number]
  enableShadows?: boolean
  enableFog?: boolean
}

export const useThreeScene = (config: SceneConfig = {}) => {
  const {
    backgroundColor = '#0a0a0a',
    ambientIntensity = 0.6,
    directionalIntensity = 1.2,
    cameraPosition = [0, 0, 5],
    enableShadows = true,
    enableFog = true,
  } = config

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(...cameraPosition)
    cameraRef.current = camera

    // Renderer setup
    const canvas = document.createElement('canvas')
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'highp',
    })

    // Optimize renderer
    const dpr = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(backgroundColor)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1

    if (enableShadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    rendererRef.current = renderer

    // Clock for animation
    const clock = new THREE.Clock()
    clockRef.current = clock

    // Lighting setup
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity)
    scene.add(ambientLight)

    // Directional light (key light)
    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      directionalIntensity
    )
    directionalLight.position.set(10, 10, 10)

    if (enableShadows) {
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.set(2048, 2048)
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 500
      directionalLight.shadow.camera.left = -50
      directionalLight.shadow.camera.right = 50
      directionalLight.shadow.camera.top = 50
      directionalLight.shadow.camera.bottom = -50
      directionalLight.shadow.bias = -0.0001
    }

    scene.add(directionalLight)

    // Rim/accent light
    const rimLight = new THREE.PointLight(0xffffff, 0.4)
    rimLight.position.set(-10, 5, 10)
    scene.add(rimLight)

    // Fog setup
    if (enableFog) {
      scene.fog = new THREE.Fog(parseInt(backgroundColor.slice(1), 16), 100, 500)
    }

    // Background setup
    scene.background = new THREE.Color(backgroundColor)

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      const dpr = Math.min(window.devicePixelRatio, 2)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      canvas.remove()
    }
  }, [backgroundColor, ambientIntensity, directionalIntensity, cameraPosition, enableShadows, enableFog])

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    clock: clockRef.current,

    // Helper functions
    addObject: (object: THREE.Object3D) => {
      if (sceneRef.current) sceneRef.current.add(object)
    },

    removeObject: (object: THREE.Object3D) => {
      if (sceneRef.current) sceneRef.current.remove(object)
    },

    updateCamera: (position: [number, number, number]) => {
      if (cameraRef.current) {
        cameraRef.current.position.set(...position)
        cameraRef.current.lookAt(0, 0, 0)
      }
    },

    getElapsedTime: () => clockRef.current?.getElapsedTime() ?? 0,
  }
}

export default useThreeScene
