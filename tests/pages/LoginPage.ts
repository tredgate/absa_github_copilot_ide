import { Page } from '@playwright/test';

/**
 * Page Object Model for Pmtool Login Page
 * 
 * Locators are based on stable CSS selectors from login_page.html
 */
export class LoginPage {
  readonly page: Page;

  // Locators using CSS selectors
  private readonly loginTitleLocator = 'h3.form-title';
  private readonly usernameInputLocator = 'input[name="username"]';
  private readonly passwordInputLocator = 'input[name="password"]';
  private readonly loginButtonLocator = 'button[type="submit"].btn.btn-info';
  private readonly rememberMeCheckboxLocator = 'input[name="remember_me"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to Pmtool URL
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Check if Login title is visible
   */
  async isLoginTitleVisible(): Promise<boolean> {
    const element = this.page.locator(this.loginTitleLocator);
    return await element.isVisible();
  }

  /**
   * Get the text of the login title
   */
  async getLoginTitleText(): Promise<string> {
    return await this.page.locator(this.loginTitleLocator).textContent() || '';
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string): Promise<void> {
    await this.page.locator(this.usernameInputLocator).fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.page.locator(this.passwordInputLocator).fill(password);
  }

  /**
   * Fill both username and password
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
  }

  /**
   * Get value from username input
   */
  async getUsernameValue(): Promise<string> {
    return await this.page.locator(this.usernameInputLocator).inputValue();
  }

  /**
   * Get value from password input
   */
  async getPasswordValue(): Promise<string> {
    return await this.page.locator(this.passwordInputLocator).inputValue();
  }

  /**
   * Click Login button
   */
  async clickLogin(): Promise<void> {
    await this.page.locator(this.loginButtonLocator).click();
  }

  /**
   * Perform complete login action
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.clickLogin();
  }
}
