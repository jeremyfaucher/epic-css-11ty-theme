const fs = require('fs');
const { exec } = require('child_process');
const sass = require('sass');
const path = require('path');
// production
const epicConfig = require('../../epicConfig');
// dev
// const epicConfig = require('../../epicConfig');
// Assuming epicConfig.epicThemeDir is the directory path
const epicThemeDir = epicConfig.epicThemeDir;
const sassFilePath = `${epicThemeDir}/pre-light.css`;
const projectStyleDir = epicConfig.projectStyleDir;

// Check if the build folder exists, if not, create it
// if (!fs.existsSync(buildFolderPath)) {
//   fs.mkdirSync(buildFolderPath, { recursive: true });
//   console.log(`Build folder created at ${buildFolderPath}`);
// }

// Check if the Sass file exists, if not, create an empty one
if (!fs.existsSync(sassFilePath)) {
  fs.writeFileSync(sassFilePath, '', 'utf8');
  console.log(`Sass file created at ${sassFilePath}`);
}

// Compile Sass file
exec(`sass --style expanded --source-map --embed-sources --no-error-css --quiet ${epicThemeDir}/index.scss:${sassFilePath} && cp ${sassFilePath} ${projectStyleDir}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  // Handle successful execution
  
  console.log(`Sass file compiled successfully to CSS in projectDir ${sassFilePath}`);
  
  // Read the compiled Sass file content
  const sassFileContent = fs.readFileSync(sassFilePath, 'utf8');
  
  // Process the Sass file content (add additional processing here if needed)
  // For example, extract utility classes, merge with existing styles, etc.
  
  // Write the processed content back to the file
  fs.writeFileSync(sassFilePath, sassFileContent, 'utf8');
  
  console.log(`Processed Sass file content written back to ${sassFilePath}`);
});
