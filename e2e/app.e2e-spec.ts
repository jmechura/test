import { MonetSmartshopPage } from './app.po';

describe('monet-smartshop App', () => {
  let page: MonetSmartshopPage;

  beforeEach(() => {
    page = new MonetSmartshopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('mss works!');
  });
});
