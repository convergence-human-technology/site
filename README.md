<p align="center">
  <img src="https://github.com/convergence-human-technology/site/raw/main/cover-aether-suite.png" alt="....." width="100%" height="100%">
</p>


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

# Next Steps : Pipedream - Stripe Webhook Configuration

Step 1 : Create a Pipedream Account
Go to pipedream.com → Sign Up → continue with GitHub (keeps everything consistent with your project).

Step 2 : Create a New Workflow

- Click **"New Project"** then **"New Workflow"**
- Click **"Add Trigger"**
- Search for **"Stripe"** in the list
- Select :
  - **"New Payment Intent"** or
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

#
#
#

# Workflow is Live !

The workflow is now in production !

The **Stripe → Pipedream → Auth0** automation is fully active and operational.

When someone makes a payment on Stripe :

- Pipedream automatically detects the event
- Auth0 is updated with:

```json
{ "paid": true }
```

Next Step : Create members.html

Now you need to create the members.html page that :

Checks if the user has paid their membership (paid: true)

Grants access to the protected content

Access Logic

If paid: true → Access granted

If not → Display message: "Access denied, please pay"

Members Content

This page provides access to exclusive Convergence product content, including :

- Product presentations

- Demo pages

Access is strictly reserved for users who have purchased a membership via a Stripe Payment Link.




# Summary : Complete System

The full system works as follows :

- A user makes a payment on Stripe.  
- Pipedream updates Auth0 with :

```json
{ "paid": true }
```

members.html checks the user status and grants or denies access.

Access Levels

Standard User
A user with a basic account can log in to the site but does not have access to premium content.

VIP User (Paid Member)
A user who has purchased a membership via Stripe gets full access to :

. All products
. Demo pages
. Exclusive Convergence content

Access is granted only if paid: true.


#
#
#


# System Status: Fully Operational

The complete system is working:

- **Stripe** → 3 membership products created  
- **Pipedream** → Automatically detects payments  
- **Auth0** → Receives `paid: true` after each payment  
- **members.html** → Checks access and redirects if not paid  

# Access Control Logic

- If `paid: true` → User is granted access to premium content  
- If not → User is redirected or shown: **"Access denied, please pay"**

This ensures that only paying members can access Convergence’s exclusive products and demo content.

#

# 100% Free Professional System

We now have a **100% free website** with a complete professional system :

- A website with **Auth0 authentication**
- **Stripe payments** fully integrated
- **Pipedream automation** handling payment events
- A **secure members area** with controlled access
- A **free domain and hosting via GitHub Pages**

# Result :

A fully functional and professional ecosystem completely free where :

- Users can sign up and log in
- Payments are processed seamlessly
- Access rights are updated automatically
- Premium content is securely restricted to paying members only

We now have a 100% free website, with a complete professional system 100% free: - A site with Auth0 authentication - Stripe payments - A Pipedream automation - A secure member area - a domain name and free hosting via github page. The whole thing is 100% free.

#
#
#

# Improving GitHub Pages URLs

With a GitHub Pages website, default URLs are not always very aesthetic.  
Fortunately, there are simple, fast, and low-cost solutions to make them cleaner and more professional.

# Custom Domain (Simplest Method)

You can purchase a domain name like **visiontech.org** from providers such as :

- OVH  
- Namecheap  
- Cloudflare  

Then, in your GitHub repository :

**Settings → Pages → Custom domain**  
Enter your domain name.

# Result

Your site becomes accessible via a clean and professional URL like :

`https://visiontech.com`  
instead of a long and complex GitHub Pages URL.

---

# Cloudflare (Free, Fast, and Efficient)

If you purchase your domain directly from **Cloudflare**, you also get :

- Competitive domain pricing  
- Automatic HTTPS certificate  
- Clean URLs  
- Very fast setup (just a few minutes)

---

# Recommendation

I recommend using **Cloudflare** for your domain :

- Easy integration with GitHub Pages  
- Fast configuration  
- Professional result  

It’s one of the simplest ways to upgrade your site’s appearance and credibility.

