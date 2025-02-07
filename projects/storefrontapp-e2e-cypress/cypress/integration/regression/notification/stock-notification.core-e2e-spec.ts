import * as notification from '../../../helpers/notification';
import { clearAllStorage } from '../../../support/utils/clear-all-storage';

describe('Stock Notification for Guest', () => {
  before(() => {
    clearAllStorage();
    cy.visit('/');
  });
  it('should login first when guest want to subscribe notification', () => {
    notification.verifyStockNotificationAsGuest();
  });
});

describe('Stock Notification for Customer', () => {
  beforeEach(() => {
    clearAllStorage();
    cy.requireLoggedIn();
    cy.visit('/');
  });

  it('should navigate to notification preference page through product detail page', () => {
    notification.verifyStockNotificationWithoutChannel();
  });
  it('should subscribe/unsubscribe notification', () => {
    notification.verifyStockNotification();
  });
});
