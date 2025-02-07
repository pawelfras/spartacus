import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import {
  CheckoutStepService,
  PaymentMethodComponent as CorePaymentMethodComponent,
} from '@spartacus/checkout/components';
import {
  CheckoutDeliveryService,
  CheckoutPaymentService,
  CheckoutService,
} from '@spartacus/checkout/core';
import {
  GlobalMessageService,
  PaymentDetails,
  TranslationService,
  UserPaymentService,
} from '@spartacus/core';
import { DP_CARD_REGISTRATION_STATUS } from '../../../utils/dp-constants';

@Component({
  selector: 'cx-payment-method',
  templateUrl: './dp-payment-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DpPaymentMethodComponent
  extends CorePaymentMethodComponent
  implements OnInit
{
  showCallbackScreen = false;

  isDpCallback(): boolean {
    const queryParams = this.activatedRoute.snapshot.queryParamMap.get(
      DP_CARD_REGISTRATION_STATUS
    );
    if (queryParams) {
      return true;
    } else {
      return false;
    }
  }

  hideCallbackScreen(): void {
    this.showCallbackScreen = false;
  }

  paymentDetailsAdded(paymentDetails: PaymentDetails) {
    this.selectPaymentMethod(paymentDetails);
    this.next();
  }

  constructor(
    protected userPaymentService: UserPaymentService,
    protected checkoutFacade: CheckoutService,
    protected checkoutDeliveryFacade: CheckoutDeliveryService,
    protected checkoutPaymentFacade: CheckoutPaymentService,
    protected globalMessageService: GlobalMessageService,
    protected activatedRoute: ActivatedRoute,
    protected translation: TranslationService,
    protected activeCartFacade: ActiveCartFacade,
    protected checkoutStepService: CheckoutStepService
  ) {
    super(
      userPaymentService,
      checkoutFacade,
      checkoutDeliveryFacade,
      checkoutPaymentFacade,
      globalMessageService,
      activatedRoute,
      translation,
      activeCartFacade,
      checkoutStepService
    );

    this.showCallbackScreen = this.isDpCallback();
  }
}
