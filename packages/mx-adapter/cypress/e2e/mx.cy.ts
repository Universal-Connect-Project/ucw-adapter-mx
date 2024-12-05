import { JobTypes } from "@repo/utils";
import {
  clickContinue,
  expectConnectionSuccess,
  generateDataTests,
  refreshAConnection,
  visitWithPostMessageSpy,
} from "@repo/utils-dev-dependency";
import { enterMxCredentials, searchAndSelectMx } from "../utils/mx";

const makeAConnection = async (jobType) => {
  searchAndSelectMx();
  enterMxCredentials();
  clickContinue();

  if ([JobTypes.ALL, JobTypes.VERIFICATION].includes(jobType)) {
    cy.findByText("Checking").click();
    clickContinue();
  }
  expectConnectionSuccess();
};

describe("mx aggregator", () => {
  generateDataTests({ makeAConnection, shouldTestVcEndpoint: true });

  it("refreshes an mx connection if given the correct parameters and hides the back button", () => {
    refreshAConnection({
      enterCredentials: enterMxCredentials,
      selectInstitution: searchAndSelectMx,
    });
  });

  // Test RouteHandlers
  it("initiates a connect and verifies the return value of the jobs endpoint", () => {
    let memberGuid: string;
    const jobType = JobTypes.AGGREGATE;
    const userId = Cypress.env("userId");

    visitWithPostMessageSpy(`/widget?job_type=${jobType}&user_id=${userId}`)
      .then(() => makeAConnection(jobType))
      .then(() => {
        cy.get("@postMessage", { timeout: 90000 }).then((mySpy) => {
          const connection = (mySpy as any)
            .getCalls()
            .find(
              (call) => call.args[0].type === "vcs/connect/memberConnected",
            );
          const { metadata } = connection?.args[0];
          memberGuid = metadata.member_guid;

          cy.window().then((win) => {
            const app = win["app"] || {};
            const { connect: connectConfig, ...clientConfig } =
              app["clientConfig"];

            const instrumentationData = {
              message: "widget-config",
              instrumentation: {
                ...clientConfig,
                ...connectConfig,
                current_aggregator: "mx_int",
                aggregator: "mx_int",
              },
            };

            cy.request({
              method: "GET",
              url: `/jobs/${encodeURIComponent(memberGuid)}`,
              headers: {
                meta: JSON.stringify(instrumentationData.instrumentation),
              },
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.haveOwnProperty("member");
              expect(response.body.member).to.haveOwnProperty("guid");
              expect(response.body.member.guid).to.eq(memberGuid);
            });
          });
        });
      });
  });
});
