import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckoutCostCenterAdapter } from '@spartacus/checkout/core';
import {
  Cart,
  CART_NORMALIZER,
  ConverterService,
  normalizeHttpError,
  OccEndpointsService,
} from '@spartacus/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OccCheckoutCostCenterAdapter implements CheckoutCostCenterAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  setCostCenter(
    userId: string,
    cartId: string,
    costCenterId: string
  ): Observable<Cart> {
    return this.http
      .put(this.getSetCartCostCenterEndpoint(userId, cartId, costCenterId), {})
      .pipe(
        catchError((error) => throwError(normalizeHttpError(error))),
        this.converter.pipeable(CART_NORMALIZER)
      );
  }

  protected getSetCartCostCenterEndpoint(
    userId: string,
    cartId: string,
    costCenterId: string
  ): string {
    return this.occEndpoints.buildUrl('setCartCostCenter', {
      urlParams: { userId, cartId },
      queryParams: { costCenterId },
    });
  }
}
