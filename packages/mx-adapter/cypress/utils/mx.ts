import { JobTypes } from "@repo/utils";

import {
  clickContinue,
  expectConnectionSuccess,
  searchByText,
} from "@repo/utils-dev-dependency";

export const searchAndSelectMx = () => {
  searchByText("MX Bank");
  cy.findByLabelText("Add account with MX Bank").first().click();
};

export const enterMxCredentials = () => {
  cy.findByLabelText("Username").type("mxuser");
  cy.findByLabelText("Password").type("correct");
};

export const makeAConnection = async (jobType) => {
  searchAndSelectMx();
  enterMxCredentials();
  clickContinue();

  if ([JobTypes.ALL, JobTypes.VERIFICATION].includes(jobType)) {
    cy.findByText("Checking").click();
    clickContinue();
  }
  expectConnectionSuccess();
};
