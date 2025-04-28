const { app, BrowserWindow, ipcMain } = require('electron')
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcryptjs');

// Connexion MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'app'
});

connection.connect(function(err) {
  if (err) {
      console.error('Erreur de connexion à la base de données: ' + err.stack);
      return;
  }
  console.log('Connecté à MySQL');
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    icon: 'public/assets/img/icon.ico',
    title: 'Arras Cyber App',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
  },
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

// Gérer l'événement de connexion
ipcMain.on('login-attempt', (event, { username, password }) => {
  const query = 'SELECT * FROM user WHERE email = ?';

  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Erreur dans la requête SQL: ' + err.stack);
      event.reply('login-response', 'Une erreur est survenue.');
      return;
    }

    if (results.length > 0) {
      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Erreur de comparaison bcrypt:', err);
          event.reply('login-response', 'Une erreur est survenue.');
          return;
        }

        if (isMatch) {
          event.reply('login-response', user.id);
        } else {
          event.reply('login-response', null);
        }
      });
    } else {
      event.reply('login-response', null);
    }
  });
});

ipcMain.on('recover-token', (event, { usernameId }) => {
  const query = 'SELECT * FROM token WHERE id_user = ?';

  connection.query(query, [usernameId], (err, results) => {
    if (err) {
      console.error('Erreur dans la requête SQL: ' + err.stack);
      event.reply('token-response', 'Une erreur est survenue.');
      return;
    }

    if (results.length > 0) {
      // Créer un tableau de tokens
      
      const tokens = results.map(result => [result.token, result.machine_name]);
      event.reply('token-response', tokens);
    } else {
      event.reply('token-response', []); // Aucun token trouvé
    }
  });
});
