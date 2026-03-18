# CONVERGENCE Web Site

Website Convergenge / on Github Pages

site + space members Auth0 :

. https://convergence-human-technology.github.io/site

```
https://github.com/convergence-human-technology/site/...

├── index.html          ← Public page (home)
├── membres.html        ← Private page (members area)
├── callback.html       ← Auth0 return page (required)
├── css/
│   └── style.css
├── js/
│   └── auth.js         ← All the logic Auth0
└── img/
    └── logo.png
```

## Restricting access to paid members only

By default, anyone can create an account. To restrict access to certain pages
of the site for users who have not yet paid their Convergence membership fee,
a serverless workflow connects Stripe with Auth0 and GitHub Pages at zero cost.
```
User
    |
    v
Creates an account (Auth0) -- free
    |
    v
Pays via Stripe Payment Link -- free to create
    |
    v
Stripe sends a webhook to Pipedream -- free
    |
    v
Pipedream marks the user as paid in Auth0 -- free
    |
    v
membres.html checks the paid status in the token -- free
```

| Service | Role | Cost |
|---|---|---|
| GitHub Pages | Site hosting | Free forever |
| Auth0 | Login and paid status | Free up to 25,000 users/month |
| Stripe Payment Links | Payment collection | Free (commission on sales only) |
| Pipedream | Receives Stripe webhook and updates Auth0 | Free |

Stack used for payments : stripe.com

#

Stripe Payment Links works differently from Gumroad. Stripe is more powerful for collecting personalized information from future members before payment.
