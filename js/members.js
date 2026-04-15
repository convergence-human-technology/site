/* ════════════════════════════════════════════════════════════════
   ★★★ SCRIPT ESPACE MEMBRES - AUTH0 ★★★
   ════════════════════════════════════════════════════════════════

   Ce fichier est uniquement pour la page : membres.html

   Ce fichier : members.js remplace :
  autho-espace-membres-loader-menu-hambuger-verif-deconnexion-gestion-abonnement.js

  Avec ce script :
  Ajouter dans le HTML (IMPORTANT UX) : class="auth-loading" sur le body.
  <body class="auth-loading">

   ✔ Gestion complète authentification côté front
   ✔ UX propre (aucun flash visuel)
   ✔ Sécurité adaptée GitHub Pages (sans backend)
   ✔ Gestion états : loading / valid / expired
   ✔ Compatible <script defer>

   ✔ Vérifie la présence du token (authentification)

   ✔ Vérifie que le token a une structure valide (format JWT)

   ✔ Vérifie que le token n’est pas expiré
     (après chargement pour éviter bug de connexion)

   ✔ Redirige si non authentifié (sécurité)

   ✔ Récupère les infos utilisateur via Auth0 (/userinfo)

   ✔ Vérifie le statut abonnement (claim "paid")

   ✔ Affiche contenu différent selon utilisateur (gratuit / payant)

   ✔ Gère le bouton Déconnexion

   ✔ Empêche le "flash" visuel avant vérification (UX propre)

   ✔ Gère les états :
     - loading (chargement)
     - connecté
     - session expirée
     - erreur authentification

   MPORTANT :
   Ce script protège la page privée (membres.html)

   ✔ Compatible avec <script defer> : <script src="js/members.js" defer></script>
   ✔ Niveau production pour site statique

   _______

   TESTS À FAIRE :

   ✔ connecté → accès normal à la page membres

   ✔ pas connecté → redirection vers index.html

   ✔ token expiré → affichage message + bouton de reconnexion
     (pas de redirection brutale → UX améliorée)

   ✔ token invalide → nettoyage session + message erreur

   ✔ logout → retour index + session nettoyée

   _______

   NOUS AVONS ICI :

   ✔ protection côté client (adaptée site statique)

   ✔ gestion Auth0 propre (login / logout / userinfo)

   ✔ UX propre :
     - pas de flash visuel
     - gestion des états (loading / connecté / expiré / erreur)

   ✔ code maintenable et structuré

   ✔ niveau quasi production pour site statique (GitHub Pages)

   ════════════════════════════════════════════════════════════════ */


/* ================================================================
   1. CONFIGURATION AUTH0
   ================================================================ */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
const BASE_URL = "https://convergence-human-technology.github.io/site";

const PAID_CLAIM = "https://convergence-tech.eu.auth0.com/paid";


/* ================================================================
   2. OUTILS AUTH (JWT)
   ================================================================ */

/* Vérifie structure JWT simple */
function hasValidJWTStructure(token) {
  return token && token.split('.').length === 3;
}

/* Vérifie expiration */
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);

    return payload.exp < now;

  } catch (e) {
    return true;
  }
}


/* ================================================================
   3. ÉTAT INITIAL (TRÈS IMPORTANT)
   ================================================================ */

/*
   ICI on ne fait PAS de vérification agressive

   Pourquoi :
   → au retour Auth0, le token vient juste d’être créé
   → il peut ne pas être encore exploitable immédiatement

   ✔ On vérifie seulement présence + structure
*/

const token = sessionStorage.getItem("auth_token");

if (!hasValidJWTStructure(token)) {

  sessionStorage.clear();

  window.location.replace(BASE_URL + "/index.html");
}


/* ================================================================
   4. INITIALISATION APRÈS DOM READY
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ================================================================
     4.1 MODE LOADING (ANTI FLASH UX)
     ================================================================ */

  /*
     La page est cachée tant que l’auth n’est pas validée
     → évite affichage contenu privé avant vérification
  */
  document.body.style.visibility = "hidden";


  /* ================================================================
     5. RÉCUPÉRATION DES ÉLÉMENTS
     ================================================================ */
  var container = document.getElementById("user-card");

  var navLogoutItem = document.getElementById('nav-logout-item');
  var navLogoutLink = document.getElementById('nav-logout-link');


  /* ================================================================
     6. GESTION BOUTON DÉCONNEXION
     ================================================================ */
  function showLogout() {
    if (navLogoutItem) navLogoutItem.style.display = 'flex';
  }

  function hideLogout() {
    if (navLogoutItem) navLogoutItem.style.display = 'none';
  }

  showLogout();


  /* ================================================================
     7. VÉRIFICATION EXPIRATION (APRÈS CHARGEMENT)
     ================================================================ */

  /*
     ✔ IMPORTANT : on vérifie ici (et pas avant)

     → évite bug login
     → permet UX propre
  */
  if (isTokenExpired(token)) {

    sessionStorage.clear();

    /* UX PROPRE :
       pas de redirection brutale immédiate */

    if (container) {
      container.innerHTML = `
        <h2>Session expirée</h2>
        <p>Votre session a expiré. Veuillez vous reconnecter.</p>
        <a href="${BASE_URL}/index.html" class="offer-button">
          Se reconnecter
        </a>
      `;
    }

    document.body.style.visibility = "visible";
    return;
  }


  /* ================================================================
     8. APPEL AUTH0 — /userinfo
     ================================================================ */

  fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(function (response) {

    /* Si erreur (token invalide côté Auth0) */
    if (!response.ok) {
      throw new Error("Token invalide");
    }

    return response.json();
  })
  .then(function (user) {

    var paid = user[PAID_CLAIM];

    if (!container) return;


    /* ================================================================
       9. AFFICHAGE UTILISATEUR
       ================================================================ */

    if (!paid) {

      container.innerHTML = `
        <h2>Découvrez nos produits</h2>
        <p>
          Accédez à toutes nos fonctionnalités en devenant membre VIP.
        </p>
        <a href="${BASE_URL}/tarifs.html" class="offer-button">
          Découvrir nos offres
        </a>
      `;

    } else {

      container.innerHTML = `
        <img src="${user.picture}" width="80" style="border-radius:50%">
        <h2>Bonjour <strong>${user.name}</strong></h2>
        <p>📧 ${user.email}</p>
        <p>✅ Accès membre actif</p>
      `;
    }


    /* ================================================================
       10. AFFICHAGE FINAL
       ================================================================ */

    document.body.style.visibility = "visible";
    document.body.classList.remove('auth-loading');

  })
  .catch(function () {

    /* Token invalide / erreur réseau */
    sessionStorage.clear();

    if (container) {
      container.innerHTML = `
        <h2>Erreur d'authentification</h2>
        <p>Veuillez vous reconnecter.</p>
        <a href="${BASE_URL}/index.html" class="offer-button">
          Retour à l'accueil
        </a>
      `;
    }

    document.body.style.visibility = "visible";
  });


  /* ================================================================
     11. DÉCONNEXION
     ================================================================ */

  if (navLogoutLink) {

    navLogoutLink.addEventListener('click', function (e) {
      e.preventDefault();

      sessionStorage.clear();

      hideLogout();

      window.location.href =
        `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(BASE_URL + "/index.html")}&client_id=${CLIENT_ID}`;
    });

  }

});
