/* ════════════════════════════════════════════════════════════════
   ★ SCRIPTS - LOADER + HAMBURGER + CONNEXION + NAV + HALO + FAQ ★
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
   - 7. FAQ : accordion ouverture/fermeture des réponses

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
  ✔ FAQ accordion natif sans dépendance

  Résultat :

  site web : structuré - scalable - maintenable - propre (niveau pro frontend)

   ════════════════════════════════════════════════════════════════ */


/* ================================================================
   1. CONFIGURATION AUTH0
   ================================================================ */

/* Domaine Auth0 propre au tenant Convergence */
const AUTH0_DOMAIN = "convergence-tech.eu.auth0.com";

/* Identifiant de l'application déclarée dans le dashboard Auth0 */
const CLIENT_ID = "ONtxpyovHGewrl4669n3Qz8RJYot27AS";

/* URL de retour après authentification — doit être autorisée dans Auth0 */
const REDIRECT_URI = "https://convergence-human-technology.github.io/site/callback.html";


/* ================================================================
   2. INITIALISATION GLOBALE APRÈS CHARGEMENT DU DOM
   ================================================================ */

/* DOMContentLoaded se déclenche quand le HTML est entièrement parsé
   mais AVANT que les images et styles externes soient chargés.
   C'est le bon moment pour brancher les listeners JS sur les éléments. */
document.addEventListener('DOMContentLoaded', function () {

  /* Lance le masquage du loader après 3 secondes */
  initLoader();

  /* Active le menu hamburger mobile */
  initHamburger();

  /* Gère l'affichage des liens connexion/déconnexion selon l'état Auth0 */
  initAuthNavigation();

  /* Active l'accordion FAQ — uniquement si la section existe sur la page */
  initFaq();

  /* Halo uniquement si présent sur la page (ex: index) */
  if (document.getElementById('halo-ring')) {
    /* getElementById renvoie null si l'élément est absent — le if protège l'appel */
    initHalo();
  }

});


/* ================================================================
   3. LOADER - Masquage après 3 secondes
   ================================================================
   DOMContentLoaded attend que le DOM soit entièrement parsé.
   Après 3000ms, la classe .hidden est ajoutée sur #loader-overlay.
   CSS gère le fondu via opacity + visibility.
   ================================================================ */
function initLoader() {

  /* Récupère l'élément overlay du loader — peut être null si absent */
  var loaderOverlay = document.getElementById('loader-overlay');

  /* setTimeout exécute la fonction callback après le délai en millisecondes.
     3000ms = 3 secondes. La valeur est volontairement lisible ici. */
  setTimeout(function () {

    /* Le if protège contre un éventuel null (page sans loader) */
    if (loaderOverlay) {
      loaderOverlay.classList.add('hidden'); /* → fade out — le CSS gère le reste via transition */
    }

  }, 3000); /* ← Modifier ici si besoin */

}


/* ================================================================
   4. HAMBURGER MENU - Ouverture/Fermeture sur mobile
   ================================================================
   Au clic sur #hamburger-btn :
   - .open sur le bouton → anime les 3 barres en croix "X"
   - .nav-open sur #nav-main-list → ouvre/ferme le menu
   - aria-expanded mis à jour pour l'accessibilité clavier
   ================================================================ */
function initHamburger() {

  /* Récupère le bouton hamburger et la liste de navigation */
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var navList = document.getElementById('nav-main-list');

  /* Le double && vérifie que les deux éléments existent avant d'aller plus loin.
     Si l'un est absent (autre page), le bloc entier est ignoré sans erreur. */
  if (hamburgerBtn && navList) {

    /* Ajoute un écouteur de clic sur le bouton hamburger */
    hamburgerBtn.addEventListener('click', function () {

      /* toggle ajoute la classe si absente, la retire si présente — parfait pour un interrupteur */
      hamburgerBtn.classList.toggle('open');   /* → anime les barres en X via CSS */
      navList.classList.toggle('nav-open');    /* → affiche ou masque le menu via CSS */

      /* Lit l'état APRÈS le toggle pour être sûr d'avoir la valeur à jour */
      var isOpen = navList.classList.contains('nav-open');

      /* ACCESSIBILITÉ : annonce état ouvert/fermé */
      /* aria-expanded informe les lecteurs d'écran si le menu est développé ou non */
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Ferme le menu quand un lien est cliqué (navigation mobile) */
    /* querySelectorAll renvoie une NodeList statique de tous les <a> dans la nav */
    var navLinks = navList.querySelectorAll('a');

    /* On ne peut pas utiliser forEach directement sur NodeList en ES5 — on boucle avec for */
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {

        /* Retire les classes d'état ouvert sur le bouton et la liste */
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

  /* Récupère les liens de connexion et déconnexion dans le menu */
  var navLoginLink = document.getElementById('nav-login-link');
  var navLogoutLink = document.getElementById('nav-logout-link');

  /* sessionStorage persiste uniquement pendant l'onglet courant — fermé = effacé.
     Si auth_token est présent, l'utilisateur s'est déjà connecté dans cet onglet. */
  var token = sessionStorage.getItem('auth_token');


  /* ================================================================
     5.1 CONNEXION (LOGIN)
     ================================================================ */

  /* Vérifie que le lien de connexion existe bien dans le DOM */
  if (navLoginLink) {

    /* Au clic sur "Connexion", redirige vers Auth0 pour authentification */
    navLoginLink.addEventListener('click', function (e) {
      e.preventDefault(); /* Empêche le comportement par défaut du lien (<a href="#">) */

      /* Génère un état aléatoire (sécurité OAuth) */
      /* Le paramètre state protège contre les attaques CSRF — il sera vérifié au retour */
      const state = Math.random().toString(36).substring(2); /* chaîne aléatoire base 36 */
      sessionStorage.setItem("auth_state", state); /* stocké pour vérification dans callback.html */

      /* Redirection vers Auth0 */
      /* response_type=token → flux implicite (adapté aux SPA sans backend) */
      /* scope=openid profile email → demande les infos de base du profil utilisateur */
      window.location.href =
        `https://${AUTH0_DOMAIN}/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email&state=${state}`;
    });

    /* Masque lien connexion si utilisateur déjà connecté */
    /* Si un token est en session, inutile d'afficher "Connexion" — l'utilisateur est déjà là */
    if (token) {
      var liParent = navLoginLink.parentElement; /* remonte au <li> parent pour le masquer */
      if (liParent) liParent.style.display = 'none'; /* masque le <li> entier */
    }

  }


  /* ================================================================
     5.2 DÉCONNEXION (LOGOUT)
     ================================================================ */

  /* Vérifie que le lien de déconnexion existe bien dans le DOM */
  if (navLogoutLink) {

    /* Au clic sur "Déconnexion", nettoie la session et redirige vers Auth0 logout */
    navLogoutLink.addEventListener('click', function (e) {
      e.preventDefault(); /* Empêche le comportement par défaut du lien */

      /* Suppression du token */
      /* sessionStorage.clear() supprime TOUTES les clés de la session courante */
      sessionStorage.clear();

      /* Redirection vers logout Auth0 */
      /* returnTo : page vers laquelle Auth0 redirige après déconnexion */
      /* client_id : nécessaire pour qu'Auth0 identifie l'application */
      window.location.href =
        `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(window.location.origin + "/site/index.html")}&client_id=${CLIENT_ID}`;
    });

    /* Affiche ou masque selon état utilisateur */
    /* On remonte au <li> parent pour gérer la visibilité du bloc entier */
    var liParent = navLogoutLink.parentElement;

    if (token) {
      /* Utilisateur connecté → affiche le lien de déconnexion */
      if (liParent) liParent.style.display = 'flex';
    } else {
      /* Utilisateur non connecté → masque le lien de déconnexion */
      if (liParent) liParent.style.display = 'none';
    }

  }

}


/* ================================================================
   6. HALO - Animation cyclique du logo
   ================================================================
   Animation :
   - actif pendant 10 secondes
   - pause de 50 secondes
   - boucle infinie

   Ce script ne s'exécute que si #halo-ring existe
   ================================================================ */
function initHalo() {

  /* Récupère l'anneau lumineux autour du logo */
  var haloRing = document.getElementById('halo-ring');

  /* Guard clause : si l'élément est absent, on sort immédiatement de la fonction */
  if (!haloRing) return;

  /* Fonction récursive qui crée le cycle actif → pause → actif → pause... */
  function lancerCycle() {

    /* Active l'animation CSS via la classe — le keyframe est dans le CSS */
    haloRing.classList.add('halo-active');

    /* Après 10 secondes d'animation, on coupe et on programme la pause */
    setTimeout(function () {

      haloRing.classList.remove('halo-active'); /* → stoppe l'animation CSS */

      /* Après 50 secondes de pause, on relance le cycle en appelant lancerCycle() */
      /* C'est de la récursivité asynchrone — pas une boucle bloquante */
      setTimeout(lancerCycle, 50000);

    }, 10000); /* ← durée de l'animation active en millisecondes */

  }

  /* Démarre le premier cycle immédiatement au chargement de la page */
  lancerCycle();

}


/* ================================================================
   7. FAQ - Accordion ouverture / fermeture
   ================================================================
   Au clic sur un .faq-question-btn :
   - bascule la classe .open sur le .faq-item parent
   - met à jour aria-expanded pour l'accessibilité
   - ferme les autres items ouverts (comportement accordion)

   ✔ Aucune dépendance externe (pas de jQuery)
   ✔ Compatible clavier et lecteurs d'écran
   ✔ Un seul item ouvert à la fois

   NE PAS MODIFIER :
   Le CSS de shared.css écoute la classe .open 
   Règles concernées dans shared.css :
     .faq-item.open .faq-answer  → affiche la réponse (max-height: 500px)
     .faq-item.open .faq-arrow   → retourne la flèche (rotate 180deg)
   Toute modification du nom de classe ici doit être répercutée dans shared.css
   sous peine de casser silencieusement l'accordion (aucune erreur console).
   ================================================================ */
function initFaq() {

  /* Récupère tous les boutons de question FAQ — renvoie une NodeList (peut être vide) */
  var faqBtns = document.querySelectorAll('.faq-question-btn');

  /* Guard clause : si la page ne contient pas de FAQ, on sort sans erreur */
  /* .length === 0 signifie que querySelectorAll n'a rien trouvé */
  if (!faqBtns.length) return;

  /* Boucle sur chaque bouton pour lui attacher un écouteur de clic */
  for (var i = 0; i < faqBtns.length; i++) {

    faqBtns[i].addEventListener('click', function () {

      /* 'this' désigne le bouton qui vient d'être cliqué */
      /* parentElement remonte au .faq-item qui contient le bouton ET la réponse */
      var item = this.parentElement;

      /* Mémorise l'état AVANT de tout fermer — nécessaire pour le toggle correct.
         On lit ici si l'item cliqué est ouvert ou fermé AVANT de réinitialiser tous les items.
         Si on lisait après la boucle de fermeture, isOpen serait toujours false. */
      var isOpen = item.classList.contains('open'); /* ← classe 'open' attendue par shared.css */

      /* ── FERME TOUS LES ITEMS ───────────────────────────────── */
      /* Comportement accordion : un seul item ouvert à la fois.
         On itère sur tous les boutons pour réinitialiser leur état. */
      for (var j = 0; j < faqBtns.length; j++) {

        /* Retire la classe .open du .faq-item parent de chaque bouton.
           C'est cette classe que shared.css surveille pour masquer/afficher .faq-answer */
        faqBtns[j].parentElement.classList.remove('open');

        /* Remet aria-expanded à false sur chaque bouton — informe les lecteurs d'écran */
        faqBtns[j].setAttribute('aria-expanded', 'false');
      }

      /* ── OUVRE L'ITEM CLIQUÉ (SI IL ÉTAIT FERMÉ) ───────────── */
      /* Si isOpen était false, l'item était fermé → on l'ouvre maintenant.
         Si isOpen était true, l'item était déjà ouvert → on le laisse fermé (bascule).
         Ce comportement évite qu'un item rouvert immédiatement après fermeture. */
      if (!isOpen) {
        item.classList.add('open');                 /* → shared.css déclenche max-height + rotation flèche */
        this.setAttribute('aria-expanded', 'true'); /* → informe les lecteurs d'écran que le panneau est ouvert */
      }

    }); /* fin addEventListener click */

  } /* fin for faqBtns */

} /* fin initFaq */
