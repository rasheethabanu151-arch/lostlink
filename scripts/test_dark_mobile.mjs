import { chromium } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\sharu\\.gemini\\antigravity\\brain\\170a7f34-b1dd-489d-86b1-bebb4bb0fc61";

async function verifyDarkAndMobile() {
  console.log("🚀 Launching Chromium...");
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Test (1280x880)
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 880 } });
  const desktopPage = await desktopContext.newPage();

  console.log("🌐 Navigating desktop to http://localhost:5173/ ...");
  await desktopPage.goto("http://localhost:5173/");
  await desktopPage.waitForLoadState("networkidle");

  // Since default is now OFF (dark room):
  console.log("📸 Capturing: dark_lamp_off_desktop.png");
  await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, "dark_lamp_off_desktop.png") });

  // Turn lamp ON
  console.log("💡 Turning lamp ON...");
  await desktopPage.click(".light-up-desk-btn");
  await desktopPage.waitForTimeout(600);
  console.log("📸 Capturing: lit_lamp_on_desktop.png");
  await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, "lit_lamp_on_desktop.png") });

  // Turn lamp OFF again to verify it hides everything
  console.log("💡 Turning lamp OFF again via pull chain...");
  await desktopPage.click(".lamp-chain-assembly", { force: true });
  await desktopPage.waitForTimeout(600);
  console.log("📸 Capturing: dark_lamp_off_again_desktop.png");
  await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, "dark_lamp_off_again_desktop.png") });

  await desktopContext.close();

  // 2. Mobile Test (iPhone / 390x844)
  console.log("📱 Testing Mobile Viewport (390x844)...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  });
  const mobilePage = await mobileContext.newPage();

  await mobilePage.goto("http://localhost:5173/");
  await mobilePage.waitForLoadState("networkidle");

  console.log("📸 Capturing: dark_lamp_off_mobile_390px.png");
  await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, "dark_lamp_off_mobile_390px.png") });

  // Turn lamp ON on mobile
  console.log("💡 Turning lamp ON on mobile...");
  await mobilePage.click(".light-up-desk-btn");
  await mobilePage.waitForTimeout(600);
  console.log("📸 Capturing: lit_lamp_on_mobile_390px.png");
  await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, "lit_lamp_on_mobile_390px.png") });

  // Check horizontal overflow on mobile
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  console.log(`📱 Mobile scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px`);
  if (scrollWidth > clientWidth) {
    console.warn("⚠️ Warning: Horizontal overflow detected on mobile!");
  } else {
    console.log("✅ Perfect mobile fit! No horizontal overflow.");
  }

  await mobileContext.close();
  await browser.close();
  console.log("🎉 Verification complete!");
}

verifyDarkAndMobile().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
