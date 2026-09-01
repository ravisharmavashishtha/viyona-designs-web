import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('viyona_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('viyona_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    const clean = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const priceNum = parsePrice(product.price);
        const mrpNum = parsePrice(product.mrp);
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            displayName: product.displayName || product.name,
            price: priceNum,
            priceFormatted: product.price,
            mrp: mrpNum,
            mrpFormatted: product.mrp,
            image: product.images?.[0] || product.lifestyleImage,
            quantity: Math.max(1, quantity),
            sku: product.specs?.['SKU'] || (product.id === 'ganesha-statue' ? 'VD-GANESHA-WHT-01' : product.id === 'sleeping-puppy-organizer' ? 'GEN-PUPPY-TRAY-WHT' : 'VD-PHONE-STAND-BLK-01'),
            weight: product.specs?.['Item Weight'] || '150g'
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalMrp = cart.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const totalSavings = Math.max(0, totalMrp - subtotal);
  const shippingFee = 0; // 100% Free Pan-India shipping

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        totalMrp,
        totalSavings,
        shippingFee
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
