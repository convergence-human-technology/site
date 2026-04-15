/* ════════════════════════════════════════════════════════════════
   ★★★ SCRIPT ESPACE MEMBRES - AUTH0 ★★★
   ════════════════════════════════════════════════════════════════
  Avec ce script :
  Ajouter dans le HTML (IMPORTANT UX) : class="auth-loading" sur le body.
  <body class="auth-loading">


   OBJECTIF :
   Gérer entièrement l’espace membres sécurisé côté front.

   ✔ Vérifie la présence du token (authentification)
   ✔ Vérifie que le token est valide (format JWT)
   ✔ Vérifie que le token n’est pas expiré
   ✔ Redirige si non authentifié (sécurité)
   ✔ Récupère les infos utilisateur via Auth0 (/userinfo)
   ✔ Vérifie le statut abonnement (claim "paid")
   ✔ Affiche contenu différent selon utilisateur (gratuit / payant)
   ✔ Gère le bouton Déconnexion
   ✔ Empêche le "flash" visuel avant vérification (UX propre)

   IMPORTANT :
   Ce script protège la page privée (membres.html)

   ✔ Compatible avec <script defer> : <script src="js/members.js" defer></script>
   ✔ Niveau production pour site statique

   _______

   TESTS À FAIRE :

  ✔ connecté → page OK
  ✔ pas connecté → redirection index
  ✔ token expiré → redirection
  ✔ logout → retour index

  _______

  Nous avons ici :

  ✔ protection réelle côté client
  ✔ gestion propre Auth0
  ✔ UX propre (pas de flash)
  ✔ code maintenable
  ✔ niveau quasi production pour site statique
   ════════════════════════════════════════════════════════════════ */


/* ================================================================
   1. CONFIGURATION AUTH0
   ================================================================ */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
const BASE_URL = "https://convergence-human-technology.github.io/site";

/* Claim personnalisé Auth0 pour savoir si utilisateur est payant */
const PAID_CLAIM = "https://convergence-tech.eu.auth0.com/paid";


/* ================================================================
   2. 🔐 SÉCURITÉ AUTH — VÉRIFICATION DU TOKEN
   ================================================================ */

/* Vérifie si un token existe ET s’il a une structure JWT valide */
function isAuthenticated() {
  const token = sessionStorage.getItem("auth_token");

  /* Un JWT doit contenir 3 parties séparées par des points */
  return token && token.split('.').length === 3;
}


/* Vérifie si le token est expiré */
function isTokenExpired(token) {
  try {
    /* Décodage de la partie payload du JWT */
    const payload = JSON.parse(atob(token.split('.')[1]));

    /* Temps actuel en secondes */
    const now = Math.floor(Date.now() / 1000);

    /* Si expiration dépassée → token invalide */
    return payload.exp < now;

  } catch (e) {
    /* En cas d'erreur → on considère le token invalide */
    return true;
  }
}


/* ================================================================
   3. PROTECTION IMMÉDIATE DE LA PAGE
   ================================================================ */

const token = sessionStorage.getItem("auth_token");

/* Si :
   - pas de token
   - token invalide
   - token expiré

   → on nettoie et on redirige vers page publique
*/
if (!token || !isAuthenticated() || isTokenExpired(token)) {

  sessionStorage.clear();

  /* window.location.replace :
     empêche retour arrière vers page protégée */
  window.location.replace(BASE_URL + "/index.html");
}


/* ================================================================
   4. INITIALISATION APRÈS CHARGEMENT DU DOM
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* Cache la page tant que l'auth n'est pas validée (anti flash UX) */
  document.body.style.visibility = "hidden";


  /* ================================================================
     5. RÉCUPÉRATION DES ÉLÉMENTS HTML
     ================================================================ */
  var container = document.getElementById("user-card");

  var navLogoutItem = document.getElementById('nav-logout-item');
  var navLogoutLink = document.getElementById('nav-logout-link');


  /* ================================================================
     6. GESTION AFFICHAGE BOUTON DÉCONNEXION
     ================================================================ */
  function showLogout() {
    if (navLogoutItem) navLogoutItem.style.display = 'flex';
  }

  function hideLogout() {
    if (navLogoutItem) navLogoutItem.style.display = 'none';
  }

  /* Si token présent → afficher bouton logout */
  if (token) showLogout();


  /* ================================================================
     7. APPEL API AUTH0 — /userinfo
     ================================================================ */

  fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (user) {

    /* Vérifie si utilisateur a abonnement payant */
    var paid = user[PAID_CLAIM];

    if (!container) return;


    /* ================================================================
       8. AFFICHAGE CONDITIONNEL SELON ABONNEMENT
       ================================================================ */

    if (!paid) {

      /* ============================================================
         UTILISATEUR NON PAYANT
         ============================================================ */
      container.innerHTML = `
        <h2>Découvrez nos produits</h2>
        <p>
          Vous souhaitez découvrir nos logiciels en intégralité et accéder aux démos ?
          Devenez membre VIP et profitez d'un accès complet.
        </p>
        <a href="${BASE_URL}/tarifs.html" class="offer-button">
          Découvrir nos offres
        </a>
      `;

    } else {

      /* ============================================================
         UTILISATEUR PAYANT
         ============================================================ */
      container.innerHTML = `
        <img src="${user.picture}" width="80" style="border-radius:50%">
        <h2>Bonjour <strong>${user.name}</strong></h2>
        <p>📧 ${user.email}</p>
        <p>✅ Vous avez accès à l'espace membres.</p>
      `;
    }


    /* ================================================================
       9. AFFICHAGE FINAL (APRÈS VALIDATION AUTH)
       ================================================================ */

    document.body.style.visibility = "visible";
    document.body.classList.remove('auth-loading');

  })
  .catch(function () {

    /* En cas d’erreur API */
    if (container) {
      container.innerHTML = "<p>Erreur de chargement des données utilisateur.</p>";
    }

    document.body.style.visibility = "visible";
  });


  /* ================================================================
     10. GESTION DE LA DÉCONNEXION
     ================================================================ */

  if (navLogoutLink) {

    navLogoutLink.addEventListener('click', function (e) {
      e.preventDefault();

      /* Nettoyage session */
      sessionStorage.clear();

      hideLogout();

      /* Redirection logout Auth0 */
      window.location.href =
        `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(BASE_URL + "/index.html")}&client_id=${CLIENT_ID}`;
    });

  }

});