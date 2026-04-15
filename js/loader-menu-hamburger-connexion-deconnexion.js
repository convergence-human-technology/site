/* ★ SCRIPTS : LOADER + HAMBURGER + CONNEXION + DECONNEXION ★
════════════════════════════════════════════════════════════════
Ce bloc gère : 
- 1. LOADER : masque l'écran de chargement après 3 secondes 
- 2. HAMBURGER : ouvre/ferme le menu de navigation sur mobile
- 3. CONNEXION : liens Connexion et Déconnexion Auth0

Pas de halo (pas de logo sur cette page). Pas de FAQ accordéon (pas de FAQ sur cette page). */


    /* ================================================================
       1. LOADER — Masquage après 3 secondes
       ================================================================
       DOMContentLoaded attend que tout le HTML soit parsé.
       Après 3000ms, la classe .hidden est ajoutée sur #loader-overlay.
       CSS gère le fondu via transition opacity + visibility.
       ================================================================ */
    document.addEventListener('DOMContentLoaded', function() {

      /* Récupère l'overlay de chargement */
      var loaderOverlay = document.getElementById('loader-overlay');

      /* Déclenche le masquage après 3 secondes (3000 ms) */
      setTimeout(function() {
        if (loaderOverlay) {
          loaderOverlay.classList.add('hidden'); /* → opacity:0, visibility:hidden */
        }
      }, 3000); /* ← Modifier ici pour changer la durée du loader */


      /* ================================================================
         2. HAMBURGER MENU — Ouverture/Fermeture sur mobile
         ================================================================
         Au clic sur #hamburger-btn :
         - Classe .open sur le bouton → animation barres → croix
         - Classe .nav-open sur #nav-main-list → max-height 0 → 380px
         - aria-expanded mis à jour pour l'accessibilité
         ================================================================ */
      var hamburgerBtn = document.getElementById('hamburger-btn');
      var navList      = document.getElementById('nav-main-list');

      if (hamburgerBtn && navList) {

        hamburgerBtn.addEventListener('click', function() {
          hamburgerBtn.classList.toggle('open');     /* Anime le bouton en croix */
          navList.classList.toggle('nav-open');      /* Ouvre/ferme le menu */
          var isOpen = navList.classList.contains('nav-open');
          hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        /* Ferme le menu quand un lien est cliqué (navigation mobile) */
        var navLinks = navList.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
          navLinks[i].addEventListener('click', function() {
            hamburgerBtn.classList.remove('open');
            navList.classList.remove('nav-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
          });
        }

      } /* fin if hamburgerBtn && navList */

    }); /* fin DOMContentLoaded */
    

    /* ================================================================
       3. LIEN CONNEXION DANS LE MENU — version autonome
       ================================================================
       Ce script gère le lien Connexion dans le menu sans dépendre
       du bouton #btn-login (qui n'existe pas sur cette page).
       ================================================================ */
    document.addEventListener('DOMContentLoaded', function() {

      var navLoginLink = document.getElementById('nav-login-link');

      if (navLoginLink) {

        navLoginLink.addEventListener('click', function(e) {
          e.preventDefault();

          /* Code Auth0 de connexion */
          const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
          const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
          const REDIRECT_URI = "https://convergence-human-technology.github.io/site/callback.html";

          const state = Math.random().toString(36).substring(2);
          sessionStorage.setItem("auth_state", state);
          const url = `https://${AUTH0_DOMAIN}/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email&state=${state}`;
          window.location.href = url;
        });

        /* Masque le lien Connexion si l'utilisateur est déjà connecté */
        var token = sessionStorage.getItem('auth_token');
        if (token) {
          var liParent = navLoginLink.parentElement;
          if (liParent) liParent.style.display = 'none';
        }

      }

    });


    /* ================================================================
       4. LIEN DÉCONNEXION DANS LE MENU - version autonome
       ================================================================
       Ce script gère le lien Déconnexion dans le menu.
       ================================================================ */
    document.addEventListener('DOMContentLoaded', function() {

      var navLogoutLink = document.getElementById('nav-logout-link');

      if (navLogoutLink) {

        navLogoutLink.addEventListener('click', function(e) {
          e.preventDefault();
          sessionStorage.clear();
          window.location.href = `https://convergence-tech.eu.auth0.com/v2/logout?returnTo=${encodeURIComponent(window.location.origin + "/site/index.html")}&client_id=ONtxpyovHGewrl4669n3Qz8RJYot27AS`;
        });

        /* Synchronisation état connecté → affiche/masque le lien Déconnexion */
        var token = sessionStorage.getItem('auth_token');
        var liParent = navLogoutLink.parentElement;
        if (token) {
          if (liParent) liParent.style.display = 'flex';
        } else {
          if (liParent) liParent.style.display = 'none';
        }

      }

    });