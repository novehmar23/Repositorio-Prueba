const fs = require("node:fs/promises");

async function getStoredSkills() {
  const rawFileContent = await fs.readFile("skills.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedSkills = data.skills ?? [];
  return storedSkills;
}

exports.getStoredSkills = getStoredSkills;
