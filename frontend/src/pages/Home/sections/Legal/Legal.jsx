import styles from './Legal.module.scss'

const ADDRESSES = [
    {
    label: 'Email',
    lines: ['sales.all@alvla.cz'],
    href: 'mailto:sales.all@alvla.cz',
  },

  {
    label: 'Registered',
    lines: ['ALVLA s.r.o.', 'K zahradkam 2605/5', '155 00 Prague 5, Czech Republic'],
  },
  {
    label: 'Office',
    lines: ['Ringhofferova 115/1', '155 21 Prague 13, Czech Republic'],
  },
  {
    label: 'Warehouse',
    lines: ['Dubska 769', '272 03 Kladno, Czech Republic'],
  },

]

const PHONES = [
  { lang: 'EN', number: '+420 234 717 526' },
  { lang: 'DE', number: '+420 23 407 66 01' },
  { lang: 'FR', number: '+420 234 280 600' },
  { lang: 'CZ', number: '+420 608 609 222' },
  { lang: 'IT', number: '+39 0583 1706661' },
  { lang: 'ES', number: '+39 0583 1706661' },
  { lang: 'HU', number: '+36 1 901 02 81' },
  { lang: 'SE', number: '+420 234 717 526' },
  { lang: 'PL', number: '+48 22 602 24 56' },
  { lang: 'NL', number: '+48 22 602 24 56' },
  { lang: 'GR', number: '+30 211 333 75 26' },
]

export default function Legal() {
  return (
    <section id="contact" className={styles.section}>
      <div className="container">

        <div className={styles.header}>
          <span className="eyebrow">06 — Contact</span>
          <h2 className={styles.title}>
            Feel free to contact us<br />in your preferred language.
          </h2>
        </div>

        <div className={styles.addresses}>
          {ADDRESSES.map(({ label, lines, href }) => (
            <div key={label} className={styles.address}>
              <span className="num-badge">{label.toUpperCase()}</span>
              <address className={styles.addressLines}>
                {lines.map((l, i) =>
                  href
                    ? <a key={i} href={href} className={styles.addressLink}>{l}</a>
                    : <span key={i}>{l}</span>
                )}
              </address>
            </div>
          ))}
        </div>

        <div className={styles.phonesWrap}>
        
          <ul className={styles.phones}>
            {PHONES.map(({ lang, number }) => (
              <li key={lang} className={styles.phone}>
                <span className="num-badge">{lang}</span>
                <a href={`tel:${number.replace(/\s/g, '')}`} className={styles.phoneNumber}>
                  {number}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
