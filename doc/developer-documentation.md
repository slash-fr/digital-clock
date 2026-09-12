# Developer Documentation

All code in this repository was written by a human being.
It doesn't use a framework, but makes extensive use of ES6 classes, and events.

A [service worker](../dev/service-worker.js) serves cached assets (such as `index.html`, `main.js` and `style.css`)
for offline use.

Please keep in mind that:
- The service worker is only allowed in
  [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts)
  (HTTPS or `localhost`)
- It only works properly in `prod` mode (as it doesn't reference the myriad of `dev` JavaScript files)

## "Build" process

The `dev` folder contains non-minified HTML/JS/CSS.

A PHP script is provided to "build" the minified HTML, CSS and JavaScript files (no Webpack, no `npm`).

You do **not** need PHP on your server. It's only used as a build tool.

### Setup

1. Install the necessary packages:  
   ```sh
   composer install
   ```

2. *(Optional)* Copy `dev/_opengraph-tags.sample.html` to `dev/_opengraph-tags.html`
   (remove the `.sample` extension, and keep the leading underscore)
   and edit it to match your website.  
   In particular, you will need to enter the full absolute URL for `og:url` and `og:image`.

### Usage

1. Update `currentCacheName` in `dev/service-worker.js` when updating assets (HTML, CSS, JS, images, …),
   or they won't update on the client-side (the service worker will serve them from the cache).

2. Run the "build" script:
   ```sh
   php build-prod-files.php
   ```
   It will generate the minified `prod/style.css`, `prod/main.js` and `prod/index.html` files
   from their corresponding source files, and copy any other necessary assets to the `prod` folder.

### Alternative

I've deliberately kept the "build" process very simple, and avoided complex tools.
No need to transpile JavaScript into JavaScript...

If you don't want to use PHP (or Composer), you can simply:
- Copy the CSS file (and a few other assets),
- Concatenate the JS files (in the correct order),
- Remove `dev-only` JS files from `index.html`.

```sh
cp dev/style.css dev/manifest.json dev/favicon.ico \
   dev/*.png dev/service-worker.js prod/
grep '<script' dev/index.html \
    | grep -oP 'src="[\w\-\/]+\.js"' \
    | grep -oP '[\w\-\/]+\.js' \
    | xargs printf -- 'dev/%s\n' \
    | xargs cat > prod/main.js
cat dev/index.html | sed /'class="dev-only"'/d > prod/index.html
```
Files won't be minified, but everything will be in the right place.

ℹ️ Make sure your JS files end with a newline (as they should), to avoid surprises with the `cat` command.

ℹ️ Don't forget to update `currentCacheName` in `dev/service-worker.js` as explained in the previous section.

ℹ️ The alternative commands above won't add OpenGraph tags to your `index.html`.  
If you want them, you could use `sed` (again) to add them from a file:

```sh
sed -i -e '/<head>/{r dev/_opengraph-tags.html' -e '}' prod/index.html
```
