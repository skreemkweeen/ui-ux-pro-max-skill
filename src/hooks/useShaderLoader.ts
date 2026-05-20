'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

export interface ShaderUniforms {
  [key: string]: THREE.IUniform
}

export interface ShaderMaterial {
  material: THREE.ShaderMaterial
  uniforms: ShaderUniforms
  update: (key: string, value: any) => void
}

const shaderCache = new Map<string, { vs: string; fs: string }>()

export const useShaderLoader = () => {
  const materialsRef = useRef<Map<string, ShaderMaterial>>(new Map())

  // Load shader from file
  const loadShader = useCallback(async (path: string): Promise<string> => {
    try {
      const response = await fetch(path)
      if (!response.ok) throw new Error(`Failed to load shader: ${path}`)
      return response.text()
    } catch (error) {
      console.error(`Shader loading error: ${path}`, error)
      return ''
    }
  }, [])

  // Create shader material with caching
  const createShaderMaterial = useCallback(
    async (
      name: string,
      vertexPath: string,
      fragmentPath: string,
      uniforms: ShaderUniforms = {},
      defines: { [key: string]: string | number } = {}
    ): Promise<ShaderMaterial | null> => {
      try {
        // Check cache first
        let vertexShader: string
        let fragmentShader: string

        const cached = shaderCache.get(name)
        if (cached) {
          vertexShader = cached.vs
          fragmentShader = cached.fs
        } else {
          // Load shaders
          ;[vertexShader, fragmentShader] = await Promise.all([
            loadShader(vertexPath),
            loadShader(fragmentPath),
          ])

          if (!vertexShader || !fragmentShader) {
            throw new Error(`Failed to load shaders for ${name}`)
          }

          // Cache shaders
          shaderCache.set(name, { vs: vertexShader, fs: fragmentShader })
        }

        // Create material
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          defines,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: true,
          depthWrite: true,
        })

        // Store material with update method
        const shaderMaterial: ShaderMaterial = {
          material,
          uniforms,
          update: (key: string, value: any) => {
            if (key in uniforms) {
              uniforms[key].value = value
            }
          },
        }

        materialsRef.current.set(name, shaderMaterial)
        return shaderMaterial
      } catch (error) {
        console.error(`Failed to create shader material: ${name}`, error)
        return null
      }
    },
    [loadShader]
  )

  // Update uniform value
  const updateUniform = useCallback(
    (materialName: string, uniformKey: string, value: any) => {
      const material = materialsRef.current.get(materialName)
      if (material) {
        material.update(uniformKey, value)
      }
    },
    []
  )

  // Get material by name
  const getMaterial = useCallback((name: string): ShaderMaterial | undefined => {
    return materialsRef.current.get(name)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      materialsRef.current.forEach((item) => {
        item.material.dispose()
      })
      materialsRef.current.clear()
    }
  }, [])

  return {
    createShaderMaterial,
    updateUniform,
    getMaterial,
    clearCache: () => shaderCache.clear(),
  }
}

export default useShaderLoader
