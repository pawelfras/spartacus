import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { OrderEntry, ProductConnector } from '@spartacus/core';
import { ProductData, ProductImportStatus } from '@spartacus/storefront';
import { QuickOrderFacade } from '../facade/quick-order.facade';
import { QuickOrderOrderEntriesContext } from './quick-order-order-entries-context';
import createSpy = jasmine.createSpy;

const mockProductData: ProductData[] = [
  { productCode: '693923', quantity: 1 },
  { productCode: '232133', quantity: 2 },
  { productCode: '756745', quantity: 99999 },
  { productCode: '345345', quantity: 123 },
];

const products = {
  693923: { name: 'mockProductSuccess', code: '693923' },
  232133: { name: 'mockProductSuccess', code: '232133' },
  756745: {
    name: 'mockProductLowStock',
    code: '756745',
    stock: { stockLevel: 150 },
  },
  345345: {
    name: 'mockProductOutOfStock',
    code: '345345',
    stock: { stockLevelStatus: 'outOfStock' },
  },
};

const mockEntries: OrderEntry[] = [
  {
    quantity: 1,
    product: products['693923'],
  },
  {
    quantity: 2,
    product: products['232133'],
  },
  {
    quantity: 99999,
    product: products['756745'],
  },
  {
    quantity: 123,
    product: products['756745'],
  },
];

const unhandledItemErrorId = 'UnhandledItemErrorId';

const canAdd$ = new BehaviorSubject<boolean>(true);

class MockProductConnector implements Partial<ProductConnector> {
  get = createSpy().and.callFake((code) => {
    if (code === unhandledItemErrorId) {
      const response = {
        error: {
          errors: [{ type: 'UNKNOWN_ERROR' }],
        },
      };
      throw response;
    }
    if (products[code]) {
      return of(products[code]);
    } else {
      const response = {
        error: {
          errors: [{ type: 'UnknownIdentifierError' }],
        },
      };
      throw response;
    }
  });
}

class MockQuickOrderFacade implements Partial<QuickOrderFacade> {
  addProduct = createSpy().and.callThrough();
  getEntries = createSpy().and.returnValue(of(mockEntries));
  canAdd = createSpy().and.returnValue(canAdd$.asObservable());
}

describe('QuickOrderOrderEntriesContext', () => {
  let service: QuickOrderOrderEntriesContext;
  let quickOrderFacade: QuickOrderFacade;
  let productConnector: ProductConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { useClass: MockQuickOrderFacade, provide: QuickOrderFacade },
        { useClass: MockProductConnector, provide: ProductConnector },
      ],
    });
    service = TestBed.inject(QuickOrderOrderEntriesContext);
    quickOrderFacade = TestBed.inject(QuickOrderFacade);
    productConnector = TestBed.inject(ProductConnector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEntries', () => {
    it('getEntries from quick order', () => {
      let entries: OrderEntry[];
      service
        .getEntries()
        .subscribe((result) => {
          entries = result;
        })
        .unsubscribe();

      expect(quickOrderFacade.getEntries).toHaveBeenCalledWith();
      expect(entries).toEqual(mockEntries);
    });
  });

  describe('addEntries', () => {
    it('should add entries to quick order', () => {
      const results = [];
      canAdd$.next(true);
      service
        .addEntries(mockProductData)
        .subscribe((data) => {
          results.push(data);
        })
        .unsubscribe();

      expect(productConnector.get).toHaveBeenCalledTimes(
        mockProductData.length
      );

      expect(quickOrderFacade.addProduct).toHaveBeenCalledTimes(
        mockProductData.length
      );

      mockProductData.forEach((mockProduct) => {
        expect(productConnector.get).toHaveBeenCalledWith(
          mockProduct.productCode
        );
        expect(quickOrderFacade.addProduct).toHaveBeenCalledWith(
          products[mockProduct.productCode],
          mockProduct.quantity
        );
      });

      expect(results).toEqual([
        {
          productCode: mockProductData[0].productCode,
          statusCode: ProductImportStatus.SUCCESS,
        },
        {
          productCode: mockProductData[1].productCode,
          statusCode: ProductImportStatus.SUCCESS,
        },
        {
          productCode: mockProductData[2].productCode,
          statusCode: ProductImportStatus.LOW_STOCK,
          productName: 'mockProductLowStock',
          quantity: 99999,
          quantityAdded: 150,
        },
        {
          productCode: mockProductData[3].productCode,
          statusCode: ProductImportStatus.NO_STOCK,
          productName: 'mockProductOutOfStock',
        },
      ]);
    });

    it('should not add entries due to limit', () => {
      const results = [];
      canAdd$.next(false);

      service
        .addEntries(mockProductData)
        .subscribe((data) => {
          results.push(data);
        })
        .unsubscribe();

      expect(quickOrderFacade.addProduct).not.toHaveBeenCalled();

      expect(results).toEqual([
        {
          productCode: mockProductData[0].productCode,
          statusCode: ProductImportStatus.LIMIT_EXCEEDED,
        },
        {
          productCode: mockProductData[1].productCode,
          statusCode: ProductImportStatus.LIMIT_EXCEEDED,
        },
        {
          productCode: mockProductData[2].productCode,
          statusCode: ProductImportStatus.LIMIT_EXCEEDED,
        },
        {
          productCode: mockProductData[3].productCode,
          statusCode: ProductImportStatus.LIMIT_EXCEEDED,
        },
      ]);
    });
  });
});
