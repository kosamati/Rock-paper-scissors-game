const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;

function createWindow (){
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 775,
        frame: false,
        resizable: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        }
  });

    mainWindow.setMenu(null)
    mainWindow.loadURL('file://' + __dirname + '/views/index.html')
}

ipc.on("closeApp", () => {
    app.quit();
  });

    // minimize app
ipc.on("minimize-app", () => {
    console.log("minimizing app");
    mainWindow.minimize();
});
ipc.on("reload-app", () => {
    console.log("refreshing...");
    mainWindow.reload();
});

app.on('ready', () => createWindow())