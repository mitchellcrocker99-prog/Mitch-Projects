"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
class JsonStore {
  data = {};
  file_path;
  constructor() {
    const user_data = electron.app.getPath("userData");
    if (!fs.existsSync(user_data)) fs.mkdirSync(user_data, { recursive: true });
    this.file_path = path.join(user_data, "resume-builder-store.json");
    try {
      this.data = JSON.parse(fs.readFileSync(this.file_path, "utf-8"));
    } catch {
      this.data = {};
    }
  }
  get(key) {
    return this.data[key] ?? null;
  }
  set(key, value) {
    this.data[key] = value;
    fs.writeFileSync(this.file_path, JSON.stringify(this.data), "utf-8");
  }
  delete(key) {
    delete this.data[key];
    fs.writeFileSync(this.file_path, JSON.stringify(this.data), "utf-8");
  }
}
const store = new JsonStore();
function createWindow() {
  const preload_path = path.join(__dirname, "../preload/index.js");
  console.log("[main] preload path:", preload_path);
  console.log("[main] preload exists:", fs.existsSync(preload_path));
  const main_window = new electron.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1e3,
    minHeight: 700,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0f172a",
    webPreferences: {
      preload: preload_path,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false
  });
  main_window.once("ready-to-show", () => main_window.show());
  if (process.env["ELECTRON_RENDERER_URL"]) {
    main_window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    main_window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.ipcMain.handle("store:get", (_event, key) => store.get(key));
electron.ipcMain.handle("store:set", (_event, key, value) => {
  store.set(key, value);
});
electron.ipcMain.handle("store:delete", (_event, key) => {
  store.delete(key);
});
electron.ipcMain.handle(
  "export:pdf",
  async (_event, html, default_name, paper_size) => {
    const { canceled, filePath } = await electron.dialog.showSaveDialog({
      defaultPath: `${default_name}.pdf`,
      filters: [{ name: "PDF", extensions: ["pdf"] }]
    });
    if (canceled || !filePath) return { success: false };
    const tmp_path = path.join(os.tmpdir(), `resume-print-${Date.now()}.html`);
    fs.writeFileSync(tmp_path, html, "utf-8");
    const print_window = new electron.BrowserWindow({
      width: paper_size === "a4" ? 794 : 816,
      height: paper_size === "a4" ? 1123 : 1056,
      show: false,
      webPreferences: { sandbox: true }
    });
    try {
      await print_window.loadFile(tmp_path);
      await new Promise((resolve) => {
        print_window.webContents.once("did-finish-load", () => setTimeout(resolve, 500));
        setTimeout(resolve, 1500);
      });
      const pdf_data = await print_window.webContents.printToPDF({
        pageSize: paper_size === "a4" ? "A4" : "Letter",
        printBackground: true,
        margins: { marginType: "noMargins" }
      });
      fs.writeFileSync(filePath, pdf_data);
      electron.shell.showItemInFolder(filePath);
      return { success: true, filePath };
    } catch (err) {
      console.error("[export:pdf] error:", err);
      return { success: false, error: String(err) };
    } finally {
      print_window.destroy();
      try {
        fs.unlinkSync(tmp_path);
      } catch {
      }
    }
  }
);
electron.ipcMain.handle("export:json", async (_event, json_string, default_name) => {
  const { canceled, filePath } = await electron.dialog.showSaveDialog({
    defaultPath: `${default_name}.json`,
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (canceled || !filePath) return { success: false };
  fs.writeFileSync(filePath, json_string, "utf-8");
  electron.shell.showItemInFolder(filePath);
  return { success: true, filePath };
});
electron.ipcMain.handle("import:json", async () => {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({
    filters: [{ name: "JSON", extensions: ["json"] }],
    properties: ["openFile"]
  });
  if (canceled || filePaths.length === 0) return { success: false };
  const content = fs.readFileSync(filePaths[0], "utf-8");
  return { success: true, content };
});
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
