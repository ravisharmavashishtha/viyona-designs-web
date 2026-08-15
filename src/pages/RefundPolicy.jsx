import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Return, Refund & Replacement Policy | Viyona Designs';
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
            Hassle-Free Peace of Mind
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--text-primary)' 
          }}>
            Return, Refund & Replacement Policy
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We take extreme pride in the precision of our craftsmanship. Here is how we ensure 100% customer satisfaction with every order.
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

            {/* 1. 10-Day Replacement Guarantee */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                backgroundColor: 'var(--accent-sage-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                color: 'var(--accent-sage)',
                fontWeight: '700',
                marginBottom: '0.75rem'
              }}>
                <span>🛡️</span> 10-Day Replacement & Return Window
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                1. 10-Day Hassle-Free Replacement & Return Guarantee
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                If your product arrives damaged in transit, with a manufacturing defect, or if the wrong item is delivered, we provide an <strong>immediate, zero-cost replacement or return</strong> within 10 days of delivery.
              </p>
            </div>

            {/* 2. Step-by-Step Process */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                2. How to Request a Replacement
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-gold)', fontSize: '1.1rem' }}>01</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Send Us an Email or Message</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Email <a href="mailto:support@viyonadesigns.com" style={{ color: 'var(--accent-gold)' }}>support@viyonadesigns.com</a> or use our <Link to="/contact" style={{ color: 'var(--accent-gold)' }}>Contact Form</Link> within 10 days of receiving the package.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-gold)', fontSize: '1.1rem' }}>02</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Attach Photo / Video Proof</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Include your Order ID along with 1-2 clear photos showing the damaged item and outer packaging.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-gold)', fontSize: '1.1rem' }}>03</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Instant Dispatch</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Once approved by our team, a brand new replacement piece will be dispatched to you within 24 hours at no extra charge.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Refund Timelines */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                3. Refund Processing & Bank Timelines
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                In situations where a replacement is unavailable or a full return is approved:
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem', marginTop: '0.5rem' }}>
                <li><strong>Prepaid Orders (UPI / Cards / Netbanking):</strong> Refunds are credited back to the original source account within <strong>5 to 7 working days</strong> from the date of approval.</li>
                <li><strong>Amazon India Orders:</strong> Refunds follow the official Amazon India A-to-z Guarantee and are processed directly via Amazon Pay or your original bank card.</li>
              </ul>
            </div>

            {/* 4. Order Cancellations */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                4. Order Cancellation Policy
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                You can cancel your order at any time before it has been dispatched from our facility for a 100% full refund. Once the package has been handed over to our courier partner, it cannot be intercepted in transit, but can be replaced or returned upon delivery as per our 10-day policy.
              </p>
            </div>

            {/* 5. Support CTA */}
            <div style={{ padding: '1.5rem', backgroundColor: '#FAF8F2', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Have Questions Regarding a Return?
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Our team is always here to resolve any issues with your order quickly and fairly.
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
                Contact Customer Support →
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default RefundPolicy;
