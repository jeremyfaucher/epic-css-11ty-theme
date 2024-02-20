# epic-css-11ty-theme

A starter [11ty](https://www.11ty.dev/) theme (using the [v2.0 release](https://www.11ty.dev/)) integrated with [epic-css](https://www.npmjs.com/package/epic-css) that is an utility-first UI library.

## Getting Started
 Clone from [Epic CSS - 11ty Theme](https://github.com/jeremyfaucher/epic-css-11ty-theme) GitHub.
 
1. Make a project directory and navigate to it if you don't already have one:
```
mkdir my-blog-name
cd my-blog-name
```
2. Clone this Repository and navigate to it.
```cmd
git clone https://github.com/jeremyfaucher/epic-css-11ty-theme.git
cd epic-css-11ty-theme
```
3. Install dependences
```
npm install
```
4. Run Eleventy to start server and follow to localhost URL http://localhost:8080/.
```
npm run start
```
The `npm run start` command will fire up `eleventy --serve` and watch for any changes to your files. Changes will be auto updated in browser for fast iterating.

You will see a folder named my-epic-css with and index.scss file where you can customize your Epic CSS integration.

## Example usage

```html
<div class="container flex flex-col md-flex-row gap-40 items-center mb-80">
```
- Wrapper for side gutters of 5%: `wrapper`
- Container for max width: `container`
- Push a log to left and nav to right use `flex` `justify-between` `items-center`.
- Medium screen and up flexbox row: `md-flex-row`
- Flex column for mobile first screens below medium: `flex-col`
- Padding top 24px: `pt-24` or padding top and bottom 24px `py-24`.
- Margin bottom 80px: `mb-80`
- Gap of 24px: `flex` `gap-24`

## epic-css
A utility-first CSS framework that easily integrates with any node.js project like 11ty or Next.js. Yes it is very similar Tailwind but much more flexible and can be add to WordPress or PHP projects.

1. **Initialize a new project**: Open your terminal or command prompt and navigate to the directory where you want to create your project. Then, run the following commands to create a new directory for your project and initialize it with npm (Node Package Manager):
```
mkdir my-node-project
cd my-node-project
npm init -y
```
The `npm init -y` command will initialize a new npm project with default settings, automatically generating a `package.json` file.

2. **Install dependencies**: 
```
npm install sass
npm install epic-css
```
This will install Sass and Epic CSS in your `package.json` file as dependencies.

3. Add a folder in the `src` folder or your projects main folder and give it a name of your choice like `my-epic-css`. Then create `index.scss` file and add the imports like this:
```
@import  "../../node_modules/epic-css/src/index";
```
or individually like:
```
@import  "../../node_modules/epic-css/src/_base";
@import  "../../node_modules/epic-css/src/_fontramp";
@import  "../../node_modules/epic-css/src/_colors";
@import  "../../node_modules/epic-css/src/_images";
@import  "../../node_modules/epic-css/src/grid";
@import  "../../node_modules/epic-css/src/_spacing";
```
For this folder structure or adjust as needed.
```
my-project/
    ├── src/
    │   └── my-epic-css/
    │       └── index.scss 
    ├── node_modules/
    ├── package.json
    └── README.md
```
    
Epic CSS will soon be shipping with the ability to only build the CSS that is being used in the `.html`,  `.njk`, `.php` and more.