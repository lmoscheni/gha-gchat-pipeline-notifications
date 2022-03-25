import core from "@actions/core"
import github from "@actions/github"
import fetch from "node-fetch"

const webHookURL = core.getInput("webHookURL");
const env = core.getInput("env");
const version = core.getInput("version");
const status = core.getInput("status");

const getStatusIcon = (status) => {
  if (status === "FAILED") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/error.png";
  }
  if (status === "RUNNING") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/running.png";
  }
  if (status === "SUCCESS") {
    return "https://raw.githubusercontent.com/lmoscheni/gha-gchat-pipeline-notifications/main/assets/success.png";
  }
};


fetch(webHookURL, {
  method: "POST",
  body: JSON.stringify({
    cards: [
      {
        header: {
          title: `Deploying ${github.event.repository.name} on ${env}`,
          subtitle: `with version ${version}`,
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
                          url: `https://github.com/despegar/arbolito-ui/runs/${github.context.runId}?check_suite_focus=true`,
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
  .catch((err) => {
    core.setFailed(error.message)
  });
