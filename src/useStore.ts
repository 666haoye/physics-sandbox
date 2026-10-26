import { create } from 'zustand'

interface SandboxState {
  /** 重力加速度，单位 m/s² */
  gravity: number
  /** 每次加 1 触发物体重置 */
  resetTrigger: number
  setGravity: (gravity: number) => void
  triggerReset: () => void
}

export const useStore = create<SandboxState>((set) => ({
  gravity: -9.81,
  resetTrigger: 0,
  setGravity: (gravity) => set({ gravity }),
  triggerReset: () => set((state) => ({ resetTrigger: state.resetTrigger + 1 })),
}))
