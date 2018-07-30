import * as utils from './utils';
test("Utilities Functions", () => {
    expect(utils.path()).toBeDefined();
    expect(utils.getUrlParam()).toBeDefined();
    expect(utils.cookie()).toBeDefined();
    expect(utils.geoip()).toBeDefined();
    expect(utils.user_location()).toBeDefined();
});

