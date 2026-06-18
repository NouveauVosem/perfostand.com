'use client'

import { useRef, useState } from 'react'
import styles from './Reviews.module.scss'

// Все запросы идут на /api: в dev проксирует next.config rewrites → :8300,
// в проде — nginx. Один путь для обеих сред (как в админке/кристале).
const API_BASE = '/api'

const MAX_PHOTOS = 6
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function validate(data) {
  const errors = {}
  if (!data.name?.trim())    errors.name    = 'Required'
  if (!data.message?.trim()) errors.message = 'Required'
  if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Valid email required'
  return errors
}

export default function Reviews() {
  const [errors, setErrors]   = useState({})
  const [photos, setPhotos]   = useState([])
  const [status, setStatus]   = useState('idle') // idle | sending | sent | error
  const [photosCountSent, setPhotosCountSent] = useState(0)
  const fileRef = useRef(null)

  function handleFiles(e) {
    const incoming = Array.from(e.target.files || [])
    const accepted = []
    for (const file of incoming) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > MAX_SIZE) continue
      accepted.push(file)
    }
    setPhotos((prev) => [...prev, ...accepted].slice(0, MAX_PHOTOS))
    if (fileRef.current) fileRef.current.value = ''
  }

  function removePhoto(idx) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const errs = validate(data)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')

    const body = new FormData()
    body.append('name', data.name)
    if (data.company) body.append('company', data.company)
    if (data.email)   body.append('email', data.email)
    body.append('message', data.message)
    photos.forEach((file) => body.append('photos', file))

    try {
      const res = await fetch(`${API_BASE}/reviews`, { method: 'POST', body })
      if (!res.ok) throw new Error('Request failed')
      setPhotosCountSent(photos.length)
      setStatus('sent')
      form.reset()
      setPhotos([])
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="reviews" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.info}>
            <span className="eyebrow">07 — Reviews</span>
            <h2 className={styles.title}>
              Worked with us?<br />Leave a review.
            </h2>
            <p className={styles.lead}>
              Share your experience and attach photos of your installed displays.
            </p>
          </div>

          {status === 'sent' ? (
            <div className={styles.success} role="status" aria-live="polite">
              <span className={styles.successGlow} aria-hidden="true" />
              <svg
                className={styles.successCheck}
                viewBox="0 0 52 52"
                aria-hidden="true"
              >
                <circle className={styles.successCheckCircle} cx="26" cy="26" r="24" />
                <path className={styles.successCheckMark} d="M14 27 l8 8 l16 -18" />
              </svg>
              <span className={`eyebrow ${styles.successEyebrow}`}>Submitted</span>
              <h3 className={styles.successTitle}>Thank you — your review is in.</h3>
              <p className={styles.successText}>
                We&apos;ve received your review{photosCountSent > 0 ? ` and ${photosCountSent} photo${photosCountSent > 1 ? 's' : ''}` : ''}.
              </p>
              <button
                type="button"
                className={styles.successReset}
                onClick={() => setStatus('idle')}
              >
                Leave another review →
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.fieldsGrid}>
              <div className={styles.fieldHalf}>
                <label htmlFor="rv-name" className={`num-badge ${styles.label}`}>FULL NAME</label>
                <input id="rv-name" name="name" type="text" className={styles.input} />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.fieldHalf}>
                <label htmlFor="rv-company" className={`num-badge ${styles.label}`}>COMPANY (OPTIONAL)</label>
                <input id="rv-company" name="company" type="text" className={styles.input} />
              </div>

              <div className={styles.fieldFull}>
                <label htmlFor="rv-email" className={`num-badge ${styles.label}`}>EMAIL (OPTIONAL)</label>
                <input id="rv-email" name="email" type="email" className={styles.input} />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>

              <div className={styles.fieldFull}>
                <label htmlFor="rv-message" className={`num-badge ${styles.label}`}>YOUR REVIEW</label>
                <textarea
                  id="rv-message"
                  name="message"
                  rows={6}
                  className={styles.textarea}
                  placeholder="Tell us about the product, fit, delivery, support…"
                />
                {errors.message && <p className={styles.error}>{errors.message}</p>}
              </div>

              <div className={styles.fieldFull}>
                <span className={`num-badge ${styles.label}`}>PHOTOS (OPTIONAL — UP TO {MAX_PHOTOS})</span>
                <input
                  ref={fileRef}
                  id="rv-photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.fileInput}
                  onChange={handleFiles}
                />
                <label htmlFor="rv-photos" className={styles.fileButton}>
                  + Add photos
                </label>

                {photos.length > 0 && (
                  <ul className={styles.thumbs}>
                    {photos.map((file, idx) => (
                      <li key={idx} className={styles.thumb}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                        <button
                          type="button"
                          className={styles.thumbRemove}
                          onClick={() => removePhoto(idx)}
                          aria-label="Remove photo"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={styles.formFooter}>
              <p className={styles.disclaimer}>
                Your review will be published after moderation.
              </p>
              <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Submit Review →'}
              </button>
            </div>

            {status === 'error' && (
              <p className={styles.formError}>
                Something went wrong. Please try again later.
              </p>
            )}
          </form>
          )}
        </div>
      </div>
    </section>
  )
}
