import assert from "node:assert";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  assert(value, `${key} must be defined in the environment`);
  return value;
};

export interface PmtoolCredentials {
  username: string;
  password: string;
}

export interface PmtoolTestData {
  url: string;
  credentials: PmtoolCredentials;
}

export const pmtoolTestData: PmtoolTestData = {
  url: requireEnv("PMTOOL_URL"),
  credentials: {
    username: requireEnv("PMTOOL_USERNAME"),
    password: requireEnv("PMTOOL_PASSWORD"),
  },
};
