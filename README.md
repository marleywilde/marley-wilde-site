# Marley Wilde website

A single-page site with one small backend function for the contact form, set up for Vercel.

```
marley-wilde-site/
├── index.html        ← the whole page: text, layout, styles and script
├── images/           ← hero.jpg, logo.png (menu), logo-name.png (big seal)
├── api/contact.js    ← emails contact-form messages to you
└── package.json
```

## Making changes yourself

Open `index.html` in any text editor (VS Code is free and good).

| To change… | Search `index.html` for… |
|---|---|
| Bio text | `class="about-text"` |
| Height / hair / eyes etc. | `class="stats"` |
| Menu links | `id="mainNav"` |
| Social links | `class="icons"` |
| Email / phone | `class="reps"` |
| Press list | `class="press"` |
| Colors | `:root {` at the top of the `<style>` block |

To swap a photo, put the new file in `images/` with the same name, or change the `src="images/..."` in the HTML.

To preview locally, just double-click `index.html`. (The contact form only works once deployed.)

## Deploying to Vercel

1. **Put the folder on GitHub** (easiest way to keep updating it):
   create a new repository at github.com, then upload the contents of this folder.
2. Go to **vercel.com → Add New → Project**, import that repository and click **Deploy**.
   No build settings are needed.
3. Every time you change a file on GitHub, Vercel republishes the site automatically.

No GitHub? Install the Vercel CLI (`npm i -g vercel`), open a terminal in this folder and run `vercel`, then `vercel --prod`.

## Turning on the contact form

1. Sign up at **resend.com** (free tier is plenty) and create an API key.
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = your key
   - `CONTACT_TO` = `marleymoney593@gmail.com`
3. Redeploy (Deployments → ⋯ → Redeploy).

Until you verify your own domain in Resend, messages can only be delivered to the email address on your Resend account, so sign up to Resend with the same email you want messages sent to. After adding a domain, set `CONTACT_FROM` to something like `Website <hello@yourdomain.com>`.

## Connecting marleywilde.com (Hostinger)

Keep the domain at Hostinger; you only change its DNS records.

1. **In Vercel:** project → **Settings → Domains** → add `marleywilde.com`, then also add `www.marleywilde.com` (let Vercel redirect one to the other).
   Vercel then shows the exact records it wants. They are usually:
   - `A` record, name `@`, value `76.76.21.21`
   - `CNAME` record, name `www`, value `cname.vercel-dns.com`
   If Vercel shows different values, use Vercel's.
2. **In Hostinger:** hPanel → **Domains** → marleywilde.com → **DNS / Nameservers** → **DNS records**.
   - Delete any existing `A` record for `@` and any `CNAME` or `A` record for `www` (these point to Hostinger's parking page).
   - Add the two records from step 1. Leave TTL at the default.
   - Don't touch `MX` records if you use email on this domain.
3. Wait. It's often live in minutes but can take a few hours. Vercel's Domains page turns green when it works, and it sets up HTTPS for you.

If Hostinger's DNS page says the domain uses other nameservers, click **Change nameservers → Use Hostinger nameservers** first, then add the records.

## Sending the form from your own address (optional, recommended)

1. In Resend → **Domains → Add domain** → `marleywilde.com`.
2. Resend lists a few DNS records (TXT/MX for things like `resend._domainkey` and `send`). Add each one in Hostinger's DNS records page exactly as shown.
3. When Resend shows the domain as verified, add this environment variable in Vercel and redeploy:
   - `CONTACT_FROM` = `Marley Wilde Website <hello@marleywilde.com>`

After that, form messages can go to any inbox, not just your Resend login email.
