import Shaw_Analytics from './analytics';

const tealium_account = 'shaw';
const tealium_profile = 'uts-shaw-consumer';
const tealium_env = 'dev';
const analytics = new Shaw_Analytics(tealium_account, tealium_profile, tealium_env);

describe('Functional Testing', () => {
  test('Constructor', () => {
    expect(analytics.account).toBe(tealium_account);
    expect(analytics.profile).toBe(tealium_profile);
    expect(analytics.environment).toBe(tealium_env);
  });

  test('Add/Remove/Clear Products', () => {
    const sample_product = {
      product_id: 'test',
      product_quantity: '1',
      product_category: 'Test Products',
      product_sale_price: 5.00,
      product_name: 'Test Item 1',
      product_type: 'test-type',
      product_regular_price: 2.00,
      product_offer_discount: 0.00,
      product_monthly_charge_less_discount: 5.00,
      product_recurring_discount: 0.00,
      product_contract: '2yvp',
    };
    analytics.add_product(sample_product);
    expect(analytics.utag_data.product_id.length).toBe(1);
    expect(analytics.utag_data.product_id[0]).toBe(sample_product.product_id);

    analytics.remove_product('test');
    expect(analytics.utag_data.product_id.length).toBe(0);

    analytics.add_product(sample_product);
    expect(analytics.utag_data.product_id.length).toBe(1);
    expect(analytics.utag_data.product_id[0]).toBe(sample_product.product_id);
    analytics.clear_products();
    expect(analytics.utag_data.hasOwnProperty('product_id')).toBeFalsy();
  });

  test('Security', () => {
    analytics.set({
      home_postal_code: 'sha256',
    });
    expect(analytics.utag_data.home_postal_code).toBe('5d5b09f6dcb2d53a5fffc60c4ac0d55fabdf556069d6631545f42aa6e3500f2e');

    analytics.view({
        home_postal_code: 'sha256-view',
    });
    expect(analytics.utag_data.home_postal_code).toBe('8fdbc88f1baecb3c0bbbcbffd4fd4c021994c9277f384793d429c82b624295af');
  });
});
