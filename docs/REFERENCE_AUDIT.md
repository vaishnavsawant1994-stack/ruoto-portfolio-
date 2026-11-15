# Ruota reference discovery and acceptance ledger

**Audited on:** 2026-11-16  
**Source:** https://ruota-template.framer.website/ and Framer's marketplace Ruota listing (Atypikal Agency).  
**Scope:** independent Vercel-hosted recreation, subject to licensing and available verification tooling.

## Evidence grades

- **Observed via public page source:** route structures, page copy/fields/links and categories.
- **Publisher-documented:** behaviors described in the marketplace listing, not independently measured frame-by-frame.
- **Implemented:** code committed in this repository; not necessarily browser-tested.
- **Unverified:** no captured synchronized browser comparison/real service proof.

## Inventory

| Route / area | Page and component inventory | Status |
| --- | --- | --- |
| \`/\` | Top navigation, large plate/wordmark hero, morning story, rolling number statistics, four featured dishes, wine rows, private dining section, visiting hours, footer newsletter | Independently implemented with different illustrative media; reference animations not measured |
| \`/menu\` | Antipasti, pasta, dolci and wine sections; jump links; dish names, descriptions, prices and media | Content categories and links implemented; no CMS |
| \`/reservations\` | Booking request fields: date, time, guests, phone, name, email, notes; private dining fields: name, email, date, guests and message | Client and server validation implemented; sending depends on production mail credentials |
| Unknown route | Custom 404 with return navigation | Implemented as static 404 file; deployment response unverified |
| Shared | Desktop navigation and mobile drawer, footer newsletter, font styles, buttons, focus states | Implemented, exact visual parity unverified |

## Motion inventory

| Motion or state | Evidence | Implementation | Outstanding |
| --- | --- | --- | --- |
| Hero plate rotation | Publisher-documented | CSS continuous rotation | Exact rotation/timing/pointer reaction unknown |
| Morning number roll | Publisher-documented | IntersectionObserver + requestAnimationFrame easing | Timing, easing and individual digit behavior not reference-matched |
| Stacking pasta cards | Publisher-documented | CSS sticky cards on larger screens | Scrub choreography/timing not matched; mobile stacks in flow |
| Mobile navigation | Publisher-documented | Accessible menu drawer | Compare slide, overlay and focus behavior against reference |
| Entrance reveal | Publisher-documented | IntersectionObserver fade/translate | Exact timings and triggers unverified |
| Live open status | Publisher-documented | Configurable timezone-aware calculation; intentionally disabled until configured | Actual restaurant time zone and hours unknown |
| Forms and errors | Visible page source | Real validation and server endpoint boundary | Verified email and email secrets required |

## Missing evidence / production release blockers

- Original template **currently listed as single-use licensed**; preview photos explicitly marked as samples. No authorization proof provided to reuse original imagery/design assets.
- Original screenshot captures and synchronized comparison for all requested viewports have **not** been executed.
- The exact visual properties, color values, section dimensions, pointer effects and responsive breakpoints have **not** been measured from live browser rendering.
- Food photography and original dish imagery are **not** reproduced; custom SVG/CSS illustrations are conspicuously different.
- Original Framer CMS data integration not recreated; menu is static.
- Form API exists but live sending is blocked pending \`RESEND_API_KEY\`, \`RUOTA_INBOX_EMAIL\` and \`RUOTA_FROM_EMAIL\`.
- Newsletter list-provider integration is not present (email request notification only).
- Opening status disabled pending restaurant time zone, validated address and hours.
- No known verified production domain; canonical metadata and sitemap are deferred.
- End-to-end browser tests (Firefox, WebKit, Chromium), latency/FPS/CLS measurements and production network inspection not executed.
- Actual Vercel project creation and deployment verification have not been completed; access may block.

## Verification checklist

| Check | State |
| --- | --- |
| Page inventory from published sources | Observed |
| Independently implemented route sections | Implemented (requires QA) |
| JS syntax and built-in unit/smoke checks | Available in CI; see actual run before marking passed |
| 320/375/430/768/1024/1440/1920/2560 screenshots | Not run |
| Reference overlay/difference visual comparison | Not run |
| Pointer/motion timing comparison | Not run |
| Keyboard and touch browser walk-through | Not run |
| Real form submission with production credentials | Not run |
| Lighthouse / measured 60 FPS tests | Not run |
| GitHub main commit | To confirm from GitHub after writes |
| Vercel production URL + smoke test | Blocked / not verified |

**Provisional verdict:** Partially implemented. A 100% or fully verified claim would be unsupported.
