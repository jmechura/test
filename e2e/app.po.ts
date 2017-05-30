import { browser, by, element } from 'protractor';
import { promise as wdpromise } from 'selenium-webdriver';

export class MonetSmartshopPage {
  navigateTo(): wdpromise.Promise<any> {
    return browser.get('/');
  }

  getParagraphText(): any {
    return element(by.css('mss-root h1')).getText();
  }
}
