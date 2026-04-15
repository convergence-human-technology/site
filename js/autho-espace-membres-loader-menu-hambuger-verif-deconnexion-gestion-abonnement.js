/* ════════════════════════════════════════════════════════════════
   ★★★ SCRIPT AUTH0 — ESPACE MEMBRES ★★★
   ════════════════════════════════════════════════════════════════
   Ce script gère l'espace membres :

   - Vérifie la présence du token en sessionStorage
   - Empêche l'affichage de la page si non authentifié (anti flash)
   - Redirige vers index.html si non connecté
   - Appelle /userinfo pour récupérer le profil utilisateur
   - Vérifie le claim "paid" pour l'accès au contenu (accès gratuit vs payant)
   - Injecte dynamiquement le contenu utilisateur
   - Gère le bouton Déconnexion dans le menu : Gère l'affichage du lien "Déconnexion"
   - PAS de lien Connexion sur cette page (inutile car page privée)
   - Gère le loader et le menu hamburger

   ✔ Compatible avec defer=defer dans head / head
   ✔ UX améliorée / Sécurisé UX (pas de flash de contenu)
   ✔ Code structuré et robuste

  ✔ Loader +	✔ Menu Hamburger + ✔ Vérif token	+
  ✔ Redirection si non connecté + ✔ Fetch /userinfo + ✔ Gestion abonnement
   ════════════════════════════════════════════════════════════════ */


/* ================================================================
   CONFIGURATION AUTH0
   ================================================================ */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
const BASE_URL = "https://convergence-human-technology.github.io/site";
const PAID_CLAIM = "https://convergence-tech.eu.auth0.com/paid";


/* ================================================================
   VÉRIFICATION IMMÉDIATE DU TOKEN (ANTI FLASH)
   ================================================================
   Empêche l'affichage de la page si l'utilisateur n'est pas connecté
   ================================================================ */
const token = sessionStorage.getItem("auth_token");

if (!token) {
    window.location.replace(BASE_URL + "/index.html");
}


/* ================================================================
   DOMContentLoaded — Initialisation générale
   ================================================================ */
document.addEventListener('DOMContentLoaded', function() {

  const navLogoutItem = document.getElementById('nav-logout-item');
  const navLogoutLink = document.getElementById('nav-logout-link');
  const container = document.getElementById("user-card");


  /* ================================================================
     GESTION DU BOUTON DÉCONNEXION
     ================================================================ */
  const showLogoutInNav = () => {
    if(navLogoutItem) navLogoutItem.style.display = 'flex';
  };

  const hideLogoutInNav = () => {
    if(navLogoutItem) navLogoutItem.style.display = 'none';
  };

  if (token) {
    showLogoutInNav();
  }


  /* ================================================================
     RÉCUPÉRATION DU PROFIL UTILISATEUR (Auth0)
     ================================================================ */
  fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(user => {

    const paid = user[PAID_CLAIM];

    if (!container) return;

    /* ================================================================
       AFFICHAGE CONDITIONNEL DU CONTENU
       ================================================================ */
    if (!paid) {
      container.innerHTML = `
        <h2>Découvrez nos produits</h2>
        <p>Vous souhaitez découvrir nos logiciels en intégralité et accéder aux démos pour pouvoir les tester ? Devenez membre VIP et profitez d'un accès exclusif à tout l'univers Convergence.</p>
        <a href="${BASE_URL}/tarifs.html" class="offer-button" style="margin-top:10px;">Découvrir nos offres</a>
      `;
    } else {
      container.innerHTML = `
        <img src="${user.picture}" width="80" style="border-radius:50%"><br>
        <h2>Bonjour <strong>${user.name}</strong> !</h2>
        <p>📧 ${user.email}</p>
        <p>✅ Vous avez accès à l'espace membres.</p>
      `;
    }

    /* Affiche la page une fois prêt */
    document.body.classList.remove('auth-loading');

  })
  .catch(() => {
    if (container) {
      container.innerHTML = "<p>Erreur de chargement.</p>";
    }

    document.body.classList.remove('auth-loading');
  });


  /* ================================================================
     GESTION DE LA DÉCONNEXION
     ================================================================ */
  if (navLogoutLink) {
    navLogoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      sessionStorage.clear();
      hideLogoutInNav();
      window.location.href =
        `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(BASE_URL + "/index.html")}&client_id=${CLIENT_ID}`;
    });
  }


  /* ================================================================
     1. LOADER — Masquage après 3 secondes
     ================================================================
     DOMContentLoaded attend que le DOM soit entièrement parsé.
     Après 3000ms (3 secondes), on ajoute la classe .hidden sur
     #loader-overlay. CSS gère le fondu via opacity + visibility.
     ================================================================ */
  var loaderOverlay = document.getElementById('loader-overlay');

  setTimeout(function() {
    if (loaderOverlay) {
      loaderOverlay.classList.add('hidden'); /* → opacity:0, visibility:hidden */
    }
  }, 3000); /* ← Modifier ici pour changer la durée du loader */


  /* ================================================================
     2. HAMBURGER MENU — Ouverture/Fermeture sur mobile
     ================================================================
     Au clic sur #hamburger-btn :
     - .open sur le bouton → anime les 3 barres en croix "X"
     - .nav-open sur #nav-main-list → max-height 0 → 380px (ouvert)
     - aria-expanded mis à jour pour l'accessibilité clavier
     ================================================================ */
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var navList      = document.getElementById('nav-main-list');

  if (hamburgerBtn && navList) {

    hamburgerBtn.addEventListener('click', function() {
      hamburgerBtn.classList.toggle('open');    /* Anime → croix */
      navList.classList.toggle('nav-open');     /* Ouvre le menu */
      var isOpen = navList.classList.contains('nav-open');

      /* ACCESSIBILITÉ : état du menu pour lecteurs d’écran */
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var navLinks = navList.querySelectorAll('a');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function() {
        hamburgerBtn.classList.remove('open');   /* Remet les barres */
        navList.classList.remove('nav-open');    /* Ferme le menu */

        /* ACCESSIBILITÉ : menu refermé */
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    }

  } /* fin if hamburgerBtn && navList */

}); /* fin DOMContentLoaded */