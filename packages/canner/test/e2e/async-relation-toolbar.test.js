const puppeteer = require('puppeteer');
const {testIdSelector} = require('./utils');

let browser;
let page;
jest.setTimeout(60000);


describe('on page load', () => {
  beforeAll(async () => { 
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 0
    }) 
    page = (await browser.pages())[0]
    await page.goto('http://localhost:8080/demo/products/products1');
    await page.waitForSelector(testIdSelector('back-button'));
     // reset localStorage
     await page.evaluate(() => { localStorage.clear(); });
    await page.setViewport({
      width: 900,
      height: 800
    })
  });
  
  afterAll(() => {
    browser.close();
  })

  it('should open relation modal', async () => {
    await page.click(testIdSelector('products/categories', '', 'a'));
    await page.waitForSelector(testIdSelector('pagination-previous-button'));
    const trLength = await page.$$eval('.ant-modal-body table tr', trs => trs.length);
    // should be 10 customers at least, and antd will render more tr for style reasons
    expect(trLength).toBeGreaterThan(10);
  });

  it.only('should go to next page', async () => {
    await page.click(testIdSelector('products/categories', '', 'a'));
    await page.waitForSelector(testIdSelector('pagination-previous-button'));
    const originTable = await page.$eval('.ant-modal-body table', table => table.innerText);
    await page.click(testIdSelector('pagination-next-button', ''));
    await page.waitFor(originTable => {
      return document.querySelector('.ant-modal-body table').innerText !== originTable
    }, originTable);

    const trLength = await page.$$eval('.ant-modal-body table tr', trs => trs.length);
    expect(trLength).toBeLessThan(10);
  });

  it('should go to next page', async () => {
    await page.click(testIdSelector('products/categories', '', 'a'));
    await page.waitForSelector(testIdSelector('pagination-previous-button'));
    const originTable = await page.$eval('.ant-modal-body table', table => table.innerText);

    await page.click(testIdSelector('pagination-next-button'));
    await page.waitFor(() => {
      return document.querySelector('.ant-modal-body table').innerText !== originTable
    });

    const nextTable = await page.$eval('.ant-modal-body table', table => table.innerText);
    expect(originTable).not.toBe(nextTable);
  });

  it('should have same content aftering returning same page', async () => {
    await page.click(testIdSelector('products/categories', '', 'a'));
    await page.waitForSelector(testIdSelector('pagination-previous-button'));
    const originTable = await page.$eval('.ant-modal-body table', table => table.innerText);

    await page.click(testIdSelector('pagination-next-button'));
    await page.waitFor(originTable => {
      return document.querySelector('.ant-modal-body table').innerText !== originTable
    }, originTable);
  
    await page.click(testIdSelector('pagination-previous-button'));
    await page.waitFor(originTable => {
      return document.querySelector('.ant-modal-body table').innerText === originTable
    }, originTable);

    const nextTable = await page.$eval('.ant-modal-body table', table => table.innerText);
    expect(originTable).toBe(nextTable);
  });

});