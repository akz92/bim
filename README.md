# Bim

Vim-inspired browser built with [Electron](https://github.com/electron/electron) and [Vue](https://github.com/vuejs/vue)

### Commandbar

Bim has a command bar similar to Vim's, to activate it press `:` while on `normal` mode.

There's a limited number of commands for now, these are all of them:

```shell
open # Opens a url in current tab
open -t # Opens a url in a new tab
reload # Reloads the current tab
stop # Stops reloading the current tab
tab-close N # Closes the current tab or the N-th tab (starting from 1)
tab-focus N # Focuses on the N-th tab (starting from 1)
tab-next # Focuses on the next tab
tab-prev # Focuses on the previous tab
tab-move N # Moves the current tab to the N-th position (starting from 1)
back # Navigates back in tab's history
forward # Navigates forward in tab's history
yank # Yanks current tab's url to the clipboard
inspect # Opens DevTools for the current tab
inspect -b # Opens Bim's DevTools
hints # Shows link hints
hints -t # Opens hint link in a new tab
hints -y # Yank hint link
set navbar show/hide # Hides or shows the navbar
```



### Keyboard shortcuts

Keyboard shortcuts are only recognized while on `normal` mode. I've only implemented basic commands yet, this is the shortcuts currently available:

```shell
i # Enter insert mode
/ # Search in page
o # Opens a url in current tab
shift+o # Opens a url in a new tab
f # Shows link hints
r # Reloads the current tab
x # Closes the current tab
shift+J # Focuses on the previous tab
shift+K # Focuses on the next tab
shift+H # Navigates back in tab's history
shift+L # Navigates forward in tab's history
yy # Yanks current tab's url to the clipboard
yf # Yanks hint link
wi # Opens DevTools for the current tab
```



### Running locally

```shell
# Install packages
npm install

# Start development hot reload server
npm run dev

# Start application
electron .
```



### How to build

```shell
# Install packages
npm install

# Build Vue files
npm run build

# Create package
npm run release:mac
```

