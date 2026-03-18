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
@see tutorial : https://github.com/convergence-human-technology/github-pages-auth0-free-members-area

#

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

#

Let's start from the beginning, in logical order
Here is the complete 4-step plan:

. Step 1 : Stripe Payment Link (10 minutes)
Create a payment link on stripe.com that corresponds to your "entry fee". No code needed. Stripe generates a URL like buy.stripe.com/xxxxx that you simply put on your site.

. Step 2 : Pipedream receives the Stripe webhook (20 minutes)
When someone pays, Stripe automatically sends a message to Pipedream. Pipedream is a free service that allows you to connect services together without a server.

. Step 3 : Pipedream updates Auth0 (20 minutes)
Pipedream calls the Auth0 API to add metadata to the user:
```json
{ "paid": true }
```

. Step 4 : members.html checks the paid status
The members page reads this metadata and redirects to the paid content or displays a message "Access denied, please pay".

#

# Convergence Membership - One-Time Payments (Stripe)

Create 3 separate products in Stripe:
Choose: **"One-time" (not recurring)**  
Each membership is paid **in a single payment** for the full duration.

## Products Setup

| Product | Duration | Price / month | Total (one-time) |
|--------|----------|---------------|------------------|
| Membership – 1 Year | 12 months | €15 / month | €180 |
| Membership – 3 Years | 36 months | €10 / month | €360 |
| Membership – 5 Years | 60 months | €8 / month | €480 |

## Convergence Membership

The **Convergence Membership** provides access to product demos and presentation pages.

Convergence is a software company that designs PC applications and innovative IT solutions based on unique concepts never explored elsewhere.

Your membership gives you access to all presentation and demonstration pages of our exclusive products.

Simple yet powerful tools, unlike anything else in the world, available only to Convergence members.

#
#
#

Next Steps : Pipedream – Stripe Webhook Configuration

Step 1 : Create a Pipedream Account
Go to pipedream.com → Sign Up → continue with GitHub (keeps everything consistent with your project).

Step 2 : Create a New Workflow

- Click **"New Project"** then **"New Workflow"**
- Click **"Add Trigger"**
- Search for **"Stripe"** in the list
- Select :
  - **"New Payment Intent"** OR
  - **"Checkout Session Completed"**

Step 3 : Connect Your Stripe Account
Pipedream will ask for access to Stripe:

- Click **"Connect Stripe"**
- Authorize access

Step 4 : What Pipedream Receives Automatically

When a customer makes a payment, Stripe sends an event containing:

- Customer email
- Amount paid
- Payment status

Pipedream captures this event and triggers the next actions toward Auth0.



