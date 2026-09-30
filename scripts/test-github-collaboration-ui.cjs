"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json"
};

const server = http.createServer((req, res) => {
  const file = path.resolve(root, "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));

    await page.goto(`${base}/simulator/github/index.html`);
    await page.waitForFunction(() => document.querySelector("#content"));

    const packageState = {
      apps: {
        github: {
          user: "developer",
          displayName: "Developer",
          activeRepo: "Developer-7-Intellij",
          repositories: [{
            owner: "sabareeshrao",
            name: "Developer-7-Intellij",
            defaultBranch: "main",
            branches: [{ name: "main" }],
            files: [],
            commits: [],
            tags: [],
            releases: [],
            issues: [],
            pullRequests: [],
            discussions: [],
            projects: []
          }]
        }
      }
    };

    await page.evaluate(pkg => window.postMessage({
      type: "SIM_PACKAGE",
      package: pkg,
      autoType: true
    }, "*"), packageState);

    const issueBody = [
      "Business outcome: establish the GeoOps delivery workflow.",
      "",
      "Acceptance criteria:",
      "- Agile workflow documented",
      "- Definition of Done documented",
      "- PR template exists"
    ].join("\n");

    await page.evaluate(body => window.postMessage({
      type: "SIM_SEEK",
      autoType: true,
      animateFinal: false,
      steps: [
        { action: "createIssue", data: { number: 3, title: "GEO-3 Establish delivery workflow", body, labels: ["feature"] } },
        { action: "openIssue", data: { number: 3 } }
      ]
    }, "*"), issueBody);

    await page.waitForSelector(".issueBody");
    const issue = await page.evaluate(() => ({
      heading: document.querySelector(".view h2")?.innerText || "",
      state: document.querySelector(".view .toolbar .pill")?.innerText || "",
      body: document.querySelector(".issueBody")?.innerText || ""
    }));
    assert(issue.heading.includes("GEO-3 Establish delivery workflow"), "Issue heading missing: " + JSON.stringify(issue));
    assert.equal(issue.state, "Open", "Issue state is not visible: " + JSON.stringify(issue));
    assert(issue.body.includes("Business outcome: establish the GeoOps delivery workflow.\n\nAcceptance criteria:"), "Issue body lost multiline structure: " + JSON.stringify(issue));

    const prBody = [
      "Closes #3",
      "",
      "What changed:",
      "- Agile workflow",
      "- Definition of Done",
      "- issue and PR templates"
    ].join("\n");

    const baseSteps = [
      { action: "createPullRequest", data: {
        number: 1,
        title: "GEO-3 Establish Agile delivery workflow",
        body: prBody,
        head: "feature/GEO-3-delivery-workflow",
        base: "main",
        filesChanged: [
          "docs/process/AGILE-WORKFLOW.md",
          "docs/process/DEFINITION-OF-DONE.md",
          "docs/process/SPRINT-001.md"
        ],
        diff: [
          "+# GeoOps Agile Delivery Workflow",
          "+# GeoOps Definition of Done",
          "+# Sprint 001 — GeoOps Foundation"
        ]
      }},
      { action: "setCheckStatus", data: { number: 1, name: "GeoOps CI / build", status: "success" } },
      { action: "addReview", data: { number: 1, author: "reviewer", state: "approved", body: "Process artifacts match the story and CI is green." } }
    ];

    await page.evaluate(({steps}) => window.postMessage({
      type: "SIM_SEEK",
      autoType: true,
      animateFinal: false,
      steps
    }, "*"), {steps: baseSteps});

    await page.waitForSelector(".reviewEvent");
    const pr = await page.evaluate(() => ({
      description: document.querySelector(".prDescription")?.innerText || "",
      review: document.querySelector(".reviewEvent")?.innerText || "",
      reviewers: document.querySelector(".reviewBox")?.innerText || "",
      check: [...document.querySelectorAll(".commitRow")].map(x => x.innerText).join("\n"),
      mergeButton: document.querySelector("#mergeBtn")?.innerText || ""
    }));
    assert(pr.description.includes("Closes #3\n\nWhat changed:"), "PR description is not visible with real line breaks: " + JSON.stringify(pr));
    assert(pr.review.includes("reviewer reviewed · approved"), "PR review event is not visible: " + JSON.stringify(pr));
    assert(pr.review.includes("Process artifacts match the story and CI is green."), "Review body is missing: " + JSON.stringify(pr));
    assert(pr.reviewers.includes("reviewer"), "Reviewer sidebar is not updated: " + JSON.stringify(pr));
    assert(pr.check.includes("GeoOps CI / build") && pr.check.includes("success"), "PR check is not visible: " + JSON.stringify(pr));
    assert.equal(pr.mergeButton, "Merge pull request");

    await page.evaluate(({steps}) => window.postMessage({
      type: "SIM_SEEK",
      autoType: true,
      animateFinal: false,
      steps: [...steps, { action: "mergePullRequest", data: { number: 1 } }]
    }, "*"), {steps: baseSteps});
    await page.waitForFunction(() => document.querySelector(".view .toolbar .pill")?.textContent.trim() === "Merged");

    assert.deepEqual(errors, [], "GitHub simulator page errors: " + JSON.stringify(errors));
    console.log("GitHub collaboration UI fidelity passed.");
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
