import * as THREE from 'three'

export interface MemoryStats {
  geometries: number
  materials: number
  textures: number
  rendererInfo: {
    memory: {
      geometries: number
      textures: number
    }
    render: {
      calls: number
      triangles: number
      points: number
      lines: number
    }
  }
}

class MemoryManager {
  private geometriesRef: Set<THREE.BufferGeometry> = new Set()
  private materialsRef: Set<THREE.Material> = new Set()
  private texturesRef: Set<THREE.Texture> = new Set()
  private renderer: THREE.WebGLRenderer | null = null

  setRenderer(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer
  }

  // Track geometry
  trackGeometry(geometry: THREE.BufferGeometry) {
    this.geometriesRef.add(geometry)
  }

  // Track material
  trackMaterial(material: THREE.Material) {
    this.materialsRef.add(material)
  }

  // Track texture
  trackTexture(texture: THREE.Texture) {
    this.texturesRef.add(texture)
  }

  // Dispose geometry
  disposeGeometry(geometry: THREE.BufferGeometry) {
    geometry.dispose()
    this.geometriesRef.delete(geometry)
  }

  // Dispose material
  disposeMaterial(material: THREE.Material) {
    material.dispose()
    this.materialsRef.delete(material)
  }

  // Dispose texture
  disposeTexture(texture: THREE.Texture) {
    texture.dispose()
    this.texturesRef.delete(texture)
  }

  // Get memory statistics
  getMemoryStats(): MemoryStats {
    return {
      geometries: this.geometriesRef.size,
      materials: this.materialsRef.size,
      textures: this.texturesRef.size,
      rendererInfo: this.renderer?.info || {
        memory: { geometries: 0, textures: 0 },
        render: { calls: 0, triangles: 0, points: 0, lines: 0 },
      },
    }
  }

  // Clear all tracked resources
  clear() {
    // Dispose all tracked geometries
    this.geometriesRef.forEach((geom) => geom.dispose())
    this.geometriesRef.clear()

    // Dispose all tracked materials
    this.materialsRef.forEach((mat) => mat.dispose())
    this.materialsRef.clear()

    // Dispose all tracked textures
    this.texturesRef.forEach((tex) => tex.dispose())
    this.texturesRef.clear()
  }

  // Panic mode: aggressively clear resources
  panicMode() {
    // Clear inactive geometries (keep only recently used)
    const stats = this.getMemoryStats()
    if (stats.geometries > 100) {
      const geoArray = Array.from(this.geometriesRef)
      geoArray.slice(0, Math.floor(geoArray.length * 0.5)).forEach((geom) => {
        this.disposeGeometry(geom)
      })
    }

    // Clear unused textures
    if (stats.textures > 50) {
      const texArray = Array.from(this.texturesRef)
      texArray.slice(0, Math.floor(texArray.length * 0.3)).forEach((tex) => {
        this.disposeTexture(tex)
      })
    }
  }

  // Get detailed memory info
  getDetailedInfo() {
    const stats = this.getMemoryStats()
    return {
      totalGeometries: stats.geometries,
      totalMaterials: stats.materials,
      totalTextures: stats.textures,
      rendererCalls: stats.rendererInfo.render.calls,
      rendererTriangles: stats.rendererInfo.render.triangles,
      rendererMemoryGeometries: stats.rendererInfo.memory.geometries,
      rendererMemoryTextures: stats.rendererInfo.memory.textures,
    }
  }
}

// Singleton instance
export const memoryManager = new MemoryManager()

export default memoryManager
