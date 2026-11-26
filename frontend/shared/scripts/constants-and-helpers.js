/* constants-and-helpers.js — shared constants, lookup tables and tiny helpers.
   This fragment, and every other file in shared/scripts/, is concatenated
   by build/assemble.py in a fixed order and wrapped ONCE in
   "(function () { 'use strict'; ... })();" for the whole assembled page.
   DO NOT wrap this file in its own IIFE and DO NOT add 'use strict' here:
   every fragment below relies on sharing ONE function scope (e.g.
   pricing-currency.js's renderPrices()/currency are called directly by
   business-name-domain.js's renderDomain(); init.js calls functions defined
   in business-name-domain.js). Wrapping any single file would hide its
   names from the files that follow it and break the page.

   Declared here, used across later fragments:
   - root: <html> element, used everywhere (theme/currency attributes, --len).
   - SALES_EMAIL: destination address for every mailto: link.
   - UGX_PER_USD: indicative USD->UGX rate, read by pricing-currency.js.
   - KEYS: localStorage/sessionStorage key names (theme, currency kept across
     visits; name, tld kept for this tab only, see business-name-domain.js).
   - THEME_COLORS: <meta name="theme-color"> value per theme, read by
     theme-toggle.js.
   - DOMAIN_DISCOUNT / TLD_PRICES / DEFAULT_SLUG / DEFAULT_NAME: domain pricing
     table and fallbacks, read by business-name-domain.js.
   - reduceMotion / darkQuery: shared MediaQueryList objects, read by
     theme-toggle.js, header-nav.js, business-name-domain.js and tilt-3d.js.
   - store / session: safe localStorage/sessionStorage wrappers (never throw
     in private-browsing mode), used by every later fragment that persists state.
   - $ / $$: querySelector(All) shorthands, used throughout. */

  var root = document.documentElement;
  var SALES_EMAIL = 'sales@logoswebsiteservices.com';
  var UGX_PER_USD = 3650; // indicative rate, shown to the visitor
  // theme and currency are preferences (kept); name and ending are what the
  // visitor typed (kept for this tab only, so every page shows their business)
  var KEYS = { theme: 'logos-theme', currency: 'logos-currency', name: 'logos-name', tld: 'logos-tld' };
  // Browser bar colour = header colour of each theme
  var THEME_COLORS = { light: '#1E0F23', dark: '#14091A' };

  // Domains: yearly list prices in US dollars, before the discount.
  // The discount applies to every domain; every first-year price shown is derived from here.
  var DOMAIN_DISCOUNT = 0.10;
  var TLD_PRICES = { 'co.ug': 30, 'ug': 30, 'com': 13, 'org': 15 };
  var DEFAULT_SLUG = 'yourbusiness';
  var DEFAULT_NAME = 'Your business';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function safeStore(area) {
    return {
      get: function (k) { try { return window[area].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[area].setItem(k, v); } catch (e) { /* private mode */ } }
    };
  }
  var store = safeStore('localStorage');
  var session = safeStore('sessionStorage');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
