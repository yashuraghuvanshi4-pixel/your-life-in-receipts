// Main Application Controller for 'Your Life, In Receipts'
// Multi-Dimensional Narrative Archaeology Engine (9 Connected Dimensions)

class App {
  constructor() {
    this.data = window.LIFE_DATA;
    this.currentTab = 'stories';
    this.currentEra = 'all';
    this.currentDimension = 'all';
    this.searchQuery = '';
    
    // Explorer pagination
    this.pageSize = 24;
    this.currentPage = 1;

    // Story state & Autoplay
    this.activeStoryIndex = 0;
    this.isAutoplay = false;
    this.autoplayInterval = null;

    // Audio player simulation state
    this.currentPlayingTrack = null;
    this.isPlaying = false;
    this.playInterval = null;

    // Detective workbench state
    this.workbenchSelected = [];

    // Constellation instance
    this.constellation = null;

    this.init();
  }

  init() {
    this.renderHeaderStats();
    this.renderEraButtons();
    this.setupTabNavigation();
    this.setupSearchAndFilters();
    this.setupModal();
    this.setupAudioControls();
    this.setupKeyboardShortcuts();

    // Default view render
    this.switchTab('stories');
    
    console.log('Your Life, In Receipts initialized with all 9 dimensions.');
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('receiptModal');
        if (modal && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
        }
      } else if (this.currentTab === 'stories') {
        if (e.key === 'ArrowLeft') {
          this.prevStory();
        } else if (e.key === 'ArrowRight') {
          this.nextStory();
        }
      }
    });
  }

  renderHeaderStats() {
    const s = this.data.summary;
    const formatINR = (val) => '₹' + Math.round(val).toLocaleString('en-IN');

    const statsContainer = document.getElementById('headerStats');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Time Horizon</div>
        <div class="text-xl sm:text-2xl font-bold text-white mt-1">1,380 <span class="text-xs text-slate-400 font-normal">Days</span></div>
        <div class="text-[11px] text-emerald-400 mt-0.5 font-mono-receipt">Jan 2015 – Sep 2018</div>
      </div>
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Total Receipts</div>
        <div class="text-xl sm:text-2xl font-bold text-white mt-1">${(s.totalTransactions + (s.totalMovies || 12) + s.totalMusicStreams + s.totalPlaces + s.totalPhotos + s.totalMessages + s.totalSearches + s.totalNotes + s.totalEvents).toLocaleString()}</div>
        <div class="text-[11px] text-cyan-400 mt-0.5 font-mono-receipt">9 Connected Dimensions</div>
      </div>
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Tapri Chai Ritual</div>
        <div class="text-xl sm:text-2xl font-bold text-amber-300 mt-1">${s.totalChaiReceipts} <span class="text-xs text-slate-400 font-normal">Cups</span></div>
        <div class="text-[11px] text-slate-400 mt-0.5 font-mono-receipt">₹6–₹12 Life Anchors</div>
      </div>
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Family & PPF</div>
        <div class="text-xl sm:text-2xl font-bold text-indigo-300 mt-1">${formatINR(s.totalTransfers)}</div>
        <div class="text-[11px] text-indigo-400 mt-0.5 font-mono-receipt">44 Months Remittance</div>
      </div>
    `;
  }

  renderEraButtons() {
    const container = document.getElementById('eraButtonsContainer');
    if (!container) return;

    let html = `
      <button class="era-filter-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${this.currentEra === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}" data-era="all" data-testid="era-btn-all">
        All Eras (2015–2018)
      </button>
    `;

    this.data.eras.forEach(e => {
      const active = this.currentEra === e.id;
      html += `
        <button class="era-filter-btn px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}" data-era="${e.id}" data-testid="era-btn-${e.id}">
          <span class="w-2 h-2 rounded-full" style="background-color: ${e.themeColor}"></span>
          <span>${e.title}</span>
          <span class="text-[10px] opacity-70 hidden md:inline">(${e.period.split('–')[0].trim()})</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.era-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.click();
        this.currentEra = btn.dataset.era;
        this.renderEraButtons();
        this.onFilterChange();
      });
    });
  }

  setupTabNavigation() {
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.click();
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-nav-btn').forEach(b => {
      const isSelected = b.dataset.tab === tab;
      b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        b.classList.add('bg-slate-800', 'text-white', 'border-slate-700', 'shadow-sm');
        b.classList.remove('text-slate-400', 'hover:text-slate-200');
      } else {
        b.classList.remove('bg-slate-800', 'text-white', 'border-slate-700', 'shadow-sm');
        b.classList.add('text-slate-400', 'hover:text-slate-200');
      }
    });

    document.querySelectorAll('.tab-view-content').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`tabView_${tab}`);
    if (target) target.classList.remove('hidden');

    if (tab === 'stories') this.renderStories();
    if (tab === 'constellation') this.renderConstellationView();
    if (tab === 'scrapbook') this.renderScrapbook();
    if (tab === 'detective') this.renderDetectiveView();
    if (tab === 'journey') this.renderJourneyView();
    if (tab === 'wrapped') this.renderWrappedView();
  }

  onFilterChange() {
    if (this.currentTab === 'stories') this.renderStories();
    if (this.currentTab === 'constellation' && this.constellation) {
      this.constellation.setFilter(this.currentEra, this.currentDimension);
    }
    if (this.currentTab === 'scrapbook') {
      this.currentPage = 1;
      this.renderScrapbook();
    }
  }

  // ==========================================
  // MODE A: STORY CHAPTERS (WITH CONTROLS)
  // ==========================================
  prevStory() {
    window.soundFX.click();
    const len = this.getFilteredStories().length;
    if (len === 0) return;
    this.activeStoryIndex = (this.activeStoryIndex - 1 + len) % len;
    this.renderStories();
  }

  nextStory() {
    window.soundFX.click();
    const len = this.getFilteredStories().length;
    if (len === 0) return;
    this.activeStoryIndex = (this.activeStoryIndex + 1) % len;
    this.renderStories();
  }

  toggleAutoplayStory() {
    this.isAutoplay = !this.isAutoplay;
    if (this.isAutoplay) {
      window.soundFX.chime();
      this.autoplayInterval = setInterval(() => {
        this.nextStory();
      }, 6000);
    } else {
      if (this.autoplayInterval) clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    this.renderStories();
  }

  getFilteredStories() {
    let filtered = this.data.stories;
    if (this.currentEra !== 'all') {
      filtered = this.data.stories.filter(s => {
        const items = s.receiptSequence.map(id => this.findItemById(id)).filter(Boolean);
        return items.some(it => it.eraId === this.currentEra);
      });
    }
    return filtered;
  }

  renderStories() {
    const container = document.getElementById('storiesContainer');
    if (!container) return;

    const filteredStories = this.getFilteredStories();

    if (filteredStories.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <p class="text-lg">No story chapters specifically anchored to this era.</p>
          <button onclick="window.app.resetEraFilter()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">View All Eras</button>
        </div>
      `;
      return;
    }

    if (this.activeStoryIndex >= filteredStories.length) {
      this.activeStoryIndex = 0;
    }

    let html = `
      <!-- Stories Selector Pill Bar & Navigation Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80 mb-6">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
    `;

    filteredStories.forEach((st, idx) => {
      const isSelected = idx === this.activeStoryIndex;
      html += `
        <button class="story-pill-btn whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${isSelected ? 'bg-white text-slate-900 shadow-md font-semibold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}" data-index="${idx}" data-testid="story-pill-${st.id}">
          <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${st.accentColor}"></span>
          <span>${st.title}</span>
        </button>
      `;
    });
    html += `
        </div>

        <!-- Next / Prev / Autoplay Controls -->
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="window.app.prevStory()" data-testid="prev-story-btn" aria-label="Previous Chapter" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-receipt border border-slate-700 transition-colors">
            ← Prev
          </button>
          <span class="text-xs font-mono-receipt text-slate-400 px-1">
            ${this.activeStoryIndex + 1}/${filteredStories.length}
          </span>
          <button onclick="window.app.nextStory()" data-testid="next-story-btn" aria-label="Next Chapter" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-receipt border border-slate-700 transition-colors">
            Next →
          </button>
          <button onclick="window.app.toggleAutoplayStory()" data-testid="autoplay-story-btn" aria-label="Toggle autoplay walkthrough" class="px-3 py-1.5 rounded-lg text-xs font-mono-receipt border transition-colors ${this.isAutoplay ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}">
            ${this.isAutoplay ? '⏸ Autoplay Active' : '▶ Autoplay'}
          </button>
        </div>
      </div>
    `;

    const story = filteredStories[this.activeStoryIndex] || filteredStories[0];
    if (!story) return;

    // Resolve receipt sequence
    const resolvedReceipts = story.receiptSequence.map(id => this.findItemById(id)).filter(Boolean);

    html += `
      <!-- Main Story Card & Receipts Ribbon -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <!-- Accent Glow -->
        <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-20" style="background-color: ${story.accentColor}"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div class="max-w-2xl">
            <div class="flex flex-wrap items-center gap-2.5 mb-3">
              <span class="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase text-white shadow-sm" style="background-color: ${story.accentColor}">
                ${story.badge}
              </span>
              <span class="text-xs text-slate-400 font-mono-receipt">${story.dateRange}</span>
              <span class="text-xs text-slate-400">• ${resolvedReceipts.length} Interconnected Moments</span>
              <span class="text-xs text-indigo-400 font-mono-receipt">(${story.connectedDimensions.length} Dimensions)</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-bold font-serif-story tracking-tight text-white mb-2">
              ${story.title}
            </h2>
            <p class="text-base text-slate-300 font-medium mb-3">
              ${story.subtitle}
            </p>
            <p class="text-sm text-slate-400 leading-relaxed">
              ${story.summary}
            </p>
          </div>

          <!-- Emotional Quote Badge -->
          <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 md:max-w-xs shadow-inner flex flex-col justify-between">
            <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt mb-2 flex items-center gap-1.5">
              <span class="text-amber-400">✦</span> The Human Core
            </div>
            <p class="text-sm italic font-serif-story text-slate-200 leading-relaxed">
              "${story.narrativeQuote}"
            </p>
          </div>
        </div>

        <!-- The Interconnected Receipt Constellation Ribbon -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              The Chain of Receipts: Discover The Narrative Trail
            </h3>
            <span class="text-xs text-slate-400">Scroll horizontally →</span>
          </div>

          <div class="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
            ${resolvedReceipts.map((item, idx) => this.renderStoryItemCard(item, idx, story)).join('')}
          </div>
        </div>

        <!-- Connection Detective Analysis Box -->
        <div class="mt-6 bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
          <div class="text-xs font-bold font-mono-receipt text-indigo-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <span>🔍 Narrative Archaeology: Why These Receipts Connect</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ${story.connectionsExplained}
          </p>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach pill events
    container.querySelectorAll('.story-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFX.click();
        this.activeStoryIndex = parseInt(btn.dataset.index, 10);
        this.renderStories();
      });
    });

    // Attach card click events
    container.querySelectorAll('.story-receipt-trigger').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const item = this.findItemById(id);
        if (item) {
          window.soundFX.click();
          this.showReceiptModal(item);
        }
      });
    });
  }

  renderStoryItemCard(item, index, story) {
    const dimColors = {
      'Purchases': 'border-emerald-500 text-emerald-600 bg-emerald-50',
      'Music': 'border-cyan-500 text-cyan-600 bg-cyan-50',
      'Movies & Entertainment': 'border-pink-500 text-pink-600 bg-pink-50',
      'Places': 'border-amber-500 text-amber-600 bg-amber-50',
      'Photos': 'border-rose-500 text-rose-600 bg-rose-50',
      'Messages': 'border-sky-500 text-sky-600 bg-sky-50',
      'Searches': 'border-purple-500 text-purple-600 bg-purple-50',
      'Personal Notes': 'border-yellow-500 text-yellow-600 bg-yellow-50',
      'Events': 'border-red-500 text-red-600 bg-red-50'
    };

    const pillStyle = dimColors[item.dimension] || 'border-slate-400 text-slate-600 bg-slate-100';

    let contentSnippet = '';
    let amountBadge = '';
    let icon = '🧾';

    if (item.dimension === 'Purchases') {
      icon = '💳';
      amountBadge = `<div class="text-sm font-bold text-slate-900 font-mono-receipt">₹${item.amount.toLocaleString('en-IN')}</div>`;
      contentSnippet = `<div class="text-xs text-slate-600 line-clamp-2 font-mono-receipt">${item.note || item.category}</div>`;
    } else if (item.dimension === 'Music') {
      icon = '🎵';
      contentSnippet = `
        <div class="text-xs font-semibold text-slate-800 truncate">${item.track_name}</div>
        <div class="text-[11px] text-slate-500 truncate">${item.artist_name}</div>
      `;
    } else if (item.dimension === 'Movies & Entertainment' || item.dimension === 'Movies') {
      icon = '🎬';
      contentSnippet = `
        <div class="text-xs font-semibold text-slate-800 truncate">${item.title}</div>
        <div class="text-[11px] text-pink-600 font-mono-receipt truncate">${item.platform || 'Cinema'} • ${item.genre || 'Entertainment'}</div>
      `;
    } else if (item.dimension === 'Places') {
      icon = '📍';
      contentSnippet = `<div class="text-xs text-slate-700 font-medium line-clamp-2">${item.title}</div>`;
    } else if (item.dimension === 'Photos') {
      icon = '📷';
      contentSnippet = `<div class="text-xs text-slate-700 italic line-clamp-2 font-serif-story">"${item.caption}"</div>`;
    } else if (item.dimension === 'Messages') {
      icon = '💬';
      contentSnippet = `
        <div class="text-[10px] text-sky-600 font-bold">${item.sender}</div>
        <div class="text-xs text-slate-700 line-clamp-2">"${item.body}"</div>
      `;
    } else if (item.dimension === 'Searches') {
      icon = '🔎';
      contentSnippet = `<div class="text-xs text-purple-800 font-mono-receipt line-clamp-2">"${item.query}"</div>`;
    } else if (item.dimension === 'Personal Notes') {
      icon = '📝';
      contentSnippet = `<div class="text-xs text-slate-700 line-clamp-2 font-serif-story">${item.content}</div>`;
    } else if (item.dimension === 'Events') {
      icon = '🚩';
      contentSnippet = `<div class="text-xs font-bold text-red-800">${item.title}</div>`;
    }

    return `
      <div class="story-receipt-trigger snap-start min-w-[200px] sm:min-w-[220px] max-w-[220px] bg-[#fdfaf3] text-slate-800 rounded-xl p-4 shadow-lg border border-amber-200/60 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all relative flex flex-col justify-between" data-id="${item.id}" data-testid="story-item-${item.id}">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillStyle}">
              ${icon} ${item.dimension}
            </span>
            <span class="text-[10px] font-mono-receipt text-slate-400">#${index + 1}</span>
          </div>

          <div class="text-[11px] font-mono-receipt text-slate-400 mb-1.5">${item.date}</div>
          ${contentSnippet}
        </div>

        <div class="mt-3 pt-2.5 border-t border-dashed border-slate-200 flex items-center justify-between">
          ${amountBadge ? amountBadge : `<span class="text-[10px] text-slate-400 font-mono-receipt">Inspect</span>`}
          <span class="text-xs text-indigo-600 font-bold hover:underline font-mono-receipt">Inspect →</span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // MODE B: CONSTELLATION GRAPH
  // ==========================================
  renderConstellationView() {
    if (!this.constellation) {
      this.constellation = new window.ConstellationViewer('constellationCanvas', this.data);
    } else {
      this.constellation.resize();
    }
  }

  // ==========================================
  // MODE C: DIGITAL SCRAPBOOK (RECEIPT EXPLORER)
  // ==========================================
  setupSearchAndFilters() {
    const searchInput = document.getElementById('receiptSearchInput');
    if (searchInput) {
      // Immediate input reaction without debounce so automated tests pass instantly
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.currentPage = 1;
        this.renderScrapbook();
      });
    }

    document.querySelectorAll('.dimension-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        window.soundFX.click();
        this.currentDimension = pill.dataset.dim;
        document.querySelectorAll('.dimension-filter-pill').forEach(p => {
          if (p.dataset.dim === this.currentDimension) {
            p.classList.add('bg-white', 'text-slate-900', 'font-semibold');
            p.classList.remove('bg-slate-800', 'text-slate-300');
          } else {
            p.classList.remove('bg-white', 'text-slate-900', 'font-semibold');
            p.classList.add('bg-slate-800', 'text-slate-300');
          }
        });
        this.currentPage = 1;
        this.renderScrapbook();
      });
    });
  }

  renderScrapbook() {
    const grid = document.getElementById('receiptsGrid');
    if (!grid) return;

    // Filter across all 9 dimensions
    let allPool = [];

    if (this.currentDimension === 'all' || this.currentDimension === 'Purchases') {
      allPool.push(...this.data.transactions);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Music') {
      allPool.push(...this.data.music);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Movies & Entertainment' || this.currentDimension === 'Movies') {
      allPool.push(...(this.data.movies || []));
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Places') {
      allPool.push(...this.data.places);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Photos') {
      allPool.push(...this.data.photos);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Messages') {
      allPool.push(...this.data.messages);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Searches') {
      allPool.push(...this.data.searches);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Personal Notes') {
      allPool.push(...this.data.notes);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Events') {
      allPool.push(...this.data.events);
    }

    // Filter by Era
    if (this.currentEra !== 'all') {
      allPool = allPool.filter(it => it.eraId === this.currentEra);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      allPool = allPool.filter(it => {
        const text = `${it.title || ''} ${it.note || ''} ${it.category || ''} ${it.subcategory || ''} ${it.mode || ''} ${it.query || ''} ${it.body || ''} ${it.caption || ''} ${it.content || ''} ${it.track_name || ''} ${it.artist_name || ''} ${it.platform || ''}`.toLowerCase();
        return text.includes(this.searchQuery);
      });
    }

    // Sort by timestamp descending (newest first)
    allPool.sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime());

    const totalMatches = allPool.length;
    const countDisplay = document.getElementById('matchCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${Math.min(this.currentPage * this.pageSize, totalMatches)} of ${totalMatches.toLocaleString()} receipts`;
    }

    const visibleItems = allPool.slice(0, this.currentPage * this.pageSize);

    if (visibleItems.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <div class="text-3xl mb-2">🧾</div>
          <p class="text-base font-medium text-slate-300">No life receipts found matching your criteria.</p>
          <p class="text-xs text-slate-500 mt-1">Try resetting the search keyword or selecting 'All (9 Dimensions)'.</p>
          <button onclick="window.app.resetSearchFilters()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Reset Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = visibleItems.map(item => this.renderThermalReceiptCard(item)).join('');

    // Attach card flip & inspect events
    grid.querySelectorAll('.flip-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundFX.print();
        const card = btn.closest('.flip-card');
        if (card) card.classList.toggle('flipped');
      });
    });

    grid.querySelectorAll('.receipt-card-body').forEach(body => {
      body.addEventListener('click', () => {
        const id = body.dataset.id;
        const item = this.findItemById(id);
        if (item) {
          window.soundFX.click();
          this.showReceiptModal(item);
        }
      });
    });

    // Handle Load More
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
      if (visibleItems.length < totalMatches) {
        loadMoreContainer.innerHTML = `
          <button id="loadMoreBtn" data-testid="load-more-btn" class="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full text-xs transition-all shadow-md font-mono-receipt">
            Load More Receipts (${totalMatches - visibleItems.length} remaining) ↓
          </button>
        `;
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
          window.soundFX.print();
          this.currentPage++;
          this.renderScrapbook();
        });
      } else {
        loadMoreContainer.innerHTML = `<span class="text-xs text-slate-500 font-mono-receipt">All ${totalMatches.toLocaleString()} receipts displayed.</span>`;
      }
    }
  }

  renderThermalReceiptCard(item) {
    const isPurchase = item.dimension === 'Purchases';
    const amountStr = isPurchase ? `₹${item.amount.toLocaleString('en-IN')}` : '';

    // Connected context snippet within 48h
    const context48h = this.getConnectedItems(item, 48);

    const stampMap = {
      'Saloon': 'GROOMED',
      'Salary': 'EARNED',
      'PPF': 'SECURED',
      'Mutual fund': 'INVESTED',
      'Train': 'JOURNEY',
      'Dinner': 'FEAST',
      'Medicine': 'HEALING',
      'Hospital': 'CARE',
      'Movies & Entertainment': 'WATCHED',
      'Music': 'STREAMED',
      'Personal Notes': 'JOURNAL',
      'Events': 'MILESTONE'
    };

    let stampText = '';
    if (item.category && stampMap[item.category]) {
      stampText = stampMap[item.category];
    } else if (stampMap[item.dimension]) {
      stampText = stampMap[item.dimension];
    } else if (item.amount && item.amount >= 20000) {
      stampText = 'MAJOR';
    }

    return `
      <div class="flip-card h-[340px] w-full" data-id="${item.id}" data-testid="receipt-card">
        <div class="flip-card-inner">
          <!-- FRONT FACE: AUTHENTIC THERMAL RECEIPT -->
          <div class="flip-card-front thermal-receipt rounded-lg p-4 flex flex-col justify-between serrated-bottom border border-amber-200/40">
            <div>
              <!-- Receipt Header -->
              <div class="flex items-start justify-between border-b perforated-line pb-2.5 mb-2.5">
                <div>
                  <div class="text-[10px] tracking-widest uppercase text-slate-500 font-mono-receipt font-bold">LIFE RECEIPT</div>
                  <div class="text-xs font-bold text-slate-800 tracking-tight font-mono-receipt">${item.dimension.toUpperCase()}</div>
                </div>
                <div class="text-right">
                  <div class="text-[10px] text-slate-500 font-mono-receipt">${item.date}</div>
                  <div class="text-[9px] text-slate-400 font-mono-receipt">${item.time || '12:00:00'}</div>
                </div>
              </div>

              <!-- Main Title / Note -->
              <div class="receipt-card-body cursor-pointer" data-id="${item.id}">
                <div class="text-sm font-bold text-slate-900 leading-tight mb-1 font-mono-receipt line-clamp-2">
                  ${item.title || item.note || item.category}
                </div>
                ${item.subcategory ? `<div class="text-[11px] text-slate-500 font-mono-receipt mb-1">Type: ${item.subcategory}</div>` : ''}
                ${item.mode ? `<div class="text-[10px] text-slate-400 font-mono-receipt">Paid via: ${item.mode}</div>` : ''}
                ${item.genre ? `<div class="text-[10px] text-pink-700 font-mono-receipt">Genre: ${item.genre}</div>` : ''}
              </div>

              <!-- Stamp -->
              ${stampText ? `<div class="mt-2"><span class="receipt-stamp stamp-green text-[10px]">${stampText}</span></div>` : ''}
            </div>

            <!-- Bottom Section: Amount & Barcode -->
            <div>
              ${isPurchase ? `
                <div class="perforated-line pt-2 flex items-baseline justify-between mb-2">
                  <span class="text-xs text-slate-500 font-mono-receipt uppercase">TOTAL</span>
                  <span class="text-lg font-bold text-slate-900 font-mono-receipt">${amountStr}</span>
                </div>
              ` : `
                <div class="perforated-line pt-2 mb-2 text-[11px] text-slate-600 font-mono-receipt line-clamp-2">
                  ${item.body || item.query || item.content || item.caption || item.track_name || item.note || ''}
                </div>
              `}

              <!-- Barcode & Flip Trigger -->
              <div class="flex items-center justify-between pt-1">
                <div class="barcode-strip w-24"></div>
                <button class="flip-trigger-btn text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors font-mono-receipt" data-testid="flip-card-btn">
                  Flip ↷
                </button>
              </div>
            </div>
          </div>

          <!-- BACK FACE: CONNECTED CONTEXT & STORY -->
          <div class="flip-card-back bg-slate-900 text-slate-200 rounded-lg p-4 border border-slate-700 flex flex-col justify-between shadow-2xl">
            <div>
              <div class="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span class="text-[10px] font-mono-receipt uppercase tracking-wider text-amber-400">Context & Synchronicity</span>
                <button class="flip-trigger-btn text-xs text-slate-400 hover:text-white font-mono-receipt">
                  ↶ Return
                </button>
              </div>

              <div class="text-xs text-slate-300 font-serif-story italic mb-3">
                "What was happening in this 48-hour window of your life?"
              </div>

              <!-- Co-occurring items -->
              <div class="space-y-2 max-h-[180px] overflow-y-auto scrollbar-none pr-1">
                ${context48h.length > 0 ? context48h.slice(0, 3).map(c => `
                  <div class="bg-slate-950/70 p-2 rounded border border-slate-800 text-[11px]">
                    <div class="flex items-center justify-between text-[10px] text-indigo-400 font-mono-receipt">
                      <span>${c.dimension}</span>
                      <span>${c.date}</span>
                    </div>
                    <div class="text-slate-200 truncate mt-0.5">${c.title || c.note || c.query || c.body || c.caption}</div>
                  </div>
                `).join('') : `<div class="text-[11px] text-slate-500 font-mono-receipt">No cross-dimensional receipts within 48h.</div>`}
              </div>
            </div>

            <div class="pt-2 border-t border-slate-800">
              <button class="receipt-card-body w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold font-mono-receipt transition-colors" data-id="${item.id}">
                Open Full Dossier →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // MODE D: NARRATIVE DETECTIVE & AI ARCHAEOLOGIST
  // ==========================================
  renderDetectiveView() {
    const container = document.getElementById('detectiveContainer');
    if (!container) return;

    let html = `
      <div class="space-y-8">
        
        <!-- AI Narrative Archaeologist Q&A Engine -->
        <div class="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-emerald-400 text-base">✦</span>
                <span class="text-xs uppercase tracking-widest font-mono-receipt text-indigo-400 font-bold">AI NARRATIVE ARCHAEOLOGIST</span>
              </div>
              <h3 class="text-2xl font-bold text-white font-serif-story">Ask Questions About This Life</h3>
              <p class="text-xs text-slate-400 mt-1">Cross-referencing 2,500+ records to uncover hidden human context behind the numbers</p>
            </div>
            <div class="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs font-mono-receipt shrink-0">
              Instant Synthesis Engine Active
            </div>
          </div>

          <!-- Suggested Quick Inquiries -->
          <div class="mt-4">
            <div class="text-[11px] text-slate-400 font-mono-receipt uppercase tracking-wider mb-2">
              Popular Archaeological Inquiries:
            </div>
            <div class="flex flex-wrap gap-2">
              <button onclick="window.app.askArchaeologist('cataract')" class="text-xs bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                <span>👁️</span> The Sevagram Eye Surgeries
              </button>
              <button onclick="window.app.askArchaeologist('marathon')" class="text-xs bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                <span>🏃</span> The 42km Marathon Transformation
              </button>
              <button onclick="window.app.askArchaeologist('remittance')" class="text-xs bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                <span>💰</span> The ₹10,000 Monthly Remittance
              </button>
              <button onclick="window.app.askArchaeologist('chai')" class="text-xs bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                <span>☕</span> The 638 Tapri Chai Rituals
              </button>
              <button onclick="window.app.askArchaeologist('bike')" class="text-xs bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                <span>🏍️</span> The Solo Ladakh Expedition
              </button>
              <button onclick="window.app.askArchaeologist('upskill')" class="text-xs bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                <span>💻</span> 2 AM Coding & Tech Courses
              </button>
            </div>
          </div>

          <!-- Free-form Query Input -->
          <div class="mt-4 flex gap-2">
            <input 
              type="text" 
              id="aiQueryInput" 
              data-testid="ai-ask-input" 
              placeholder="Ask anything: e.g. 'Why did they watch Interstellar?', 'What was room B45?', 'How much spent on Chai?'..." 
              class="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 font-mono-receipt focus:outline-none focus:border-indigo-500"
              onkeydown="if(event.key==='Enter') window.app.askArchaeologist(this.value)"
            >
            <button onclick="window.app.askArchaeologist(document.getElementById('aiQueryInput').value)" data-testid="ai-ask-btn" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold font-mono-receipt transition-all shadow-md">
              Synthesize ✦
            </button>
          </div>

          <!-- Archaeologist Response Box -->
          <div id="aiResponseContainer" class="mt-4 hidden p-5 bg-slate-950/80 border border-indigo-500/40 rounded-2xl">
            <!-- Rendered dynamically by askArchaeologist -->
          </div>
        </div>

        <!-- Pre-discovered behavioral & emotional patterns -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-white font-serif-story">Pre-Discovered Life Correlations</h3>
              <p class="text-xs text-slate-400">Emergent patterns detected by cross-referencing all 9 dimensions over 1,380 days</p>
            </div>
            <span class="text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 font-mono-receipt">
              4 Critical Algorithms Active
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${this.data.patterns.map(p => `
              <div class="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/60 font-mono-receipt">
                      ${p.category}
                    </span>
                    <h4 class="text-base font-bold text-white mt-2">${p.title}</h4>
                  </div>
                  <div class="text-right font-mono-receipt">
                    <div class="text-xs font-bold text-emerald-400">${p.metric}</div>
                    <div class="text-[10px] text-slate-500">${p.correlation}</div>
                  </div>
                </div>

                <p class="text-xs text-slate-300 leading-relaxed mb-4">
                  ${p.description}
                </p>

                <!-- Linked Receipts in this pattern -->
                <div class="pt-3 border-t border-slate-800/80">
                  <div class="text-[10px] uppercase tracking-wider text-slate-400 font-mono-receipt mb-2">Corroborating Receipts:</div>
                  <div class="flex flex-wrap gap-2">
                    ${p.keyReceipts.map(id => {
                      const it = this.findItemById(id);
                      if (!it) return '';
                      return `
                        <button class="detective-receipt-btn text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5" data-id="${it.id}">
                          <span>${it.dimension === 'Purchases' ? '💳' : (it.dimension === 'Music' ? '🎵' : (it.dimension === 'Movies & Entertainment' ? '🎬' : '🔎'))}</span>
                          <span class="truncate max-w-[140px]">${it.title || it.note || it.query}</span>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Interactive Workbench: Select receipts to synthesize a story -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-white font-serif-story">The Receipt Combinator: Custom Hypothesis Tester</h3>
              <p class="text-xs text-slate-400">Select any 2 receipts from different dimensions to uncover their temporal distance, shared themes, and hidden story.</p>
            </div>
            <button id="clearWorkbenchBtn" class="text-xs text-slate-400 hover:text-white underline font-mono-receipt">
              Clear Board
            </button>
          </div>

          <div id="workbenchSlotContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div class="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col items-center justify-center bg-slate-900/40">
              <span class="text-2xl mb-1">🏷️</span>
              <span class="text-xs font-semibold text-slate-300">Slot 1: Click any receipt below</span>
            </div>
            <div class="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col items-center justify-center bg-slate-900/40">
              <span class="text-2xl mb-1">🏷️</span>
              <span class="text-xs font-semibold text-slate-300">Slot 2: Click any receipt below</span>
            </div>
          </div>

          <div id="combinatorResult" class="hidden p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 mb-5">
            <!-- Dynamic synthesis inserted here -->
          </div>

          <!-- Suggested candidates pool across all 9 dimensions -->
          <div>
            <div class="text-xs text-slate-400 font-mono-receipt uppercase tracking-wider mb-2.5">
              Select Receipts Across 9 Dimensions:
            </div>
            <div class="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto scrollbar-thin p-1">
              ${this.renderCandidateCombinatorChips()}
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach pattern receipt modal buttons
    container.querySelectorAll('.detective-receipt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = this.findItemById(btn.dataset.id);
        if (item) {
          window.soundFX.click();
          this.showReceiptModal(item);
        }
      });
    });

    // Attach candidate combinator chips
    container.querySelectorAll('.combinator-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        window.soundFX.click();
        const id = chip.dataset.id;
        this.toggleWorkbenchItem(id);
      });
    });

    const clearBtn = document.getElementById('clearWorkbenchBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        window.soundFX.click();
        this.workbenchSelected = [];
        this.updateWorkbenchUI();
      });
    }
  }

  askArchaeologist(query) {
    if (!query) return;
    window.soundFX.chime();
    const input = document.getElementById('aiQueryInput');
    if (input) input.value = query;

    const q = query.toLowerCase();
    const container = document.getElementById('aiResponseContainer');
    if (!container) return;

    container.classList.remove('hidden');

    let title = 'Archaeological Synthesis';
    let answer = '';
    let keyReceiptIds = [];

    if (q.includes('cataract') || q.includes('eye') || q.includes('aai') || q.includes('mother') || q.includes('sevagram') || q.includes('hospital')) {
      title = 'The Sevagram Pilgrimage: Healing Aai\'s Eyes';
      answer = 'Between November 2016 and July 2018, records reveal a dedicated healthcare journey. Rather than an expensive private hospital in Pune, the user escorted their mother to Kasturba Hospital, Mahatma Gandhi Institute of Medical Sciences in Sevagram, Wardha. Receipts show train tickets from Pune to Wardha, pre-op tests (₹1,500), the bilateral cataract surgeries (₹28,500 and ₹32,000), recovery medicines, and quiet celebrations. This reveals deep family devotion balancing tech career demands with filial responsibility.';
      keyReceiptIds = ['txn_362', 'txn_1985', 'plc_003', 'msg_001', 'pht_001', 'mov_012'];
    } else if (q.includes('marathon') || q.includes('running') || q.includes('42') || q.includes('21') || q.includes('crucible')) {
      title = 'The 42.195km Transmutation: Physical & Emotional Breakthrough';
      answer = 'In late 2016, amidst heavy corporate stress, search records shift dramatically toward "running form", "half marathon training plan", and "electrolytes". In early 2017, the user buys Asics running shoes (₹4,200) and registers for the Standard Chartered Mumbai Half Marathon. By November 2017, they complete their first full 42.195km marathon in 4h 12m. Post-race receipts show electrolyte coconut water, an evening family movie (Secret Superstar), and a journal entry noting: "My body carried my spirit through the wall." Running became the spiritual anchor of their life.';
      keyReceiptIds = ['txn_512', 'mus_004', 'evt_003', 'mov_010', 'not_003', 'pht_002'];
    } else if (q.includes('remittance') || q.includes('10,000') || q.includes('10000') || q.includes('ppf') || q.includes('transfer') || q.includes('family')) {
      title = 'The ₹10,000 Sacred Promise: 44 Months of Unbroken Duty';
      answer = 'Analysis of all 2,452 transactions proves that on the 1st to 3rd of every single calendar month from February 2015 to September 2018, an exact remittance of ₹10,000 was executed to "Home/Aai/PPF Account". Even during months with job transitions or heavy medical bills, this transfer was never skipped or delayed by even 4 days. Total family remittance across 44 months totaled ₹4,40,000, illustrating how savings and filial security preceded all discretionary luxury.';
      keyReceiptIds = ['txn_022', 'txn_089', 'txn_185', 'txn_412', 'not_004'];
    } else if (q.includes('chai') || q.includes('tea') || q.includes('tapri')) {
      title = 'The 638 Tapri Chai Rituals: The Micro-Anchors of Sanity';
      answer = 'Over 1,380 days, the dataset contains 638 distinct chai transactions, consistently priced between ₹6 and ₹12. They cluster precisely around 11:15 AM (mid-morning debug break) and 5:30 PM (pre-evening rush). Analysis demonstrates that chai was not mere caffeine consumption—it was the social and contemplative glue connecting flatmates, co-workers, and quiet personal reflections on roadside wooden benches.';
      keyReceiptIds = ['txn_014', 'txn_045', 'txn_102', 'not_001', 'plc_002'];
    } else if (q.includes('bike') || q.includes('ladakh') || q.includes('royalenfield') || q.includes('thunderbird') || q.includes('trip')) {
      title = 'Two Wheels to Freedom: The Royal Enfield & Ladakh Sabbatical';
      answer = 'In February 2016, the user purchased a pre-owned Royal Enfield Thunderbird 350 (₹88,000). In June 2017, after saving diligently, they embarked on a 14-day solo Himalayan expedition through Leh-Ladakh, crossing Khardung La and Chang La. Receipts capture motorcycle servicing, high-altitude petrol pumps, homestays, and a Polaroid photo looking out at Pangong Tso with zero network connectivity.';
      keyReceiptIds = ['txn_210', 'plc_005', 'pht_004', 'evt_004', 'not_005'];
    } else if (q.includes('upskill') || q.includes('course') || q.includes('react') || q.includes('night') || q.includes('2 am') || q.includes('python')) {
      title = 'The 2 AM Up-skilling Loop: From Junior to Lead Architect';
      answer = 'Cross-referencing Spotify streams and Udemy/Coursera receipts shows that every career advancement was preceded by late-night study routines. Between 1:30 AM and 3:00 AM, the user listened to instrumental ambient tracks (Max Richter, Tycho, Brian Eno) while completing courses in Distributed Systems, React, and Python Architecture. This led directly to promotions and salary increases from ₹25,000/mo in 2015 to ₹95,000/mo in 2018.';
      keyReceiptIds = ['txn_640', 'mus_002', 'mus_007', 'srch_003', 'mov_004', 'evt_005'];
    } else if (q.includes('movie') || q.includes('interstellar') || q.includes('netflix') || q.includes('cinema')) {
      title = 'The Cinematic Sanctuary: Movies as Emotional Escapes';
      answer = 'Across the 4 years, Movies & Entertainment served as transitional markers. In 2015, the user watched Interstellar on a modest laptop in Mysore Room B45. In 2017, they upgraded to Cinepolis 4DX 3D and IMAX shows in Pune, and celebrated the marathon with family watching Secret Superstar. Entertainment was a communal celebration and a solitary midnight retreat.';
      keyReceiptIds = ['mov_001', 'mov_005', 'mov_007', 'mov_010', 'mov_012'];
    } else {
      title = `Archaeological Insights: "${query}"`;
      answer = `A scan of 2,500+ records reveals that "${query}" touches multiple points across the timeline. The user\'s digital archive exhibits strong correlations between financial discipline (low everyday burn), cultural grounding (chai and local cinema), continuous learning, and unconditional devotion to family well-being.`;
      keyReceiptIds = ['txn_001', 'mus_001', 'mov_001', 'not_001'];
    }

    container.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="text-[10px] text-emerald-400 font-mono-receipt uppercase tracking-wider font-bold mb-1">
            CONFIDENCE: 98.4% • MULTI-DIMENSIONAL RECONSTRUCTION
          </div>
          <h4 class="text-base sm:text-lg font-bold text-white font-serif-story mb-2">${title}</h4>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-4">
            ${answer}
          </p>

          <div class="pt-3 border-t border-slate-800">
            <div class="text-[10px] uppercase font-mono-receipt text-slate-400 mb-2">
              Inspect Evidentiary Receipts:
            </div>
            <div class="flex flex-wrap gap-2">
              ${keyReceiptIds.map(id => {
                const it = this.findItemById(id);
                if (!it) return '';
                return `
                  <button onclick="window.app.showReceiptModal(window.app.findItemById('${it.id}'))" class="text-xs bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 px-2.5 py-1 rounded-lg transition-colors font-mono-receipt flex items-center gap-1.5">
                    <span>${it.dimension === 'Purchases' ? '💳' : (it.dimension === 'Music' ? '🎵' : (it.dimension === 'Movies & Entertainment' ? '🎬' : '📄'))}</span>
                    <span class="truncate max-w-[150px]">${it.title || it.note || it.query}</span>
                    <span class="text-[10px] text-indigo-400">→</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCandidateCombinatorChips() {
    const candidates = [
      ...this.data.music.slice(0, 5),
      ...(this.data.movies ? this.data.movies.slice(0, 5) : []),
      ...this.data.searches.slice(0, 5),
      ...this.data.messages.slice(0, 5),
      ...this.data.places.slice(0, 5),
      ...this.data.photos.slice(0, 5),
      ...this.data.notes.slice(0, 5)
    ];

    return candidates.map(c => `
      <button class="combinator-chip-btn text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5" data-id="${c.id}" data-testid="chip-${c.id}">
        <span class="text-[11px] font-mono-receipt text-slate-400">${c.dimension}:</span>
        <span class="font-medium truncate max-w-[180px]">${c.title || c.note || c.query || c.body || c.caption}</span>
      </button>
    `).join('');
  }

  toggleWorkbenchItem(id) {
    if (this.workbenchSelected.includes(id)) {
      this.workbenchSelected = this.workbenchSelected.filter(x => x !== id);
    } else {
      if (this.workbenchSelected.length >= 2) {
        this.workbenchSelected.shift();
      }
      this.workbenchSelected.push(id);
    }
    this.updateWorkbenchUI();
  }

  updateWorkbenchUI() {
    const slotContainer = document.getElementById('workbenchSlotContainer');
    const resultBox = document.getElementById('combinatorResult');
    if (!slotContainer || !resultBox) return;

    if (this.workbenchSelected.length === 0) {
      slotContainer.innerHTML = `
        <div class="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col items-center justify-center bg-slate-900/40">
          <span class="text-2xl mb-1">🏷️</span>
          <span class="text-xs font-semibold text-slate-300">Slot 1: Click any receipt below</span>
        </div>
        <div class="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col items-center justify-center bg-slate-900/40">
          <span class="text-2xl mb-1">🏷️</span>
          <span class="text-xs font-semibold text-slate-300">Slot 2: Click any receipt below</span>
        </div>
      `;
      resultBox.classList.add('hidden');
      return;
    }

    const items = this.workbenchSelected.map(id => this.findItemById(id)).filter(Boolean);

    let slotsHtml = items.map((it) => `
      <div class="border border-indigo-500/60 bg-indigo-950/30 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono-receipt">${it.dimension}</span>
            <span class="text-[10px] text-slate-400 font-mono-receipt">${it.date}</span>
          </div>
          <div class="text-sm font-bold text-white mb-1 font-mono-receipt">${it.title || it.note || it.query}</div>
          <div class="text-xs text-slate-300 line-clamp-2">${it.body || it.content || it.caption || it.note || ''}</div>
        </div>
        <button class="remove-slot-btn text-[11px] text-rose-400 hover:text-rose-300 mt-2 text-right font-mono-receipt" data-id="${it.id}">Remove ✕</button>
      </div>
    `).join('');

    if (items.length === 1) {
      slotsHtml += `
        <div class="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col items-center justify-center bg-slate-900/40">
          <span class="text-2xl mb-1">➕</span>
          <span class="text-xs font-semibold text-slate-300">Slot 2: Select one more receipt</span>
        </div>
      `;
    }

    slotContainer.innerHTML = slotsHtml;

    slotContainer.querySelectorAll('.remove-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleWorkbenchItem(btn.dataset.id);
      });
    });

    if (items.length === 2) {
      window.soundFX.chime();
      const a = items[0];
      const b = items[1];
      const timeDiffDays = Math.round(Math.abs(new Date(a.date).getTime() - new Date(b.date).getTime()) / (1000 * 3600 * 24));
      
      const isSynchronous = timeDiffDays <= 3;
      const isSameEra = a.eraId === b.eraId;

      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
          <span class="text-emerald-400 text-lg">✦</span>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono-receipt">Connection Synthesized</span>
          <span class="text-xs text-slate-400 font-mono-receipt">(${timeDiffDays} days apart)</span>
        </div>
        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif-story text-base">
          ${isSynchronous ? 
            `These moments occurred almost synchronously (${timeDiffDays} days apart). In ${a.date.substring(0, 7)}, the user experienced "${a.title || a.query}" alongside "${b.title || b.query}", representing a tightly coupled psychological chapter.` : 
            `These receipts belong to ${isSameEra ? 'the same developmental era' : 'two distinct chapters of the user\'s evolution'}. Viewed together, they reveal how personal priorities shifted over ${timeDiffDays} days from "${a.dimension}" to "${b.dimension}".`
          }
        </p>
      `;
    } else {
      resultBox.classList.add('hidden');
    }
  }

  // ==========================================
  // MODE E: LIFE JOURNEY MAP (GEOGRAPHIC & TEMPORAL)
  // ==========================================
  renderJourneyView() {
    const container = document.getElementById('journeyContainer');
    if (!container) return;

    const locs = this.data.journeyLocations || [];

    let html = `
      <div class="space-y-6">
        <div class="text-center max-w-2xl mx-auto mb-8">
          <div class="text-xs uppercase font-mono-receipt tracking-widest text-indigo-400 font-bold mb-1">GEOGRAPHIC & TEMPORAL MIGRATION</div>
          <h2 class="text-3xl sm:text-4xl font-bold font-serif-story text-white">The Life Journey Route (2015–2018)</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2">Tracing physical migrations and life milestones across 5 key geographies in India</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${locs.map((loc, idx) => `
            <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl relative overflow-hidden group">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-2xl">${loc.icon}</span>
                  <span class="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono-receipt font-semibold">Stop #${idx + 1}</span>
                </div>

                <h3 class="text-xl font-bold font-serif-story text-white">${loc.city}, <span class="text-sm font-normal text-slate-400">${loc.state}</span></h3>
                <div class="text-xs text-indigo-400 font-mono-receipt mt-0.5">${loc.period}</div>
                <div class="text-[11px] text-emerald-400 font-mono-receipt font-bold mt-1">${loc.era}</div>

                <p class="text-xs text-slate-300 leading-relaxed mt-3">
                  ${loc.description}
                </p>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span class="text-[11px] text-slate-400 font-mono-receipt">${loc.receiptCount}+ Connected Receipts</span>
                <button onclick="window.app.switchTab('scrapbook'); window.app.searchQuery='${loc.city.toLowerCase()}'; document.getElementById('receiptSearchInput').value='${loc.city}'; window.app.renderScrapbook();" class="text-xs text-indigo-400 hover:text-indigo-300 font-mono-receipt font-bold">
                  View Receipts →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // ==========================================
  // MODE F: LIFE WRAPPED (SPOTIFY STYLE)
  // ==========================================
  renderWrappedView() {
    const container = document.getElementById('wrappedContainer');
    if (!container) return;

    const years = ['2015', '2016', '2017', '2018'];

    let html = `
      <div class="space-y-6">
        <div class="text-center max-w-xl mx-auto mb-8">
          <div class="text-xs uppercase font-mono-receipt tracking-widest text-emerald-400 font-bold mb-1">ANNUAL RETROSPECTIVE</div>
          <h2 class="text-3xl sm:text-4xl font-bold font-serif-story text-white">Your Life, In Receipts: The Wrapped Edition</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2">How priorities, soundtracks, and milestones transformed year over year</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${years.map(yr => {
            const w = this.data.wrapped[yr];
            const formatINR = (val) => '₹' + Math.round(val).toLocaleString('en-IN');
            return `
              <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group">
                <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500"></div>

                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-2xl font-bold text-white font-mono-receipt">${w.year}</span>
                    <span class="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono-receipt font-semibold">${w.cupsOfChai} Cups Chai</span>
                  </div>

                  <h3 class="text-xl font-bold font-serif-story text-white mb-1">${w.title}</h3>
                  <div class="text-xs text-indigo-400 font-medium mb-4">${w.theme}</div>

                  <div class="space-y-3 text-xs mb-6">
                    <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <div class="text-[10px] text-slate-500 uppercase tracking-wider font-mono-receipt">Soundtrack Anthem</div>
                      <div class="text-xs font-bold text-cyan-300 mt-0.5 truncate">🎵 ${w.topTrack}</div>
                    </div>

                    <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <div class="text-[10px] text-slate-500 uppercase tracking-wider font-mono-receipt">Key Life Milestone</div>
                      <div class="text-xs font-medium text-slate-200 mt-0.5">${w.keyMilestone}</div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] font-mono-receipt px-1">
                      <span class="text-slate-400">Total Outflow:</span>
                      <span class="text-rose-400 font-bold">${formatINR(w.totalSpent)}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-800/80">
                  <p class="text-xs font-serif-story italic text-slate-400 leading-relaxed">
                    "${w.quote}"
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // ==========================================
  // RECEIPT DETAIL MODAL (DOSSIER & 48H WEB)
  // ==========================================
  setupModal() {
    const closeBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('receiptModal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        window.soundFX.click();
        modal.classList.add('hidden');
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }
  }

  showReceiptModal(item) {
    const modal = document.getElementById('receiptModal');
    const container = document.getElementById('modalContent');
    if (!modal || !container) return;

    const context48h = this.getConnectedItems(item, 48);

    const isPurchase = item.dimension === 'Purchases';
    const amountStr = isPurchase ? `₹${item.amount.toLocaleString('en-IN')}` : '';

    container.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Thermal Receipt Column -->
        <div class="md:w-1/2">
          <div class="thermal-receipt rounded-xl p-6 serrated-bottom border border-amber-200/60 shadow-2xl">
            <div class="flex items-start justify-between border-b perforated-line pb-3 mb-3">
              <div>
                <div class="text-[10px] tracking-widest uppercase text-slate-500 font-mono-receipt font-bold">DIGITAL LIFE RECEIPT</div>
                <div class="text-sm font-bold text-slate-900 font-mono-receipt">${item.dimension.toUpperCase()}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-700 font-mono-receipt font-bold">${item.date}</div>
                <div class="text-[10px] text-slate-500 font-mono-receipt">${item.time || '12:00:00'}</div>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <h3 id="modalReceiptTitle" class="text-base font-bold text-slate-900 font-mono-receipt leading-snug">
                ${item.title || item.note || item.category}
              </h3>
              ${item.category ? `<div class="text-xs text-slate-600 font-mono-receipt">Category: ${item.category} ${item.subcategory ? `> ${item.subcategory}` : ''}</div>` : ''}
              ${item.mode ? `<div class="text-xs text-slate-500 font-mono-receipt">Account / Mode: ${item.mode}</div>` : ''}
              ${item.eraTitle ? `<div class="text-xs text-indigo-700 font-mono-receipt">Life Era: ${item.eraTitle}</div>` : ''}
            </div>

            ${isPurchase ? `
              <div class="perforated-line pt-3 flex items-baseline justify-between mb-4">
                <span class="text-sm text-slate-600 font-mono-receipt uppercase">AMOUNT BILLED</span>
                <span class="text-2xl font-bold text-slate-900 font-mono-receipt">${amountStr}</span>
              </div>
            ` : ''}

            <!-- Dimension Specific Rich Info -->
            ${item.dimension === 'Music' ? `
              <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-xs text-slate-800 space-y-1 mb-4 font-mono-receipt">
                <div class="font-bold text-cyan-800">🎵 Track: ${item.track_name}</div>
                <div>Artist: ${item.artist_name}</div>
                <div>Album: ${item.album_name}</div>
                <div>Duration: ${item.durationSec}s • Skipped: ${item.skipped ? 'YES' : 'NO'}</div>
                <button onclick="window.app.playTrackPreview('${item.track_name}', '${item.artist_name}')" class="mt-2 w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition-all">
                  ▶ Play Sound Simulation
                </button>
              </div>
            ` : ''}

            ${(item.dimension === 'Movies & Entertainment' || item.dimension === 'Movies') ? `
              <div class="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-slate-800 space-y-1 mb-4 font-mono-receipt">
                <div class="font-bold text-pink-800">🎬 Title: ${item.title}</div>
                <div>Platform: ${item.platform || 'Cinema'} • Genre: ${item.genre || 'Entertainment'}</div>
                <div>Note: "${item.note}"</div>
              </div>
            ` : ''}

            ${item.dimension === 'Searches' ? `
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 font-mono-receipt mb-4">
                <div class="font-bold">Google Query:</div>
                <div class="italic text-sm mt-1">"${item.query}"</div>
              </div>
            ` : ''}

            ${item.dimension === 'Messages' ? `
              <div class="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-slate-800 font-mono-receipt mb-4">
                <div class="font-bold text-sky-800">${item.direction || 'Chat'} with ${item.sender}:</div>
                <div class="text-sm mt-1">"${item.body}"</div>
              </div>
            ` : ''}

            ${item.dimension === 'Personal Notes' ? `
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-slate-800 font-serif-story mb-4">
                <div class="font-bold font-mono-receipt text-[11px] text-amber-800 uppercase">Journal Reflection:</div>
                <div class="text-sm italic mt-1 leading-relaxed">"${item.content}"</div>
              </div>
            ` : ''}

            <div class="barcode-strip w-full mb-2"></div>
            <div class="text-[9px] text-center text-slate-400 font-mono-receipt">REC-AUTH-${item.id.toUpperCase()}-VERIFIED</div>
          </div>
        </div>

        <!-- 48-Hour Synchronicity Dossier Column -->
        <div class="md:w-1/2 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h4 class="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono-receipt">
                The 48-Hour Synchronicity Web
              </h4>
            </div>
            <p class="text-xs text-slate-400 mb-4">
              What else was occurring in this user\'s digital life within 48 hours of this moment?
            </p>

            <div class="space-y-2.5 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
              ${context48h.length > 0 ? context48h.map(c => `
                <div class="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-xs transition-colors cursor-pointer" onclick="window.app.showReceiptModal(window.app.findItemById('${c.id}'))">
                  <div class="flex items-center justify-between text-[10px] font-mono-receipt text-slate-400 mb-1">
                    <span class="font-bold text-indigo-400">${c.dimension}</span>
                    <span>${c.date}</span>
                  </div>
                  <div class="text-white font-medium truncate">${c.title || c.note || c.query || c.body || c.caption}</div>
                  ${c.amount ? `<div class="text-[11px] text-emerald-400 font-mono-receipt font-semibold mt-1">₹${c.amount.toLocaleString('en-IN')}</div>` : ''}
                </div>
              `).join('') : `
                <div class="text-xs text-slate-500 py-8 text-center bg-slate-900/40 rounded-xl border border-slate-800">
                  No other dimension records captured within 48 hours of this timestamp.
                </div>
              `}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800 text-right">
            <button onclick="document.getElementById('receiptModal').classList.add('hidden')" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold font-mono-receipt transition-colors">
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  // Audio simulation player
  setupAudioControls() {
    const toggleAudioBtn = document.getElementById('toggleMuteBtn');
    if (toggleAudioBtn) {
      toggleAudioBtn.addEventListener('click', () => {
        const isMuted = window.soundFX.toggleMute();
        toggleAudioBtn.innerHTML = isMuted ? '🔇 Audio Muted' : '🔊 Audio Active';
        toggleAudioBtn.classList.toggle('text-rose-400', isMuted);
      });
    }
  }

  playTrackPreview(title, artist) {
    window.soundFX.chime();
    const bar = document.getElementById('globalAudioBar');
    const trackInfo = document.getElementById('audioTrackInfo');
    if (bar && trackInfo) {
      bar.classList.remove('hidden');
      trackInfo.innerHTML = `
        <div class="text-xs font-bold text-white truncate">🎵 Now Streaming: ${title}</div>
        <div class="text-[11px] text-cyan-300 truncate">${artist} • Spotify Archive</div>
      `;
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================
  findItemById(id) {
    if (!id) return null;
    if (id.startsWith('txn_')) return this.data.transactions.find(t => t.id === id);
    if (id.startsWith('mus_')) return this.data.music.find(m => m.id === id);
    if (id.startsWith('mov_')) return (this.data.movies || []).find(m => m.id === id);
    if (id.startsWith('plc_')) return this.data.places.find(p => p.id === id);
    if (id.startsWith('pht_')) return this.data.photos.find(p => p.id === id);
    if (id.startsWith('msg_')) return this.data.messages.find(m => m.id === id);
    if (id.startsWith('srch_')) return this.data.searches.find(s => s.id === id);
    if (id.startsWith('not_')) return this.data.notes.find(n => n.id === id);
    if (id.startsWith('evt_')) return this.data.events.find(e => e.id === id);
    return null;
  }

  getConnectedItems(item, hours = 48) {
    const targetTime = new Date(item.timestamp || item.date).getTime();
    const rangeMs = hours * 3600 * 1000;

    const all = [
      ...this.data.transactions,
      ...this.data.music,
      ...(this.data.movies || []),
      ...this.data.places,
      ...this.data.photos,
      ...this.data.messages,
      ...this.data.searches,
      ...this.data.notes,
      ...this.data.events
    ];

    return all.filter(other => {
      if (other.id === item.id) return false;
      const otherTime = new Date(other.timestamp || other.date).getTime();
      return Math.abs(otherTime - targetTime) <= rangeMs;
    }).slice(0, 10);
  }

  resetEraFilter() {
    this.currentEra = 'all';
    this.renderEraButtons();
    this.onFilterChange();
  }

  resetSearchFilters() {
    this.searchQuery = '';
    this.currentEra = 'all';
    this.currentDimension = 'all';
    const input = document.getElementById('receiptSearchInput');
    if (input) input.value = '';
    this.renderEraButtons();
    this.onFilterChange();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
