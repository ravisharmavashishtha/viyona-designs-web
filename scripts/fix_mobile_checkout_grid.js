const base = 'https://mintcream-antelope-246402.hostingersite.com';
const auth = 'Basic ' + Buffer.from('viyonadesigns@gmail.com:mfRI HA5c R81A hCu3 KbTi xvYs').toString('base64');

async function fixCheckoutTemplate(templateSlug) {
  console.log(`\n======================================================`);
  console.log(`🔧 Patching checkout template: ${templateSlug}`);
  console.log(`======================================================`);

  const res = await fetch(`${base}/wp-json/wp/v2/templates/hostinger-ai-theme//${templateSlug}?context=edit`, {
    headers: { 'Authorization': auth }
  });
  const data = await res.json();
  let content = data?.content?.raw || '';

  if (!content) {
    console.error(`❌ Could not fetch content for ${templateSlug}`);
    return false;
  }

  // 1. Wrap the desktop 2-column grid in @media (min-width: 901px)
  const oldDesktopGrid = `body:not(.woocommerce-order-pay) form.checkout {
  display: grid !important;
  grid-template-columns: 1.15fr 0.85fr !important;
  gap: 36px !important;
  align-items: start !important;
  width: 100% !important;
}`;

  const newDesktopGrid = `@media (min-width: 901px) {
  body:not(.woocommerce-order-pay) form.checkout {
    display: grid !important;
    grid-template-columns: 1.15fr 0.85fr !important;
    gap: 36px !important;
    align-items: start !important;
    width: 100% !important;
  }
}`;

  if (content.includes(oldDesktopGrid)) {
    content = content.replace(oldDesktopGrid, newDesktopGrid);
    console.log('  ✅ Wrapped desktop grid in @media (min-width: 901px)');
  }

  // 2. Wrap the desktop #order_review grid-column & sticky in @media (min-width: 901px)
  const oldDesktopOrderReview = `body:not(.woocommerce-order-pay) .woocommerce-checkout #order_review {
  grid-column: 2 / 3 !important;
  position: sticky !important;
  top: 90px !important;`;

  const newDesktopOrderReview = `@media (min-width: 901px) {
  body:not(.woocommerce-order-pay) .woocommerce-checkout #order_review {
    grid-column: 2 / 3 !important;
    position: sticky !important;
    top: 90px !important;
  }
}
body:not(.woocommerce-order-pay) .woocommerce-checkout #order_review {`;

  if (content.includes(oldDesktopOrderReview)) {
    content = content.replace(oldDesktopOrderReview, newDesktopOrderReview);
    console.log('  ✅ Wrapped desktop #order_review grid-column in @media (min-width: 901px)');
  }

  // 3. Upgrade the mobile media query (< 900px)
  const oldMobileQuery = `@media (max-width: 900px) {
  body:not(.woocommerce-order-pay) form.checkout {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
  }

  .woocommerce-checkout .woocommerce-NoticeGroup,
  .woocommerce-checkout .woocommerce-NoticeGroup-checkout,
  .woocommerce-checkout #customer_details,
  .woocommerce-checkout #order_review {
    grid-column: 1 / -1 !important;
  }`;

  const newMobileQuery = `@media (max-width: 900px) {
  body:not(.woocommerce-order-pay) form.checkout,
  form.checkout {
    display: flex !important;
    flex-direction: column !important;
    gap: 24px !important;
    width: 100% !important;
  }

  body:not(.woocommerce-order-pay) .woocommerce-checkout #customer_details,
  .woocommerce-checkout #customer_details,
  body:not(.woocommerce-order-pay) .woocommerce-checkout #order_review,
  .woocommerce-checkout #order_review {
    grid-column: auto !important;
    position: static !important;
    top: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }`;

  if (content.includes(oldMobileQuery)) {
    content = content.replace(oldMobileQuery, newMobileQuery);
    console.log('  ✅ Upgraded mobile media query with flex column layout');
  }

  // Push update
  const updateRes = await fetch(`${base}/wp-json/wp/v2/templates/hostinger-ai-theme//${templateSlug}`, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });

  if (updateRes.ok) {
    console.log(`  🎉 Successfully updated template: ${templateSlug}`);
    return true;
  } else {
    const err = await updateRes.text();
    console.error(`  ❌ Update failed for ${templateSlug}:`, err);
    return false;
  }
}

export async function runFix() {
  const r1 = await fixCheckoutTemplate('checkout');
  const r2 = await fixCheckoutTemplate('page-checkout');
  if (r1 && r2) {
    console.log('\n🚀 ALL CHECKOUT TEMPLATES PATCHED SUCCESSFULLY!');
  }
}

if (process.argv[1].endsWith('fix_mobile_checkout_grid.js')) {
  runFix();
}
