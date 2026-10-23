import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const ARTIFACTS_DIR = "C:\\Users\\sharu\\.gemini\\antigravity\\brain\\170a7f34-b1dd-489d-86b1-bebb4bb0fc61";

async function runLiveDemo() {
  console.log("🚀 Launching Chromium browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 880 },
  });
  const page = await context.newPage();

  // Define realistic mock API routes adhering to the Java Spring Boot contracts
  await page.route("**/api/auth/login", async (route) => {
    console.log("📡 API intercepted: POST /api/auth/login");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-jwt-token-xyz123",
        username: "Alex Rivera",
        role: "USER",
        email: "alex@example.com",
        contact: "9876543210",
      }),
    });
  });

  await page.route("**/api/posts", async (route) => {
    if (route.request().method() === "GET") {
      console.log("📡 API intercepted: GET /api/posts");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            title: "Black Leather Bi-fold Wallet",
            category: "Wallet",
            location: "North Library 2nd Floor",
            description: "Contains student cards and metro pass. Found under a study desk.",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            mine: false,
            status: "OPEN",
            claimedBy: null,
            type: "FOUND",
          },
          {
            id: 2,
            title: "Lost Silver iPhone 13 Pro",
            category: "Phone",
            location: "Campus Cafeteria",
            description: "Has a transparent MagSafe case with a blue sticker.",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            mine: true,
            status: "OPEN",
            claimedBy: null,
            type: "LOST",
          },
          {
            id: 3,
            title: "Set of Brass Keys with Red Lanyard",
            category: "Keys",
            location: "Gymnasium Locker Area",
            description: "3 brass door keys and 1 small bicycle lock key.",
            createdAt: new Date(Date.now() - 14400000).toISOString(),
            mine: false,
            status: "OPEN",
            claimedBy: null,
            type: "FOUND",
          },
          {
            id: 4,
            title: "Navy Blue Herschel Backpack",
            category: "Bag",
            location: "Bus Stop Terminal B",
            description: "Found on the waiting bench around 5 PM.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            mine: false,
            status: "OPEN",
            claimedBy: null,
            type: "FOUND",
          },
        ]),
      });
    } else {
      await route.continue();
    }
  });

  await page.route("**/api/posts/mine", async (route) => {
    console.log("📡 API intercepted: GET /api/posts/mine");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 2,
          title: "Lost Silver iPhone 13 Pro",
          category: "Phone",
          location: "Campus Cafeteria",
          description: "Has a transparent MagSafe case with a blue sticker.",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          mine: true,
          status: "OPEN",
          claimedBy: null,
          type: "LOST",
        },
        {
          id: 5,
          title: "Found Wireless Earbuds Case",
          category: "Other",
          location: "Science Lecture Hall 101",
          description: "Matte black case, found on seat 14.",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          mine: true,
          status: "CLAIMED",
          claimedBy: "Sarah Jenkins",
          type: "FOUND",
        },
      ]),
    });
  });

  await page.route("**/api/posts/suggestions", async (route) => {
    console.log("📡 API intercepted: GET /api/posts/suggestions");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          myPost: {
            id: 2,
            title: "Lost Silver iPhone 13 Pro",
            category: "Phone",
            location: "Campus Cafeteria",
            description: "Has a transparent MagSafe case.",
            createdAt: new Date().toISOString(),
            mine: true,
            status: "OPEN",
            type: "LOST",
          },
          matches: [
            {
              id: 99,
              title: "Silver Smartphone found near Cafeteria exit",
              category: "Phone",
              location: "Campus Cafeteria",
              description: "Found on table near main door.",
              createdAt: new Date().toISOString(),
              mine: false,
              status: "OPEN",
              type: "FOUND",
            },
          ],
        },
      ]),
    });
  });

  await page.route("**/api/posts/1/questions", async (route) => {
    console.log("📡 API intercepted: GET /api/posts/1/questions");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 101,
          type: "BASIC",
          text: "What color and material is the wallet exterior?",
          options: ["Brown canvas", "Black leather", "Blue nylon", "Red plastic"],
        },
        {
          id: 102,
          type: "UNIQUE",
          text: "What distinctive card or emblem is inside the ID window?",
          options: ["Transit metro card", "Gym badge", "Student card with eagle crest", "Coffee punch card"],
        },
      ]),
    });
  });

  await page.route("**/api/posts/1/claim", async (route) => {
    console.log("📡 API intercepted: POST /api/posts/1/claim");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        verified: true,
        finder: "Morgan Smith",
        contact: "+1 (555) 438-9210",
      }),
    });
  });

  await page.route("**/api/support/mine", async (route) => {
    console.log("📡 API intercepted: GET /api/support/mine");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          message: "Hi, I accidentally entered the wrong city when posting my keys. Can it be edited?",
          reply: "Hello! We have updated your post location to Campus Center. Best regards, LostLink Support.",
          status: "REPLIED",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          repliedAt: new Date(Date.now() - 43200000).toISOString(),
        },
      ]),
    });
  });

  await page.route("**/api/admin/stats", async (route) => {
    console.log("📡 API intercepted: GET /api/admin/stats");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        users: 148,
        lostPosts: 42,
        foundPosts: 89,
        claimed: 34,
        failedClaimUsers: 3,
        openMessages: 1,
        totalMessages: 12,
      }),
    });
  });

  await page.route("**/api/admin/posts", async (route) => {
    console.log("📡 API intercepted: GET /api/admin/posts");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          title: "Black Leather Bi-fold Wallet",
          type: "FOUND",
          category: "Wallet",
          location: "North Library",
          status: "OPEN",
          owner: "Morgan Smith",
          claimedBy: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Lost Silver iPhone 13 Pro",
          type: "LOST",
          category: "Phone",
          location: "Campus Cafeteria",
          status: "OPEN",
          owner: "Alex Rivera",
          claimedBy: null,
          createdAt: new Date().toISOString(),
        },
      ]),
    });
  });

  await page.route("**/api/admin/claim-attempts", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.route("**/api/admin/messages", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  // STEP 1: Navigate to Root / Welcome Scene
  console.log("🌐 Step 1: Navigating to http://localhost:5173/ ...");
  await page.goto("http://localhost:5173/");
  await page.waitForLoadState("networkidle");

  // Capture Lamp ON
  console.log("📸 Capturing: 01_table_lamp_on.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "01_table_lamp_on.png") });

  // STEP 2: Toggle Lamp OFF
  console.log("💡 Step 2: Clicking pull chain to turn lamp OFF...");
  await page.click(".lamp-chain-assembly", { force: true });
  await page.waitForTimeout(600);
  console.log("📸 Capturing: 02_table_lamp_off.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "02_table_lamp_off.png") });

  // STEP 3: Toggle Lamp back ON
  console.log("💡 Step 3: Clicking pill button to turn lamp back ON...");
  await page.click(".lamp-toggle-pill-btn");
  await page.waitForTimeout(600);
  console.log("📸 Capturing: 03_table_lamp_toggled_on.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "03_table_lamp_toggled_on.png") });

  // STEP 4: Switch to Register tab and back to Login
  console.log("📝 Step 4: Testing Register tab...");
  await page.click("button:has-text('Register')");
  await page.waitForTimeout(300);
  console.log("📸 Capturing: 04_register_form.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "04_register_form.png") });

  // STEP 5: Switch back to Sign In and log in
  console.log("🔑 Step 5: Logging in...");
  await page.click("button:has-text('Sign In')");
  await page.fill("#auth-email", "alex@example.com");
  await page.fill("#auth-password", "supersecret123");
  await page.click(".password-toggle-btn"); // Test password unmasking
  await page.waitForTimeout(200);
  console.log("📸 Capturing: 05_login_filled.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "05_login_filled.png") });

  // Submit Login
  await page.click("button[type='submit']");
  await page.waitForTimeout(800);

  // STEP 6: Feed Dashboard
  console.log("📰 Step 6: Navigated to Feed Dashboard...");
  await page.waitForURL("**/feed");
  await page.waitForLoadState("networkidle");
  console.log("📸 Capturing: 06_feed_dashboard.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "06_feed_dashboard.png") });

  // Test Search & Filter on Feed
  console.log("🔍 Testing search filter on Feed...");
  await page.fill(".search-input-wrap input", "Wallet");
  await page.waitForTimeout(300);
  console.log("📸 Capturing: 07_feed_search_filtered.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "07_feed_search_filtered.png") });
  await page.click(".search-clear-btn");

  // STEP 7: Create Post Page
  console.log("➕ Step 7: Navigating to Create Post...");
  await page.goto("http://localhost:5173/new");
  await page.waitForLoadState("networkidle");
  await page.fill("#post-title", "Found Silver Laptop Charger");
  await page.fill("#post-location", "Student Union Building 3rd Floor");
  console.log("📸 Capturing: 08_create_post_page.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "08_create_post_page.png") });

  // STEP 8: Suggestions Page
  console.log("✨ Step 8: Navigating to Suggestions...");
  await page.goto("http://localhost:5173/suggestions");
  await page.waitForLoadState("networkidle");
  console.log("📸 Capturing: 09_suggestions_page.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "09_suggestions_page.png") });

  // STEP 9: Claim Verification Dialogue with Linky
  console.log("💬 Step 9: Testing Claim Verification with Linky...");
  await page.goto("http://localhost:5173/claim/1");
  await page.waitForLoadState("networkidle");
  console.log("📸 Capturing: 10_claim_question_1.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "10_claim_question_1.png") });

  // Pick correct option 1
  console.log("👉 Answering Question 1: 'Black leather'...");
  await page.click("button.claim-option-btn:has-text('Black leather')");
  await page.waitForTimeout(500);

  // Pick correct option 2
  console.log("👉 Answering Question 2: 'Student card with eagle crest'...");
  await page.click("button.claim-option-btn:has-text('Student card with eagle crest')");
  await page.waitForTimeout(800);
  console.log("📸 Capturing: 11_claim_verified_celebration.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "11_claim_verified_celebration.png") });

  // STEP 10: My Posts Page
  console.log("📦 Step 10: Navigating to My Posts...");
  await page.goto("http://localhost:5173/my-posts");
  await page.waitForLoadState("networkidle");
  console.log("📸 Capturing: 12_my_posts_page.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "12_my_posts_page.png") });

  // Test Delete Confirmation Modal
  console.log("🗑️ Opening Delete Confirmation Modal...");
  await page.click(".delete-post-btn >> nth=0");
  await page.waitForTimeout(300);
  console.log("📸 Capturing: 13_delete_confirm_modal.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "13_delete_confirm_modal.png") });
  await page.click("button:has-text('Cancel')");

  // STEP 11: Support Page
  console.log("🆘 Step 11: Navigating to Support...");
  await page.goto("http://localhost:5173/support");
  await page.waitForLoadState("networkidle");
  console.log("📸 Capturing: 14_support_page.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "14_support_page.png") });

  // STEP 12: Admin Dashboard
  console.log("🛡️ Step 12: Navigating to Admin Dashboard...");
  await page.evaluate(() => localStorage.setItem("role", "ADMIN"));
  await page.goto("http://localhost:5173/admin");
  await page.waitForLoadState("networkidle");
  console.log("📸 Capturing: 15_admin_dashboard.png");
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "15_admin_dashboard.png") });

  console.log("🎉 Automated walkthrough completed successfully!");
  await browser.close();
}

runLiveDemo().catch((err) => {
  console.error("❌ Walkthrough Error:", err);
  process.exit(1);
});
