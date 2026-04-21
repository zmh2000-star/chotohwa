import asyncio
from pyppeteer import launch

async def main():
    browser = await launch()
    page = await browser.newPage()
    await page.setViewport({'width': 1440, 'height': 900})
    await page.goto('http://localhost:8080/index2.html')
    await asyncio.sleep(2)  # wait for animations
    await page.screenshot({'path': 'screenshot_hero.png', 'fullPage': False})
    
    # Scroll down to timeline
    await page.evaluate('window.scrollBy(0, 1500)')
    await asyncio.sleep(1)
    await page.screenshot({'path': 'screenshot_timeline.png', 'fullPage': False})
    
    # Scroll down to vision
    await page.evaluate('window.scrollBy(0, 1500)')
    await asyncio.sleep(1)
    await page.screenshot({'path': 'screenshot_vision.png', 'fullPage': False})
    
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())
