import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    orderNumber: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us — Customer Care & Inquiries | Viyona Designs';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission state
    setSubmitted(true);
  };

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
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            Customer Care & Inquiries
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--text-primary)' 
          }}>
            We're Here to Help.
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Have a question about our eco-friendly creations, your order status, or custom gifting? Reach out to the Viyona Designs team and we’ll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section style={{ padding: 'clamp(3rem, 5vw, 5rem) 0', width: '100%' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', 
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'start'
          }}>
            
            {/* Left Column: Direct Info & Trust Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Quick Contact Card */}
              <div style={{
                padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.25rem' }}>
                  Direct Contact
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>✉️</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>Email Support</div>
                      <a href="mailto:support@viyonadesigns.com" style={{ color: 'var(--accent-gold)', fontWeight: '600', fontSize: '1.02rem', textDecoration: 'none' }}>
                        support@viyonadesigns.com
                      </a>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Mon – Sat, 10:00 AM – 7:00 PM IST</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>🏢</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>Headquarters & Studio</div>
                      <div style={{ fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Viyona Designs
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.2rem' }}>
                        Designed & Precision-Manufactured in India
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>⚡</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>Response Commitment</div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                        Guaranteed response within 24 business hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amazon Storefront Card */}
              <div style={{
                padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                backgroundColor: '#FAF8F2',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Amazon Prime Orders</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Ordered via Amazon India?
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  For real-time delivery tracking, 1-day Prime shipping updates, or Amazon return requests, you can manage your order directly on your Amazon account.
                </p>
                <a 
                  href="https://www.amazon.in/gp/css/order-history" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-amazon"
                  style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                >
                  View Your Amazon Orders ↗
                </a>
              </div>

            </div>

            {/* Right Column: Contact Message Form */}
            <div style={{
              padding: 'clamp(2rem, 3.5vw, 3rem)',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Send Us a Message
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Fill in the details below and our customer care team will get back to you promptly.
              </p>

              {submitted ? (
                <div style={{
                  padding: '2.5rem 1.5rem',
                  backgroundColor: 'var(--accent-sage-light)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px solid #C2DEC6'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌿</div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--accent-sage)', marginBottom: '0.5rem' }}>
                    Thank You for Reaching Out!
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    We have received your message. A Viyona Designs customer specialist will review your inquiry and email you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary"
                    style={{ width: 'auto', padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label htmlFor="name" style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                      Full Name <span style={{ color: '#D9534F' }}>*</span>
                    </label>
                    <input 
                      id="name"
                      type="text" 
                      required
                      placeholder="e.g. Rahul Verma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.95rem',
                        backgroundColor: '#FAF9F5',
                        outline: 'none',
                        transition: 'border-color var(--transition-fast)'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                      Email Address <span style={{ color: '#D9534F' }}>*</span>
                    </label>
                    <input 
                      id="email"
                      type="email" 
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.95rem',
                        backgroundColor: '#FAF9F5',
                        outline: 'none',
                        transition: 'border-color var(--transition-fast)'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                    <div>
                      <label htmlFor="subject" style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                        Inquiry Topic
                      </label>
                      <select 
                        id="subject"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.92rem',
                          backgroundColor: '#FAF9F5',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="General Inquiry">General Question</option>
                        <option value="Order Support">Order Tracking / Support</option>
                        <option value="Product Care & Specs">Product Care & Materials</option>
                        <option value="Corporate / Bulk Gifting">Corporate & Bulk Gifting</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="orderNumber" style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                        Order ID <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input 
                        id="orderNumber"
                        type="text" 
                        placeholder="e.g. 408-1234567..."
                        value={formData.orderNumber}
                        onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.95rem',
                          backgroundColor: '#FAF9F5',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                      Your Message <span style={{ color: '#D9534F' }}>*</span>
                    </label>
                    <textarea 
                      id="message"
                      rows="4" 
                      required
                      placeholder="How can we assist you with our products or your order?"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.95rem',
                        backgroundColor: '#FAF9F5',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', marginTop: '0.5rem' }}
                  >
                    Submit Inquiry →
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Quick Policy Links Bar */}
      <section style={{ padding: '2.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1rem, 3vw, 2.5rem)', flexWrap: 'wrap', fontSize: '0.92rem' }}>
          <Link to="/shipping-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            📦 Shipping & Delivery Policy
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <Link to="/refund-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            🔄 Return & Refund Policy
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <Link to="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            🔒 Privacy Policy
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            📜 Terms of Service
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Contact;
