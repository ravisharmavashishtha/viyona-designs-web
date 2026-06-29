import logoImg from '../assets/logo.jpg';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '3rem 0', 
      marginTop: 'auto',
      borderTop: '1px solid #eaeaea'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <img src={logoImg} alt="Viyona Designs" style={{ height: '30px', marginBottom: '1rem' }} />
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
