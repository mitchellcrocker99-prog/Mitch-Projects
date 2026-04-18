"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  store: {
    get: (key) => electron.ipcRenderer.invoke("store:get", key),
    set: (key, value) => electron.ipcRenderer.invoke("store:set", key, value),
    delete: (key) => electron.ipcRenderer.invoke("store:delete", key)
  },
  export: {
    pdf: (html, default_name, paper_size) => electron.ipcRenderer.invoke("export:pdf", html, default_name, paper_size),
    json: (json_string, default_name) => electron.ipcRenderer.invoke("export:json", json_string, default_name)
  },
  import: {
    json: () => electron.ipcRenderer.invoke("import:json")
  }
});
