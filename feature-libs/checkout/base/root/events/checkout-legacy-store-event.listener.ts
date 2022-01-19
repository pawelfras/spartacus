import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { EventService, LoadUserAddresses, UserActions } from '@spartacus/core';
import { Subscription } from 'rxjs';

/**
 * The event listener which dispatches legacy store actions.
 * It will be removed as soon as the legacy store is removed.
 */
// TODO:#deprecation-checkout remove once all the features using store are switched to c&q
@Injectable({
  providedIn: 'root',
})
export class CheckoutLegacyStoreEventListener implements OnDestroy {
  protected subscriptions = new Subscription();

  constructor(
    protected eventService: EventService,
    protected store: Store<unknown>
  ) {
    this.onUserAction();
  }

  /**
   * Registers events for the user actions.
   */
  protected onUserAction(): void {
    this.subscriptions.add(
      this.eventService.get(LoadUserAddresses).subscribe(({ userId }) => {
        /**
         * TODO:#deprecation-checkout We have to keep this here, since the user address feature is still ngrx-based.
         * Remove once it is switched from ngrx to c&q.
         * We should dispatch an event, which will reload the userAddress$ query.
         */
        this.store.dispatch(new UserActions.LoadUserAddresses(userId));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
