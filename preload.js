const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Méthode pour envoyer des informations de connexion au main process
    login: (username, password) => ipcRenderer.send('login-attempt', { username, password }),
    
    // Méthode pour recevoir la réponse du main process
    onLoginResponse: (callback) => ipcRenderer.on('login-response', callback),

    // Méthode pour récupérer les tokens
    recoverToken: (usernameId) => ipcRenderer.send('recover-token', { usernameId }),

    // Méthode pour recevoir les tokens
    onTokenResponse: (callback) => ipcRenderer.on('token-response', callback),

    // Nouvelle méthode pour supprimer un token et mettre à jour l'état de la machine
    removeTokenAndUpdateMachine: (token, machineId) => ipcRenderer.send('remove-token-and-update-machine', { token, machineId }),
});
