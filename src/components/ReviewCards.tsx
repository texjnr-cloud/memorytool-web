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
    reviewCard(currentCard.id, quality)

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowHint(false)
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
        </div>
      </div>
    </div>
  )
}
