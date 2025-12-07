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

  'use client'

import { useState, useEffect } from 'react'
import { useCardStore, Card } from '@/lib/store'
import styles from './ReviewCards.module.css'

export default function ReviewCards({
  onReviewComplete,
}: {
  onReviewComplete?: () => void
}) {
  const [dueCards, setDueCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastQuality, setLastQuality] = useState<number | null>(null)
  const reviewCard = useCardStore((state) => state.reviewCard)
  const getDueCards = useCardStore((state) => state.getDueCards)

  useEffect(() => {
    const cards = getDueCards()
    setDueCards(cards)
  }, [getDueCards])

  if (dueCards.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>🎉</p>
          <h2 className={styles.emptyTitle}>All caught up!</h2>
          <p className={styles.emptyText}>
            No cards to review right now. Come back later!
          </p>
        </div>
      </div>
    )
  }

  const currentCard = dueCards[currentIndex]

  const handleReview = (quality: number) => {
    setLastQuality(quality)
    setShowFeedback(true)
  }

  const handleMnemonicFeedback = (helpful: boolean) => {
    reviewCard(currentCard.id, lastQuality!, helpful)

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowHint(false)
      setShowFeedback(false)
      setLastQuality(null)
    } else {
      onReviewComplete?.()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <p className={styles.progressText}>
          {currentIndex + 1} / {dueCards.length}
        </p>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((currentIndex + 1) / dueCards.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardImage}>
          {currentCard.imageBase64 ? (
            <img
              src={currentCard.imageBase64}
              alt={currentCard.name}
              className={styles.image}
            />
          ) : (
            <div className={styles.noImage}>No image</div>
          )}
        </div>

        <div className={styles.cardContent}>
          {!showFeedback ? (
            <>
              <p className={styles.prompt}>Do you remember this person?</p>

              <div className={styles.hintSection}>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={styles.hintButton}
                >
                  {showHint ? '✓ Hide' : '💡'} Memory Aid
                </button>

                {showHint && (
                  <div className={styles.hintBox}>
                    <p className={styles.hintLabel}>Name:</p>
                    <p className={styles.hintName}>{currentCard.name}</p>
                    <p className={styles.hintLabel}>Mnemonic:</p>
                    <p className={styles.hintText}>{currentCard.mnemonic}</p>
                  </div>
                )}
              </div>

              <div className={styles.ratingSection}>
                <p className={styles.ratingLabel}>How well did you remember?</p>
                <div className={styles.ratings}>
                  <button
                    onClick={() => handleReview(2)}
                    className={`${styles.ratingButton} ${styles.ratingBad}`}
                    title="Forgot"
                  >
                    ✗ Forgot
                  </button>
                  <button
                    onClick={() => handleReview(3)}
                    className={`${styles.ratingButton} ${styles.ratingOk}`}
                    title="Unsure"
                  >
                    ? Unsure
                  </button>
                  <button
                    onClick={() => handleReview(4)}
                    className={`${styles.ratingButton} ${styles.ratingGood}`}
                    title="Good"
                  >
                    ✓ Good
                  </button>
                  <button
                    onClick={() => handleReview(5)}
                    className={`${styles.ratingButton} ${styles.ratingPerfect}`}
                    title="Perfect"
                  >
                    ★ Perfect
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.feedbackSection}>
              <p className={styles.feedbackQuestion}>
                Did the mnemonic help you remember?
              </p>
              <div className={styles.feedbackButtons}>
                <button
                  onClick={() => handleMnemonicFeedback(true)}
                  className={`${styles.feedbackButton} ${styles.feedbackYes}`}
                >
                  👍 Yes, it helped!
                </button>
                <button
                  onClick={() => handleMnemonicFeedback(false)}
                  className={`${styles.feedbackButton} ${styles.feedbackNo}`}
                >
                  👎 Didn't help
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
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
