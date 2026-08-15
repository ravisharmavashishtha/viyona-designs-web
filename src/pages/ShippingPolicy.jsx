import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Shipping & Delivery Policy | Viyona Designs';
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
            Customer Delivery Standards
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--text-primary)' 
          }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Learn about our Pan-India delivery timelines, premium gift packaging standards, and courier handling procedures.
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

            {/* 1. Overview */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                1. Pan-India Delivery Coverage
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                At <strong>Viyona Designs</strong>, we are committed to delivering our precision-crafted, plant-based products safely and promptly to your doorstep across India. We deliver to over 19,000+ pin codes nationwide in partnership with leading tier-1 logistics carriers (including Amazon Logistics, Delhivery, and Blue Dart).
              </p>
            </div>

            {/* 2. Delivery Timelines */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                2. Estimated Delivery Timelines
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem', marginBottom: '1.25rem' }}>
                Orders are processed and carefully packaged within 24 to 48 hours of order confirmation. Once dispatched, the estimated transit times are as follows:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '1rem'
              }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#FAF9F5', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>🏙️</div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.35rem' }}>Metro Cities (Express Transit)</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>3 – 5 Business Days</strong> across Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Ahmedabad.
                  </p>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#FAF9F5', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>🗺️</div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.35rem' }}>Rest of India</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>5 – 7 Business Days</strong> for Tier 2, Tier 3 cities, and all regional serviceable pincodes.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Shipping Rates */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                3. Shipping Charges & Free Delivery
              </h2>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
                <li><strong>Amazon India Orders:</strong> Shipping and delivery rates apply as per standard Amazon India fulfillment rates at checkout.</li>
                <li><strong>Direct Website Orders:</strong> Standard nominal delivery fee of ₹49 applicable for orders below ₹499. Orders of ₹499 and above qualify for <strong>100% Free Shipping</strong>.</li>
              </ul>
            </div>

            {/* 4. Packaging & Fragile Handling */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                4. Sustainable & Protective Gift Packaging
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                Every Viyona Designs creation is packed in standard <strong>5 × 5 × 5 inch durable gift cartons</strong> reinforced with shock-absorbent cushioning. While our plant-based bio-plastic is naturally shatter-resistant and impact-durable, we take utmost care to ensure the outer gift packaging arrives in pristine, gift-ready condition.
              </p>
            </div>

            {/* 5. Order Tracking */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                5. Tracking Your Package
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                As soon as your package is dispatched, you will receive an SMS and email notification containing your unique Air Waybill (AWB) tracking number and live tracking link.
              </p>
              <div style={{ marginTop: '1.25rem' }}>
                <Link to="/contact" className="btn btn-secondary" style={{ width: 'auto', display: 'inline-flex' }}>
                  Need Help with Shipping? Contact Us →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ShippingPolicy;
