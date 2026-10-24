/**
 * Site-wide Ad-Free gate. Loaded on every page (alongside the Ezoic
 * Subscriptions script, https://sm.ezoic.com/min.js) so that a subscriber's
 * ad suppression follows them across the whole site, not just the
 * subscription pages. Those pages have their own richer UI wired through
 * subscription-ui.js / subscription-service.mjs; this file decides, on every
 * page, whether ads should show, and where the Ad-Free links go.
 *
 * Fails silently and safely: if Ezoic isn't reachable, ads render exactly
 * as sa.min.js already renders them for every other visitor.
 */
import { subscriptionService } from '/js/subscription-service.mjs';

// Ad-Free links: subscribers go to /subscription/ (their account page)
// instead of the sales page, the same rule subscription-ui.js applies to the
// nav link on the Ad-Free pages. The live check can take a few seconds, so
// the last answer is remembered on this device (just "1", no account data)
// and applied straight away; everyone else is never held up.
const SUBSCRIBED_KEY = 'pb_ad_free_active';
const AD_FREE_PATHS = ['/ad-free/', '/ad-free', '/ad-free/index.html'];

function readSubscribed() {
  try {
    return localStorage.getItem(SUBSCRIBED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSubscribed(active) {
  try {
    if (active) localStorage.setItem(SUBSCRIBED_KEY, '1');
    else localStorage.removeItem(SUBSCRIBED_KEY);
  } catch {
    // Storage blocked: links just follow the live check on each page.
  }
}

let subscribed = readSubscribed();

function isAdFreeLink(link) {
  // data-ad-free-href holds the original target once a link is retargeted.
  if (link.dataset.adFreeHref) return true;
  try {
    const url = new URL(link.getAttribute('href'), location.href);
    return url.hostname.replace(/^www\./, '') === location.hostname.replace(/^www\./, '')
      && AD_FREE_PATHS.includes(url.pathname);
  } catch {
    return false;
  }
}

function retarget(link) {
  if (subscribed) {
    if (!link.dataset.adFreeHref) link.dataset.adFreeHref = link.getAttribute('href');
    link.setAttribute('href', '/subscription/');
  } else if (link.dataset.adFreeHref) {
    link.setAttribute('href', link.dataset.adFreeHref);
    delete link.dataset.adFreeHref;
  }
}

function retargetAll() {
  document.querySelectorAll('a[href]').forEach(link => {
    if (isAdFreeLink(link)) retarget(link);
  });
}

// Settles the remembered answer from a live check. Only a definite answer
// changes it: if Ezoic couldn't be reached, keep what we knew.
function applyAccess({ state, reason } = {}) {
  if (state === 'AD_FREE') subscribed = true;
  else if (state === 'FREE' || state === 'INACTIVE' || reason === 'login_required') subscribed = false;
  else return;
  writeSubscribed(subscribed);
  retargetAll();
}

// Catches links added after load (and any click before the check settles)
// by fixing the href right before the browser follows it.
document.addEventListener('click', event => {
  const link = event.target.closest && event.target.closest('a[href]');
  if (link && isAdFreeLink(link)) retarget(link);
}, true);

if (subscribed) retargetAll();

subscriptionService.syncAdVisibility().then(result => applyAccess(result.access));
subscriptionService.watchAdVisibility();
window.addEventListener('access:change', () => {
  subscriptionService.checkAccess().then(applyAccess);
});
