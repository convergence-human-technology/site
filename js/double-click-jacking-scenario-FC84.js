/*
 * (c) Fabien Conéjéro / FC84
 * double-click-jacking-scenario-FC84.js - Version 2 : MARS 2026 - version plus robuste qui utilise la délégation d'événements 
 * (pour gérer les futurs boutons) et une approche plus moderne
 */
//
// ********************************************************************************************************************************
// Le Double-Clickjacking est une variante sophistiquée du "clickjacking" classique. Alors que le clickjacking traditionnel 
// utilise souvent des cadres invisibles (iframes), cette technique exploite le délai de quelques millisecondes entre les deux 
// clics d'un double-clic pour tromper l'utilisateur.
// Le mécanisme de l'attaque :
// L'attaque repose sur une stratégie de "remplacement rapide" (bait and switch) :
// L'appât : Vous êtes sur une page malveillante qui vous demande de double-cliquer (par exemple, pour "jouer à un jeu" ou 
// "valider un captcha").
// Le changement de contexte : Au moment où vous effectuez le premier clic, un script JavaScript change instantanément le contenu 
// de la page ou ouvre une fenêtre contextuelle (popup) juste sous votre souris.
// Le piège : Votre deuxième clic, déjà lancé par réflexe, atterrit sur un bouton sensible d'un site légitime (comme "Autoriser 
// l'accès à mon compte" ou "Confirmer le transfert").
// Pourquoi est-ce si redoutable ?
// Contrairement au clickjacking classique, le Double-Clickjacking contourne les protections standards :
// Contourne les en-têtes de sécurité : Des protections comme X-Frame-Options ou CSP (Content Security Policy) sont inutiles car 
// l'attaque ne repose pas forcément sur l'imbrication d'un site dans un autre.
// Vitesse d'exécution : Le changement est si rapide que l'œil humain ne peut pas percevoir que la cible du deuxième clic a changé.
// Exploitation de la confiance : L'action se produit sur un site où vous êtes déjà connecté (Session Cookie), validant ainsi 
// l'opération immédiatement.
// Exemples de risques :
// - Vols de compte : Valider une autorisation OAuth (type "Se connecter avec Google/Facebook") pour donner accès à vos données 
// à un attaquant.
// - Transactions forcées : Confirmer un virement ou un achat sur une plateforme de paiement ou de cryptomonnaies.
// - Modification de paramètres : Désactiver par mégarde un pare-feu ou une option de confidentialité.
// Comment se protéger ?
// Pour les développeurs : Il est conseillé d'ajouter un léger délai d'activation (par exemple 500ms) sur les boutons sensibles 
// ou de demander une interaction différente (glisser-déposer, saisie clavier) pour confirmer une action critique.
// Pour les utilisateurs : Méfiez-vous des sites qui exigent des double-clics inhabituels pour des actions simples. Utilisez 
// des extensions de sécurité comme NoScript qui peuvent bloquer les scripts malveillants.
//
// ********************************************************************************************************************************
// Ce bloc de code empêche l'utilisateur de cliquer plusieurs fois sur un élément cliquable (comme un bouton ou un lien) 
// dans un court laps de temps. Lorsqu'un utilisateur clique, l'élément devient temporairement désactivé et change 
// d'apparence (devenant transparent).
// Attaques ciblées :
// Double submission / Double clic : Cette attaque se produit lorsque l'utilisateur clique plusieurs fois rapidement sur un 
// bouton, ce qui peut entraîner la soumission multiple de formulaires ou des actions non intentionnelles. En désactivant le 
// bouton après un premier clic, le code réduit le risque que l'utilisateur effectue des actions inattendues (comme soumettre 
// un formulaire plusieurs fois).
// Ce code ajoute une classe CSS qui rend l'élément cliqué transparent et empêche toute interaction supplémentaire tant qu'il 
// est cliqué.
// Attaques ciblées :
// Phishing ou tromperie : Bien que cela ne soit pas une "attaque" au sens traditionnel, rendre un élément transparent peut 
// aider à clarifier à l'utilisateur que son action a été enregistrée, réduisant ainsi la confusion et le risque d'interaction 
// répétée. Cela contribue à une meilleure UX et à une réduction des erreurs de manipulation.
// Ce code est utile pour :
// Protection contre le clickjacking : En évitant que le site soit chargé dans des iframes, il protège les utilisateurs des 
// attaques visant à les tromper en leur faisant cliquer sur des éléments cachés.
// Réduction des erreurs d'utilisateur : En empêchant le double clic sur les éléments cliquables, il diminue le risque de 
// soumissions multiples et d'actions non intentionnelles, ce qui est crucial dans les applications où des actions peuvent 
// entraîner des modifications de données ou des transactions financières.
// Ce code améliorer la sécurité et l'expérience utilisateur de l'application web.
// ********************************************************************************************************************************

// Écouteur d'événements pour s'assurer que le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // 1. Protection Frame-Busting renforcée
    if (window.top !== window.self) {
        try {
            window.top.location.replace(window.self.location.href);
        } catch (e) {
            // Si la redirection est bloquée, on vide le corps du document
            document.body.innerHTML = "<h1>Accès refusé : protection contre le clickjacking active.</h1>";
        }
    }

    // 2. Protection contre le Double-Click (Délégation d'événements)
    document.addEventListener('click', (event) => {
        const target = event.target.closest('button, a');
        
        if (target) {
            // Si déjà en cours de "refroidissement", on bloque tout
            if (target.dataset.preventClick === "true") {
                event.preventDefault();
                event.stopImmediatePropagation();
                return;
            }

            // Activer la protection
            target.dataset.preventClick = "true";
            target.classList.add('is-processing');

            // Réinitialisation après un délai court (500ms suffisent contre le double-clickjacking)
            setTimeout(() => {
                target.dataset.preventClick = "false";
                target.classList.remove('is-processing');
            }, 500); 
        }
    }, true); // "true" pour capturer l'événement en phase de capture
});

// CSS intégré plus propre
const style = document.createElement('style');
style.textContent = `
    .is-processing {
        opacity: 0.6 !important;
        pointer-events: none !important;
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);