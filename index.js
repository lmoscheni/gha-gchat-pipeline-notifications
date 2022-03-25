const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

const webHookURL = core.getInput("webHookURL");
const env = core.getInput("env");
const version = core.getInput("version");
const status = core.getInput("status");

const getStatusIcon = (status) => {
  if (status === "FAILED") {
    return "https://e7.pngegg.com/pngimages/10/205/png-clipart-computer-icons-error-information-error-angle-triangle.png";
  }
  if (status === "RUNNING") {
    return "https://cdn-icons-png.flaticon.com/512/189/189638.png";
  }
  if (status === "SUCCESS") {
    return "https://flyclipart.com/thumb2/verify-success-success-tick-icon-with-png-and-vector-format-372259.png";
  }
};

github.context.runId

fetch(webHookURL, {
  method: "POST",
  body: JSON.stringify({
    cards: [
      {
        header: {
          title: `Deploying ${github.event.repository.name} on ${env}`,
          subtitle: `with version ${version}`,
          imageUrl:
            "https://icones.pro/wp-content/uploads/2021/06/icone-github-bleu.png",
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
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new Error(res.body.message);
    }
  })
  .catch((err) => core.setFailed(error.message));
