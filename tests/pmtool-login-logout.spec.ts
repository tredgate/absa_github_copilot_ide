import { test } from "@playwright/test";
import { pmtoolTestData } from "../src/test-data/pmtool";
import { PmtoolLoginPage } from "../src/pages/pmtool-login.page";
import { PmtoolDashboardPage } from "../src/pages/pmtool-dashboard.page";

test.describe("Pmtool authentication", () => {
  test("Pmtool Should login and logout", async ({ page }) => {
    const loginPage = new PmtoolLoginPage(page);
    const dashboardPage = new PmtoolDashboardPage(page);

    await loginPage.open(pmtoolTestData.url);
    await loginPage.loginWith(pmtoolTestData.credentials);
    await dashboardPage.expectLoaded();
    await dashboardPage.openProfileMenu();
    await dashboardPage.logout();
    await loginPage.expectOnLoginPage();
  });
});
