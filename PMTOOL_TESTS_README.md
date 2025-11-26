# Pmtool Playwright Test Suite

Automated test suite for Pmtool login/logout functionality using Playwright and Page Object Model pattern.

## Project Structure

```
tests/
├── pages/
│   ├── LoginPage.ts          # Page Object for Login page
│   └── DashboardPage.ts      # Page Object for Dashboard page
├── testData.ts               # Test data and credentials management
├── pmtool.spec.ts            # Main test specification
└── debug*.spec.ts            # Debug tests (can be removed)
```

## Features

✅ **Page Object Model** - Clean separation of page logic and test logic  
✅ **Environment Variables** - Sensitive data stored in `.env` file  
✅ **Reusable Test Data** - Centralized test data management  
✅ **Comprehensive Assertions** - Each step validated with proper checks  
✅ **Stable Locators** - CSS selectors based on HTML structure  
✅ **Headless Mode** - Tests run in headless Chrome by default  
✅ **Screenshots on Failure** - Automatic screenshots when tests fail  
✅ **Trace on Failure** - Playwright trace for debugging failures  

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Credentials

The test credentials are stored in `.env` file:

```env
PMTOOL_URL=https://tredgate.com/pmtool
PMTOOL_USERNAME=absa_ai
PMTOOL_PASSWORD=Absa2025#
```

**⚠️ IMPORTANT:** The `.env` file is in `.gitignore` to prevent committing sensitive data.

### 3. Verify Credentials

Before running tests, verify that the credentials are correct by attempting manual login at https://tredgate.com/pmtool

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/pmtool.spec.ts
```

### Run with UI (Headed Mode)

```bash
npx playwright test --headed
```

### Run with List Reporter

```bash
npx playwright test --reporter=list
```

### Run Specific Browser

```bash
npx playwright test --project=chromium
```

## Test Case: Pmtool Should Login and Logout

### Test Steps

1. **Open Pmtool**
   - Navigate to Pmtool URL
   - ✓ Assert: Login title is visible
   - ✓ Assert: Login title text is "Login"

2. **Fill Login Form**
   - Fill username input with `absa_ai`
   - Fill password input with `Absa2025#`
   - ✓ Assert: Username field contains correct value
   - ✓ Assert: Password field contains correct value

3. **Click Login Button**
   - Click Login button
   - Wait for navigation to dashboard
   - ✓ Assert: Welcome page header is visible
   - ✓ Assert: Welcome header contains correct text
   - ✓ Assert: Notification bell icon is visible
   - ✓ Assert: Username "Absa Training" is displayed

4. **Open Profile Menu**
   - Click user profile button
   - ✓ Assert: Profile menu is opened
   - ✓ Assert: Logout button is visible

5. **Logout**
   - Click Logoff button
   - Wait for navigation to login page
   - ✓ Assert: Login page is displayed
   - ✓ Assert: Login title is visible
   - ✓ Assert: URL contains "users/login"

## Current Status

### ⚠️ Known Issue: Authentication Failure

The test is currently failing with the error:
```
"No match for Username and/or Password."
```

**Possible Causes:**
1. Credentials may have been changed in the system
2. Account may be locked or disabled
3. There may be additional authentication requirements

**Resolution:**
1. Verify credentials with system administrator
2. Update `.env` file with correct credentials
3. Ensure the test account `absa_ai` is active

### Test Execution Evidence

Debug tests confirm:
- ✅ Navigation to login page works
- ✅ Form fields are properly filled
- ✅ Password with `#` character is handled correctly
- ✅ Form submission works
- ❌ Authentication fails with invalid credentials error

## Configuration

### Playwright Config (`playwright.config.ts`)

- **Browser:** Chromium only
- **Headless:** Yes
- **Screenshots:** On failure
- **Trace:** On first retry
- **HTML Report:** Generated but not auto-opened

## Page Objects

### LoginPage

**Locators:**
- Login Title: `h3.form-title`
- Username Input: `input[name="username"]`
- Password Input: `input[name="password"]`
- Login Button: `button[type="submit"].btn.btn-info`

**Methods:**
- `navigate(url)` - Navigate to login page
- `fillUsername(username)` - Fill username field
- `fillPassword(password)` - Fill password field
- `clickLogin()` - Click login button
- `login(username, password)` - Complete login action

### DashboardPage

**Locators:**
- Welcome Header: `h3#welcome-page-header`
- Notification Bell: `i.fa.fa-bell-o`
- User Dropdown: `li.dropdown.user a.dropdown-toggle`
- Username Span: `li.dropdown.user span.username`
- Logout Button: `li#logout a`

**Methods:**
- `waitForDashboardLoad()` - Wait for dashboard to fully load
- `clickProfileButton()` - Open profile menu
- `clickLogout()` - Click logout button
- `logout()` - Complete logout action

## Troubleshooting

### Tests Timeout

If tests timeout waiting for dashboard:
1. Check network connectivity
2. Verify URL is correct
3. Check if login was successful

### Login Fails

If login fails:
1. Verify credentials in `.env` file
2. Try manual login with same credentials
3. Check for error messages in screenshots
4. Look in `test-results/` folder for debugging artifacts

### Screenshots Not Generated

Screenshots are only generated on test failure. Check:
- `test-results/` directory
- Playwright HTML report

## Maintenance

### Updating Locators

If HTML structure changes, update locators in:
- `tests/pages/LoginPage.ts`
- `tests/pages/DashboardPage.ts`

### Updating Test Data

Update test data in `tests/testData.ts`:
- Expected texts
- Timeouts
- Other configuration values

## Clean Up

Remove debug test files before committing:

```bash
rm tests/debug.spec.ts tests/debug2.spec.ts
rm debug-*.png
```

## Security Notes

- Never commit `.env` file
- `.env` is already in `.gitignore`
- Use environment-specific credentials
- Rotate test credentials regularly
