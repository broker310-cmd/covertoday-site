// ---------------------------------------------------------------------------
// Server-side lead intake proxy.  /api/lead
//
// WHY THIS EXISTS
// Before this endpoint, the GoHighLevel inbound-webhook URL was hardcoded in
// client-side JavaScript and therefore printed into the HTML of 47 pages. In
// August 2026 a bot scraped it and POSTed JSON straight to GHL, creating 47 fake
// leads + opportunities in 5 days and triggering 47 automated emails to scraped
// third-party addresses. Because the bot never loaded the form, NO front-end
// control (captcha, honeypot, JS validation) could have stopped it.
//
// The webhook URL now lives ONLY in the GHL_WEBHOOK_URL server env var and is
// never sent to the browser. Every submission passes through the checks below.
//
// ENV VARS (set in Vercel → Project → Settings → Environment Variables)
//   GHL_WEBHOOK_URL           required. The GHL inbound webhook trigger URL.
//   TURNSTILE_SECRET_KEY      optional. Cloudflare Turnstile secret. If set,
//                             a valid token becomes REQUIRED.
//   PUBLIC_TURNSTILE_SITE_KEY optional. Build-time; renders the widget.
// ---------------------------------------------------------------------------

// DEPLOY-ORDER SAFETY NET.
// This is the OLD webhook URL. It is already public — it sat in the HTML of 47
// pages, which is how it got scraped — so keeping it here costs nothing: this
// file is server-side and never reaches the browser.
//
// Its only job is to keep the quote forms working if this code ships before
// GHL_WEBHOOK_URL is set in Vercel. The moment that env var exists, it wins.
//
// DELETE THIS CONSTANT once the webhook has been rotated and the env var is set.
const LEGACY_WEBHOOK =
  'https://services.leadconnectorhq.com/hooks/eYZdYbKt9k4UeIF4JLJJ/webhook-trigger/32bb8191-de93-4bc7-9ff5-6a95fb6599f4';

const WEBHOOK = process.env.GHL_WEBHOOK_URL || LEGACY_WEBHOOK;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

const ALLOWED_ORIGINS = [
  'https://covertoday.com',
  'https://www.covertoday.com',
];

// Minimum seconds a human plausibly takes to fill the form. Bots replay instantly.
const MIN_FILL_MS = 2500;
const MAX_FORM_AGE_MS = 6 * 60 * 60 * 1000; // 6h — stale/replayed token

// Per-IP rate limit. In-memory: resets when the function instance recycles, which
// is fine — it exists to blunt a flood, not to be a system of record.
// 5 not 3: a shared office / household NAT can legitimately produce several
// quote requests from one IP in a short window.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map();

// Manual blocklist. Add offending IPs / CIDR-free exact matches here if an attack
// ever recurs; the endpoint logs every client IP so you will have them.
const BLOCKED_IPS = new Set([]);

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return arr.length > RATE_MAX;
}

function clientIp(req) {
  const xff = req.headers.get('x-forwarded-for') || '';
  return (xff.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

// --- validators -----------------------------------------------------------

// NANP: 10 digits, area code + exchange must start 2-9, no N11 area codes.
function normalizePhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  const ten = d.length === 11 && d[0] === '1' ? d.slice(1) : d;
  if (ten.length !== 10) return null;
  if (!/^[2-9]/.test(ten)) return null;              // invalid area code
  if (/^[2-9]11/.test(ten)) return null;             // 211/311/411/911...
  if (!/^[2-9]/.test(ten.slice(3, 4))) return null;  // invalid exchange
  if (/^(\d)\1{9}$/.test(ten)) return null;          // 5555555555
  return '+1' + ten;
}

// Area codes actually in service in the NANP (US, Canada, territories).
// Used as a SOFT signal only — a brand-new NPA activating would otherwise start
// silently rejecting real leads. The Aug 2026 bot generated structurally-valid
// but unassigned codes (589, 633, 544, 983, 686, 654, 789, 768, 852, 922, 948…),
// so this catches a lot while costing nothing when it is wrong.
const VALID_NPA = new Set(`
201 202 203 204 205 206 207 208 209 210 212 213 214 215 216 217 218 219 220 223 224 225 226 227 228 229 231 234 236 239 240 242 246 248 249 250 251 252 253 254 256 260 262 263 264 267 268 269 270 272 273 274 276 279 281 283 284 289
301 302 303 304 305 306 307 308 309 310 312 313 314 315 316 317 318 319 320 321 323 325 326 327 329 330 331 332 334 336 337 338 339 340 341 343 345 346 347 350 351 352 354 360 361 363 364 365 367 368 369 380 381 382 385 386 387
401 402 403 404 405 406 407 408 409 410 412 413 414 415 416 417 418 419 423 424 425 428 430 431 432 434 435 437 438 440 441 442 443 445 447 448 450 458 463 464 468 469 470 472 473 474 475 478 479 480 484
501 502 503 504 505 506 507 508 509 510 512 513 514 515 516 517 518 519 520 530 531 534 539 540 541 548 551 557 559 561 562 563 564 567 570 571 572 573 574 575 579 580 581 582 584 585 586 587 588
601 602 603 604 605 606 607 608 609 610 612 613 614 615 616 617 618 619 620 623 626 628 629 630 631 636 639 640 641 646 647 649 650 651 656 657 658 659 660 661 662 664 667 669 670 671 672 678 680 681 682 683 684 689
701 702 703 704 705 706 707 708 709 712 713 714 715 716 717 718 719 720 721 724 725 726 727 731 732 734 737 740 742 743 747 753 754 757 758 760 762 763 765 767 769 770 771 772 773 774 775 778 779 780 782 784 785 786 787
801 802 803 804 805 806 807 808 809 810 812 813 814 815 816 817 818 819 820 825 825 826 828 829 830 831 832 835 838 839 840 843 845 847 848 849 850 854 856 857 858 859 860 862 863 864 865 867 868 869 870 872 873 878 876 879
901 902 903 904 905 906 907 908 909 910 912 913 914 915 916 917 918 919 920 925 928 929 930 931 934 935 936 937 938 939 940 941 943 945 947 949 951 952 954 956 959 970 971 972 973 978 979 980 983 984 985 986 989
`.trim().split(/\s+/));

// SOFT signal only — never rejects. Real customers include transliterated
// Russian/Georgian/Armenian names, so a hard name filter would drop real leads.
// The bot's names were random letter strings ("nfuKVNIiWyOjhHEgjaxORsOo").
function gibberishScore(name) {
  const s = String(name || '').trim();
  if (!s) return 0;
  const letters = s.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 8) return 0;
  let score = 0;
  const vowels = (letters.match(/[aeiouyAEIOUY]/g) || []).length;
  const ratio = vowels / letters.length;
  if (ratio < 0.22 || ratio > 0.72) score += 2;
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(letters)) score += 2;
  if (letters.length >= 15 && !/\s/.test(s)) score += 2;  // one long token
  // random capitalisation mid-word, e.g. "nfuKVNIiWyOj"
  if (/[a-z][A-Z]{2,}[a-z]/.test(s)) score += 3;
  return score;
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: 'missing-captcha' };
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
    });
    const d = await r.json();
    return d.success ? { ok: true } : { ok: false, reason: 'captcha-failed' };
  } catch {
    // Fail OPEN on Cloudflare outage — the other layers still apply, and losing a
    // real quote request is worse than letting one bot through.
    return { ok: true, degraded: true };
  }
}

// --- handler --------------------------------------------------------------

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
    if (request.method !== 'POST') return json(405, { error: 'method not allowed' });

    const ip = clientIp(request);
    const ua = request.headers.get('user-agent') || '';
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';

    const deny = (reason, status = 400) => {
      console.warn(
        `[lead:BLOCK] reason=${reason} ip=${ip} origin=${origin || '-'} ua="${ua.slice(0, 120)}"`
      );
      // Deliberately vague + 200-shaped error so a bot can't tune against us.
      return json(status, { ok: false, error: 'Could not process this submission.' });
    };

    if (BLOCKED_IPS.has(ip)) return deny('blocklist', 403);

    // 1. Origin must be our own site. A direct curl/script POST has no Origin
    //    header at all — which is exactly how the August 2026 attack ran.
    const src = origin || referer;
    if (!src || !ALLOWED_ORIGINS.some((o) => src.startsWith(o))) return deny('bad-origin', 403);

    if (!WEBHOOK) {
      console.error('[lead:CONFIG] GHL_WEBHOOK_URL is not set');
      return json(500, { ok: false, error: 'Form temporarily unavailable.' });
    }

    // 2. Rate limit per IP.
    if (rateLimited(ip)) return deny('rate-limit', 429);

    let body;
    try {
      body = await request.json();
    } catch {
      return deny('bad-json');
    }

    // 3. Server-side honeypot. Hidden field; humans never fill it.
    if (body._hp) return deny('honeypot');

    // 4. Timing. The form stamps render time; a replay bot has none or a stale one.
    const ts = Number(body._ts);
    if (!ts || Number.isNaN(ts)) return deny('no-timestamp');
    const elapsed = Date.now() - ts;
    if (elapsed < MIN_FILL_MS) return deny('too-fast');
    if (elapsed > MAX_FORM_AGE_MS) return deny('stale-form');

    // 5. Captcha (only enforced once TURNSTILE_SECRET_KEY is set).
    const cap = await verifyTurnstile(body._turnstile, ip);
    if (!cap.ok) return deny(cap.reason, 403);

    // 6. Field validation.
    const name = String(body.name || body.full_name || '').trim().slice(0, 120);
    if (name.length < 2) return deny('bad-name');

    const phone = normalizePhone(body.phone);
    if (!phone) return deny('bad-phone');

    const zipRaw = String(body.zip || '').trim().slice(0, 40);
    const email = String(body.email || '').trim().slice(0, 160);
    if (email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return deny('bad-email');

    // 7. Build the forwarded payload. Whitelist fields — never blind-forward, or a
    //    bot could inject arbitrary keys into the CRM.
    const ALLOW = [
      'name', 'full_name', 'phone', 'email', 'zip', 'line', 'insurance_type',
      'currently_insured', 'dot_mc', 'units', 'new_venture', 'sms_consent',
      'consent_language', 'source', 'page', 'submitted_at',
    ];
    const payload = {};
    for (const k of ALLOW) if (body[k] !== undefined) payload[k] = String(body[k]).slice(0, 2000);

    payload.name = name;
    payload.phone = phone;
    payload.zip = zipRaw;

    // Attribution the CRM never had before — this is what makes a future attack
    // traceable and blockable.
    payload.client_ip = ip;
    payload.user_agent = ua.slice(0, 200);
    payload.fill_seconds = Math.round(elapsed / 1000);
    payload.verified_by = 'covertoday-api/lead';

    // 8. Soft spam scoring. Suspicious leads still reach the CRM (never silently
    //    dropped) but are flagged so a workflow can route them to review instead
    //    of the live pipeline.
    let score = gibberishScore(name);
    if (!VALID_NPA.has(phone.slice(2, 5))) score += 3;   // unassigned area code
    if (!email) score += 0;                              // email is optional; no penalty
    payload.spam_score = String(score);
    payload.suspected_spam = score >= 4 ? 'yes' : 'no';

    try {
      const r = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        console.error(`[lead:UPSTREAM] GHL responded ${r.status} ip=${ip}`);
        return json(502, { ok: false, error: 'Could not reach our system. Please call (310) 299-5555.' });
      }
    } catch (e) {
      console.error(`[lead:UPSTREAM] fetch failed ip=${ip} err=${e && e.message}`);
      return json(502, { ok: false, error: 'Could not reach our system. Please call (310) 299-5555.' });
    }

    console.log(
      `[lead:OK] ip=${ip} source="${payload.source || '-'}" score=${score} fill=${payload.fill_seconds}s`
    );
    return json(200, { ok: true });
  },
};
