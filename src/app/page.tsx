'use client'

import { useState, useEffect } from 'react'
import AddCard from '@/components/AddCard'
import ReviewCards from '@/components/ReviewCards'
import CardLibrary from '@/components/CardLibrary'
import { useCardStore } from '@/lib/store'
import styles from './page.module.css'

type TabType = 'review' | 'add' | 'library'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('review')
  const [mounted, setMounted] = useState(false)
  const [dueCount, setDueCount] = useState(0)
  const loadCardsFromStorage = useCardStore(
    (state) => state.loadCardsFromStorage
  )
  const getDueCards = useCardStore((state) => state.getDueCards)

  useEffect(() => {
    loadCardsFromStorage()
    setMounted(true)
  }, [loadCardsFromStorage])

  useEffect(() => {
    if (mounted) {
      setDueCount(getDueCards().length)
    }
  }, [getDueCards, mounted])

  const handleCardAdded = () => {
    setActiveTab('review')
  }

  const handleReviewComplete = () => {
    setDueCount(0)
    setActiveTab('library')
  }

  if (!mounted) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🧠 MemoryTool</h1>
          <p className={styles.subtitle}>
            Remember names and faces with AI-powered mnemonics
          </p>
        </div>
      </header>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${
            activeTab === 'review' ? styles.navButtonActive : ''
          }`}
          onClick={() => setActiveTab('review')}
        >
          <span className={styles.badge}>{dueCount}</span>
          Review
        </button>
        <button
          className={`${styles.navButton} ${
            activeTab === 'add' ? styles.navButtonActive : ''
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add Person
        </button>
        <button
          className={`${styles.navButton} ${
            activeTab === 'library' ? styles.navButtonActive : ''
          }`}
          onClick={() => setActiveTab('library')}
        >
          Library
        </button>
      </nav>

      <div className={styles.content}>
        {activeTab === 'review' && (
          <ReviewCards onReviewComplete={handleReviewComplete} />
        )}
        {activeTab === 'add' && <AddCard onCardAdded={handleCardAdded} />}
        {activeTab === 'library' && <CardLibrary />}
      </div>
    </main>
  )
}
