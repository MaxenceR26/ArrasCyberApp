document.addEventListener('DOMContentLoaded', function() {
    // Écouter la soumission du formulaire de connexion
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire par défaut

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Utiliser l'API exposée par preload.js pour envoyer les données de connexion
        window.electron.login(username, password);
    });

    // Recevoir la réponse du main process via onLoginResponse exposé par preload.js
    window.electron.onLoginResponse((event, response) => {
        if (response != null) {
            // Connexion réussie, rediriger vers la page de sélection
            localStorage.clear();
            window.location.href = 'select.html';
             // Envoi de la requête pour récupérer les tokens
            window.electron.recoverToken(response);  // response ici représente userId

            // Écoute la réponse pour récupérer les tokens
            window.electron.onTokenResponse((event, tokens) => {
                // Stocker les tokens dans localStorage
                if (tokens && Array.isArray(tokens) && tokens.length > 0) {
                    
                    localStorage.setItem('tokens', JSON.stringify(tokens));  // Sauvegarde les tokens dans localStorage
                } else {
                    console.log("Aucun token trouvé pour cet utilisateur.");
                }
            });
        } else {
            // Connexion échouée
            document.getElementById('errorConnection').innerHTML = 'Adresse email ou mot de passe incorrect.';
        }
    });
});
