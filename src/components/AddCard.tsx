'use client'

import { useState, useRef } from 'react'
import { useCardStore } from '@/lib/store'
import styles from './AddCard.module.css'

export default function AddCard({ onCardAdded }: { onCardAdded?: () => void }) {
  const [name, setName] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addCard = useCardStore((state) => state.addCard)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setImageBase64(base64)
      setImagePreview(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateMnemonic = async () => {
    if (!name) {
      setError('Please enter a name')
      return
    }

    if (!imageBase64) {
      setError('Please upload a photo')
      return
    }

    setLoading(true)
    setError('')

    try {
      const analyzeResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64.split(',')[1],
          mimeType: 'image/jpeg',
        }),
      })

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze image')
      }

      const { description } = await analyzeResponse.json()

      const mnemonicResponse = await fetch('/api/generate-mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          imageDescription: description,
        }),
      })

      if (!mnemonicResponse.ok) {
        throw new Error('Failed to generate mnemonic')
      }

      const { mnemonic: generatedMnemonic } =
        await mnemonicResponse.json()
      setMnemonic(generatedMnemonic)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate mnemonic'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAddCard = () => {
    if (!name || !imageBase64 || !mnemonic) {
      setError('Please fill in all fields')
      return
    }

    addCard(name, imageBase64, mnemonic, imageBase64)
    setName('')
    setImageBase64(null)
    setImagePreview(null)
    setMnemonic('')
    setError('')
    
    // Show success message instead of auto-switching
    alert(`✅ ${name} added! Ready to review?`)
    onCardAdded?.()
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Add New Person</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
            className={styles.input}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Photo</label>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadButton}
            disabled={loading}
          >
            {imagePreview ? '✓ Photo selected' : '+ Upload photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.hiddenInput}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className={styles.preview}
            />
          )}
        </div>

        <button
          onClick={handleGenerateMnemonic}
          disabled={loading || !name || !imageBase64}
          className={styles.generateButton}
        >
          {loading ? '⏳ Generating...' : '✨ Generate Memory Aid'}
        </button>

        {mnemonic && (
          <div className={styles.mnemonicBox}>
            <p className={styles.mnemonicLabel}>Memory Aid:</p>
            <p className={styles.mnemonicText}>{mnemonic}</p>
          </div>
        )}

        <button
          onClick={handleAddCard}
          disabled={loading || !mnemonic}
          className={styles.addButton}
        >
          {loading ? 'Adding...' : '+ Add to Cards'}
        </button>
      </div>
    </div>
  )
}
