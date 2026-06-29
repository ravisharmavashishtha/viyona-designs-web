function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px' }}>
            Thoughtfully Designed.<br/>Perfectly Made.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Elevating everyday Indian living through meticulously engineered, high-quality household solutions you won't find anywhere else.
          </p>
          <a href="#shop" className="btn btn-primary">Explore Collection</a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Our Collection</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Product 1 */}
            <div style={{ border: '1px solid #eaeaea', borderRadius: 'var(--radius)', overflow: 'hidden', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', backgroundColor: '#f3f4f6', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Premium Keychain</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>Engineered for durability.</p>
              <button className="btn btn-primary" style={{ width: '100%' }}>Buy on Amazon</button>
            </div>
            {/* Product 2 */}
            <div style={{ border: '1px solid #eaeaea', borderRadius: 'var(--radius)', overflow: 'hidden', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', backgroundColor: '#f3f4f6', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Krishna Aesthetic Statue</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>Elegant decor for modern homes.</p>
              <button className="btn btn-primary" style={{ width: '100%' }}>Buy on Amazon</button>
            </div>
            {/* Product 3 */}
            <div style={{ border: '1px solid #eaeaea', borderRadius: 'var(--radius)', overflow: 'hidden', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', backgroundColor: '#f3f4f6', marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bathroom Wiper Holder</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>Clever solution for a tidy space.</p>
              <button className="btn btn-primary" style={{ width: '100%' }}>Buy on Amazon</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
