const fs = require("node:fs/promises");

async function getStoredExperiences() {
  const rawFileContent = await fs.readFile("experiences.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedProjects = data.experiences ?? [];
  return storedProjects;
}

exports.getStoredExperiences = getStoredExperiences;
