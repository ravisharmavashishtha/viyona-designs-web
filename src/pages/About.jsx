import { Link } from 'react-router-dom';
import founderImg from '../assets/founder.jpg';

function About() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Header Section */}
      <section style={{ 
        padding: '5.5rem 0 4.5rem', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, #FFFDF8 0%, #FAF8F2 60%, #F3EFE6 100%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            The Studio Story
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.75rem, 5vw, 4rem)', 
            fontWeight: '600', 
            marginBottom: '1.25rem', 
            color: 'var(--text-primary)' 
          }}>
            Crafting the Future of Everyday Indian Living.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We combine high-precision additive manufacturing, plant-based sustainable bio-polymers, and minimalist aesthetic soul to create objects you truly cherish.
          </p>
        </div>
      </section>

      {/* 2. Vision & Values */}
      <section style={{ padding: '5.5rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div style={{ 
              padding: '2.5rem', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' }}>Our Vision</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', marginBottom: '1rem' }}>
                "To elevate modern Indian living through meticulously engineered, plant-based design goods that bring serenity, order, and beauty to every corner."
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                We noticed an urgent need in the Indian home decor landscape: mass-produced petrochemical plastics that are flimsy, toxic, and devoid of intentional design. Viyona Designs was born to redefine how high-precision objects are created and loved.
              </p>
            </div>

            <div style={{ 
              padding: '2.5rem', 
              backgroundColor: '#FFFFFF', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📐</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' }}>Our Craft Standard</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', marginBottom: '1rem' }}>
                "Zero toxic shortcuts. Zero compromise on finish, durability, and environmental stewardship."
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Every single piece — from our Lord Ganesha statue to our catchall desk trays — undergoes computer-guided additive fabrication in India. We tune every layer to micro-fractions of a millimeter for tactile richness and lifelong structural integrity.
              </p>
            </div>
          </div>

          {/* 3. Founder Story Spotlight */}
          <div style={{ 
            padding: '3.5rem', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', margin: '0 auto' }}>
                <img 
                  src={founderImg} 
                  alt="Meenu Sharma, Founder & CEO" 
                  style={{ 
                    width: '240px', 
                    height: '240px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '6px solid var(--bg-primary)', 
                    boxShadow: 'var(--shadow-md)' 
                  }} 
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#fff',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em'
                }}>
                  FOUNDER
                </div>
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Leadership</span>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '0.35rem', fontWeight: '600' }}>Meenu Sharma</h2>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', fontWeight: '500' }}>Founder & CEO</h3>
                <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  "I founded Viyona Designs out of a personal longing for objects that carry both engineering precision and spiritual peace. When we craft an idol or a functional tray, we treat every micro-layer as a testament to conscious craftsmanship."
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                  Under her vision, Viyona Designs continues to push the boundaries of sustainable rapid additive fabrication across home decor, sacred spaces, and lifestyle accessories.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Action Banner */}
          <div style={{ marginTop: '5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>
              Experience Viyona in Your Space
            </h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/#collection" className="btn btn-primary">
                Explore Studio Collection
              </Link>
              <a 
                href="https://www.amazon.in/dp/B0HF5124YZ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-amazon"
              >
                Visit Amazon India Storefront ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
