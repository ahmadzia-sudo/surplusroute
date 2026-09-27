# SurplusRoute — clickable prototype

A working web prototype for the SurplusRoute design thinking project. It runs entirely in the
browser with sample data. There is no database and no server code, which means it deploys as a
plain static site and cannot break in ways that need debugging during a presentation.

## Tech stack, and why

Plain HTML, CSS and JavaScript. No framework, no build step, no `npm install`.

This is deliberate. A React or Next.js project would need a build pipeline, dependency installs
and a version of Node that matches, and every one of those is a way for the demo to fail the
morning it is due. A static site has none of those moving parts, deploys to Vercel in under a
minute, and produces exactly the same visible result. The rubric rewards a real working website,
not a complicated one.

## What is inside

```
index.html                  Landing page
login.html                  Sign in (three demo accounts)
signup.html                 Create an account

outlet-dashboard.html       Outlet: tonight's listings and totals
outlet-new-listing.html     Outlet: list surplus (the three-field form)
outlet-listing.html         Outlet: collection codes for staff

user-verify.html            Resident: confirm eligibility
user-browse.html            Resident: what is available nearby
user-listing.html           Resident: one listing, with claim button
user-claim.html             Resident: collection code and live countdown
user-claims.html            Resident: collection history

admin-dashboard.html        Admin: platform overview
admin-review.html           Admin: approve or reject registrations

assets/styles.css           All styling and design tokens
assets/app.js               Sample data, fake sign-in, shared header
assets/logo.png             Logo
assets/fonts/               Self-hosted fonts, so no internet is needed to render
screenshots/                Every screen at phone and desktop width, for the report
```

## Demo accounts

Password for all three is `demo1234`.

| Email | Role | What you can do |
|---|---|---|
| sunil@bakery.ae | Food outlet | List surplus, see collection codes |
| maria@worker.ae | Resident | Browse, claim, get a code and timer |
| admin@surplusroute.ae | Administrator | Approve or reject registrations |

On the sign-in page you can click any of the three cards to fill the form automatically.

## The walkthrough to demo

1. Sign in as **sunil@bakery.ae**. Click **List surplus**, fill the short form, publish it.
2. You land on the collection codes screen. This is what staff look at when someone walks in.
3. Sign out. Sign in as **maria@worker.ae**. Your new listing appears at the top of the list.
4. Open it and click **Claim a portion**. The collection code screen appears with a live countdown.
5. Sign out. Sign in as **admin@surplusroute.ae** and approve a pending registration.

That covers all three account types and the full journey in about ninety seconds.

---

# Step 1: Put the project on GitHub

1. Go to **github.com** and sign in. If you do not have an account, create one first.
2. Click the **+** in the top right corner, then **New repository**.
3. Name it `surplusroute`.
4. Choose **Public**. Vercel's free plan works with public repositories without extra setup.
5. Do **not** tick "Add a README file". This project already has one.
6. Click **Create repository**.
7. On the next screen, click the link that says **uploading an existing file**.
8. Unzip `surplusroute.zip` on your computer. Open the folder it creates.
9. Select everything **inside** that folder and drag it into the browser window.
   Make sure you are uploading the files themselves, not the folder that contains them.
   When it is right, you will see `index.html` in the list, not `surplusroute`.
10. Scroll down and click **Commit changes**.

# Step 2: Open it in Codespaces and preview it

1. On your repository page, click the green **Code** button.
2. Click the **Codespaces** tab, then **Create codespace on main**.
3. Wait about a minute. A version of VS Code opens in your browser.
4. Click the **Terminal** menu at the top, then **New Terminal**. A panel opens at the bottom.
5. Type this command and press Enter:

   ```bash
   python3 -m http.server 8000
   ```

6. A pop-up appears at the bottom right saying a port is available. Click **Open in Browser**.
   If you miss it, click the **Ports** tab next to the terminal, find port 8000, and click the
   globe icon in the Forwarded Address column.
7. The site opens in a new tab. Click through it and check everything works.
8. To stop the server, click inside the terminal and press **Ctrl + C**.

**To edit a file:** click it in the file list on the left, make your change, then press
**Ctrl + S** to save. Refresh the browser tab to see it.

**To save your changes back to GitHub:**

```bash
git add .
git commit -m "Update prototype"
git push
```

Vercel redeploys automatically every time you push.

# Step 3: Deploy it on Vercel

1. Go to **vercel.com** and click **Sign Up**.
2. Choose **Continue with GitHub** and allow access when asked.
3. On your Vercel dashboard, click **Add New**, then **Project**.
4. Find `surplusroute` in the list and click **Import**.
5. On the configuration screen:
   - **Framework Preset:** choose **Other**
   - **Root Directory:** leave as it is
   - **Build Command:** leave empty
   - **Output Directory:** leave empty
   - **Install Command:** leave empty

   These are all empty on purpose. There is nothing to build.
6. Click **Deploy**.
7. Wait roughly thirty seconds. You get a live URL like
   `https://surplusroute.vercel.app`.

Put that URL in your report and open it live during the presentation.

## If something goes wrong

**The page loads but has no styling.** The `assets` folder did not upload. Check your repository
has an `assets` folder containing `styles.css`, `app.js` and `logo.png`.

**You see a file listing instead of the site.** You uploaded the outer folder rather than the files
inside it. In your repository, `index.html` must sit at the top level, not inside another folder.

**Vercel shows a 404.** Your Root Directory setting is pointing at a folder that is not there.
Go to Project Settings, then General, and clear the Root Directory field.

**A page redirects you to sign in.** That is the prototype working as intended. Each area checks
which account type you are signed in as. Sign in with the right demo account for that section.

**Something behaves oddly after lots of clicking.** The prototype stores your session and any
listings you created in the browser. Click **Start over** in the footer to reset it.

## Note on the data

Everything in `assets/app.js` is invented sample data written for this prototype. Nothing connects
to a real restaurant, a real person or a real payment system. The figures shown on the landing page
come from the sources cited in the project report.
