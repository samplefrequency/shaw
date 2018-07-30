import { analytics } from "./analytics";
import { sha256 } from 'js-sha256';

test("Settings Definitions", () => {
  expect(analytics.settings.manual_view).toBeDefined();
  expect(analytics.settings.view_complete).toBeDefined();
  expect(analytics.settings.allow_double_fire).toBeDefined();
  expect(analytics.settings.bsps).toBeDefined();
  expect(analytics.settings.wait_for_all_tags).toBeDefined();
  expect(analytics.settings.retry_tealium_failure).toBeDefined();
  expect(analytics.settings.retry_limit).toBeDefined();
  expect(analytics.settings.event_remap).toBeDefined();
  expect(analytics.settings.profile_map).toBeDefined();
});

test("Validate Profile Map", () => {
  expect(typeof analytics.settings.profile_map).toBe("object");
  analytics.settings.profile_map.every(i => {
    expect(i).toHaveProperty("profile");
    expect(i).toHaveProperty("hostname");
    expect(typeof i.profile).toBe("string");
    expect(Array.isArray(i.hostname)).toBeTruthy();
  });
});

test("Device Detection", () => {
  const device = analytics.tools.device();
  expect(typeof device).toBe("object");
  expect(device).toHaveProperty("device");
  expect(device).toHaveProperty("isMobile");
  expect(device).toHaveProperty("userAgent");
});

test("Object Total", () => {
  const obj = {
    a: 'foo',
    b: 'bar',
    c: {
      a1: 'foo',
      a2: 'bar'
    }
  };
  const object_total = analytics.tools.object_total(obj);
  expect(typeof object_total).toBe("number");
  expect(object_total).toBe(5);
});

test("Uniq", () => {
  const not_uniq = ['item', 'item'];
  const uniq = analytics.tools.uniq(not_uniq);
  expect(uniq.length).toBe(1);
  expect(uniq).toEqual(['item']);
});

test("Plugins Init", () => {
  analytics.plugins.init();
  const active_plugins = analytics.settings.active_plugins;
  expect(active_plugins).toEqual(expect.arrayContaining(['__optimizely', '__marketing_cloud']));
});

test("Clean Object", () => {
  const obj = {
    a: '$@ !/*^',
    b: {
      c: '$@ !/*^'
    }
  };
  const exp = {
    a: '',
    b: {
      c: ''
    }
  };
 const clean = analytics.tools.clean_object(obj);
 expect(clean).toEqual(exp);
});

test("SHA-256", () => {
  const test_string = 'testing';
  const sha = sha256(test_string);
  expect(sha).not.toBe(test_string);
  expect(sha.length).toBe(64);
});

test("Clear Products", () => {
  const products = analytics.settings.default_product_string;
  products.product_id.push('item');
  products.product_quantity.push('item');
  products.product_name.push('item');
  products.product_type.push('item');
  products.product_category.push('item');
  products.product_regular_price.push('item');
  products.product_monthly_charge_less_discount.push('item');
  products.product_recurring_discount.push('item');
  products.product_sale_price.push('item');
  products.product_offer_discount.push('item');
  products.product_order_type.push('item');
  products.product_xsell.push('item');
  products.product_upsell.push('item');
  products.product_rgu.push('item');
  products.product_contract.push('item');

  const clear_products = analytics.cart.clear_products(products);
  expect(clear_products).toBe(analytics.settings.default_product_string);
});
