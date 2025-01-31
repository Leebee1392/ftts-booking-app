import nunjucks from 'nunjucks';
import i18next from 'i18next';
import { NextFunction } from 'express';
import { App } from '../../app';
import config from '../../src/config';
import { addNunjucksFilters } from '../../src/nunjucks-filters/filter-manager';
import resources from '../../src/locales';
import { Locale } from '../../src/domain/enums';

jest.mock('nunjucks');
jest.mock('../../src/nunjucks-filters/filter-manager');
jest.mock('../../src/libraries/ftts-session', () => jest.fn((req, res, next: NextFunction) => next()));
jest.spyOn(i18next, 'init');

describe('App Locals Entrypoint', () => {
  test('App config is set', () => {
    const actual = App();

    expect(actual.locals.insights).toStrictEqual(process.env.APPINSIGHTS_INSTRUMENTATIONKEY);
    expect(actual.locals.gtmId).toStrictEqual(process.env.GOOGLE_TAG_MANAGER_TRACKING_ID);
    expect(actual.locals.assetPath).toStrictEqual(config.view.assetPath);
    expect(actual.locals.assetUrl).toStrictEqual(config.view.assetPath);
    expect(actual.locals.serviceName).toStrictEqual(config.view.serviceName);
  });

  test('Nunjucks is configured', () => {
    const actual = App();

    expect(addNunjucksFilters).toHaveBeenCalled();
    expect(nunjucks.configure).toHaveBeenCalledWith([
      expect.stringContaining('/views/'),
    ], expect.objectContaining({
      autoescape: true,
      express: actual,
      noCache: false,
      watch: false,
    }));
  });

  test('Express settings are configured', () => {
    const actual = App();

    expect(actual.settings['view engine']).toStrictEqual('njk');
    expect(actual.settings['trust proxy']).toStrictEqual(1);
    expect(actual.settings['query parser']).toStrictEqual('extended');
  });

  test('Locales are configured', () => {
    App();
    expect(i18next.init).toHaveBeenCalledWith(expect.objectContaining({
      resources,
      initImmediate: false,
      fallbackLng: [Locale.GB],
      preload: [Locale.GB, Locale.NI, Locale.CY],
    }));
  });
});
