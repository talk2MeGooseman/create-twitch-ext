# Yet Another Extension Example

Simple and straight to the point example configuration for creating a Twitch Extension.

This repository complements the presentation for [Build Your First Twitch Extension](https://docs.google.com/presentation/d/1wAA1dzMM74RwLWCtp_SqtktVzp4I2sQYz_mwl5wq2Cs/edit?usp=sharing). I am using webpack to help with HTML page generation and running a local dev server.

Generates HTML pages for the following views:

- Overlay
- Component
- Panel
- Mobile
- Configuration
- Live Config

This repository is intended to be a bare-bones example so you can then customize everything yourself. Enjoy.

## How it works

Inside `src` all generated HTML views use the same index.html template. If you would like to build a custom HTML page for the different Extension view you can do so by:

- Creating a new HTML page, it should to be called something other then `index.html`, this will be your template base HTML.
- Open `webpack.common.js` and modify the `template` field to use your new HTML file.
- What you call `npm run build` to build new HTML page using your new base template.

Your JavaScript files will automatically be included in the HTML page using webpack. So all you have to do is write you JavaScript and webpack should handle the rest.

## Local Development

To run in development, use the command:

```bash
npm start

```

This command will use `webpack-dev-server` to run a local server to serve the assets on `https://localhost:8080`. You can then load each page by visiting their corresponding address like `https://localhost:8080/panel.html`

You will get a warning for an invalid certification because were using SSL. This is expected and don't worry, just accept and you should bee good to go developing.`

## Building for Release

All you have to do is run:

```bash
npm run build
```

This command will generate all your HTML views, bundle CSS, transpile your JavaScript, bundle your JavaScript into an `app.bundle`, and bundle third-party libraries into `vendor.bundle` files inside `/dist`.

All you have to do next is zip the contents of `/dist` and upload it to Twitch.
