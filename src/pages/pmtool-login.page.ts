import { expect, Page } from "@playwright/test";
import { PmtoolCredentials } from "../test-data/pmtool";

export class PmtoolLoginPage {
  private readonly page: Page;
  private readonly selectors = {
    loginTitle: "css=h3.form-title",
    loginForm: "css=form#login_form",
    username: "css=#username",
    password: "css=#password",
    submitButton: 'css=form#login_form button[type="submit"]',
  } as const;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url: string): Promise<void> {
    await this.page.goto(url);
    await this.expectOnLoginPage();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page.locator(this.selectors.loginTitle)).toBeVisible();
    await expect(this.page.locator(this.selectors.loginTitle)).toHaveText(
      "Login"
    );
    await expect(this.page.locator(this.selectors.loginForm)).toBeVisible();
  }

  async loginWith(credentials: PmtoolCredentials): Promise<void> {
    await this.page.locator(this.selectors.username).fill(credentials.username);
    await expect(this.page.locator(this.selectors.username)).toHaveValue(
      credentials.username
    );

    await this.page.locator(this.selectors.password).fill(credentials.password);
    await expect(this.page.locator(this.selectors.password)).toHaveValue(
      credentials.password
    );

    await this.page.locator(this.selectors.submitButton).click();
  }
}
