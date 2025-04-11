"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/** EXTRA DETAILS FOR CLARITY - DELETE COMMENT
 * The main self executing function navigates to the github page and puts
 * the object together.
 * Most of the scraping logic is in 'scrapeServerConfiguration'. MCP server
 * configurations come in JSON that are exposed in some pages and a user
 * can copy them to the browser's clipboard. Others are hidden under a dropdown, i.e.,
 * "Using docker". The scraper looks for docker configurations, followed by npx commands,
 * which is followed by uvx if the preference doesn't exist. For whatever reason, playwright's
 * selector keeps favoring the npx configuration, so another for loop was created
 * to specifically get docker configurations if they exist (ontact author for further
 * explanation).
 * Otherwise, console logs were added for debugging. Delete any comment as preferred,
 * including this one.
 * Build typescript: npm run build
 * Run script: npm start
 */
var playwright_1 = require("playwright");
var fs_1 = require("fs");
var scrapeServerConfiguration = function (server, context, page) { return __awaiter(void 0, void 0, void 0, function () {
    var serverConfig, serverConfigs, _a, _b, _c, _i, config, configIndex, targetConfig, _d, _e, _f, _g, config, configIndex, targetConfig;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                serverConfig = "";
                return [4 /*yield*/, context.grantPermissions(["clipboard-read", "clipboard-write"])];
            case 1:
                _h.sent();
                // console.log(`Navigating to ${server} server page.`);
                return [4 /*yield*/, page
                        .locator(".react-directory-filename-cell")
                        .getByRole("link", { name: server + ", (Directory)" })
                        .click()];
            case 2:
                // console.log(`Navigating to ${server} server page.`);
                _h.sent();
                return [4 /*yield*/, page.waitForTimeout(1000)];
            case 3:
                _h.sent();
                return [4 /*yield*/, page.screenshot({
                        path: "./screenshots/".concat(server, "_page.png"),
                    })];
            case 4:
                _h.sent();
                return [4 /*yield*/, page.getByText("Using docker").isVisible()];
            case 5:
                if (!_h.sent()) return [3 /*break*/, 11];
                /// Check if summary tag contains "docker" text (fetch, git)
                return [4 /*yield*/, page.getByText("Using docker").click()];
            case 6:
                /// Check if summary tag contains "docker" text (fetch, git)
                _h.sent();
                return [4 /*yield*/, page
                        .getByRole("group")
                        .filter({ hasText: "Using docker" })
                        .getByLabel("Copy")
                        .click()];
            case 7:
                _h.sent();
                return [4 /*yield*/, page.waitForTimeout(1000)];
            case 8:
                _h.sent();
                return [4 /*yield*/, page.screenshot({
                        path: "./screenshots/click-summary-for-".concat(server, ".png"),
                    })];
            case 9:
                _h.sent();
                return [4 /*yield*/, page.evaluate("navigator.clipboard.readText()")];
            case 10:
                serverConfig = _h.sent();
                return [3 /*break*/, 21];
            case 11: return [4 /*yield*/, page.waitForTimeout(3000)];
            case 12:
                _h.sent();
                return [4 /*yield*/, page.getByLabel("Copy").all()];
            case 13:
                serverConfigs = _h.sent();
                _a = serverConfigs;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _h.label = 14;
            case 14:
                if (!(_i < _b.length)) return [3 /*break*/, 17];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 16];
                config = _c;
                configIndex = parseInt(config);
                return [4 /*yield*/, page
                        .getByLabel("Copy")
                        .nth(configIndex)
                        .getAttribute("value")];
            case 15:
                targetConfig = _h.sent();
                if (targetConfig === null || targetConfig === void 0 ? void 0 : targetConfig.includes('"command": "npx"')) {
                    serverConfig = targetConfig;
                }
                else if (targetConfig === null || targetConfig === void 0 ? void 0 : targetConfig.includes('"command": "uvx"')) {
                    serverConfig = targetConfig;
                }
                _h.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 14];
            case 17:
                _d = serverConfigs;
                _e = [];
                for (_f in _d)
                    _e.push(_f);
                _g = 0;
                _h.label = 18;
            case 18:
                if (!(_g < _e.length)) return [3 /*break*/, 21];
                _f = _e[_g];
                if (!(_f in _d)) return [3 /*break*/, 20];
                config = _f;
                configIndex = parseInt(config);
                return [4 /*yield*/, page
                        .getByLabel("Copy")
                        .nth(configIndex)
                        .getAttribute("value")];
            case 19:
                targetConfig = _h.sent();
                if (targetConfig === null || targetConfig === void 0 ? void 0 : targetConfig.includes('"command": "docker"')) {
                    serverConfig = targetConfig;
                    // console.log(`${server} server configuration:\n${serverConfig}`);
                }
                _h.label = 20;
            case 20:
                _g++;
                return [3 /*break*/, 18];
            case 21:
                console.log("\n");
                return [4 /*yield*/, page.getByRole("link", { name: "src" }).first().click()];
            case 22:
                _h.sent();
                return [4 /*yield*/, page.waitForTimeout(1500)];
            case 23:
                _h.sent();
                return [2 /*return*/, serverConfig];
        }
    });
}); };
var processServerConfigDetails = function (unprocessedServerConfigDetails) {
    // Discard comments
    unprocessedServerConfigDetails = unprocessedServerConfigDetails.replace(/\/\/\sOptional.*\n/g, "");
    // Discard Python type comments
    unprocessedServerConfigDetails = unprocessedServerConfigDetails.replace(/#.*\n/, "");
    // Make object
    if (!(unprocessedServerConfigDetails.charAt(0) == "{")) {
        // JSON has to start with '{' to be valid JSON, otherwise, an error is thrown.
        unprocessedServerConfigDetails = "{" + unprocessedServerConfigDetails + "}";
    }
    return unprocessedServerConfigDetails;
};
var appendDateTimeToFilename = function (filename) {
    var fullDateTime = new Date().toJSON();
    var currentDateTime = fullDateTime.split(".")[0];
    var processedDateTime = currentDateTime.split(":").join("");
    console.log("".concat(processedDateTime));
    return "".concat(filename, "_").concat(processedDateTime, ".json");
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var chrome, context, page, mcpFolderSection, mcpServers, mcpFolders, _i, mcpFolders_1, mcpFolder, mcpFolderName, mcpServerConfig, processedServerConfigDetails, JSONParsedMcpServerConfig, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, playwright_1.chromium.launch()];
            case 1:
                chrome = _a.sent();
                return [4 /*yield*/, chrome.newContext()];
            case 2:
                context = _a.sent();
                return [4 /*yield*/, context.newPage()];
            case 3:
                page = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 14, 16, 20]);
                console.log("Navigating to github page.");
                return [4 /*yield*/, page.goto("https://github.com/modelcontextprotocol/servers/tree/main/src")];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.screenshot({ path: "screenshots/github_repo_page.png" })];
            case 6:
                _a.sent();
                console.log("Recording folder names of MCP Servers.");
                mcpFolderSection = page.getByRole("table", {
                    name: "Folders and files",
                });
                mcpServers = {};
                return [4 /*yield*/, mcpFolderSection
                        .getByRole("row")
                        .locator(".Link--primary")
                        .all()];
            case 7:
                mcpFolders = _a.sent();
                _i = 0, mcpFolders_1 = mcpFolders;
                _a.label = 8;
            case 8:
                if (!(_i < mcpFolders_1.length)) return [3 /*break*/, 12];
                mcpFolder = mcpFolders_1[_i];
                return [4 /*yield*/, mcpFolder.innerText()];
            case 9:
                mcpFolderName = _a.sent();
                console.log("Processing ".concat(mcpFolderName));
                if (!!(mcpFolderName in mcpFolder)) return [3 /*break*/, 11];
                return [4 /*yield*/, scrapeServerConfiguration(mcpFolderName, context, page)];
            case 10:
                mcpServerConfig = _a.sent();
                processedServerConfigDetails = processServerConfigDetails(mcpServerConfig);
                JSONParsedMcpServerConfig = JSON.parse(processedServerConfigDetails);
                mcpServers[mcpFolderName] =
                    JSONParsedMcpServerConfig.mcpServers[mcpFolderName.replace("-server", "")];
                console.log("Folder name: ".concat(mcpFolderName.replace("-server", "")) +
                    "Target: ".concat(JSONParsedMcpServerConfig.mcpServers[mcpFolderName.replace("-server", "")]));
                _a.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 8];
            case 12:
                console.log(mcpServers);
                return [4 /*yield*/, fs_1.promises.writeFile(appendDateTimeToFilename("mcp_server_configurations"), JSON.stringify(mcpServers, null, 2))];
            case 13:
                _a.sent();
                return [3 /*break*/, 20];
            case 14:
                error_1 = _a.sent();
                return [4 /*yield*/, page.screenshot({ path: "./screenshots/error.png" })];
            case 15:
                _a.sent();
                console.error(error_1);
                return [3 /*break*/, 20];
            case 16: return [4 /*yield*/, page.close()];
            case 17:
                _a.sent();
                return [4 /*yield*/, context.close()];
            case 18:
                _a.sent();
                return [4 /*yield*/, chrome.close()];
            case 19:
                _a.sent();
                return [7 /*endfinally*/];
            case 20: return [2 /*return*/];
        }
    });
}); })();
