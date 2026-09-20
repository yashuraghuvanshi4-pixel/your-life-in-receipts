// Main Application Controller for 'Your Life, In Receipts'
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

    // Story state
    this.activeStoryIndex = 0;

    // Audio player simulation state
    this.currentPlayingTrack = null;
    this.isPlaying = false;
    this.playInterval = null;
    this.playProgress = 0;

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

    // Default view render
    this.switchTab('stories');
    
    console.log('Your Life, In Receipts initialized.');
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
        <div class="text-[11px] text-emerald-400 mt-0.5">Jan 2015 – Sep 2018</div>
      </div>
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Total Receipts</div>
        <div class="text-xl sm:text-2xl font-bold text-white mt-1">${s.totalTransactions.toLocaleString()}</div>
        <div class="text-[11px] text-cyan-400 mt-0.5">9 Connected Dimensions</div>
      </div>
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Tapri Chai Ritual</div>
        <div class="text-xl sm:text-2xl font-bold text-amber-300 mt-1">${s.totalChaiReceipts} <span class="text-xs text-slate-400 font-normal">Cups</span></div>
        <div class="text-[11px] text-slate-400 mt-0.5">₹6–₹12 Life Anchors</div>
      </div>
      <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
        <div class="text-xs text-slate-400 uppercase tracking-wider font-mono-receipt">Family & PPF</div>
        <div class="text-xl sm:text-2xl font-bold text-indigo-300 mt-1">${formatINR(s.totalTransfers)}</div>
        <div class="text-[11px] text-indigo-400 mt-0.5">44 Months Remittance</div>
      </div>
    `;
  }

  renderEraButtons() {
    const container = document.getElementById('eraButtonsContainer');
    if (!container) return;

    let html = `
      <button class="era-filter-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${this.currentEra === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}" data-era="all">
        All Eras (2015–2018)
      </button>
    `;

    this.data.eras.forEach(e => {
      const active = this.currentEra === e.id;
      html += `
        <button class="era-filter-btn px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}" data-era="${e.id}">
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
      if (b.dataset.tab === tab) {
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
  // MODE A: STORY CHAPTERS
  // ==========================================
  renderStories() {
    const container = document.getElementById('storiesContainer');
    if (!container) return;

    let filteredStories = this.data.stories;
    if (this.currentEra !== 'all') {
      // Filter stories that touch the current era
      filteredStories = this.data.stories.filter(s => {
        const items = s.receiptSequence.map(id => this.findItemById(id)).filter(Boolean);
        return items.some(it => it.eraId === this.currentEra);
      });
    }

    if (filteredStories.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <p class="text-lg">No story chapters specifically anchored to this era.</p>
          <button onclick="window.app.resetEraFilter()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">View All Eras</button>
        </div>
      `;
      return;
    }

    let html = `
      <!-- Stories Selector Pill Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
    `;

    filteredStories.forEach((st, idx) => {
      const isSelected = idx === this.activeStoryIndex;
      html += `
        <button class="story-pill-btn whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${isSelected ? 'bg-white text-slate-900 shadow-md font-semibold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}" data-index="${idx}">
          <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${st.accentColor}"></span>
          <span>${st.title}</span>
        </button>
      `;
    });
    html += `</div>`;

    const story = filteredStories[this.activeStoryIndex] || filteredStories[0];
    if (!story) return;

    // Resolve receipt sequence
    const resolvedReceipts = story.receiptSequence.map(id => this.findItemById(id)).filter(Boolean);

    html += `
      <!-- Main Story Card & Receipts Carousel -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <!-- Accent Glow -->
        <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-20" style="background-color: ${story.accentColor}"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div class="max-w-2xl">
            <div class="flex items-center gap-2.5 mb-3">
              <span class="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase text-white shadow-sm" style="background-color: ${story.accentColor}">
                ${story.badge}
              </span>
              <span class="text-xs text-slate-400 font-mono-receipt">${story.dateRange}</span>
              <span class="text-xs text-slate-400">• ${resolvedReceipts.length} Interconnected Moments</span>
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
      contentSnippet = `<div class="text-xs text-slate-600 line-clamp-2">${item.note || item.category}</div>`;
    } else if (item.dimension === 'Music') {
      icon = '🎵';
      contentSnippet = `
        <div class="text-xs font-semibold text-slate-800 truncate">${item.track_name}</div>
        <div class="text-[11px] text-slate-500 truncate">${item.artist_name}</div>
      `;
    } else if (item.dimension === 'Places') {
      icon = '📍';
      contentSnippet = `<div class="text-xs text-slate-700 font-medium line-clamp-2">${item.title}</div>`;
    } else if (item.dimension === 'Photos') {
      icon = '📷';
      contentSnippet = `<div class="text-xs text-slate-700 italic line-clamp-2">"${item.caption}"</div>`;
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
      contentSnippet = `<div class="text-xs text-slate-700 line-clamp-2">${item.content}</div>`;
    } else if (item.dimension === 'Events') {
      icon = '🚩';
      contentSnippet = `<div class="text-xs font-bold text-red-800">${item.title}</div>`;
    }

    return `
      <div class="story-receipt-trigger snap-start min-w-[200px] sm:min-w-[220px] max-w-[220px] bg-[#fdfaf3] text-slate-800 rounded-xl p-4 shadow-lg border border-amber-200/60 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all relative flex flex-col justify-between" data-id="${item.id}">
        <!-- Top index step -->
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
          ${amountBadge ? amountBadge : `<span class="text-[10px] text-slate-400">Click to view</span>`}
          <span class="text-xs text-indigo-600 font-bold hover:underline">Inspect →</span>
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
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.currentPage = 1;
          this.renderScrapbook();
        }, 200);
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

    // Filter across all items
    let allPool = [];

    if (this.currentDimension === 'all' || this.currentDimension === 'Purchases') {
      allPool.push(...this.data.transactions);
    }
    if (this.currentDimension === 'all' || this.currentDimension === 'Music') {
      allPool.push(...this.data.music);
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
        const text = `${it.title || ''} ${it.note || ''} ${it.category || ''} ${it.subcategory || ''} ${it.mode || ''} ${it.query || ''} ${it.body || ''} ${it.caption || ''} ${it.content || ''}`.toLowerCase();
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
          <p class="text-xs text-slate-500 mt-1">Try resetting the search keyword or selecting 'All Eras'.</p>
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
          <button id="loadMoreBtn" class="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full text-xs transition-all shadow-md">
            Load More Receipts (${totalMatches - visibleItems.length} remaining) ↓
          </button>
        `;
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
          window.soundFX.print();
          this.currentPage++;
          this.renderScrapbook();
        });
      } else {
        loadMoreContainer.innerHTML = `<span class="text-xs text-slate-500 font-mono-receipt">End of receipts catalog.</span>`;
      }
    }
  }

  renderThermalReceiptCard(item) {
    const isPurchase = item.dimension === 'Purchases';
    const amountStr = isPurchase ? `₹${item.amount.toLocaleString('en-IN')}` : '';

    // Connected context snippet
    const context48h = this.getConnectedItems(item, 48);

    const stampMap = {
      'Saloon': 'GROOMED',
      'Salary': 'EARNED',
      'PPF': 'SECURED',
      'Mutual fund': 'INVESTED',
      'Train': 'JOURNEY',
      'Dinner': 'FEAST',
      'Medicine': 'HEALING',
      'Hospital': 'CARE'
    };

    let stampText = '';
    if (item.category && stampMap[item.category]) {
      stampText = stampMap[item.category];
    } else if (item.amount >= 20000) {
      stampText = 'MAJOR';
    }

    return `
      <div class="flip-card h-[340px] w-full" data-id="${item.id}">
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
                  ${item.body || item.query || item.content || item.caption || item.track_name || ''}
                </div>
              `}

              <!-- Barcode & Flip Trigger -->
              <div class="flex items-center justify-between pt-1">
                <div class="barcode-strip w-24"></div>
                <button class="flip-trigger-btn text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors font-mono-receipt">
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
                `).join('') : `<div class="text-[11px] text-slate-500">No cross-dimensional receipts within 48h.</div>`}
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
  // MODE D: NARRATIVE DETECTIVE (COMBINATOR)
  // ==========================================
  renderDetectiveView() {
    const container = document.getElementById('detectiveContainer');
    if (!container) return;

    let html = `
      <div class="space-y-8">
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
                          <span>${it.dimension === 'Purchases' ? '💳' : (it.dimension === 'Music' ? '🎵' : '🔎')}</span>
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

          <!-- Suggested candidates pool for quick combining -->
          <div>
            <div class="text-xs text-slate-400 font-mono-receipt uppercase tracking-wider mb-2.5">
              Select Receipts To Test:
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

  renderCandidateCombinatorChips() {
    // Pick interesting sample across dimensions
    const candidates = [
      ...this.data.music.slice(0, 6),
      ...this.data.searches.slice(0, 6),
      ...this.data.messages.slice(0, 6),
      ...this.data.places.slice(0, 6),
      ...this.data.photos.slice(0, 6),
      ...this.data.notes.slice(0, 6)
    ];

    return candidates.map(c => `
      <button class="combinator-chip-btn text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5" data-id="${c.id}">
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
        this.workbenchSelected.shift(); // keep max 2
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

    let slotsHtml = items.map((it, idx) => `
      <div class="border border-indigo-500/60 bg-indigo-950/30 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono-receipt">${it.dimension}</span>
            <span class="text-[10px] text-slate-400 font-mono-receipt">${it.date}</span>
          </div>
          <div class="text-sm font-bold text-white mb-1 font-mono-receipt">${it.title || it.note || it.query}</div>
          <div class="text-xs text-slate-300 line-clamp-2">${it.body || it.content || it.caption || ''}</div>
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

    // If 2 items selected, evaluate connection!
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
            `These receipts belong to ${isSameEra ? 'the same developmental era' : 'two distinct chapters of the user\'s evolution'}. Viewed together, they reveal how their personal priorities and inner reflections shifted over ${timeDiffDays} days from "${a.dimension}" to "${b.dimension}".`
          }
        </p>
      `;
    } else {
      resultBox.classList.add('hidden');
    }
  }

  // ==========================================
  // MODE E: LIFE WRAPPED (SPOTIFY STYLE)
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
                <!-- Glowing Top Accent -->
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
              <div class="text-base font-bold text-slate-900 font-mono-receipt leading-snug">
                ${item.title || item.note || item.category}
              </div>
              ${item.category ? `<div class="text-xs text-slate-600 font-mono-receipt">Category: ${item.category} ${item.subcategory ? `> ${item.subcategory}` : ''}</div>` : ''}
              ${item.mode ? `<div class="text-xs text-slate-500 font-mono-receipt">Account: ${item.mode}</div>` : ''}
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

            ${item.dimension === 'Searches' ? `
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 font-mono-receipt mb-4">
                <div class="font-bold">Google Query:</div>
                <div class="italic text-sm mt-1">"${item.query}"</div>
              </div>
            ` : ''}

            ${item.dimension === 'Messages' ? `
              <div class="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-slate-800 font-mono-receipt mb-4">
                <div class="font-bold text-sky-800">${item.direction} Chat with ${item.sender}:</div>
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
              What else was occurring in this user's digital life within 48 hours of this moment?
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
    const audioBar = document.getElementById('globalAudioBar');
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
    if (id.startsWith('txn_')) return this.data.transactions.find(t => t.id === id);
    if (id.startsWith('mus_')) return this.data.music.find(m => m.id === id);
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
