const { app, BrowserWindow } = require('electron')
import { setupDatabase } from "database";
setupDatabase();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    icon: 'public/assets/img/icon.ico',
    title: 'Arras Cyber App',
    autoHideMenuBar: true // Hide the menu
  })

  win.loadFile('views/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})