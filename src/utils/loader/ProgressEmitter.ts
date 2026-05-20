// Progress emission system for asset loading

export interface ProgressEvent {
  progress: number
  phase: 'initializing' | 'loading' | 'revealing' | 'complete'
  timestamp: number
}

type ProgressListener = (event: ProgressEvent) => void

class ProgressEmitter {
  private listeners: Set<ProgressListener> = new Set()
  private currentProgress = 0
  private lastUpdateTime = Date.now()
  private updateInterval = 50 // ms between emits

  subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener)
    // Immediately emit current progress to new subscriber
    listener({
      progress: this.currentProgress,
      phase: this.getPhase(),
      timestamp: Date.now(),
    })
    // Return unsubscribe function
    return () => this.listeners.delete(listener)
  }

  setProgress(progress: number, force = false): void {
    const now = Date.now()
    const timeSinceLastUpdate = now - this.lastUpdateTime

    if (!force && timeSinceLastUpdate < this.updateInterval) {
      return // Skip frequent updates, batch them
    }

    const clampedProgress = Math.max(0, Math.min(100, progress))

    if (clampedProgress !== this.currentProgress) {
      this.currentProgress = clampedProgress
      this.lastUpdateTime = now

      this.emit({
        progress: clampedProgress,
        phase: this.getPhase(),
        timestamp: now,
      })
    }
  }

  incrementProgress(amount: number): void {
    this.setProgress(this.currentProgress + amount)
  }

  complete(): void {
    this.setProgress(100, true)
    this.emit({
      progress: 100,
      phase: 'complete',
      timestamp: Date.now(),
    })
  }

  reset(): void {
    this.currentProgress = 0
    this.lastUpdateTime = Date.now()
  }

  private getPhase(progress: number = this.currentProgress) {
    if (progress === 100) return 'complete'
    if (progress > 70) return 'loading'
    return 'initializing'
  }

  private emit(event: ProgressEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (error) {
        console.error('ProgressListener error:', error)
      }
    })
  }

  getProgress(): number {
    return this.currentProgress
  }

  isComplete(): boolean {
    return this.currentProgress === 100
  }
}

// Singleton instance
export const progressEmitter = new ProgressEmitter()

export default progressEmitter
