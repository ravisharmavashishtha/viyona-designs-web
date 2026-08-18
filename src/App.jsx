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

import {
  initGA, initMetaPixel,
  trackPageView, trackMetaPageView,
  trackEvent, trackInitiateCheckout
} from './utils/analytics';

function AmazonFastRedirect({ url, product, name = 'Lord Ganesha Minimalist Murti', price = 550 }) {
  useEffect(() => {
    initGA();
    initMetaPixel();
    const pageTitle = `Redirecting to Amazon — ${name}`;
    document.title = pageTitle;
    trackPageView(window.location.pathname + window.location.search, pageTitle);
    trackInitiateCheckout({ id: product, name, displayName: name, price }, 'fast_redirect');

    // 350ms safe delay gives analytics beacons time to dispatch over the network
    const timer = setTimeout(() => window.location.replace(url), 350);
    return () => clearTimeout(timer);
  }, [url, product, name, price]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>🛒</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Taking you to Amazon India...
      </h2>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Opening the official Viyona Designs product listing.
      </p>
      <a href={url} className="btn btn-amazon" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
        Click here if not redirected automatically ↗
      </a>
    </div>
  );
}

/**
 * Tracks GA4 page views and Meta Pixel PageViews on every SPA route change.
 * Meta PageView is intentionally skipped on the very first render because
 * index.html base code already fires the initial PageView via fbq('track','PageView').
 */
function RouteAnalyticsTracker() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const isInitial = useRef(true);

  // One-time setup on mount
  useEffect(() => {
    initGA();
    initMetaPixel();
    // Support legacy hash routes e.g. /#/product/ganesha-statue
    if (window.location.hash?.startsWith('#/')) {
      navigate(window.location.hash.slice(1), { replace: true });
    }
  }, [navigate]);

  // Fire on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // GA4 — always track
    trackPageView(location.pathname + location.search, document.title);

    // Meta — skip first render (index.html base code already handles it)
    if (isInitial.current) {
      isInitial.current = false;
    } else {
      trackMetaPageView();
    }
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
            <Route path="/buy-ganesha" element={<AmazonFastRedirect url="https://www.amazon.in/dp/B0HF5124YZ" product="ganesha-statue" name="Lord Ganesha Minimalist Murti" price={550} />} />
            <Route path="/buy-puppy" element={<AmazonFastRedirect url="https://www.amazon.in/dp/B0HC36C861" product="sleeping-puppy-organizer" name="Sleeping Puppy Desk Organizer & Catchall Tray" price={499} />} />
            <Route path="/amazon" element={<AmazonFastRedirect url="https://www.amazon.in/dp/B0HF5124YZ" product="ganesha-statue" name="Viyona Designs Amazon Official Store" price={550} />} />

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
