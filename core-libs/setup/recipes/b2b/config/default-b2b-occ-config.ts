// We need this import for augmentation of OccEndpoints to pick up
import { CartOccEndpoints } from '@spartacus/cart/base/occ';
import { CheckoutOccEndpoints } from '@spartacus/checkout/occ';
import { OccConfig } from '@spartacus/core';
import { OrderOccEndpoints } from '@spartacus/order/occ';
import { UserAccountOccEndpoints } from '@spartacus/user/account/occ';
import { UserProfileOccEndpoints } from '@spartacus/user/profile/occ';

// While it is not strictly required to define checkout endpoints in a separate `CheckoutOccEndpoints`
// variable, type augmentation does require that this file imports `CheckoutOccEndpoints`.
// A good way to make sure the `CheckoutOccEndpoints` import is not removed by mistake is to use
// `CheckoutOccEndpoints` in the code.
const defaultB2bCheckoutOccEndpoints: CheckoutOccEndpoints = {
  setDeliveryAddress: 'orgUsers/${userId}/carts/${cartId}/addresses/delivery',
  placeOrder: 'orgUsers/${userId}/orders?fields=FULL',
};

const defaultB2bUserAccountOccEndpoints: UserAccountOccEndpoints = {
  user: 'orgUsers/${userId}',
};

const defaultB2bUserProfileOccEndpoints: UserProfileOccEndpoints = {
  userUpdateProfile: 'users/${userId}',
  userCloseAccount: 'users/${userId}',
};

const defaultB2bCartOccEndpoints: CartOccEndpoints = {
  addEntries: 'orgUsers/${userId}/carts/${cartId}/entries?quantity=${quantity}',
};

const defaultB2bOrderOccEndpoints: OrderOccEndpoints = {
  scheduleReplenishmentOrder:
    'orgUsers/${userId}/replenishmentOrders?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType',
  replenishmentOrderDetails:
    'users/${userId}/replenishmentOrders/${replenishmentOrderCode}?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType,user',
  replenishmentOrderDetailsHistory:
    'users/${userId}/replenishmentOrders/${replenishmentOrderCode}/orders',
  cancelReplenishmentOrder:
    'users/${userId}/replenishmentOrders/${replenishmentOrderCode}?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType,user',
  replenishmentOrderHistory:
    'users/${userId}/replenishmentOrders?fields=FULL,replenishmentOrders(FULL, purchaseOrderNumber)',
};

export const defaultB2bOccConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        ...defaultB2bCheckoutOccEndpoints,
        ...defaultB2bUserAccountOccEndpoints,
        ...defaultB2bUserProfileOccEndpoints,
        ...defaultB2bCartOccEndpoints,
        ...defaultB2bOrderOccEndpoints,
        user: 'orgUsers/${userId}',
        userUpdateProfile: 'users/${userId}',
        userCloseAccount: 'users/${userId}',
      },
    },
  },
};
