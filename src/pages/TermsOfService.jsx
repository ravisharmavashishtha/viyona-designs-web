import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service | Viyona Designs';
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', width: '100%' }}>
      {/* Header Banner */}
      <section style={{ 
        padding: 'clamp(3.5rem, 6vw, 5.5rem) 0', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, #FFFDF8 0%, #FAF8F2 60%, #F3EFE6 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        width: '100%'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            Legal Framework
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--text-primary)' 
          }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Terms and conditions governing the use of viyonadesigns.com and the purchase of our products.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: 'clamp(3rem, 5vw, 5rem) 0', width: '100%' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem'
          }}>

            {/* 1. Agreement */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                1. Agreement to Terms
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                By accessing or purchasing from <strong>Viyona Designs</strong> via <strong>viyonadesigns.com</strong>, you agree to be bound by these Terms of Service. If you do not agree to all terms, please refrain from using our site or services.
              </p>
            </div>

            {/* 2. Product Authenticity & Specifications */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                2. Product Accuracy & Craftsmanship
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                Every item showcased on our platform is manufactured using high-precision additive engineering and 100% plant-based bio-polymers. While we strive to display dimensions, colors, and textures with exact precision, slight natural variations in micro-layer surface texture are inherent to precision additive manufacturing and signify unique, conscious craftsmanship.
              </p>
            </div>

            {/* 3. Pricing & Payments */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                3. Pricing & Taxes
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                All prices displayed on the website are in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to modify prices or promotional discounts at any time without prior notice.
              </p>
            </div>

            {/* 4. Intellectual Property */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                4. Intellectual Property Rights
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                All content, trademarks, brand logos, 3D sculptural designs, product photography, and text on <strong>viyonadesigns.com</strong> are the intellectual property of Viyona Designs. Unauthorized reproduction, copying, or redistribution of our designs or brand media for commercial purposes is strictly prohibited under Indian Copyright and Trademark laws.
              </p>
            </div>

            {/* 5. Limitation of Liability */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                5. Limitation of Liability
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                Viyona Designs shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our products or website. Our maximum liability in any circumstance is limited strictly to the total purchase price paid for the specific item.
              </p>
            </div>

            {/* 6. Governing Law */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                6. Governing Law & Dispute Resolution
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                These terms shall be governed by and interpreted in accordance with the laws of the Republic of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </div>

            {/* 7. Contact Link */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                For any questions regarding our terms and policies, please reach out to us via our <Link to="/contact" style={{ color: 'var(--accent-gold)' }}>Contact Us Page</Link> or email <a href="mailto:support@viyonadesigns.com" style={{ color: 'var(--accent-gold)' }}>support@viyonadesigns.com</a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsOfService;
