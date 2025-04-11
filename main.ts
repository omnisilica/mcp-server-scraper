import { BrowserContext, chromium, Page } from "playwright";
import { promises as fs } from "fs";

const scrapeServerConfiguration = async (
  server: string,
  context: BrowserContext,
  page: Page
): Promise<string> => {
  let serverConfig = "";

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  // console.log(`Navigating to ${server} server page.`);

  await page
    .locator(".react-directory-filename-cell")
    .getByRole("link", { name: server + ", (Directory)" })
    .click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: `./screenshots/${server}_page.png`,
  });

  // Check if summary tag needs to be opened
  if (await page.getByText("Using docker").isVisible()) {
    /// Check if summary tag contains "docker" text (fetch, git)
    await page.getByText("Using docker").click();
    await page
      .getByRole("group")
      .filter({ hasText: "Using docker" })
      .getByLabel("Copy")
      .click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `./screenshots/click-summary-for-${server}.png`,
    });
    serverConfig = await page.evaluate("navigator.clipboard.readText()");
    // console.log(`${server} server configuration:\n${serverConfig}`);
  } else {
    await page.waitForTimeout(3000);

    let serverConfigs = await page.getByLabel("Copy").all();

    for (let config in serverConfigs) {
      let configIndex = parseInt(config);
      let targetConfig = await page
        .getByLabel("Copy")
        .nth(configIndex)
        .getAttribute("value");
      if (targetConfig?.includes('"command": "npx"')) {
        serverConfig = targetConfig;
      } else if (targetConfig?.includes('"command": "uvx"')) {
        serverConfig = targetConfig;
      }
      // console.log(`${server} server configuration:\n${serverConfig}`);
    }

    for (let config in serverConfigs) {
      let configIndex = parseInt(config);
      let targetConfig = await page
        .getByLabel("Copy")
        .nth(configIndex)
        .getAttribute("value");
      if (targetConfig?.includes('"command": "docker"')) {
        serverConfig = targetConfig;
        // console.log(`${server} server configuration:\n${serverConfig}`);
      }
    }
  }

  console.log("\n");
  await page.getByRole("link", { name: "src" }).first().click();
  await page.waitForTimeout(1500);
  return serverConfig;
};

const processServerConfigDetails = (
  unprocessedServerConfigDetails: string
): string => {
  // Discard comments
  unprocessedServerConfigDetails = unprocessedServerConfigDetails.replace(
    /\/\/\sOptional.*\n/g,
    ""
  );
  // Discard Python type comments
  unprocessedServerConfigDetails = unprocessedServerConfigDetails.replace(
    /#.*\n/,
    ""
  );
  // Make object
  if (!(unprocessedServerConfigDetails.charAt(0) == "{")) {
    // JSON has to start with '{' to be valid JSON, otherwise, an error is thrown.
    unprocessedServerConfigDetails = "{" + unprocessedServerConfigDetails + "}";
  }

  return unprocessedServerConfigDetails;
};

const appendDateTimeToFilename = (filename: string): string => {
  const fullDateTime = new Date().toJSON();
  const currentDateTime = fullDateTime.split(".")[0];
  const processedDateTime = currentDateTime.split(":").join("");
  console.log(`${processedDateTime}`);
  return `${filename}_${processedDateTime}.json`;
};

(async () => {
  const chrome = await chromium.launch();
  const context = await chrome.newContext();
  const page = await context.newPage();

  try {
    console.log("Navigating to github page.");
    await page.goto(
      "https://github.com/modelcontextprotocol/servers/tree/main/src"
    );
    await page.screenshot({ path: "screenshots/github_repo_page.png" });

    console.log("Recording folder names of MCP Servers.");
    const mcpFolderSection = page.getByRole("table", {
      name: "Folders and files",
    });
    let mcpServers: {
      [mcpServer: string]: any;
    } = {};
    const mcpFolders = await mcpFolderSection
      .getByRole("row")
      .locator(".Link--primary")
      .all();

    for (const mcpFolder of mcpFolders) {
      let mcpFolderName = await mcpFolder.innerText();
      console.log(`Processing ${mcpFolderName}`);
      if (!(mcpFolderName in mcpFolder)) {
        let mcpServerConfig = await scrapeServerConfiguration(
          mcpFolderName,
          context,
          page
        );
        // console.log(`\nServer Config Details before processing:\n${mcpServerConfig}`);
        let processedServerConfigDetails =
          processServerConfigDetails(mcpServerConfig);
        console.log(
          `\nServer Config Details after processing:\n${processedServerConfigDetails}`
        );

        let JSONParsedMcpServerConfig = JSON.parse(
          processedServerConfigDetails
        );
        mcpServers[mcpFolderName] =
          JSONParsedMcpServerConfig.mcpServers[
            mcpFolderName.replace("-server", "")
          ];
        console.log(
          `Folder name: ${mcpFolderName.replace("-server", "")}` +
            `Target: ${
              JSONParsedMcpServerConfig.mcpServers[
                mcpFolderName.replace("-server", "")
              ]
            }`
        );
        /*console.log(
          `\nParsed and raw Server Config Details:\n` +
            JSONParsedMcpServerConfig +
            `\nParsed and Stringified Server Config Details:\n` +
            JSON.stringify(JSONParsedMcpServerConfig)
        );*/
      }
    }

    console.log(mcpServers);
    await fs.writeFile(
      appendDateTimeToFilename("mcp_server_configurations"),
      JSON.stringify(mcpServers, null, 2)
    );
  } catch (error) {
    await page.screenshot({ path: "./screenshots/error.png" });

    console.error(error);
  } finally {
    await page.close();
    await context.close();
    await chrome.close();
  }
})();
