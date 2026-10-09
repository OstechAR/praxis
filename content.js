/* =======================================================================
   PRAXIS SITE CONTENT
   This is the only file to edit when adding or changing content.
   Each entry sits between { and }, and entries are separated by commas.
   See README.md for step-by-step instructions.
   ======================================================================= */
window.PRAXIS = {

  /* Channel links. Leave a link empty and it stays hidden. */
  links: {
    youtube: '',          // e.g. 'https://www.youtube.com/@yourchannel'
  },

  /* ---------------------------------------------------------------------
     VIDEOS — the library. Order doesn't matter; published videos are
     sorted by date. To release one: status 'published', a date, and a url.
     --------------------------------------------------------------------- */
  videos: [
    {
      id: 's002',
      title: 'Why can someone with a high income still be broke?',
      format: 'short',                 // 'short' or 'long'
      status: 'published',             // 'published' or 'upcoming'
      date: '2026-10-03',
      url: '',                         // the video's address
      poster: { fig: '$0', line: 'left at month end', cols: 10, groups: [[['g', 20]], [['w', 20]]] },
      summary: 'You get a big promotion. You make more, so you spend more: the nicer car, the bigger place, the better restaurants. None of it looks like a problem on its own, because you can afford it. But if your spending rises every time your income does, you end up right back where you started.',
      takeaway: 'If you spend everything you make, it doesn’t matter how high your income is. You can still end the month with nothing left.',
    },
    {
      id: 's001',
      title: 'Why is 8% interest high?',
      format: 'short',
      status: 'published',
      date: '2026-10-02',
      url: '',
      poster: { fig: '8%', line: 'became 25% more', cols: 10, groups: [[['b', 8]], [['g', 25]]] },
      summary: 'You borrow $100,000 at 8% to open your business. For the first year you only pay the interest, about $667 a month. A year in, you check your balance and you still owe $100,000. Then the real payments start: about $2,441 a month for four years, each one finally chipping away at the debt.',
      takeaway: '8% interest made you pay back 25% more than you borrowed.',
      numbers: [
        ['Borrowed', '$100,000'],
        ['Interest rate', '8% a year'],
        ['Year 1, interest only', 'about $667 a month'],
        ['Years 2 to 5', 'about $2,441 a month'],
        ['Interest paid', 'about $25,182'],
        ['Paid back in total', 'about $125,182'],
      ],
      tool: { page: 'calculator', label: 'Run your own loan' },
    },
    {
      id: 's003',
      title: 'Why a lower mortgage payment can cost more in the long run',
      format: 'short',
      status: 'upcoming',
      stage: 'In production',          // shown while upcoming
      date: '',
      url: '',
      poster: { fig: '30', line: 'years instead of 20', cols: 10, groups: [[['o', 30]]] },
      // Everything below shows once status is 'published'.
      summary: 'Your broker recommends 30 years instead of 20. Borrowing $300,000 at 5%, that drops the payment from about $1,971 a month to $1,601, which frees up $370 every month. But you pay the debt down more slowly, and the bank collects interest for longer.',
      takeaway: 'Saving $370 a month cost about $103,000 more in interest.',
      numbers: [
        ['Borrowed', '$300,000'],
        ['Interest rate', '5%'],
        ['Payment over 20 years', 'about $1,971 a month'],
        ['Payment over 30 years', 'about $1,601 a month'],
        ['Monthly difference', 'about $370'],
        ['Extra interest over 30 years', 'about $103,000'],
      ],
      fine: 'Canadian dollars. 5% a year compounded twice a year, the same rate at every renewal, regular monthly payments, and no extra payments or fees.',
      source: { label: 'Financial Consumer Agency of Canada: mortgage relief options', url: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/relief-options.html' },
      tool: { page: 'calculator', label: 'Run your own mortgage' },
    },
  ],

  /* ---------------------------------------------------------------------
     INTERACTIVE PIECES — paced animations, simulators.
     Put the piece's HTML file in pieces/ and add an entry here.
     --------------------------------------------------------------------- */
  interactives: [
    {
      id: 'pa001',
      title: 'Why is everything so expensive?',
      blurb: 'A higher price is an outcome, not an explanation. Move through a model at your own speed: a loaf of bread, the chain that makes it, and what happens to the price when something changes.',
      file: 'pieces/pa001.html',
      status: 'published',
      date: '2026-10-08',
      poster: { fig: '$3.40', line: 'It used to be $3.00', cols: 14, groups: [[['g', 6], ['o', 1]]] },
    },
  ],

  /* ---------------------------------------------------------------------
     TOOLS — each one gets its own link in the top menu.
     --------------------------------------------------------------------- */
  tools: [
    {
      id: 'calculator',
      label: 'Calculator',
      file: 'pieces/calculator.html',
      hideInside: '.brand',            // parts of the tool to hide when it runs inside the site
      heading: 'Then run your own numbers',
      blurb: 'The calculator shows where every payment goes: what pays down the amount you borrowed, and what goes to interest.',
      features: [
        ['Loan', 'What a fixed-rate loan costs you, payment by payment.'],
        ['Mortgage', 'Your payment, what you still owe when the term ends, and the interest along the way.'],
        ['Savings', 'How regular deposits grow, and how much of the total is interest.'],
        ['Debt payoff', 'How long a fixed payment takes to clear a balance, and what paying extra saves.'],
        ['Compare rates', 'The same loan at two interest rates, side by side.'],
      ],
    },
  ],

  /* ---------------------------------------------------------------------
     EXTRA PAGES — any other page. Put its HTML file in pieces/ and add
     e.g.  { id: 'about', label: 'About', file: 'pieces/about.html' },
     --------------------------------------------------------------------- */
  pages: [
  ],
};
