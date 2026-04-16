/* ════════════════════════════════════════════════════════════════
   ★★★ SCRIPT AUTH0 — ESPACE MEMBRES (VERSION STABLE COMMENTÉE) ★★★
   ════════════════════════════════════════════════════════════════

   OBJECTIF GLOBAL DU SCRIPT :

   Ce script gère entièrement la page membres.html :

   ✔ Vérifie la présence du token en sessionStorage
   ✔ Redirige vers index.html si non authentifié
   ✔ Appelle Auth0 /userinfo pour récupérer le profil utilisateur
   ✔ Vérifie le claim "paid" (abonnement gratuit ou payant)
   ✔ Affiche un contenu dynamique selon l’utilisateur
   ✔ Gère le bouton Déconnexion dans le menu
   ✔ Gère le loader (UX)
   ✔ Gère le menu hamburger mobile

   IMPORTANT :
   - Aucun backend (GitHub Pages uniquement)
   - Auth0 côté front uniquement
   - Sécurité = UX + redirection, pas sécurité serveur

   ✔ VERSION STABLE : NE PAS MODIFIER LA LOGIQUE
   ════════════════════════════════════════════════════════════════ */



/* ================================================================
   CONFIGURATION AUTH0
   ================================================================ */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";
const BASE_URL = "https://convergence-human-technology.github.io/site";
const PAID_CLAIM = "https://convergence-tech.eu.auth0.com/paid";


/* ================================================================
   TOKEN STOCKÉ EN SESSION (AUTH0 CALLBACK)
   ================================================================ */
const token = sessionStorage.getItem("auth_token");


/* ================================================================
   GESTION DU BOUTON DÉCONNEXION (MENU NAV)
   ================================================================ */
const navLogoutItem = document.getElementById('nav-logout-item');

/* Affiche le bouton "Déconnexion" dans le menu */
const showLogoutInNav = () => {
    if(navLogoutItem) navLogoutItem.style.display = 'flex';
};

/* Masque le bouton "Déconnexion" */
const hideLogoutInNav = () => {
    if(navLogoutItem) navLogoutItem.style.display = 'none';
};


/* ================================================================
   PROTECTION DE LA PAGE (REDIRECTION SI NON CONNECTÉ)
   ================================================================
   Si aucun token → utilisateur non connecté → retour index
   ================================================================ */
if (!token) {

    // Redirection vers page publique
    window.location.replace(BASE_URL + "/index.html");

} else {

    // Utilisateur connecté → affichage du bouton logout
    showLogoutInNav();


    /* ============================================================
       APPEL API AUTH0 — RÉCUPÉRATION PROFIL UTILISATEUR
       ============================================================ */
    fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    .then(r => r.json())

    .then(user => {

        const paid = user[PAID_CLAIM];
        const container = document.getElementById("user-card");

        if (!container) return;


        /* ========================================================
           UTILISATEUR NON PAYANT (FREE USER)
           ======================================================== */
        if (!paid) {

            container.innerHTML = `
                <h2>Découvrez nos produits</h2>
                <p>
                    Vous souhaitez découvrir nos logiciels en intégralité et accéder aux démos ?
                    Devenez membre VIP pour débloquer tout l’univers Convergence.
                </p>
                <a href="${BASE_URL}/tarifs.html" class="offer-button">
                    Découvrir nos offres
                </a>
            `;

        }

        /* ========================================================
           UTILISATEUR PAYANT (PREMIUM USER)
           ======================================================== */
        else {

            container.innerHTML = `
                <img src="${user.picture}" width="80" style="border-radius:50%">
                <h2>${user.name}</h2>
                <p>${user.email}</p>
                <p>Accès validé ✔</p>
            `;
        }

    })

    /* ============================================================
       GESTION D’ERREUR API AUTH0
       ============================================================ */
    .catch(() => {
        const container = document.getElementById("user-card");
        if (container) container.innerHTML = "Erreur chargement";
    });
}


/* ================================================================
   GESTION DU LOGOUT (DÉCONNEXION AUTH0)
   ================================================================ */
const navLogoutLink = document.getElementById('nav-logout-link');

if (navLogoutLink) {

    navLogoutLink.addEventListener('click', function (e) {

        e.preventDefault();

        // Nettoyage session locale
        sessionStorage.clear();

        // Redirection logout Auth0
        window.location.href =
            `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(BASE_URL + "/index.html")}&client_id=${CLIENT_ID}`;
    });
}


/* ================================================================
   LOADER — MASQUAGE APRÈS 3 SECONDES
   ================================================================
   UX : écran de chargement masqué après délai
   ================================================================ */
const loaderOverlay = document.getElementById('loader-overlay');

setTimeout(() => {
    if (loaderOverlay) {
        loaderOverlay.classList.add('hidden');
    }
}, 3000);


/* ================================================================
   HAMBURGER MENU — MOBILE NAVIGATION
   ================================================================
   ✔ ouverture / fermeture menu mobile
   ✔ mise à jour aria-expanded (accessibilité)
   ================================================================ */
const hamburgerBtn = document.getElementById('hamburger-btn');
const navList = document.getElementById('nav-main-list');

if (hamburgerBtn && navList) {

    hamburgerBtn.addEventListener('click', function () {

        hamburgerBtn.classList.toggle('open');
        navList.classList.toggle('nav-open');

        // ACCESSIBILITÉ : état du menu pour lecteurs d’écran
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

            // ACCESSIBILITÉ : menu refermé
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    }
}
