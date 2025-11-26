import { Page } from '@playwright/test';

/**
 * Page Object Model for Pmtool Dashboard Page
 * 
 * Locators are based on stable CSS selectors from dashboard_page.html
 */
export class DashboardPage {
  readonly page: Page;

  // Locators using CSS selectors
  private readonly welcomeHeaderLocator = 'h3#welcome-page-header';
  private readonly notificationBellLocator = 'i.fa.fa-bell-o';
  private readonly userDropdownLocator = 'li.dropdown.user a.dropdown-toggle';
  private readonly usernameSpanLocator = 'li.dropdown.user span.username';
  private readonly profileMenuLocator = 'li.dropdown.user ul.dropdown-menu';
  private readonly logoutButtonLocator = 'li#logout a';
  private readonly myAccountLinkLocator = 'a[href*="users/account"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Check if Welcome page header is visible
   */
  async isWelcomeHeaderVisible(): Promise<boolean> {
    const element = this.page.locator(this.welcomeHeaderLocator);
    return await element.isVisible();
  }

  /**
   * Get the text of the welcome header
   */
  async getWelcomeHeaderText(): Promise<string> {
    return await this.page.locator(this.welcomeHeaderLocator).textContent() || '';
  }

  /**
   * Check if notification bell icon is visible
   */
  async isNotificationBellVisible(): Promise<boolean> {
    const element = this.page.locator(this.notificationBellLocator);
    return await element.isVisible();
  }

  /**
   * Get the displayed username from the header
   */
  async getDisplayedUsername(): Promise<string> {
    return await this.page.locator(this.usernameSpanLocator).textContent() || '';
  }

  /**
   * Click the user profile button to open dropdown
   */
  async clickProfileButton(): Promise<void> {
    await this.page.locator(this.userDropdownLocator).click();
  }

  /**
   * Check if profile menu is visible/opened
   */
  async isProfileMenuVisible(): Promise<boolean> {
    const element = this.page.locator(this.profileMenuLocator);
    return await element.isVisible();
  }

  /**
   * Check if logout button is visible in the profile menu
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    const element = this.page.locator(this.logoutButtonLocator);
    return await element.isVisible();
  }

  /**
   * Click the Logoff button
   */
  async clickLogout(): Promise<void> {
    await this.page.locator(this.logoutButtonLocator).click();
  }

  /**
   * Perform complete logout action
   * Opens profile menu and clicks logout
   */
  async logout(): Promise<void> {
    await this.clickProfileButton();
    await this.clickLogout();
  }

  /**
   * Wait for dashboard to be fully loaded
   * Checks for presence of welcome header and notification bell
   */
  async waitForDashboardLoad(): Promise<void> {
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Wait for welcome header
    await this.page.locator(this.welcomeHeaderLocator).waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for notification bell
    await this.page.locator(this.notificationBellLocator).waitFor({ state: 'visible', timeout: 15000 });
  }
}
