/**
 * SuperMemo 2 (SM-2) Algorithm
 * Used to calculate optimal review intervals
 */

export interface SM2State {
  interval: number
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
}

export interface ReviewQuality {
  score: number // 0-5, where 5 is perfect recall
}

/**
 * Initialize SM2 state for a new card
 */
export function initializeSM2(): SM2State {
  return {
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: new Date(),
  }
}

/**
 * Calculate next review interval based on quality of response
 * @param state Current SM2 state
 * @param quality Quality score (0-5)
 * @returns Updated SM2 state
 */
export function calculateNextReview(
  state: SM2State,
  quality: number
): SM2State {
  let { interval, easeFactor, repetitions } = state

  // Ensure quality is in valid range
  const q = Math.max(0, Math.min(5, quality))

  if (q < 3) {
    // Failed response - reset
    repetitions = 0
    interval = 1
  } else {
    // Successful response
    repetitions += 1

    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 3
    } else {
      interval = Math.round(interval * easeFactor)
    }
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
  )

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    interval,
    easeFactor,
    repetitions,
    nextReviewDate,
  }
}

/**
 * Check if a card is due for review
 */
export function isDueForReview(state: SM2State): boolean {
  return new Date() >= state.nextReviewDate
}
