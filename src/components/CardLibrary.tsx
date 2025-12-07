'use client'

import { useState, useEffect } from 'react'
import { useCardStore, Card } from '@/lib/store'
import styles from './CardLibrary.module.css'

export default function CardLibrary() {
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const getAllCards = useCardStore((state) => state.getAllCards)
  const deleteCard = useCardStore((state) => state.deleteCard)

  useEffect(() => {
    const allCards = getAllCards()
    setCards(allCards)
  }, [getAllCards])

  const handleDelete = (id: string) => {
    if (confirm("Delete this person?")) {
      deleteCard(id)
      setCards(cards.filter((c) => c.id !== id))
      setSelectedCard(null)
    }
  }

  if (cards.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>📚</p>
          <h2 className={styles.emptyTitle}>No cards yet</h2>
          <p className={styles.emptyText}>
            Add your first person to get started!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Total Cards</p>
          <p className={styles.statValue}>{cards.length}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Reviews</p>
          <p className={styles.statValue}>
            {cards.reduce((sum, c) => sum + c.reviews.length, 0)}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={`${styles.cardThumb} ${
              selectedCard?.id === card.id ? styles.cardThumbActive : ""
            }`}
          >
            {card.imageBase64 ? (
              <img
                src={card.imageBase64}
                alt={card.name}
                className={styles.thumbImage}
              />
            ) : (
              <div className={styles.noThumbImage}>📷</div>
            )}
            <p className={styles.thumbName}>{card.name}</p>
          </button>
        ))}
      </div>

      {selectedCard && (
        <div className={styles.detail}>
          <div className={styles.detailImage}>
            {selectedCard.imageBase64 ? (
              <img
                src={selectedCard.imageBase64}
                alt={selectedCard.name}
                className={styles.detailImg}
              />
            ) : (
              <div className={styles.noDetailImage}>📷</div>
            )}
          </div>

          <div className={styles.detailContent}>
            <h3 className={styles.detailName}>{selectedCard.name}</h3>

            <div className={styles.detailStats}>
              <div className={styles.detailStatItem}>
                <p className={styles.detailStatLabel}>Reviews</p>
                <p className={styles.detailStatValue}>
                  {selectedCard.reviews.length}
                </p>
              </div>
              <div className={styles.detailStatItem}>
                <p className={styles.detailStatLabel}>Interval</p>
                <p className={styles.detailStatValue}>
                  {selectedCard.sm2.interval} days
                </p>
              </div>
              <div className={styles.detailStatItem}>
                <p className={styles.detailStatLabel}>Mnemonic Helpful</p>
                <p className={styles.detailStatValue}>
                  {selectedCard.reviews.filter(r => r.mnemonicHelpful).length} / {selectedCard.reviews.length}
                </p>
              </div>
              <div className={styles.detailStatItem}>
                <p className={styles.detailStatLabel}>Ease</p>
                <p className={styles.detailStatValue}>
                  {selectedCard.sm2.easeFactor.toFixed(2)}
                </p>
              </div>
            </div>

            <div className={styles.detailBox}>
              <p className={styles.detailLabel}>Description:</p>
              <p className={styles.detailMnemonic}>
                {selectedCard.description}
              </p>
            </div>

            <div className={styles.detailBox}>
              <p className={styles.detailLabel}>Memory Aid:</p>
              <p className={styles.detailMnemonic}>
                {selectedCard.mnemonic}
              </p>
            </div>

            <button
              onClick={() => handleDelete(selectedCard.id)}
              className={styles.deleteButton}
            >
              🗑️ Delete Card
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
