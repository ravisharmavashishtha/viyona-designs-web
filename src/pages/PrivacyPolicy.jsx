import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy | Viyona Designs';
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
            Data Privacy & Security
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--text-primary)' 
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Last updated: August 2026. How Viyona Designs collects, protects, and respects your personal information.
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

            {/* 1. Introduction */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                1. Our Commitment to Your Privacy
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                At <strong>Viyona Designs</strong> ("we", "our", or "us"), we value the trust you place in us when sharing your personal information. This Privacy Policy describes how we collect, use, and safeguard your data in accordance with the <em>Information Technology Act, 2000</em> and the <em>Digital Personal Data Protection (DPDP) Act, 2023</em> of India.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                2. Information We Collect
              </h2>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
                <li><strong>Contact Information:</strong> Your name, email address, phone number, and delivery address provided when submitting inquiries or placing orders.</li>
                <li><strong>Order & Transaction Data:</strong> Information regarding items purchased, order amounts, and payment confirmation status (we never store your raw credit card numbers or UPI PINs).</li>
                <li><strong>Technical & Browsing Data:</strong> Anonymized device information, IP address, and browser characteristics collected via standard web analytics to optimize our site experience.</li>
              </ul>
            </div>

            {/* 3. How We Use Your Data */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                3. How We Use Your Information
              </h2>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
                <li>To process and fulfill your product orders and provide accurate delivery tracking.</li>
                <li>To respond promptly to customer support requests and product inquiries.</li>
                <li>To protect against fraudulent transactions and ensure website security.</li>
                <li>To send order notifications and relevant updates about our sustainable creations (you can opt out at any time).</li>
              </ul>
            </div>

            {/* 4. Payment Security & 256-Bit SSL */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                4. Payment Security & Data Protection
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                All browsing and transactions on <strong>viyonadesigns.com</strong> are protected with industry-standard <strong>256-bit SSL encryption</strong>. When direct checkout is enabled, all payments are processed through RBI-authorized, PCI-DSS Level 1 compliant payment aggregators (such as Razorpay, Cashfree, or Amazon Pay).
              </p>
            </div>

            {/* 5. Non-Disclosure & Third Parties */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                5. Zero Selling of Personal Data
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                We <strong>do not sell, rent, or trade</strong> your personal information to any third parties for advertising or marketing purposes. We only share necessary shipping data (e.g., recipient name, address, phone) with our verified courier delivery partners solely for order fulfillment.
              </p>
            </div>

            {/* 6. Contact Data Grievance */}
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                6. Contact Our Grievance Officer
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                If you have questions, corrections, or wish to request deletion of your personal data from our records, please contact our data grievance desk:
              </p>
              <div style={{ marginTop: '0.75rem', padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Viyona Designs — Privacy & Grievance Desk</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.92rem' }}>
                  Email: <a href="mailto:support@viyonadesigns.com" style={{ color: 'var(--accent-gold)' }}>support@viyonadesigns.com</a> | <Link to="/contact" style={{ color: 'var(--accent-gold)' }}>Customer Support Form</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
