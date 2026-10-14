const SITE_LINKS = {
  discord: 'https://discord.gg/bcPcvU8yCC'
};

const RELEASE_LINKS = {
  all: 'https://github.com/matjedo/PyUtilsX/releases',

  // Latest stable release
  latestStable: 'https://github.com/matjedo/PyUtilsX/releases/latest',

  // Replace with the URL of your latest pre-release
  latestPreRelease: 'https://github.com/matjedo/PyUtilsX/releases/tag/1.2.0.2'
};

const TOOLKIT_APPS = [
  {
    name: 'FileX',
    status: 'Stable',
    icon: 'shield',
    tone: 'blue',
    description: 'Verify file integrity with SHA-256 and SHA-1 hashes. Compare checksums with a clean, straightforward workflow.',
    tags: ['SHA-256', 'SHA-1', 'Windows'],
    linkLabel: 'Get FileX',
    release: 'stable'
  },
  {
    name: 'SuperPySearch',
    status: 'Stable',
    icon: 'search',
    tone: 'blue',
    description: 'Search for files across a drive or a large folder without manually digging through every directory.',
    tags: ['File search', 'Productivity'],
    linkLabel: 'Get SuperPySearch',
    release: 'stable'
  },
  {
    name: 'Cipher++',
    status: 'Stable',
    icon: 'code',
    tone: 'blue',
    description: 'An all-in-one utility for encoding, decoding and generating hashes from one place.',
    tags: ['Encoding', 'Decoding', 'Hashes'],
    linkLabel: 'Get Cipher++',
    release: 'stable'
  }

  /*
    TO ADD AN APP:
    Copy an object above and edit its information.

    status: 'Stable', 'Pre-release' or 'Planned'
    icon: 'shield', 'search', 'code' or 'box'
    tone: 'blue', 'purple' or 'gray'
    release: 'stable', 'prerelease' or 'all'

    You can also use a custom URL:
    url: 'https://example.com/download'

    Example:

    {
      name: 'MyNewTool',
      status: 'Stable',
      icon: 'box',
      tone: 'blue',
      description: 'Description of your new app.',
      tags: ['Windows', 'Productivity'],
      linkLabel: 'Get MyNewTool',
      release: 'stable'
    }
  */
];


// ==========================================
// ICONS
// ==========================================

const ICONS = {
  shield:
    '<path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',

  search:
    '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',

  code:
    '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>',

  box:
    '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/>'
};


// ==========================================
// HELPERS
// ==========================================

const escapeHTML = value =>
  String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

function getReleaseUrl(app) {
  if (app.url) return app.url;

  if (app.release === 'stable') {
    return RELEASE_LINKS.latestStable;
  }

  if (app.release === 'prerelease') {
    return RELEASE_LINKS.latestPreRelease;
  }

  return RELEASE_LINKS.all;
}


// ==========================================
// TOOLKIT RENDERING
// ==========================================

function renderToolkit() {
  const grid = document.querySelector('#tool-grid');
  if (!grid) return;

  grid.innerHTML = TOOLKIT_APPS.map((app, index) => {
    const status = app.status.toLowerCase();

    const statusClass =
      status === 'stable' ? 'status-stable' :
      status === 'pre-release' ? 'status-prerelease' :
      'status-planned';

    const icon = ICONS[app.icon] || ICONS.box;

    const tags = (app.tags || [])
      .map(tag => `<span>${escapeHTML(tag)}</span>`)
      .join('');

    const link = status === 'planned'
      ? `<span class="card-link card-link-disabled">Coming soon <span>·</span></span>`
      : `<a class="card-link"
            href="${escapeHTML(getReleaseUrl(app))}"
            target="_blank"
            rel="noopener noreferrer">
            ${escapeHTML(app.linkLabel || 'View release')} <span>↗</span>
         </a>`;

    const delayClass = index % 3
      ? `delay-${index % 3}`
      : '';

    return `
      <article class="product-card reveal ${delayClass}">
        <div class="card-top">
          <span class="product-icon icon-${escapeHTML(app.tone || 'gray')}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              ${icon}
            </svg>
          </span>

          <span class="status ${statusClass}">
            <i></i>${escapeHTML(app.status)}
          </span>
        </div>

        <h3>${escapeHTML(app.name)}</h3>
        <p>${escapeHTML(app.description)}</p>

        <div class="card-tags">${tags}</div>

        ${link}
      </article>
    `;
  }).join('');

}


// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

function observeRevealElements(elements) {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    elements.forEach(element => {
      element.classList.add('visible');
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -35px 0px'
    }
  );

  elements.forEach(element => observer.observe(element));
}


// ==========================================
// RELEASE AND DISCORD LINKS
// ==========================================

function applyReleaseLinks() {
  document.querySelectorAll('[data-release-link]').forEach(link => {
    const kind = link.dataset.releaseLink;

    if (kind === 'prerelease') {
      link.href = RELEASE_LINKS.latestPreRelease;
    } else if (kind === 'stable') {
      link.href = RELEASE_LINKS.latestStable;
    } else {
      link.href = RELEASE_LINKS.all;
    }
  });
}


function applySiteLinks() {
  // Supports both data-discord-link and data-site-link="discord".
  document.querySelectorAll('[data-discord-link], [data-site-link="discord"]').forEach(link => {
    const url = SITE_LINKS.discord;

    if (url && !url.startsWith('COLE_AQUI')) {
      link.href = url;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('title');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.title = 'Discord link not configured yet';
    }
  });

  // Supports other configured site links too.
  document.querySelectorAll('[data-site-link]:not([data-site-link="discord"])').forEach(link => {
    const kind = link.dataset.siteLink;
    const url = SITE_LINKS[kind];

    if (url && !url.startsWith('COLE_AQUI')) {
      link.href = url;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('title');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.title = 'Link not configured yet';
    }
  });
}



// ==========================================
// INITIALIZATION
// ==========================================

(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen =
        menuButton.getAttribute('aria-expanded') === 'true';

      menuButton.setAttribute('aria-expanded', String(!isOpen));

      menuButton.setAttribute(
        'aria-label',
        isOpen ? 'Open navigation' : 'Close navigation'
      );

      navigation.classList.toggle('open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navigation.classList.remove('open');
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navigation.classList.remove('open');
        menuButton.focus();
      }
    });
  }

  const year = document.querySelector('#year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  renderToolkit();
  applyReleaseLinks();
  applySiteLinks();

  observeRevealElements(document.querySelectorAll('.reveal'));
})();
