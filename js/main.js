/* ════════════════════════════════════════════════════════════════
   ★ SCRIPTS — LOADER + HAMBURGER + CONNEXION + NAV + HALO ★
   ════════════════════════════════════════════════════════════════
   
   Ce fichier : main.js remplace : loader-menu-hamburger-halo-connexion-nav.js 
   et remplace aussi : loader-menu-hamburger-connexion-deconnexion.js
   car il les regroupe en un seul fichier.


  ✔ Pages concernées par ce script :
    index.html - tarifs.html - contact.html - mentions.html - fabien.html
    et autres pages publiques.

    <script src="js/main.js" defer></script> à placer avant la balise de fermeture head

    . ne pas inclure dans membres.html
    . ne pas toucher callback.html
    . ne pas mettre async


   OBJECTIF :
   Script global pour toutes les pages publiques du site.

   Ce script gère :
   - 1. LOADER : masque l'écran de chargement après 3 secondes
   - 2. HAMBURGER : ouvre/ferme le menu mobile
   - 3. CONNEXION : Auth0 login (via lien menu)
   - 4. DÉCONNEXION : Auth0 logout
   - 5. NAV STATE : affichage dynamique selon connexion
   - 6. HALO : animation du logo (uniquement si présent)

   ✔ Compatible avec <script defer>
   ✔ Fonctionne sur toutes les pages publiques
   ✔ Code factorisé (plus de duplication)

   Ne gère PAS :
   - la page membres (→ members.js)
   - la callback Auth0 (→ inline)

   _______

   Nous avons ici :

  ✔ un seul script global
  ✔ zéro duplication
  ✔ code maintenable
  ✔ accessibilité conservée (aria-expanded)
  ✔ auth propre
  ✔ halo conditionnel

  Résultat :

  site web : structuré - scalable - maintenable - propre (niveau pro frontend)

   ════════════════════════════════════════════════════════════════ */


/* ================================================================
   1. CONFIGURATION AUTH0
   ================================================================ */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
const REDIRECT_URI = "https://convergence-human-technology.github.io/site/callback.html";


/* ================================================================
   2. INITIALISATION GLOBALE APRÈS CHARGEMENT DU DOM
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  initLoader();
  initHamburger();
  initAuthNavigation();

  /* Halo uniquement si présent sur la page (ex: index) */
  if (document.getElementById('halo-ring')) {
    initHalo();
  }

});


/* ================================================================
   3. LOADER — Masquage après 3 secondes
   ================================================================
   DOMContentLoaded attend que le DOM soit entièrement parsé.
   Après 3000ms, la classe .hidden est ajoutée sur #loader-overlay.
   CSS gère le fondu via opacity + visibility.
   ================================================================ */
function initLoader() {

  var loaderOverlay = document.getElementById('loader-overlay');

  setTimeout(function () {
    if (loaderOverlay) {
      loaderOverlay.classList.add('hidden'); /* → fade out */
    }
  }, 3000); /* ← Modifier ici si besoin */

}


/* ================================================================
   4. HAMBURGER MENU — Ouverture/Fermeture sur mobile
   ================================================================
   Au clic sur #hamburger-btn :
   - .open sur le bouton → anime les 3 barres en croix "X"
   - .nav-open sur #nav-main-list → ouvre/ferme le menu
   - aria-expanded mis à jour pour l'accessibilité clavier
   ================================================================ */
function initHamburger() {

  var hamburgerBtn = document.getElementById('hamburger-btn');
  var navList = document.getElementById('nav-main-list');

  if (hamburgerBtn && navList) {

    hamburgerBtn.addEventListener('click', function () {

      hamburgerBtn.classList.toggle('open');
      navList.classList.toggle('nav-open');

      var isOpen = navList.classList.contains('nav-open');

      /* ACCESSIBILITÉ : annonce état ouvert/fermé */
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Ferme le menu quand un lien est cliqué (navigation mobile) */
    var navLinks = navList.querySelectorAll('a');

    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {

        hamburgerBtn.classList.remove('open');
        navList.classList.remove('nav-open');

        /* ACCESSIBILITÉ */
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    }

  } /* fin if hamburgerBtn && navList */

}


/* ================================================================
   5. CONNEXION + DÉCONNEXION + ÉTAT NAVIGATION
   ================================================================
   Gère :
   - clic sur "Connexion"
   - clic sur "Déconnexion"
   - affichage dynamique des liens selon état utilisateur
   ================================================================ */
function initAuthNavigation() {

  var navLoginLink = document.getElementById('nav-login-link');
  var navLogoutLink = document.getElementById('nav-logout-link');

  var token = sessionStorage.getItem('auth_token');


  /* ================================================================
     5.1 CONNEXION (LOGIN)
     ================================================================ */
  if (navLoginLink) {

    navLoginLink.addEventListener('click', function (e) {
      e.preventDefault();

      /* Génère un état aléatoire (sécurité OAuth) */
      const state = Math.random().toString(36).substring(2);
      sessionStorage.setItem("auth_state", state);

      /* Redirection vers Auth0 */
      window.location.href =
        `https://${AUTH0_DOMAIN}/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email&state=${state}`;
    });

    /* Masque lien connexion si utilisateur déjà connecté */
    if (token) {
      var liParent = navLoginLink.parentElement;
      if (liParent) liParent.style.display = 'none';
    }

  }


  /* ================================================================
     5.2 DÉCONNEXION (LOGOUT)
     ================================================================ */
  if (navLogoutLink) {

    navLogoutLink.addEventListener('click', function (e) {
      e.preventDefault();

      /* Suppression du token */
      sessionStorage.clear();

      /* Redirection vers logout Auth0 */
      window.location.href =
        `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(window.location.origin + "/site/index.html")}&client_id=${CLIENT_ID}`;
    });

    /* Affiche ou masque selon état utilisateur */
    var liParent = navLogoutLink.parentElement;

    if (token) {
      if (liParent) liParent.style.display = 'flex';
    } else {
      if (liParent) liParent.style.display = 'none';
    }

  }

}


/* ================================================================
   6. HALO — Animation cyclique du logo
   ================================================================
   Animation :
   - actif pendant 10 secondes
   - pause de 50 secondes
   - boucle infinie

   Ce script ne s'exécute que si #halo-ring existe
   ================================================================ */
function initHalo() {

  var haloRing = document.getElementById('halo-ring');

  if (!haloRing) return;

  function lancerCycle() {

    haloRing.classList.add('halo-active');

    setTimeout(function () {

      haloRing.classList.remove('halo-active');

      setTimeout(lancerCycle, 50000);

    }, 10000);

  }

  lancerCycle();
}
