/* ════════════════════════════════════════════════════════════════
   ★★★ SCRIPT AUTH0 — ESPACE MEMBRES (VERSION STABLE) ★★★
   ════════════════════════════════════════════════════════════════
   VERSION : SAFE (ne casse pas la connexion Auth0)
   ════════════════════════════════════════════════════════════════ */


/* ================================================================
   CONFIGURATION AUTH0
   ================================================================ */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
const BASE_URL = "https://convergence-human-technology.github.io/site";
const PAID_CLAIM = "https://convergence-tech.eu.auth0.com/paid";


/* ================================================================
   1. VÉRIFICATION SIMPLE DU TOKEN (ULTRA SAFE)
   ================================================================
   IMPORTANT :
   - on ne bloque PAS trop tôt
   - on évite les faux négatifs Auth0
   ================================================================ */

function getToken() {
  return sessionStorage.getItem("auth_token");
}

/* ================================================================
   2. PROTECTION SIMPLE (SANS CASSE AUTH0)
   ================================================================ */
const token = getToken();

/* IMPORTANT UX :
   on attend un peu avant de rediriger pour éviter bug callback */
setTimeout(() => {
  if (!token) {
    window.location.replace(BASE_URL + "/index.html");
  }
}, 100);


/* ================================================================
   3. INITIALISATION PAGE
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  const container = document.getElementById("user-card");
  const navLogoutItem = document.getElementById('nav-logout-item');
  const navLogoutLink = document.getElementById('nav-logout-link');


  /* ================================================================
     4. AFFICHAGE LOGOUT
     ================================================================ */
  function showLogout() {
    if (navLogoutItem) navLogoutItem.style.display = "flex";
  }

  function hideLogout() {
    if (navLogoutItem) navLogoutItem.style.display = "none";
  }

  if (token) showLogout();


  /* ================================================================
     5. APPEL AUTH0 /userinfo
     ================================================================ */
  fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(user => {

      if (!container) return;

      const paid = user[PAID_CLAIM];

      /* ============================================================
         CONTENU NON PAYANT
         ============================================================ */
      if (!paid) {
        container.innerHTML = `
          <h2>Découvrez nos produits</h2>
          <p>Accédez à l’univers complet en devenant membre.</p>
          <a href="${BASE_URL}/tarifs.html">Voir les offres</a>
        `;
      }

      /* ============================================================
         CONTENU PAYANT
         ============================================================ */
      else {
        container.innerHTML = `
          <img src="${user.picture}" width="80" style="border-radius:50%">
          <h2>${user.name}</h2>
          <p>${user.email}</p>
          <p>Accès validé ✔</p>
        `;
      }

    })
    .catch(() => {
      if (container) container.innerHTML = "Erreur chargement";
    });


  /* ================================================================
     6. LOGOUT
     ================================================================ */
  if (navLogoutLink) {
    navLogoutLink.addEventListener('click', function (e) {
      e.preventDefault();

      sessionStorage.clear();

      window.location.href =
        `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(BASE_URL + "/index.html")}&client_id=${CLIENT_ID}`;
    });
  }


  /* ================================================================
     7. LOADER (SAFE)
     ================================================================ */
  const loaderOverlay = document.getElementById('loader-overlay');

  setTimeout(() => {
    if (loaderOverlay) {
      loaderOverlay.classList.add('hidden');
    }
  }, 3000);


  /* ================================================================
     8. HAMBURGER (SAFE)
     ================================================================ */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navList = document.getElementById('nav-main-list');

  if (hamburgerBtn && navList) {

    hamburgerBtn.addEventListener('click', function () {
      hamburgerBtn.classList.toggle('open');
      navList.classList.toggle('nav-open');

      hamburgerBtn.setAttribute(
        "aria-expanded",
        navList.classList.contains("nav-open") ? "true" : "false"
      );
    });

    const navLinks = navList.querySelectorAll('a');

    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        hamburgerBtn.classList.remove('open');
        navList.classList.remove('nav-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }

});
