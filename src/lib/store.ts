import { create } from 'zustand'
import { SM2State, initializeSM2, calculateNextReview } from './sm2'

export interface Card {
  id: string
  name: string
  imageUrl: string
  imageBase64?: string
  mnemonic: string
  sm2: SM2State
  createdAt: Date
  lastReviewedAt?: Date
  reviews: {
    date: Date
    quality: number
    mnemonicHelpful?: boolean
  }[]
}

interface CardStore {
  cards: Card[]
  addCard: (
    name: string,
    imageUrl: string,
    mnemonic: string,
    imageBase64?: string
  ) => void
  reviewCard: (cardId: string, quality: number, mnemonicHelpful?: boolean) => void
  deleteCard: (cardId: string) => void
  getCard: (cardId: string) => Card | undefined
  getDueCards: () => Card[]
  getAllCards: () => Card[]
  loadCardsFromStorage: () => void
  saveCardsToStorage: () => void
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],

  addCard: (name, imageUrl, mnemonic, imageBase64) => {
    set((state) => ({
      cards: [
        ...state.cards,
        {
          id: Date.now().toString(),
          name,
          imageUrl,
          imageBase64: imageBase64 || imageUrl,
          mnemonic,
          sm2: initializeSM2(),
          createdAt: new Date(),
          reviews: [],
        },
      ],
    }))
    get().saveCardsToStorage()
  },

  reviewCard: (cardId, quality, mnemonicHelpful) => {
    set((state) => ({
      cards: state.cards.map((card) => {
        if (card.id === cardId) {
          const updatedCard = {
            ...card,
            sm2: calculateNextReview(card.sm2, quality),
            lastReviewedAt: new Date(),
            reviews: [
              ...card.reviews,
              {
                date: new Date(),
                quality,
                mnemonicHelpful,
              },
            ],
          }
          return updatedCard
        }
        return card
      }),
    }))
    get().saveCardsToStorage()
  },

  deleteCard: (cardId) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    }))
    get().saveCardsToStorage()
  },

  getCard: (cardId) => {
    return get().cards.find((card) => card.id === cardId)
  },

  getDueCards: () => {
    const cards = get().cards
    return cards.filter((card) => new Date() >= card.sm2.nextReviewDate)
  },

  getAllCards: () => {
    return get().cards
  },

  saveCardsToStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('memorytool_cards', JSON.stringify(get().cards))
      } catch (e) {
        console.error('Failed to save to localStorage:', e)
      }
    }
  },

  loadCardsFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('memorytool_cards')
        if (stored) {
          const cards = JSON.parse(stored).map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            sm2: {
              ...card.sm2,
              nextReviewDate: new Date(card.sm2.nextReviewDate),
            },
            lastReviewedAt: card.lastReviewedAt
              ? new Date(card.lastReviewedAt)
              : undefined,
            reviews: card.reviews.map((review: any) => ({
              ...review,
              date: new Date(review.date),
            })),
          }))
          set({ cards })
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e)
      }
    }
  },
}))
