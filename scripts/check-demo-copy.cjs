const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const roots = ["src"];
if (process.argv.includes("--output")) roots.push("_site");
const filler = /\b(?:lorem|ipsum|pellentesque|fusce|quisque|suspendisse|consectetur|adipiscing|mauris|porttitor|ullamcorper|vestibulum|chicharrones|shoreditch|fingerstache|gastropub|knausgaard)\b|I'm baby|YOLO pop-up|Typewriter wolf|Your Blog Name|This is a H2 Heading/i;
let checked = 0;
const failures = [];

function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(?:html|njk|md|json)$/i.test(entry.name)) {
      checked++;
      fs.readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
        const match = line.match(filler);
        if (match) failures.push(`${path.relative(projectRoot, file)}:${index + 1}: ${match[0]}`);
      });
    }
  }
}

for (const root of roots) {
  const directory = path.join(projectRoot, root);
  if (!fs.existsSync(directory)) {
    console.error(`${root} is missing; build the site before checking output.`);
    process.exit(1);
  }
  scan(directory);
}
if (failures.length) {
  console.error(`Demo filler found:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Copy check passed: ${checked} content files in ${roots.join(" and ")}.`);
}
