/* init.js — must be the LAST fragment concatenated by build/assemble.py.
   Calls syncEndings() and renderDomain(), both defined in
   business-name-domain.js, to do the page's first render (ending button
   states, domain text, prices) once every earlier fragment has run. */

  /* ---------------------------------------------------------------------
     Start
     --------------------------------------------------------------------- */
  syncEndings();
  renderDomain(); // also renders every price in the saved currency
