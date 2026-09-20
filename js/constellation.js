// Interactive Canvas Constellation Graph connecting Life Receipts across 48h temporal webs
class ConstellationViewer {
  constructor(canvasId, data) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.data = data;
    
    this.nodes = [];
    this.edges = [];
    this.hoveredNode = null;
    this.selectedNode = null;
    
    this.transform = { x: 0, y: 0, scale: 1 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    
    this.activeEra = 'all';
    this.activeDimension = 'all';
    
    this.setupNodes();
    this.initEvents();
    this.resize();
    this.animate();
  }

  setupNodes() {
    this.nodes = [];
    const allItems = [];

    // Curated high-impact items for clean, fluid graph visualization
    // 1. Stories sequence items
    const storyItemIds = new Set();
    this.data.stories.forEach(s => s.receiptSequence.forEach(id => storyItemIds.add(id)));

    // Collect candidates across all dimensions
    this.data.music.forEach(m => allItems.push(m));
    if (this.data.movies) this.data.movies.forEach(mv => allItems.push(mv));
    this.data.places.forEach(p => allItems.push(p));
    this.data.photos.forEach(ph => allItems.push(ph));
    this.data.messages.forEach(msg => allItems.push(msg));
    this.data.searches.forEach(sr => allItems.push(sr));
    this.data.notes.forEach(nt => allItems.push(nt));
    this.data.events.forEach(ev => allItems.push(ev));

    // Sample high-impact purchases (from stories, salary, high value, chai, or key events)
    const sampledTxns = this.data.transactions.filter(t => {
      return storyItemIds.has(t.id) ||
             t.amount >= 2000 ||
             t.transactionType === 'Income' ||
             t.note.toLowerCase().includes('tv') ||
             t.note.toLowerCase().includes('bike') ||
             t.note.toLowerCase().includes('cataract') ||
             t.note.toLowerCase().includes('laptop') ||
             t.note.toLowerCase().includes('marathon') ||
             t.note.toLowerCase().includes('sevagram') ||
             t.note.toLowerCase().includes('eyes');
    }).slice(0, 160);

    sampledTxns.forEach(t => allItems.push(t));

    // Sort by timestamp
    allItems.sort((a, b) => new Date(a.timestamp || a.date).getTime() - new Date(b.timestamp || b.date).getTime());

    const minTime = new Date('2015-01-01').getTime();
    const maxTime = new Date('2018-09-30').getTime();
    const totalTime = maxTime - minTime;

    const width = 2400;
    const height = 900;

    const dimensionYOffset = {
      'Purchases': -220,
      'Music': -150,
      'Movies & Entertainment': -90,
      'Places': -30,
      'Photos': 30,
      'Messages': 90,
      'Searches': 150,
      'Personal Notes': 220,
      'Events': 0
    };

    const dimensionColors = {
      'Purchases': '#10b981',
      'Music': '#06b6d4',
      'Movies & Entertainment': '#ec4899',
      'Places': '#f59e0b',
      'Photos': '#f43f5e',
      'Messages': '#38bdf8',
      'Searches': '#a855f7',
      'Personal Notes': '#eab308',
      'Events': '#ef4444'
    };

    allItems.forEach((item, index) => {
      const itemTime = new Date(item.timestamp || item.date).getTime();
      const progress = (itemTime - minTime) / totalTime;
      const x = 150 + progress * (width - 300) + (Math.sin(index * 17) * 20);
      const baseOffsetY = dimensionYOffset[item.dimension] || 0;
      const jitterY = Math.cos(index * 11) * 35;
      const y = height / 2 + baseOffsetY + jitterY;

      this.nodes.push({
        id: item.id,
        item: item,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        radius: item.type === 'event' || item.type === 'photo' ? 9 : 6.5,
        color: dimensionColors[item.dimension] || '#94a3b8',
        timestamp: itemTime,
        dimension: item.dimension,
        eraId: item.eraId
      });
    });

    // Compute temporal edges: Connect items that happened within 48 hours (172,800,000 ms)
    this.edges = [];
    const fortyEightHours = 48 * 3600 * 1000;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const diff = Math.abs(this.nodes[i].timestamp - this.nodes[j].timestamp);
        if (diff <= fortyEightHours) {
          // Add edge between different dimensions
          if (this.nodes[i].dimension !== this.nodes[j].dimension) {
            this.edges.push({
              source: this.nodes[i],
              target: this.nodes[j],
              weight: 1 - (diff / fortyEightHours)
            });
          }
        } else if (diff > fortyEightHours * 2) {
          break; // Array is sorted by time
        }
      }
    }
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = (rect.height || 540) * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height || 540}px`;
    
    // Center initially
    this.transform.x = rect.width * 0.15;
    this.transform.y = -80;
    this.transform.scale = 0.65;
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStart = { x: e.clientX - this.transform.x, y: e.clientY - this.transform.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.transform.x = e.clientX - this.dragStart.x;
        this.transform.y = e.clientY - this.dragStart.y;
      }
      this.checkHover(e);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY < 0 ? 1.08 : 0.92;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.transform.x = mouseX - (mouseX - this.transform.x) * zoom;
      this.transform.y = mouseY - (mouseY - this.transform.y) * zoom;
      this.transform.scale = Math.max(0.2, Math.min(2.5, this.transform.scale * zoom));
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredNode) {
        window.soundFX.click();
        if (window.app && window.app.showReceiptModal) {
          window.app.showReceiptModal(this.hoveredNode.item);
        }
      }
    });
  }

  checkHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - this.transform.x) / this.transform.scale;
    const mouseY = (e.clientY - rect.top - this.transform.y) / this.transform.scale;

    let found = null;
    for (const node of this.nodes) {
      if (this.activeEra !== 'all' && node.eraId !== this.activeEra) continue;
      if (this.activeDimension !== 'all' && node.dimension !== this.activeDimension) continue;

      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      if (dist <= node.radius + 6) {
        found = node;
        break;
      }
    }
    if (this.hoveredNode !== found) {
      this.hoveredNode = found;
      this.canvas.style.cursor = found ? 'pointer' : 'grab';
    }
  }

  animate() {
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(this.transform.x, this.transform.y);
    ctx.scale(this.transform.scale, this.transform.scale);

    // Background era bands
    const eras = [
      { name: "2015: Baroda Foundation", x: 100, w: 550, color: "rgba(59, 130, 246, 0.04)" },
      { name: "2016: The Family Anchor", x: 650, w: 550, color: "rgba(139, 92, 246, 0.04)" },
      { name: "2017: Mumbai Crucible", x: 1200, w: 580, color: "rgba(16, 185, 129, 0.04)" },
      { name: "2018: Freedom & Care", x: 1780, w: 550, color: "rgba(245, 158, 11, 0.04)" }
    ];

    eras.forEach(er => {
      ctx.fillStyle = er.color;
      ctx.fillRect(er.x, 100, er.w, 700);
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "12px 'Space Mono', monospace";
      ctx.fillText(er.name.toUpperCase(), er.x + 20, 140);
    });

    // Draw Edges
    for (const edge of this.edges) {
      const isHighlighted = this.hoveredNode && (edge.source === this.hoveredNode || edge.target === this.hoveredNode);
      if (this.activeEra !== 'all') {
        if (edge.source.eraId !== this.activeEra && edge.target.eraId !== this.activeEra) continue;
      }

      ctx.beginPath();
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
      if (isHighlighted) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + edge.weight * 0.07})`;
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }

    // Draw Nodes
    for (const node of this.nodes) {
      if (this.activeEra !== 'all' && node.eraId !== this.activeEra) continue;
      if (this.activeDimension !== 'all' && node.dimension !== this.activeDimension) continue;

      const isHovered = this.hoveredNode === node;
      const isConnectedToHover = this.hoveredNode && this.edges.some(e => 
        (e.source === this.hoveredNode && e.target === node) || 
        (e.target === this.hoveredNode && e.source === node)
      );

      ctx.beginPath();
      const r = isHovered ? node.radius * 1.6 : (isConnectedToHover ? node.radius * 1.3 : node.radius);
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

      if (isHovered || isConnectedToHover) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = node.color;
      ctx.fill();

      // Node border
      ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(10, 13, 20, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node title label if hovered or high impact
      if (isHovered || node.item.type === 'event' || isConnectedToHover) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = isHovered ? "bold 13px 'Outfit', sans-serif" : "11px 'Outfit', sans-serif";
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#000';
        const label = node.item.title || node.item.note || node.item.name || '';
        const shortLabel = label.length > 28 ? label.substring(0, 26) + '…' : label;
        ctx.fillText(shortLabel, node.x + 12, node.y + 4);
      }
    }

    ctx.restore();
  }

  setFilter(era, dimension) {
    this.activeEra = era;
    this.activeDimension = dimension;
  }

  resetView() {
    this.resize();
  }
}

window.ConstellationViewer = ConstellationViewer;
