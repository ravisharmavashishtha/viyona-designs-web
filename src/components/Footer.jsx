import logoImg from '../assets/logo.png';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '3rem 0', 
      marginTop: 'auto',
      borderTop: '1px solid #eaeaea'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <img src={logoImg} alt="Viyona Designs" style={{ height: '60px', marginBottom: '1rem', objectFit: 'contain' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Thoughtfully Designed. Perfectly Made.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <span>Amazon</span>
          <span>Flipkart</span>
          <span>Meesho</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
