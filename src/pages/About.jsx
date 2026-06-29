import founderImg from '../assets/founder.jpg';

function About() {
  return (
    <div>
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px' }}>
            Our Story
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            We engineer everyday solutions that simply work better.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Our Vision</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--color-text-muted)', fontStyle: 'italic', borderLeft: '4px solid var(--color-accent)', paddingLeft: '1rem' }}>
              "To elevate everyday Indian living through thoughtfully engineered, high-quality solutions."
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1.5rem' }}>
              At Viyona Designs, we noticed a gap in the Indian market. While there are countless plastic products available, many suffer from poor quality, flimsy construction, or simply don't solve the problem they were meant to. We set out to change that by designing premium products from the ground up.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Our Mission</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--color-text-muted)', fontStyle: 'italic', borderLeft: '4px solid var(--color-accent)', paddingLeft: '1rem' }}>
              "To design and manufacture unique, uncompromising quality items—from aesthetic decor to clever utility tools—that you can't find anywhere else."
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1.5rem' }}>
              Every product we release is meticulously engineered and rigorously tested. We refuse to compromise on durability or aesthetics. Whether it's a simple keychain you carry every day or a clever holder that keeps your bathroom tidy, if it bears the Viyona name, it is built to last.
            </p>
          </div>

          {/* Founder Section */}
          <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img 
                src={founderImg} 
                alt="Meenu Sharma, CEO" 
                style={{ width: '250px', height: '250px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--shadow-md)' }} 
              />
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '600' }}>Meet the Founder</h2>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-accent)', marginBottom: '1.5rem', fontWeight: '500' }}>Meenu Sharma, CEO</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Meenu Sharma founded Viyona Designs out of a personal frustration with the lack of high-quality, reliable everyday products in the Indian market. With an eye for precise design and a passion for engineering better solutions, she built Viyona to bridge the gap between necessity and perfection.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--color-text-muted)' }}>
                  Under her leadership, every product undergoes meticulous scrutiny to ensure it not only solves a problem but does so with uncompromising durability and aesthetic elegance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default About;
