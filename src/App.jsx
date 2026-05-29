import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { portfolio } from './data/portfolio'

const galleryCategories = ['All', 'Web3', 'Interface', 'Automation', 'Research']

function App() {
  return (
    <main className="portfolio-shell">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ImagePortfolioGallery />
      <Timeline />
      <Contact />
    </main>
  )
}

function Header() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <div className="nav-inner">
        <a className="brand-lockup" href="#top" aria-label="Aditya Kadam home">
          <span className="brand-mark">AK</span>
          <span className="brand-copy">
            <strong>Aditya Kadam</strong>
            <small>Web3 Full-Stack</small>
          </span>
        </a>
        <nav>
          {portfolio.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const { profile } = portfolio

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{profile.location}</p>
        <h1>{profile.name}</h1>
        <p className="hero-title">{profile.headline}</p>
        <p className="hero-summary">{profile.summary}</p>
        <div className="hero-actions" aria-label="Primary links">
          <a className="button button-primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="button" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="button" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="button button-muted" href={profile.resume} aria-disabled="true">
            Resume soon
          </a>
        </div>
        <div className="hero-highlights" aria-label="Portfolio highlights">
          {portfolio.highlights.map((highlight) => (
            <div className="highlight-line" key={highlight.label}>
              <strong>{highlight.value}</strong>
              <span>{highlight.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section-grid" id="about">
      <SectionIntro
        kicker="About"
        title="Building practical Web3 products with full-stack discipline."
        copy={portfolio.about}
      />
      <div className="focus-list">
        {portfolio.focus.map((item) => (
          <article className="focus-card" key={item.title}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className="content-section" id="skills">
      <SectionHeading kicker="Skills" title="Stack coverage from interface to protocol." />
      <div className="skills-console">
        <div className="console-panel">
          <div className="console-topbar" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="console-command">aditya.stack.scan --mode production</p>
          <div className="console-summary">
            <span>6 layers detected</span>
            <h3>Balanced product stack</h3>
            <p>
              Frontend, backend, Web3, deployment, automation, and hardware skills
              organized as practical build layers.
            </p>
          </div>
        </div>
        <div className="skill-grid">
          {portfolio.skills.map((group) => (
            <article className="skill-card" key={group.category}>
              <div className="skill-card-head">
                <div>
                  <p>{group.signal}</p>
                  <h3>{group.category}</h3>
                </div>
                <span>{group.strength}</span>
              </div>
              <div className="skill-meter" aria-hidden="true">
                <span style={{ width: group.strength }}></span>
              </div>
              <div className="tag-list">
                {group.items.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="content-section" id="projects">
      <SectionHeading
        kicker="Projects"
        title="Featured Web3, automation, and full-stack work."
      />
      <div className="project-grid">
        {portfolio.projects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className="project-topline">
              <span>{project.type}</span>
              <span>{project.updated}</span>
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tag-list">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="card-links">
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer">
                  Repo
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer">
                  Live
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ImagePortfolioGallery() {
  const [images, setImages] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const imagesRef = useRef([])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url))
    }
  }, [])

  const visibleImages = useMemo(() => {
    if (activeCategory === 'All') {
      return images
    }

    return images.filter((image) => image.category === activeCategory)
  }, [activeCategory, images])

  function handleUpload(event) {
    const files = Array.from(event.target.files || [])
    const nextImages = files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        size: file.size,
        category: 'Interface',
        featured: false,
        url: URL.createObjectURL(file),
      }))

    setImages((currentImages) => [...nextImages, ...currentImages])
    event.target.value = ''
  }

  function updateImage(id, updates) {
    setImages((currentImages) =>
      currentImages.map((image) => (image.id === id ? { ...image, ...updates } : image)),
    )
  }

  function removeImage(id) {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === id)

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }

      return currentImages.filter((image) => image.id !== id)
    })
  }

  return (
    <section className="content-section gallery-section" id="gallery">
      <SectionHeading
        kicker="Gallery"
        title="Upload, preview, and organize portfolio visuals."
      />
      <div className="gallery-workspace">
        <label className="upload-panel">
          <input type="file" accept="image/*" multiple onChange={handleUpload} />
          <span className="upload-kicker">Image uploader</span>
          <strong>Drop portfolio screenshots, UI studies, or project visuals here.</strong>
          <small>{images.length} image{images.length === 1 ? '' : 's'} in this gallery</small>
        </label>

        <div className="gallery-controls" aria-label="Gallery filters">
          {galleryCategories.map((category) => (
            <button
              className={category === activeCategory ? 'is-active' : ''}
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {images.length === 0 ? (
        <div className="gallery-empty">
          <h3>No images uploaded yet</h3>
          <p>
            Select one or more image files to build a live portfolio gallery with editable
            titles, category grouping, and featured image markers.
          </p>
        </div>
      ) : (
        <div className="dynamic-gallery" aria-live="polite">
          {visibleImages.map((image) => (
            <article
              className={`gallery-card${image.featured ? ' gallery-card-featured' : ''}`}
              key={image.id}
            >
              <div className="gallery-image-frame">
                <img src={image.url} alt={image.name} />
                {image.featured && <span>Featured</span>}
              </div>
              <div className="gallery-card-body">
                <input
                  aria-label="Image title"
                  type="text"
                  value={image.name}
                  onChange={(event) => updateImage(image.id, { name: event.target.value })}
                />
                <div className="gallery-meta">
                  <select
                    aria-label="Portfolio category"
                    value={image.category}
                    onChange={(event) =>
                      updateImage(image.id, { category: event.target.value })
                    }
                  >
                    {galleryCategories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <span>{Math.max(1, Math.round(image.size / 1024))} KB</span>
                </div>
                <div className="gallery-actions">
                  <label>
                    <input
                      checked={image.featured}
                      type="checkbox"
                      onChange={(event) =>
                        updateImage(image.id, { featured: event.target.checked })
                      }
                    />
                    Featured
                  </label>
                  <button type="button" onClick={() => removeImage(image.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function Timeline() {
  return (
    <section className="section-grid" id="experience">
      <SectionIntro
        kicker="Experience"
        title="Academic, freelance, and open-source foundations."
        copy="A compact timeline of the roles and learning paths behind the portfolio."
      />
      <div className="timeline">
        {portfolio.timeline.map((item) => (
          <article className="timeline-item" key={`${item.title}-${item.period}`}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const { profile } = portfolio

  return (
    <section className="contact-section" id="contact">
      <p className="eyebrow">Contact</p>
      <h2>Have a Web3 or full-stack build in mind?</h2>
      <p>
        Reach out for project discussions, collaboration, freelance work, or assignment
        review. Email is the fastest way to start.
      </p>
      <div className="hero-actions">
        <a className="button button-primary" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <a className="button" href={profile.github} target="_blank" rel="noreferrer">
          GitHub profile
        </a>
      </div>
    </section>
  )
}

function SectionIntro({ kicker, title, copy }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

function SectionHeading({ kicker, title }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
    </div>
  )
}

export default App
