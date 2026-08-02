cat << 'EOF' > src/store.js
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    // 6.7: Initialize anecdotes from backend
    initializeAnecdotes: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },
    // 6.8: Save new anecdote to backend
    createAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote)
      }))
    },
    // 6.9: Save votes to backend
    vote: async (id) => {
      const anecdoteToVote = get().anecdotes.find((a) => a.id === id)
      const updated = await anecdoteService.update(id, {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      })
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a))
      }))
    },
    // 6.11: Delete zero-vote anecdotes
    deleteAnecdote: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id)
      }))
    },
    setFilter: (filter) => set({ filter })
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)
}

export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
EOF