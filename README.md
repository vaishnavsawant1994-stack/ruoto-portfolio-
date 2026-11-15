# Ruoto Portfolio — Ruota reference-inspired restaurant site

**Status:** independently coded initial implementation; not certified as pixel-perfect.  
**Reference:** https://ruota-template.framer.website/  
**Repository:** https://github.com/vaishnavsawant1994-stack/ruoto-portfolio-  
**Deployment target:** Vercel (not yet verified).

## Routes

- \`/\` — rotatable illustrated pasta plate hero, introduction, counters, stacked dish cards, wine list, group table, visit/hours.
- \`/menu\` — antipasti, pasta, dolci, wine with anchored categories.
- \`/reservations\` — booking request and private dining enquiry.
- Unmatched URLs — custom \`404.html\` with return routes.

Vanilla HTML, CSS, and browser JavaScript avoid dependencies for this prototype. \`api/submit.js\` is a Vercel Node function for securely relaying form requests through Resend if configured.

## Run locally

Serve the repository root through an HTTP server, for example \`python -m http.server 8000\`. The client-side router uses HTML5 history. For deep-link server rewrites and the API function, use a compatible Vercel environment.

Run source-level checks with:
\`\`\`bash
node --check app.js
node --check api/submit.js
node --test tests/*.test.cjs
\`\`\`
Those smoke tests do **not** substitute for Playwright visual, accessibility, functional or animation verification.

## Form delivery (required before accepting real requests)

Set these secrets in the Vercel project, not in client-side code:
- \`RESEND_API_KEY\` — provider API key.
- \`RUOTA_INBOX_EMAIL\` — authorized inbox for table/enquiry requests.
- \`RUOTA_FROM_EMAIL\` — verified provider sender.

The forms send JSON to \`/api/submit\`, which validates requests server-side and forwards to the configured inbox. On absent configuration or provider failure, it returns a real error and the browser **does not** announce success. A delivered reservation request is **not** a confirmed booking. Newsletter submissions email a subscription request to the inbox; they are **not** automatic list subscriptions. Connect a compliant mailing-list provider before advertising live subscriptions.

You may override \`window.RUOTA_CONFIG\` before \`app.js\` runs:
\`\`\`html
<script>
window.RUOTA_CONFIG = {
  timeZone: "Europe/London",
  endpoints: {
    booking: "/api/submit",
    private: "/api/submit",
    newsletter: "/api/submit"
  }
};
</script>
\`\`\`
The sample address and hours in the reference are not verified real-world business information. Set the authentic business time zone and replace sample contact details before launch.

## Media and licensing

- The Framer marketplace lists the original Ruota template with a **single-use license** and tells users to replace preview/sample photographs. Verify licensing before transferring any original template asset to this independent site.
- **No Framer source code, proprietary images, or template files have been copied.** This implementation uses original CSS/SVG illustrations. Those illustrations do **not** visually match the reference photography; replacing them with properly licensed matching imagery is a tracked blocker.
- The fonts, Fraunces and DM Sans, are loaded from Google Fonts; review their open-source licenses when self-hosting.
- Brand text, sample restaurant address/menu, and pricing in the prototype are illustrative. Obtain authorization and production details before representing a real restaurant.
- Social links are omitted rather than linking to unverified accounts.
- Do not claim this is the official Ruota website or a verified visual clone.

## Quality status

See \`docs/REFERENCE_AUDIT.md\` for route and interaction inventory, unresolved visual/motion gaps, test matrix, and deployment blockers. GitHub Actions performs syntactic/smoke checks only. Full browser QA and side-by-side reference screenshot testing are still required.

## Production next steps

1. Secure template / asset permissions and brand approval.
2. Obtain licensed final food photography, validated hours, address, locale/currency, and verified contact endpoints.
3. Resolve Vercel project creation access, connect this GitHub repository, and configure environment secrets.
4. Use screenshots at 320/375/430/768/1024/1440/1920/2560 widths to measure and fix layout and motion differences.
5. Test Chromium, WebKit, Firefox, touch, keyboard, form delivery, performance and reduced motion.
6. Set final canonical URL and sitemap, then publish only after deployment checks.
