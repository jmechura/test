import { browser, by, element } from 'protractor';

export class MonetSmartshopPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('mss-root h1')).getText();
  }
}
