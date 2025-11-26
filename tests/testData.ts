import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Interface for Pmtool test credentials
 */
export interface PmtoolCredentials {
  url: string;
  username: string;
  password: string;
}

/**
 * Get Pmtool credentials from environment variables
 * @throws Error if required environment variables are not set
 */
export function getPmtoolCredentials(): PmtoolCredentials {
  const url = process.env.PMTOOL_URL;
  const username = process.env.PMTOOL_USERNAME;
  const password = process.env.PMTOOL_PASSWORD;

  if (!url || !username || !password) {
    throw new Error(
      'Missing required environment variables. Please ensure PMTOOL_URL, PMTOOL_USERNAME, and PMTOOL_PASSWORD are set in .env file.'
    );
  }

  return {
    url,
    username,
    password,
  };
}

/**
 * Test Data for Pmtool tests
 */
export const TestData = {
  /**
   * Get credentials from .env file
   */
  getCredentials: getPmtoolCredentials,

  /**
   * Expected texts and values
   */
  expectedTexts: {
    loginTitle: 'Login',
    welcomeHeader: 'Vítej v testovací aplikaci Tredgate Project',
    displayedUsername: 'Absa Training',
  },

  /**
   * Timeout values in milliseconds
   */
  timeouts: {
    default: 30000,
    navigation: 30000,
    elementVisible: 10000,
  },
};
