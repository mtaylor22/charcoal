export class StateStore {
  private data = new Map<string, any>()
  private watchers = new Map<string, Set<(val: any) => void>>()
  private globalListeners = new Set<(key: string, val: any) => void>()

  get(key: string): any {
    return this.data.get(key)
  }

  set(key: string, value: any): void {
    const old = this.data.get(key)
    if (old === value) return // no-op if unchanged
    this.data.set(key, value)
    const keyWatchers = this.watchers.get(key)
    if (keyWatchers) {
      for (const cb of keyWatchers) cb(value)
    }
    for (const cb of this.globalListeners) cb(key, value)
  }

  watch(key: string, cb: (val: any) => void): () => void {
    if (!this.watchers.has(key)) this.watchers.set(key, new Set())
    this.watchers.get(key)!.add(cb)
    return () => { this.watchers.get(key)?.delete(cb) }
  }

  onChange(cb: (key: string, val: any) => void): () => void {
    this.globalListeners.add(cb)
    return () => { this.globalListeners.delete(cb) }
  }
}
