import { expect, Page } from "@playwright/test";

export class PmtoolDashboardPage {
  private readonly page: Page;
  private readonly selectors = {
    welcomeHeader: "css=#welcome-page-header",
    notificationBell: "css=#user_notifications_report i.fa-bell-o",
    profileToggle: "css=#user_dropdown > a",
    profileMenu: "css=#user_dropdown ul.dropdown-menu",
    logoutLink: "css=#logout > a",
  } as const;

  constructor(page: Page) {
    this.page = page;
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.locator(this.selectors.welcomeHeader)).toBeVisible();
    await expect(
      this.page.locator(this.selectors.notificationBell)
    ).toBeVisible();
  }

  async openProfileMenu(): Promise<void> {
    await this.page.locator(this.selectors.profileToggle).click();
    await expect(this.page.locator(this.selectors.profileMenu)).toBeVisible();
    await expect(this.page.locator(this.selectors.logoutLink)).toBeVisible();
  }

  async logout(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/module=users\/login/),
      this.page.locator(this.selectors.logoutLink).click(),
    ]);
  }
}
