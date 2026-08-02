cat << 'EOF' > src/store.js
import { create } from 'zustand'

const useStore = create((set) => ({
  good: 0,
  ok: 0,
  bad: 0,
  actions: {
    good: () => set((state) => ({ good: state.good + 1 })),
    ok: () => set((state) => ({ ok: state.ok + 1 })),
    bad: () => set((state) => ({ bad: state.bad + 1 })),
    zero: () => set({ good: 0, ok: 0, bad: 0 })
  }
}))

export const useFeedback = () =>
  useStore((state) => ({
    good: state.good,
    ok: state.ok,
    bad: state.bad
  }))

export const useFeedbackActions = () => useStore((state) => state.actions)
EOF