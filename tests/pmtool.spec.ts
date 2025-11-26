import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TestData } from './testData';

/**
 * Test Suite: Pmtool Login and Logout
 * 
 * This test verifies the complete login and logout flow in Pmtool application
 * using Page Object Model pattern with proper assertions at each step.
 */
test.describe('Pmtool Authentication', () => {
  
  test('Should login and logout', async ({ page }) => {
    // Get test credentials from .env file
    const credentials = TestData.getCredentials();
    
    // Initialize Page Objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // ==========================================
    // STEP 1: Open Pmtool
    // Expected: Pmtool is opened, Login title is visible
    // ==========================================
    await test.step('Open Pmtool and verify Login page is displayed', async () => {
      await loginPage.navigate(credentials.url);
      
      // Assert: Login title is visible
      const isLoginTitleVisible = await loginPage.isLoginTitleVisible();
      expect(isLoginTitleVisible).toBeTruthy();
      
      // Assert: Login title has correct text
      const loginTitleText = await loginPage.getLoginTitleText();
      expect(loginTitleText).toBe(TestData.expectedTexts.loginTitle);
    });

    // ==========================================
    // STEP 2: Fill login form inputs
    // Expected: Username and password are filled with correct credentials
    // ==========================================
    await test.step('Fill login form with valid credentials', async () => {
      await loginPage.fillUsername(credentials.username);
      await loginPage.fillPassword(credentials.password);
      
      // Assert: Username field contains correct value
      const usernameValue = await loginPage.getUsernameValue();
      expect(usernameValue).toBe(credentials.username);
      
      // Assert: Password field contains correct value (checking it's filled)
      const passwordValue = await loginPage.getPasswordValue();
      expect(passwordValue).toBe(credentials.password);
    });

    // ==========================================
    // STEP 3: Click Login
    // Expected: Login is successful, Welcome page header and notification icon (bell) are displayed
    // ==========================================
    await test.step('Click Login button and verify successful login', async () => {
      await loginPage.clickLogin();
      
      // Wait for navigation to complete (the URL might be different than expected)
      await page.waitForLoadState('networkidle');
      
      // Wait for dashboard to load
      await dashboardPage.waitForDashboardLoad();
      
      // Assert: Welcome page header is visible
      const isWelcomeHeaderVisible = await dashboardPage.isWelcomeHeaderVisible();
      expect(isWelcomeHeaderVisible).toBeTruthy();
      
      // Assert: Welcome header contains expected text
      const welcomeHeaderText = await dashboardPage.getWelcomeHeaderText();
      expect(welcomeHeaderText).toContain(TestData.expectedTexts.welcomeHeader);
      
      // Assert: Notification bell icon is visible
      const isBellVisible = await dashboardPage.isNotificationBellVisible();
      expect(isBellVisible).toBeTruthy();
      
      // Assert: User is logged in (check displayed username)
      const displayedUsername = await dashboardPage.getDisplayedUsername();
      expect(displayedUsername.trim()).toBe(TestData.expectedTexts.displayedUsername);
    });

    // ==========================================
    // STEP 4: Click profile button with user name
    // Expected: Profile menu box is opened, logout button is visible
    // ==========================================
    await test.step('Open profile menu and verify logout button is visible', async () => {
      await dashboardPage.clickProfileButton();
      
      // Assert: Profile menu is visible/opened
      const isProfileMenuVisible = await dashboardPage.isProfileMenuVisible();
      expect(isProfileMenuVisible).toBeTruthy();
      
      // Assert: Logout button is visible in the menu
      const isLogoutButtonVisible = await dashboardPage.isLogoutButtonVisible();
      expect(isLogoutButtonVisible).toBeTruthy();
    });

    // ==========================================
    // STEP 5: Click Logoff button
    // Expected: Logout is successful, Login Page is displayed
    // ==========================================
    await test.step('Click Logout button and verify return to Login page', async () => {
      await dashboardPage.clickLogout();
      
      // Wait for login title to appear
      await page.locator('h3.form-title').waitFor({ state: 'visible', timeout: 10000 });
      
      // Assert: Login page is displayed again
      const isLoginTitleVisible = await loginPage.isLoginTitleVisible();
      expect(isLoginTitleVisible).toBeTruthy();
      
      // Assert: Login title text is correct
      const loginTitleText = await loginPage.getLoginTitleText();
      expect(loginTitleText).toBe(TestData.expectedTexts.loginTitle);
      
      // Assert: URL contains login path
      expect(page.url()).toContain('users/login');
    });
  });
});
