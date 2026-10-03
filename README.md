# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

## GitHub Pages Deployment

This project is configured to deploy to:

- https://dross7278-star.github.io/david-internship

Use these commands:

### `npm run deploy`

Builds the app and publishes the `build` folder to the `gh-pages` branch.

If this is your first deployment, ensure GitHub Pages is enabled in repository settings and set the source branch to `gh-pages`.

## Vercel Deployment

The `homepage` in `package.json` makes Create React App prefix every asset URL and the router `basename` with `/david-internship` for GitHub Pages. Vercel serves the app from `/`, so `vercel.json` overrides this for Vercel builds only:

- **Framework:** `create-react-app`
- **Install command:** `npm ci`
- **Build command:** `PUBLIC_URL=/ npm run build` (overrides `homepage`, so assets load from `/static/...` and the router basename is the site root)
- **Output directory:** `build` (built from `src/` and `public/`; the compiled files committed at the repo root for GitHub Pages are not used)
- **Rewrites:** all paths except `/static/*` fall back to `/index.html`, so deep links such as `/explore` or `/author/:authorId` work on refresh. Existing files are served first, and missing `/static/*` files return 404.

In the Vercel dashboard:

1. Import this GitHub repository with the Git integration and set **Root Directory** to the repository root (leave it empty).
2. Under **Settings → Build and Deployment**, turn off any Framework, Build Command, Output Directory, or Install Command overrides so `vercel.json` is used. Any override you keep must match the values above.
3. Make sure the production domain (for example `david-internship-eta.vercel.app`) is assigned to this project under **Settings → Domains**.
4. Redeploy production after merging this config, either by pushing to the production branch or with **Redeploy** on the latest deployment, with the build cache cleared.

You can check a Vercel-style build locally with `PUBLIC_URL=/ npm run build`. `build/index.html` should then reference `/static/...` and not `/david-internship/static/...`.

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
