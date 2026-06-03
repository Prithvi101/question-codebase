import React, { useState, useMemo } from 'react';

const INITIAL_ITEMS = [
  { id: 'prod_1', name: 'Wireless Headphones', price: 99.99, quantity: 1 },
  { id: 'prod_2', name: 'Smart Watch', price: 199.99, quantity: 2 },
  { id: 'prod_3', name: 'USB-C Cable (1m)', price: 15.00, quantity: 5 }
];

export default function App() {
  const [cartItems, setCartItems] = useState(INITIAL_ITEMS);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  const updateQuantity = (id, delta) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          // BUG: Quantity boundary check is missing/broken. Can go below 1.
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculations
  const { subtotal, discount, tax, total } = useMemo(() => {
    // BUG: Only accumulates item.price, ignores item.quantity!
    const sub = cartItems.reduce((acc, item) => acc + item.price, 0);

    const disc = appliedPromo === 'BEE10' ? sub * 0.1 : 0;
    
    // BUG: Tax is calculated on subtotal before discount. Should be 8% of (subtotal - discount).
    const calculatedTax = sub * 0.08;

    return {
      subtotal: sub,
      discount: disc,
      tax: calculatedTax,
      total: sub - disc + calculatedTax
    };
  }, [cartItems, appliedPromo]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput === '') {
      setAppliedPromo('');
      // BUG: Should clear error on empty submit, but sets it instead.
      setPromoError('Promo code invalid');
    } else if (promoInput === 'BEE10') {
      setAppliedPromo('BEE10');
      setPromoError('');
    } else {
      setAppliedPromo('');
      // BUG: Fails to set "Promo code invalid" error message.
      setPromoError('');
    }
  };

  return (
    <div className="shopping-cart-app" style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Shopping Cart</h1>
      
      <div className="cart-container" style={{ display: 'flex', gap: 40 }}>
        <div className="items-list" style={{ flex: 2 }}>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              // BUG: Missing unique key prop here!
              <div className="cart-item" style={{ borderBottom: '1px solid #ccc', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <span style={{ color: '#666' }}>${item.price.toFixed(2)} each</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease quantity of ${item.name}`}>-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase quantity of ${item.name}`}>+</button>
                  <button onClick={() => removeItem(item.id)} style={{ marginLeft: 20, color: 'red' }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary" style={{ flex: 1, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
          <h2>Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>Subtotal</span>
            <span className="subtotal-val">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: 'green' }}>
              <span>Discount (10%)</span>
              <span className="discount-val">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>Tax (8%)</span>
            <span className="tax-val">${tax.toFixed(2)}</span>
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontWeight: 'bold' }}>
            <span>Total</span>
            <span className="total-val">${total.toFixed(2)}</span>
          </div>

          <form onSubmit={handleApplyPromo}>
            <input
              type="text"
              placeholder="Promo Code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 10, boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ width: '100%', padding: 8, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Apply Promo
            </button>
            {promoError && <p className="promo-error" style={{ color: 'red', fontSize: 14, marginTop: 5 }}>{promoError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
