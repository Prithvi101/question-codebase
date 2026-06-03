# React Shopping Cart Assessment

Welcome to the React Shopping Cart assessment!

This is a frontend react project representing a user's shopping cart dashboard. The system has a few bugs, missing state boundary constraints, performance issues (missing keys), and incomplete promo code logic.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run tests:
   ```bash
   npm run test
   ```

## Tasks

1. **Fix Quantity Updates (Boundary Check):** Item quantities must not go below 1. If a user clicks the decrement button when the quantity is 1, it should do nothing. Decrementing the quantity should correctly update the component state.
2. **Fix Cart Total and Subtotal Logic:** The subtotal and tax calculation in the cart is broken. Fix it so that the total is updated correctly when quantities change. Tax should be calculated as 8% of the subtotal (after discount is applied).
3. **Fix List Unique Key Warnings:** The cart items list raises console warnings because it renders elements without unique React keys. Find this map call and assign a correct key.
4. **Implement Promo Code Validation:** The apply discount form is non-functional. Implement the logic to apply a promo code:
   - Entering 'BEE10' should apply a 10% discount on the subtotal.
   - Any other code should show the message "Promo code invalid".
   - If the code is blank, no discount should be applied and no error should display.
