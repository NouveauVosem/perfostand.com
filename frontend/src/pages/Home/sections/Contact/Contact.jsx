import { useState } from 'react'
import styles from './Contact.module.scss'

const FIELDS = [
  { name: 'name',    label: 'Full name',   type: 'text',  half: true },
  { name: 'company', label: 'Company',     type: 'text',  half: true },
  { name: 'email',   label: 'Work email',  type: 'email', half: false },
]

function validate(data) {
  const errors = {}
  if (!data.name?.trim())    errors.name    = 'Required'
  if (!data.company?.trim()) errors.company = 'Required'
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Valid email required'
  if (!data.message?.trim()) errors.message = 'Required'
  return errors
}

export default function Contact() {
  const [errors, setErrors] = useState({})
  const [sent, setSent]     = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const errs = validate(data)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.info}>
            <span className="eyebrow">06 — Contact</span>
            <h2 className={styles.title}>
              Need a custom<br />merchandising solution?
            </h2>
            <p className={styles.lead}>
              Send us your product list, store format, or rollout brief. We respond
              within one business day with a feasibility note and indicative pricing.
            </p>

            <ul className={styles.meta}>
              {[
                { k: 'EMAIL',    v: 'sales@perfostand.eu' },
                { k: 'RESPONSE', v: '≤ 24 hours' },
                { k: 'SHIPPING', v: 'EU-wide' },
              ].map(({ k, v }) => (
                <li key={k} className={styles.metaRow}>
                  <span className="num-badge">{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.fieldsGrid}>
              {FIELDS.map(({ name, label, type, half }) => (
                <div key={name} className={half ? styles.fieldHalf : styles.fieldFull}>
                  <label htmlFor={name} className={`num-badge ${styles.label}`}>
                    {label.toUpperCase()}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    className={styles.input}
                  />
                  {errors[name] && <p className={styles.error}>{errors[name]}</p>}
                </div>
              ))}

              <div className={styles.fieldFull}>
                <label htmlFor="message" className={`num-badge ${styles.label}`}>
                  MESSAGE / PRODUCT LIST
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className={styles.textarea}
                  placeholder="Brief, SKU count, store format, target launch date…"
                />
                {errors.message && <p className={styles.error}>{errors.message}</p>}
              </div>
            </div>

            <div className={styles.formFooter}>
              <p className={styles.disclaimer}>
                By submitting, you agree to be contacted regarding your inquiry.
              </p>
              <button type="submit" className={styles.submit}>
                Send Request →
              </button>
            </div>

            {sent && (
              <p className={styles.success}>
                Thank you — we'll be in touch within one business day.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
