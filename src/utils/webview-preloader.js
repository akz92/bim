require('../libs/hints/hints')
require('../libs/webview-navigation')
require('../libs/webview-listeners')

function loadLinkHintsCss() {
  var node = document.createElement('style');

  node.innerHTML = `
    .vimiumReset {
      background: none;
      border: none;
      bottom: auto;
      box-shadow: none;
      color: black;
      cursor: auto;
      display: inline;
      float: none;
      font-family : "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      font-size: inherit;
      font-style: normal;
      font-variant: normal;
      font-weight: normal;
      height: auto;
      left: auto;
      letter-spacing: 0;
      line-height: 100%;
      margin: 0;
      max-height: none;
      max-width: none;
      min-height: 0;
      min-width: 0;
      opacity: 1;
      padding: 0;
      position: static;
      right: auto;
      text-align: left;
      text-decoration: none;
      text-indent: 0;
      text-shadow: none;
      text-transform: none;
      top: auto;
      vertical-align: baseline;
      white-space: normal;
      width: auto;
      z-index: 2147483647; /* Maximum value in Safari */
    }

    div.internalVimiumHintMarker {
      position: absolute !important;
      display: block !important;
      top: -1px;
      left: -1px;
      white-space: nowrap !important;
      overflow: hidden !important;
      font-size: 11px !important;
      padding: 2px 3px !important;
      background-color: #feda31 !important;
      border: 0 !important;
      border-radius: 2px !important;
      box-shadow: inset 0 -2px 0 #b39922 !important;
    }

    div.internalVimiumHintMarker span {
      color: #4a400e;
      font-family: Helvetica, Arial, sans-serif;
      font-weight: bold;
    }

    div.internalVimiumHintMarker > .matchingCharacter {
      color: #dcbc2a;
    }

    .vimiumHUD, .vimiumHUD * {
      line-height: 100%;
      font-size: 11px;
      font-weight: normal;
    }

    .vimiumHUD {
      position: fixed;
      bottom: 0px;
      left: 40px;
      color: black;
      max-width: 400px;
      min-width: 150px;
      text-align: center;
      background-color: #ebebeb;
      padding: 3px 3px 5px 3px;
      border: 1px solid #b3b3b3;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      font-family: Lucida Grande, Arial, Sans;
      /* One less than vimium's hint markers, so link hints can be shown e.g. for the panel's close button. */
      z-index: 99999998;
      text-shadow: 0px 1px 2px #FFF;
      line-height: 1.0;
      opacity: 0;
    }

    .vimiumHUD a, .vimiumHUD a:hover {
      background: transparent;
      color: blue;
      text-decoration: underline;
    }

    .vimiumHUD a.close-button {
      float:right;
      font-family:courier new;
      font-weight:bold;
      color:#9C9A9A;
      text-decoration:none;
      padding-left:10px;
      margin-top:-1px;
      font-size:14px;
    }

    .vimiumHUD a.close-button:hover {
      color:#333333;
      cursor:default;
      -webkit-user-select:none;
    }
  `;

  document.body.appendChild(node);
}

document.onreadystatechange = loadLinkHintsCss;
