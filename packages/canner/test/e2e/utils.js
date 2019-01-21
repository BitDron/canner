export function testIdSelector(testid, tag, postfix) {
  return `${tag || ''}[data-testid="${testid}"] ${postfix || ''}`;
}
export async function clickAndWait(page, buttonId, selector) {
  await page.waitFor(500)
  return await Promise.all([
    page.waitForNavigation(),
    page.waitForSelector(selector),
    page.click(buttonId),
  ]);
}