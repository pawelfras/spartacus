import * as cartCoupon from '../../../helpers/coupons/cart-coupon';
import { viewportContext } from '../../../helpers/viewport-context';

describe('Cart Coupon', () => {
  viewportContext(['mobile', 'desktop'], () => {
    beforeEach(() => {
      cy.window().then((win) => win.sessionStorage.clear());
      cy.requireLoggedIn();
    });

    it('should apply cart coupon', () => {
      const stateAuth = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
      cartCoupon.visitProductPage(cartCoupon.productCode1);

      //TODO products can be added to cart asynchronously
      cartCoupon.addProductToCart(cartCoupon.productCode1);
      cartCoupon.applyCoupon(cartCoupon.couponForCart);
      cartCoupon.placeOrder(stateAuth.token);
      // Pend verification in order confirmation page, not order details. $$$ 
      //cartCoupon.placeOrder(stateAuth.token).then((orderData) => {
      //  cartCoupon.verifyOrderHistory(orderData, cartCoupon.couponForCart);
      //});
    });
  });
});
