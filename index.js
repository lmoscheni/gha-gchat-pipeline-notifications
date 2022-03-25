import core from "@actions/core"
import github from "@actions/github"
import fetch from "node-fetch"

const webHookURL = core.getInput("webHookURL");
const env = core.getInput("env");
const version = core.getInput("version");
const status = core.getInput("status");

const getStatusIcon = (status) => {
  if (status === "failure") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/error.png";
  }
  if (status === "running") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/running.png";
  }
  if (status === "success") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/success.png";
  }
  if (status === "cancelled") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/cancelled.png";
  }
};

fetch(webHookURL, {
  method: "POST",
  body: JSON.stringify({
    cards: [
      {
        header: {
          title: `Deploying ${github.context.repo.repo} on ${env}`,
          subtitle: version,
          imageUrl:
            "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/github.png",
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: "status",
                  content: status,
                  iconUrl: getStatusIcon(status),
                },
              },
              {
                buttons: [
                  {
                    textButton: {
                      text: "See workflow",
                      onClick: {
                        openLink: {
                          url: `https://github.com/despegar/arbolito-ui/actions/runs/${github.context.runId}?check_suite_focus=true`,
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }),
})
  .then((res) => res.json())
  .then((res) => {
    if (!!res.error) {
      throw new Error(res.error.message);
    }
  })
  .catch((error) => {
    core.setFailed(error.message)
  });
