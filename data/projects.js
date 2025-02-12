const fs = require("node:fs/promises");

async function getStoredProjects() {
  const rawFileContent = await fs.readFile("projects.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedProjects = data.projects ?? [];
  return storedProjects;
}

exports.getStoredProjects = getStoredProjects;
