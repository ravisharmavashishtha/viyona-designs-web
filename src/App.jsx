import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import BrandShowcase from './pages/BrandShowcase';

import { initGA, initMetaPixel, trackPageView, trackEvent, trackMetaEvent } from './utils/analytics';

function AmazonFastRedirect({ url, product }) {
  useEffect(() => {
    initGA();
    initMetaPixel();
    const pageTitle = `Redirecting to Amazon — ${product}`;
    document.title = pageTitle;
    trackPageView(window.location.pathname + window.location.search, pageTitle);
    trackEvent('amazon_fast_redirect', {
      product_id: product,
      product_name: product === 'ganesha-statue' ? 'Lord Ganesha Minimalist Murti' : product,
      destination: url,
      value: 550,
      currency: 'INR'
    });
    trackMetaEvent('InitiateCheckout', {
      content_name: product === 'ganesha-statue' ? 'Lord Ganesha Minimalist Murti' : product,
      content_ids: [product],
      content_type: 'product',
      value: 550,
      currency: 'INR'
    });

    // 350ms safe delay gives analytics beacons time to dispatch over the network
    const timer = setTimeout(() => {
      window.location.replace(url);
    }, 350);

    return () => clearTimeout(timer);
  }, [url, product]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>🛒</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Taking you to Amazon India...
      </h2>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Opening the official Viyona Designs product listing.
      </p>
      <a 
        href={url} 
        className="btn btn-amazon"
        style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
      >
        Click here if not redirected automatically ↗
      </a>
    </div>
  );
}

function RouteAnalyticsTracker() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initGA();
    initMetaPixel();
    // Catch and redirect legacy hash routes like #/product/ganesha-statue
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const target = window.location.hash.slice(1);
      navigate(target, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <RouteAnalyticsTracker />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Home />} />
            <Route path="/products" element={<Home />} />
            <Route path="/craft" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Branded Fast Amazon Redirects */}
            <Route path="/buy-ganesha" element={<AmazonFastRedirect url="https://www.amazon.in/dp/B0HF5124YZ" product="ganesha-statue" />} />
            <Route path="/buy-puppy" element={<AmazonFastRedirect url="https://www.amazon.in/dp/B0HC36C861" product="sleeping-puppy" />} />
            <Route path="/amazon" element={<AmazonFastRedirect url="https://www.amazon.in/dp/B0HF5124YZ" product="store" />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/brand-assets" element={<BrandShowcase />} />
            {/* Catch-all fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
