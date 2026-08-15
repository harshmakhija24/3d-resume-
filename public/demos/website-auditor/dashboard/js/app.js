document.addEventListener('DOMContentLoaded', () => {
  const data = window.AUDIT_DATA || [];
  
  const grid = document.getElementById('programme-grid');
  const sidebarNav = document.getElementById('sidebar-nav');
  
  const modal = document.getElementById('audit-modal');
  const modalClose = document.getElementById('close-modal');
  const modalBack = document.getElementById('modal-back');
  const modalHeader = document.getElementById('modal-header-content');
  const modalTabs = document.getElementById('modal-tabs');
  const modalBody = document.getElementById('modal-body');
  
  // Folder Views
  const homeView = document.getElementById('home-view');
  const openCoursesView = document.getElementById('open-courses-view');
  const northstarView = document.getElementById('northstar-view');
  const folderNorthstar = document.getElementById('folder-northstar');
  const folderOpenCourses = document.getElementById('folder-open-courses');
  const breadcrumb = document.getElementById('breadcrumb');
  const backToHome = document.getElementById('back-to-home');
  
  const wfViewer = document.getElementById('wf-viewer');
  const wfClose = document.getElementById('wf-close');
  const wfBack = document.getElementById('wf-back');
  const wfTitle = document.getElementById('wf-title');
  const wfSourceTabs = document.getElementById('wf-source-tabs');
  const wfActions = document.getElementById('wf-actions');
  const wfPaneLeft = document.getElementById('wf-pane-left');
  const wfPaneMiddle = document.getElementById('wf-pane-middle');
  const wfPaneRight = document.getElementById('wf-pane-right');
  const wfLabelLeft = document.getElementById('wf-label-left');
  const wfLabelMiddle = document.getElementById('wf-label-middle');
  const wfLabelRight = document.getElementById('wf-label-right');
  
  let currentProgramme = null;
  let currentWfLeft = 'oldSite';
  let currentWfMiddle = 'marketingHtml';
  let currentWfRight = 'proposedV1';
  let currentViewMode = 'ascii';
  
  // Render Grid
  function renderGrid() {
    grid.innerHTML = '';
    sidebarNav.innerHTML = '';
    
    data.forEach(prog => {
      // Sidebar item
      const sItem = document.createElement('div');
      sItem.className = 'sidebar-item';
      sItem.innerHTML = `
        <div class="sidebar-item-content">
          <span class="dot"></span>${prog.shortName}
        </div>
        <div class="sidebar-item-actions">
          <button class="action-btn audit-btn">Audit Details</button>
          <button class="action-btn wf-btn">Check Wireframes</button>
        </div>
      `;
      
      const auditBtn = sItem.querySelector('.audit-btn');
      const wfBtn = sItem.querySelector('.wf-btn');
      
      auditBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(prog);
      });
      
      wfBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openWfViewer(prog);
      });
      
      sItem.addEventListener('click', () => openModal(prog));
      sidebarNav.appendChild(sItem);
      
      // Card
      const card = document.createElement('div');
      card.className = 'card';

      // Calculate best overall grader score for badge
      let bestScore = null;
      let bestScoreColor = 'var(--text-muted)';
      let bestScoreBorder = 'var(--border)';
      let bestPrevScore = null;
      if (prog.graderScores) {
        const validScores = Object.values(prog.graderScores)
          .filter(s => s.url && !s.url.includes('northstar-learning.example'))
          .map(s => s.overall)
          .filter(s => s !== null && s !== undefined && s > 0);
        if (validScores.length) {
          bestScore = Math.max(...validScores);
          bestScoreColor = bestScore >= 90 ? '#2E7D32' : bestScore >= 70 ? '#ED6C02' : '#D32F2F';
          bestScoreBorder = bestScoreColor;
        }
      }
      if (prog.previousScores) {
        const validPrev = Object.values(prog.previousScores)
          .filter(s => s.url && !s.url.includes('northstar-learning.example'))
          .map(s => s.overall)
          .filter(s => s !== null && s !== undefined && s > 0);
        if (validPrev.length) bestPrevScore = Math.max(...validPrev);
      }
      let cardDelta = '';
      if (bestScore !== null && bestPrevScore !== null) {
        const diff = bestScore - bestPrevScore;
        if (diff > 0) cardDelta = `<span class="score-delta up" style="font-size:0.7rem;margin-left:4px;">↑${diff}</span>`;
        else if (diff < 0) cardDelta = `<span class="score-delta down" style="font-size:0.7rem;margin-left:4px;">↓${Math.abs(diff)}</span>`;
        else cardDelta = `<span class="score-delta same" style="font-size:0.7rem;margin-left:4px;">—</span>`;
      }

      card.innerHTML = `
        <div class="title">${prog.programmeName}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">${prog.file}</div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 52px; height: 52px; border-radius: 50%; border: 3px solid ${bestScoreBorder}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: ${bestScoreColor}; font-size: ${bestScore !== null ? '1.05rem' : '0.75rem'};">
                    ${bestScore !== null ? bestScore : 'TBD'}
                </div>
                <div style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted); line-height: 1.4;">
                    Best Prototype${cardDelta}<br/><span style="color: var(--text); font-size: 0.75rem;">Lighthouse Overall</span>
                </div>
            </div>
            <button class="card-grader-btn" style="background: var(--accent); color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 600; transition: var(--transition); white-space: nowrap;">⚡ Grader Report</button>
        </div>

        ${prog.file === 'Not provided' ? '<div style="font-size: 0.9rem; font-style: italic; color: var(--text-muted);">No audit data (prototypes only)</div>' : `
        <details class="kpi-details" style="font-family: 'Inter', sans-serif;">
            <summary style="font-size: 0.82rem; font-weight: 600; color: var(--text); cursor: pointer; outline: none;">View Audit KPIs (Brand / Content / UX)</summary>
            <div style="padding-top: 8px; border-top: 1px dashed var(--border); margin-top: 8px;">
                <div style="font-size: 0.78rem; margin-bottom: 8px; color: var(--text-muted);">Brand: <span style="color:var(--text); font-weight:600;">${prog.scores.brand}%</span> | Content: <span style="color:var(--text); font-weight:600;">${prog.scores.content}%</span> | UX: <span style="color:var(--text); font-weight:600;">${prog.scores.ux}%</span></div>
                <div class="scores" style="display: flex; gap: 4px;">
                  <div class="score-bar" style="flex:1; height:4px; background:var(--border); border-radius:2px;"><div class="score-fill" style="height:100%; width:${prog.scores.brand}%; background:var(--success)"></div></div>
                  <div class="score-bar" style="flex:1; height:4px; background:var(--border); border-radius:2px;"><div class="score-fill" style="height:100%; width:${prog.scores.content}%; background:var(--warning)"></div></div>
                  <div class="score-bar" style="flex:1; height:4px; background:var(--border); border-radius:2px;"><div class="score-fill" style="height:100%; width:${prog.scores.ux}%; background:var(--accent)"></div></div>
                </div>
            </div>
        </details>
        `}
      `;
      
      card.addEventListener('click', (e) => {
          if(e.target.closest('details') || e.target.closest('.card-grader-btn')) return;
          openModal(prog);
      });
      
      const graderBtn = card.querySelector('.card-grader-btn');
      if (graderBtn) {
          graderBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              openGraderModal(prog);
          });
      }

      grid.appendChild(card);
    });
  }
  
  // History State Management
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.view === 'wf') {
      modal.style.display = 'flex';
      wfViewer.style.display = 'flex';
    } else if (e.state && e.state.view === 'modal') {
      modal.style.display = 'flex';
      wfViewer.style.display = 'none';
    } else {
      modal.style.display = 'none';
      wfViewer.style.display = 'none';
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (wfViewer.style.display === 'flex') {
        history.back();
      } else if (modal.style.display === 'flex') {
        history.back();
      }
    }
  });

  // Open Modal
  function openModal(prog) {
    currentProgramme = prog;
    modal.style.display = 'flex';
    history.pushState({ view: 'modal' }, '', '#audit');
    modalHeader.innerHTML = `<h2>${prog.programmeName}</h2><p>Audit Results for ${prog.file}</p>`;
    
    // Setup Tabs
    modalTabs.innerHTML = `
      <div class="modal-tab active" data-tab="summary">Summary</div>
      <div class="modal-tab" data-tab="gaps">Gap Analysis</div>
      <div class="modal-tab" data-tab="brand">Brand Compliance</div>
      <div class="modal-tab" data-tab="wireframes">Wireframes</div>
    `;
    
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderTabContent(e.target.dataset.tab, prog);
      });
    });
    
    renderTabContent('summary', prog);
  }
  
  // Render Tab Content
  function renderTabContent(tab, prog) {
    let html = '';
    if (tab === 'summary') {
      html = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <p><strong>Summary:</strong> ${prog.summary}</p>
            <p><strong>Old Site:</strong> ${prog.oldSiteUrl !== '—' ? `<a href="${prog.oldSiteUrl}" target="_blank">${prog.oldSiteUrl}</a>` : '—'}</p>
            <p><strong>${prog.id === 'elp' ? 'v2' : 'v1'} Staging:</strong> ${prog.v1StagingUrl !== '—' ? `<a href="${prog.v1StagingUrl}" target="_blank">${prog.v1StagingUrl}</a>` : '—'}</p>
            <p><strong>Audit Date:</strong> ${prog.auditDate}</p>
          </div>
          <button id="summary-open-wf-viewer" style="background: var(--accent); color: white; padding: 10px 20px; border: none; border-radius: var(--radius); cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; margin-left: 20px;">Compare Wireframes</button>
        </div>
        <h3>Action Items</h3>
        <ul>
          ${prog.actionItems.map(a => `<li><b>${a.priority.toUpperCase()}</b>: ${a.task}</li>`).join('')}
        </ul>
      `;
    } else if (tab === 'gaps') {
      html = `
        <table style="width: 100%; text-align: left; border-collapse: collapse;">
          <tr style="background: var(--bg-dark); color: var(--text-light);">
            <th style="padding: 10px; border: 1px solid var(--border);">Section</th>
            <th style="padding: 10px; border: 1px solid var(--border);">Old Site</th>
            <th style="padding: 10px; border: 1px solid var(--border);">Marketing HTML</th>
            <th style="padding: 10px; border: 1px solid var(--border);">${prog.id === 'elp' ? 'v2' : 'v1'} Staging</th>
            <th style="padding: 10px; border: 1px solid var(--border);">Severity</th>
          </tr>
          ${prog.contentGaps.map(g => `
            <tr>
              <td style="padding: 10px; border: 1px solid var(--border); font-weight: bold;">${g.section}</td>
              <td style="padding: 10px; border: 1px solid var(--border);">${g.oldSite.detail}</td>
              <td style="padding: 10px; border: 1px solid var(--border); ${!g.marketingHtml.present ? 'color: red; font-weight: bold;' : ''}">${g.marketingHtml.detail}</td>
              <td style="padding: 10px; border: 1px solid var(--border);">${g.v1Staging.detail}</td>
              <td style="padding: 10px; border: 1px solid var(--border); color: ${g.severity === 'critical' ? 'red' : (g.severity === 'warning' ? 'orange' : 'green')}">${g.severity.toUpperCase()}</td>
            </tr>
          `).join('')}
        </table>
      `;
    } else if (tab === 'brand') {
      html = `
        <table style="width: 100%; text-align: left; border-collapse: collapse;">
          <tr style="background: var(--bg-dark); color: var(--text-light);">
            <th style="padding: 10px; border: 1px solid var(--border);">Rule</th>
            <th style="padding: 10px; border: 1px solid var(--border);">Expected</th>
            <th style="padding: 10px; border: 1px solid var(--border);">Actual</th>
            <th style="padding: 10px; border: 1px solid var(--border);">Status</th>
          </tr>
          ${prog.brandChecks.map(b => `
            <tr>
              <td style="padding: 10px; border: 1px solid var(--border);">${b.rule}</td>
              <td style="padding: 10px; border: 1px solid var(--border);">${b.expected}</td>
              <td style="padding: 10px; border: 1px solid var(--border);">${b.actual}</td>
              <td style="padding: 10px; border: 1px solid var(--border); color: ${b.status === 'pass' ? 'green' : (b.status === 'warn' ? 'orange' : 'red')}">${b.status.toUpperCase()}</td>
            </tr>
          `).join('')}
        </table>
      `;
    } else if (tab === 'wireframes') {
      html = `
        <p>Click below to compare wireframes side by side and download them.</p>
        <button id="open-wf-viewer" style="background: var(--accent); color: white; padding: 10px 20px; border: none; border-radius: var(--radius); cursor: pointer; font-family: 'Inter', sans-serif;">Compare Wireframes</button>
        <h3 style="margin-top: 20px;">UX Suggestions</h3>
        <ul>
          ${prog.wireframes.suggestions.map(s => `<li><b>${s.title}</b>: ${s.description} (Effort: ${s.effort}, Impact: ${s.impact})</li>`).join('')}
        </ul>
      `;
    }
    modalBody.innerHTML = html;
    
    if (tab === 'wireframes') {
      document.getElementById('open-wf-viewer').addEventListener('click', () => {
        openWfViewer(prog);
      });
    }
    if (tab === 'summary') {
      const btn = document.getElementById('summary-open-wf-viewer');
      if (btn) {
        btn.addEventListener('click', () => {
          openWfViewer(prog);
        });
      }
    }
  }
  
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    history.replaceState(null, '', '#');
  });
  if (modalBack) {
    modalBack.addEventListener('click', () => {
      modal.style.display = 'none';
      history.replaceState(null, '', '#');
    });
  }
  
  // Wireframe Viewer
  function openWfViewer(prog) {
    currentProgramme = prog;
    wfViewer.style.display = 'flex';
    history.pushState({ view: 'wf' }, '', '#wireframes');
    wfTitle.textContent = `${prog.shortName} Wireframe Comparison`;
    
    // Set up source tabs
    const sources = [
      { id: 'oldSite', label: 'Old Website' },
      { id: 'marketingHtml', label: 'Marketing HTML' },
      { id: 'v1Staging', label: currentProgramme.id === 'elp' ? 'v2 Staging' : 'v1 Staging' },
      { id: 'proposedV1', label: 'Proposed Layout v1' },
      { id: 'proposedV2', label: 'Proposed Layout v2' },
      { id: 'proposedV3', label: 'Proposed Layout v3' }
    ];
    
    function renderActions() {
      wfActions.innerHTML = `
        <div style="background: var(--bg-darker); padding: 4px; border-radius: 6px; display: inline-flex; margin-right: 16px; border: 1px solid var(--border);">
          <button id="view-ascii" style="background: ${currentViewMode === 'ascii' ? 'var(--accent)' : 'transparent'}; color: ${currentViewMode === 'ascii' ? 'white' : 'var(--text-light)'}; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">ASCII Mode</button>
          <button id="view-html" style="background: ${currentViewMode === 'html' ? 'var(--accent)' : 'transparent'}; color: ${currentViewMode === 'html' ? 'white' : 'var(--text-light)'}; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">HTML Code</button>
        </div>
        <button id="preview-html" style="background: var(--accent); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 12px; font-weight: 500; font-size: 14px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" onmouseover="this.style.filter='brightness(1.1)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.filter='none'; this.style.transform='none'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Preview HTML
        </button>
        ${currentViewMode === 'ascii' ? `
        <button id="dl-txt" style="background: #2D3748; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 12px; font-weight: 500; font-size: 14px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#4A5568'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#2D3748'; this.style.transform='none'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export TXT
        </button>
        <button id="dl-png" style="background: #2D3748; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#4A5568'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#2D3748'; this.style.transform='none'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          Export PNG
        </button>
        ` : `
        <button id="dl-html" style="background: #2D3748; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#4A5568'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#2D3748'; this.style.transform='none'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download HTML Codes
        </button>
        `}
      `;

      document.getElementById('view-ascii').addEventListener('click', () => {
        currentViewMode = 'ascii';
        renderActions();
        updateWfViews();
      });
      document.getElementById('view-html').addEventListener('click', () => {
        currentViewMode = 'html';
        renderActions();
        updateWfViews();
      });
      
      
      document.getElementById('preview-html').addEventListener('click', () => {
        let fileUrl = '';
        if (prog.id === 'adm') {
            if (currentWfRight === 'v1_variant_1') fileUrl = '../prototypes/adm_v1_variant_1.html';
            else if (currentWfRight === 'v1_variant_2') fileUrl = '../prototypes/adm_gemini31pro.html';
            else if (currentWfRight === 'v1_variant_3') fileUrl = '../prototypes/adm_v1_variant_3.html';
            else if (currentWfRight === 'v1_variant_4') fileUrl = '../prototypes/adm_gemini35flash.html';
            else if (currentWfRight === 'v1_variant_5') fileUrl = '../prototypes/adm_v1_variant_5.html';
        } else if (prog.id === 'elp') {
            if (currentWfRight === 'proposedV1') fileUrl = '../prototypes/elp_v1.html';
            else if (currentWfRight === 'proposedV2') fileUrl = '../prototypes/elp_v2.html';
            else if (currentWfRight === 'proposedV3') fileUrl = '../prototypes/elp_v3.html';
            else if (currentWfRight === 'v1_variant_1') fileUrl = '../prototypes/elp_v1_variant_1.html';
            else if (currentWfRight === 'v1_variant_2') fileUrl = '../prototypes/elp_v1_variant_2.html';
            else if (currentWfRight === 'v1_variant_3') fileUrl = '../prototypes/elp_v1_variant_3.html';
            else if (currentWfRight === 'v1_variant_4') fileUrl = '../prototypes/elp_v1_stitch_v4.html';
            else if (currentWfRight === 'v2_variant_1') fileUrl = '../prototypes/elp_v2_variant_1.html';
            else if (currentWfRight === 'v2_variant_2') fileUrl = '../prototypes/elp_v2_variant_2.html';
            else if (currentWfRight === 'v2_variant_3') fileUrl = '../prototypes/elp_v2_variant_3.html';
            else if (currentWfRight === 'v2_variant_4') fileUrl = '../prototypes/elp_v2_stitch_v4.html';
        } else if (prog.id === 'contact') {
            if (currentWfRight === 'proposedV1') fileUrl = '../prototypes/contact_v1.html';
            else if (currentWfRight === 'proposedV2') fileUrl = '../prototypes/contact_v2.html';
            else if (currentWfRight === 'proposedV3') fileUrl = '../prototypes/contact_v3.html';
            else if (currentWfRight === 'v2_variant_4') fileUrl = '../prototypes/contact_v2_stitch.html';
                } else if (prog.id === 'programmes_listing') {
            if (currentWfRight === 'v1_variant_1') fileUrl = '../output/programmes_list_variant_1_patched.html';
            else if (currentWfRight === 'v1_variant_2') fileUrl = '../output/programmes_list_variant_2_patched.html';
            else if (currentWfRight === 'v1_variant_3') fileUrl = '../output/programmes_list_variant_3_patched.html';
        } else {
            if (currentWfRight === 'proposedV1') fileUrl = `../prototypes/${prog.id}_v1.html`;
            else if (currentWfRight === 'proposedV2') fileUrl = `../prototypes/${prog.id}_v2.html`;
            else if (currentWfRight === 'proposedV3') fileUrl = `../prototypes/${prog.id}_v3.html`;
            else if (currentWfRight === 'v1_variant_4') fileUrl = `../prototypes/${prog.id}_stitch_v4.html`;
        }
        
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        } else {
            alert('No preview available for this layout option.');
        }
      });


      if (currentViewMode === 'ascii') {
        document.getElementById('dl-txt').addEventListener('click', () => {
          const parts = [];
          if (currentWfLeft !== 'none') parts.push(`=== LEFT: ${currentWfLeft} ===\n${prog.wireframes.ascii[currentWfLeft]}`);
          if (currentWfMiddle !== 'none') parts.push(`=== MIDDLE: ${currentWfMiddle} ===\n${prog.wireframes.ascii[currentWfMiddle]}`);
          if (currentWfRight !== 'none') parts.push(`=== RIGHT: ${currentWfRight} ===\n${prog.wireframes.ascii[currentWfRight]}`);
          const content = parts.join('\n\n');
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${prog.shortName}_wireframes.txt`;
          a.click();
          URL.revokeObjectURL(url);
        });
        
        document.getElementById('dl-png').addEventListener('click', () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const width = 1200;
          const height = 800;
          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.font = '14px monospace';
          ctx.fillStyle = '#000000';
          
          const activePanes = [];
          if (currentWfLeft !== 'none') activePanes.push(currentWfLeft);
          if (currentWfMiddle !== 'none') activePanes.push(currentWfMiddle);
          if (currentWfRight !== 'none') activePanes.push(currentWfRight);
          
          const paneWidth = activePanes.length > 0 ? width / activePanes.length : width;
          
          activePanes.forEach((paneId, index) => {
            const xOffset = index * paneWidth + 20;
            const lines = prog.wireframes.ascii[paneId] ? prog.wireframes.ascii[paneId].split('\n') : [];
            ctx.fillText(`--- ${paneId} ---`, xOffset, 30);
            lines.forEach((line, i) => {
              ctx.fillText(line, xOffset, 60 + i * 16);
            });
          });
          
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `${prog.shortName}_wireframes.png`;
          a.click();
        });
      } else {
        document.getElementById('dl-html').addEventListener('click', () => {
          // Download all active panes as HTML files
          const activePanes = [];
          if (currentWfLeft !== 'none') activePanes.push(currentWfLeft);
          if (currentWfMiddle !== 'none') activePanes.push(currentWfMiddle);
          if (currentWfRight !== 'none') activePanes.push(currentWfRight);
          
          activePanes.forEach(paneId => {
            let fileUrl = '';
            if (prog.id === 'adm') {
                if (paneId === 'v1_variant_1') fileUrl = `../prototypes/adm_v1_variant_1.html`;
                else if (paneId === 'v1_variant_2') fileUrl = `../prototypes/adm_gemini31pro.html`;
                else if (paneId === 'v1_variant_3') fileUrl = `../prototypes/adm_v1_variant_3.html`;
                else if (paneId === 'v1_variant_4') fileUrl = `../prototypes/adm_gemini35flash.html`;
                else if (paneId === 'v1_variant_5') fileUrl = `../prototypes/adm_v1_variant_5.html`;
            } else if (prog.id === 'elp') {
                if (paneId === 'proposedV1') fileUrl = `../prototypes/elp_v1.html`;
                else if (paneId === 'proposedV2') fileUrl = `../prototypes/elp_v2.html`;
                else if (paneId === 'proposedV3') fileUrl = `../prototypes/elp_v3.html`;
                else if (paneId === 'v1_variant_1') fileUrl = `../prototypes/elp_v1_variant_1.html`;
                else if (paneId === 'v1_variant_2') fileUrl = `../prototypes/elp_v1_variant_2.html`;
                else if (paneId === 'v1_variant_3') fileUrl = `../prototypes/elp_v1_variant_3.html`;
                else if (paneId === 'v2_variant_1') fileUrl = `../prototypes/elp_v2_variant_1.html`;
                else if (paneId === 'v2_variant_2') fileUrl = `../prototypes/elp_v2_variant_2.html`;
                else if (paneId === 'v2_variant_3') fileUrl = `../prototypes/elp_v2_variant_3.html`;
                else if (paneId === 'v1_variant_4') fileUrl = `../prototypes/elp_v1_stitch_v4.html`;
                else if (paneId === 'v2_variant_4') fileUrl = `../prototypes/elp_v2_stitch_v4.html`;
            } else if (prog.id === 'contact') {
                if (paneId === 'proposedV1') fileUrl = '../prototypes/contact_v1.html';
                else if (paneId === 'proposedV2') fileUrl = '../prototypes/contact_v2.html';
                else if (paneId === 'proposedV3') fileUrl = '../prototypes/contact_v3.html';
                else if (paneId === 'v2_variant_4') fileUrl = '../prototypes/contact_v2_stitch.html';
                        } else if (prog.id === 'programmes_listing') {
                if (paneId === 'v1_variant_1') fileUrl = '../output/programmes_list_variant_1_patched.html';
                else if (paneId === 'v1_variant_2') fileUrl = '../output/programmes_list_variant_2_patched.html';
                else if (paneId === 'v1_variant_3') fileUrl = '../output/programmes_list_variant_3_patched.html';
            } else {
                if (paneId === 'proposedV1') fileUrl = `../prototypes/${prog.id}_v1.html`;
                else if (paneId === 'proposedV2') fileUrl = `../prototypes/${prog.id}_v2.html`;
                else if (paneId === 'proposedV3') fileUrl = `../prototypes/${prog.id}_v3.html`;
                else if (paneId === 'v1_variant_4') fileUrl = `../prototypes/${prog.id}_stitch_v4.html`;
            }

            if (!fileUrl) {
                // Ignore external live sites for physical file download
                return;
            }

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileUrl.split('/').pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
        });
      }
    }
    
    renderActions();
    updateWfViews();
  }
  
  
  function fetchHtmlSource(progId, paneId, targetElement) {
    targetElement.textContent = "Loading HTML source...";
    let fileUrl = '';
    
    // Specifically handle marketingHtml mapping to the physical file found at the root
    if (paneId === 'marketingHtml') {
        if (progId === 'adm') fileUrl = '../adm_old_site_reference_agent_gen.html';
        else if (progId === 'pcaim') fileUrl = '../AI_For_Managers_agent_gen.html';
        else if (progId === 'pchm') fileUrl = '../pchm_v1_marketing_html.html';
        else if (progId === 'nam') fileUrl = '../nam_v1_marketing_html.html';
        else if (progId === 'elp') fileUrl = '../elp_v1_marketing_html.html';
    } else if (progId === 'adm') {
        if (paneId === 'v1_variant_1') fileUrl = `../prototypes/adm_v1_variant_1.html`;
        else if (paneId === 'v1_variant_2') fileUrl = `../prototypes/adm_gemini31pro.html`;
        else if (paneId === 'v1_variant_3') fileUrl = `../prototypes/adm_v1_variant_3.html`;
        else if (paneId === 'v1_variant_4') fileUrl = `../prototypes/adm_gemini35flash.html`;
        else if (paneId === 'v1_variant_5') fileUrl = `../prototypes/adm_v1_variant_5.html`;
    } else if (progId === 'elp') {
        if (paneId === 'proposedV1') fileUrl = `../prototypes/elp_v1.html`;
        else if (paneId === 'proposedV2') fileUrl = `../prototypes/elp_v2.html`;
        else if (paneId === 'proposedV3') fileUrl = `../prototypes/elp_v3.html`;
        else if (paneId === 'v1_variant_1') fileUrl = `../prototypes/elp_v1_variant_1.html`;
        else if (paneId === 'v1_variant_2') fileUrl = `../prototypes/elp_v1_variant_2.html`;
        else if (paneId === 'v1_variant_3') fileUrl = `../prototypes/elp_v1_variant_3.html`;
        else if (paneId === 'v2_variant_1') fileUrl = `../prototypes/elp_v2_variant_1.html`;
        else if (paneId === 'v2_variant_2') fileUrl = `../prototypes/elp_v2_variant_2.html`;
        else if (paneId === 'v2_variant_3') fileUrl = `../prototypes/elp_v2_variant_3.html`;
        else if (paneId === 'v1_variant_4') fileUrl = `../prototypes/elp_v1_stitch_v4.html`;
        else if (paneId === 'v2_variant_4') fileUrl = `../prototypes/elp_v2_stitch_v4.html`;
    } else if (progId === 'contact') {
        if (paneId === 'proposedV1') fileUrl = '../prototypes/contact_v1.html';
        else if (paneId === 'proposedV2') fileUrl = '../prototypes/contact_v2.html';
        else if (paneId === 'proposedV3') fileUrl = '../prototypes/contact_v3.html';
        else if (paneId === 'v2_variant_4') fileUrl = '../prototypes/contact_v2_stitch.html';
        } else if (progId === 'programmes_listing') {
        if (paneId === 'v1_variant_1') fileUrl = '../output/programmes_list_variant_1_patched.html';
        else if (paneId === 'v1_variant_2') fileUrl = '../output/programmes_list_variant_2_patched.html';
        else if (paneId === 'v1_variant_3') fileUrl = '../output/programmes_list_variant_3_patched.html';
    } else {
        if (paneId === 'proposedV1') fileUrl = `../prototypes/${progId}_v1.html`;
        else if (paneId === 'proposedV2') fileUrl = `../prototypes/${progId}_v2.html`;
        else if (paneId === 'proposedV3') fileUrl = `../prototypes/${progId}_v3.html`;
        else if (paneId === 'v1_variant_4') fileUrl = `../prototypes/${progId}_stitch_v4.html`;
    }

    if (!fileUrl) {
        targetElement.textContent = "HTML not available for external URLs. Please check the actual site.";
        return;
    }

    fetch(fileUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(text => {
            targetElement.textContent = text;
        })
        .catch(err => {
            targetElement.textContent = "Failed to load HTML source: " + err.message;
        });
  }

  function updateWfViews() {
    const friendlyLabels = {
      none: 'None',
      oldSite: 'Old Website',
      marketingHtml: 'Marketing HTML',
      v1Staging: currentProgramme.id === 'elp' ? 'V2 Staging (Original)' : 'V1 Staging',
      proposedV1: 'Proposed Layout v1',
      proposedV2: 'Proposed Layout v2',
      proposedV3: 'Proposed Layout v3',
      v1_variant_1: 'Design 1 — Gemini 3.1 Pro (Stitch)',
      v1_variant_2: 'Design 2 — Gemini 3.1 Pro (HTML)',
      v1_variant_3: 'Design 3 — Gemini 3.5 Flash (Stitch)',
      v1_variant_4: 'Design 4 — Gemini 3.5 Flash (HTML)',
      v1_variant_5: 'Design 5 — Gemini 3.1 Pro (Refined)',
      v2Staging: 'V2 Staging URL',
      v2_variant_1: 'V2 Prototype 1 (Baseline)',
      v2_variant_2: 'V2 Prototype 2 (Navy Custom)',
      v2_variant_3: 'V2 Prototype 3 (Compact)',
      v2_variant_4: 'V2 Prototype 4 (Stitch)'
    };

    const colLeft = document.getElementById('wf-col-left');
    colLeft.style.display = 'flex';
    if (currentWfLeft === 'none') {
      wfLabelLeft.textContent = `Left: ${friendlyLabels['none']}`;
      wfPaneLeft.textContent = '';
    } else {
      wfLabelLeft.textContent = `Left: ${friendlyLabels[currentWfLeft]}`;
            if (currentViewMode === 'html') {
        fetchHtmlSource(currentProgramme.id, currentWfLeft, wfPaneLeft);
      } else {
        wfPaneLeft.textContent = currentProgramme.wireframes[currentViewMode][currentWfLeft] || 'No wireframe available for this view';
      }
    }
    
    const colMiddle = document.getElementById('wf-col-middle');
    if (colMiddle) {
      colMiddle.style.display = 'flex';
      if (currentWfMiddle === 'none') {
        wfLabelMiddle.textContent = `Middle: ${friendlyLabels['none']}`;
        wfPaneMiddle.textContent = '';
      } else {
        wfLabelMiddle.textContent = `Middle: ${friendlyLabels[currentWfMiddle]}`;
                if (currentViewMode === 'html') {
          fetchHtmlSource(currentProgramme.id, currentWfMiddle, wfPaneMiddle);
        } else {
          wfPaneMiddle.textContent = currentProgramme.wireframes[currentViewMode][currentWfMiddle] || 'No wireframe available for this view';
        }
      }
    }
    
    const colRight = document.getElementById('wf-col-right');
    colRight.style.display = 'flex';
    if (currentWfRight === 'none') {
      wfLabelRight.textContent = `Proposed Layout: ${friendlyLabels['none']}`;
      wfPaneRight.textContent = '';
    } else {
      wfLabelRight.textContent = `Proposed Layout: ${friendlyLabels[currentWfRight]}`;
            if (currentViewMode === 'html') {
        fetchHtmlSource(currentProgramme.id, currentWfRight, wfPaneRight);
      } else {
        wfPaneRight.textContent = currentProgramme.wireframes[currentViewMode][currentWfRight] || 'No wireframe available for this view';
      }
    }
    
    const previewBtn = document.getElementById('preview-html');
    if (previewBtn) {
      let v = friendlyLabels[currentWfRight] || 'V1';
      previewBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview: ${v}`;
    }

    // Build options dynamically based on prog.id
    let options = `
      <option value="none">None</option>
      <option value="oldSite">Old Site</option>
      <option value="marketingHtml">Marketing HTML</option>
      <option value="v1Staging">${currentProgramme.id === 'elp' ? 'V2 Staging' : 'V1 Staging'}</option>
    `;

    if (currentProgramme.id === 'adm') {
        options += `
          <option value="v1_variant_1">Design 1 — Gemini 3.1 Pro (Stitch MCP)</option>
          <option value="v1_variant_2">Design 2 — Gemini 3.1 Pro (Rules HTML)</option>
          <option value="v1_variant_3">Design 3 — Gemini 3.5 Flash (Stitch MCP)</option>
          <option value="v1_variant_4">Design 4 — Gemini 3.5 Flash (Rules HTML)</option>
          <option value="v1_variant_5">Design 5 — Gemini 3.1 Pro (Refined HTML)</option>
        `;
    } else if (currentProgramme.id === 'elp') {
        options += `
          <option value="proposedV1">Proposed Layout v1</option>
          <option value="proposedV2">Proposed Layout v2</option>
          <option value="proposedV3">Proposed Layout v3</option>
          <option value="v1_variant_1">V1 Prototype 1 (Baseline)</option>
          <option value="v1_variant_2">V1 Prototype 2 (Dark Mode)</option>
          <option value="v1_variant_3">V1 Prototype 3 (Compact)</option>
          <option value="v1_variant_4">V1 Prototype 4 (Stitch)</option>
          <option value="v2_variant_1">V2 Prototype 1 (Baseline)</option>
          <option value="v2_variant_2">V2 Prototype 2 (Navy Custom)</option>
          <option value="v2_variant_3">V2 Prototype 3 (Compact)</option>
          <option value="v2_variant_4">V2 Prototype 4 (Stitch)</option>
        `;
    } else if (currentProgramme.id === 'contact') {
        options += `
          <option value="proposedV1">Proposed Layout v1</option>
          <option value="proposedV2">Proposed Layout v2 (Split)</option>
          <option value="proposedV3">Proposed Layout v3 (Dark)</option>
          <option value="v2_variant_4">Stitch Prototype v2 (Tailwind)</option>
        `;
    } else if (currentProgramme.id === 'programmes_listing') {
        options += `
          <option value="v1_variant_1">Design 1 — Hybrid (Patched)</option>
          <option value="v1_variant_2">Design 2 — Masonry (Patched)</option>
          <option value="v1_variant_3">Design 3 — List (Patched)</option>
        `;
    } else {
        // NAM, PCAIM, PCHM
        options += `
          <option value="proposedV1">Proposed Layout v1</option>
          <option value="proposedV2">Proposed Layout v2</option>
          <option value="proposedV3">Proposed Layout v3</option>
          <option value="v1_variant_4">Stitch Prototype 4</option>
        `;
    }

    // Replace the select options
    const setSelectOptions = (id, currentVal) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = options;
        sel.value = currentVal;
        // if the currentVal is not in the options (e.g. switching programmes), fallback to 'none'
        if (sel.value !== currentVal) {
            sel.value = 'none';
        }
    };

    // Ensure we don't duplicate the selects, just update them if they exist
    if (!document.getElementById('sel-left')) {
        wfSourceTabs.innerHTML = `
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="sel-left" style="padding: 6px 10px; border-radius: 6px; border: none; background: #2D3748; color: white; max-width: 200px; outline: none; cursor: pointer; font-size: 13px;"></select>
            <select id="sel-middle" style="padding: 6px 10px; border-radius: 6px; border: none; background: #2D3748; color: white; max-width: 200px; outline: none; cursor: pointer; font-size: 13px;"></select>
            <select id="sel-right" style="padding: 6px 10px; border-radius: 6px; border: none; background: #2D3748; color: white; max-width: 200px; outline: none; cursor: pointer; font-size: 13px;"></select>
          </div>
        `;
        document.getElementById('sel-left').addEventListener('change', (e) => { currentWfLeft = e.target.value; updateWfViews(); });
        document.getElementById('sel-middle').addEventListener('change', (e) => { currentWfMiddle = e.target.value; updateWfViews(); });
        document.getElementById('sel-right').addEventListener('change', (e) => { currentWfRight = e.target.value; updateWfViews(); });
    }

    setSelectOptions('sel-left', currentWfLeft);
    setSelectOptions('sel-middle', currentWfMiddle);
    setSelectOptions('sel-right', currentWfRight);
    
    // Also update our state variables in case they were invalidated by the switch
    currentWfLeft = document.getElementById('sel-left').value;
    currentWfMiddle = document.getElementById('sel-middle').value;
    currentWfRight = document.getElementById('sel-right').value;
  }

  wfClose.addEventListener('click', () => {
    wfViewer.style.display = 'none';
    history.replaceState({ view: 'modal' }, '', '#audit');
  });
  if (wfBack) {
    wfBack.addEventListener('click', () => {
      wfViewer.style.display = 'none';
      history.replaceState({ view: 'modal' }, '', '#audit');
    });
  }
  
  // ── GRADER MODAL v4 ──────────────────────────────────────────────────────
  const graderModal      = document.getElementById('grader-modal');
  const graderModalClose = document.getElementById('grader-modal-close');
  const graderModalBack  = document.getElementById('grader-modal-back');
  const graderModalTitle = document.getElementById('grader-modal-title');
  const graderModalBody  = document.getElementById('grader-modal-body');

  function scoreChip(val) {
    if (val === null || val === undefined || val === 0) return '<span style="color:var(--text-muted);font-weight:500;">N/A</span>';
    const color = val >= 90 ? '#2E7D32' : val >= 70 ? '#ED6C02' : '#D32F2F';
    const bg    = val >= 90 ? '#e8f5e9' : val >= 70 ? '#fff3e0' : '#ffebee';
    return `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-weight:700;font-size:0.85rem;color:${color};background:${bg};">${val}</span>`;
  }

  function deltaChip(current, previous) {
    if (previous === null || previous === undefined || current === null || current === undefined) return '';
    const diff = current - previous;
    if (diff === 0) return '<span class="score-delta same">—</span>';
    if (diff > 0) return `<span class="score-delta up">↑${diff}</span>`;
    return `<span class="score-delta down">↓${Math.abs(diff)}</span>`;
  }

  function formatDate(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
           ' at ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function buildReportPanel(label, current, previous) {
    const cats = [
      { key: 'performance',    icon: '⚡', name: 'Performance' },
      { key: 'accessibility',  icon: '♿', name: 'Accessibility' },
      { key: 'bestPractices',  icon: '🔒', name: 'Best Practices' },
      { key: 'seo',            icon: '🔍', name: 'SEO' },
    ];

    const diagnostics = current.diagnostics || [];
    const hasPrev = previous && previous.overall !== null && previous.overall !== undefined;

    let catCards = cats.map(cat => {
      const cur = current[cat.key];
      const prev = hasPrev ? previous[cat.key] : null;
      const diff = (prev !== null && prev !== undefined && cur !== null) ? cur - prev : null;
      const diffStr = diff !== null
        ? (diff > 0 ? `<span class="report-cat-arrow" style="color:#2E7D32">+${diff}</span>` :
           diff < 0 ? `<span class="report-cat-arrow" style="color:#D32F2F">${diff}</span>` :
                      `<span class="report-cat-arrow" style="color:var(--text-muted)">=</span>`)
        : '';
      const arrowText = (prev !== null && prev !== undefined)
        ? `${prev} → ${cur}`
        : `${cur}`;

      // Find diagnostics for this category
      const catDiags = diagnostics.filter(d => d.category === cat.key);
      let issuesList = '';
      if (catDiags.length > 0) {
        const items = catDiags.map(d => {
          const severity = d.score < 50 ? 'fail' : 'warn';
          let detail = d.title;
          if (d.savingsMs) detail += ` (−${d.savingsMs}ms)`;
          if (d.savingsKb) detail += ` (−${d.savingsKb}KB)`;
          if (d.affectedElements) detail += ` · ${d.affectedElements} element${d.affectedElements > 1 ? 's' : ''}`;
          return `<li><span class="report-issue-icon ${severity}">!</span><span>${detail}</span></li>`;
        }).join('');
        issuesList = `<ul class="report-issues">${items}</ul>`;
      } else {
        issuesList = '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">No issues found ✓</div>';
      }

      return `
        <div class="report-cat">
          <div class="report-cat-header">
            <span>${cat.icon} ${cat.name}: ${arrowText}</span>
            ${diffStr}
          </div>
          ${issuesList}
        </div>
      `;
    }).join('');

    const metaHtml = `
      <div class="report-meta">
        Scanned: ${formatDate(current.scannedAt)}
        ${hasPrev ? `<br>Previous: ${formatDate(previous.scannedAt)}` : ''}
      </div>
    `;

    return `
      <div class="report-panel-inner">
        ${catCards}
      </div>
      ${metaHtml}
    `;
  }

  function openGraderModal(prog) {
    graderModal.style.display = 'flex';
    graderModalTitle.innerHTML = `<h2 style="margin:0;font-family:'Source Serif 4',serif;">${prog.programmeName}</h2><p style="margin:4px 0 0;font-size:0.85rem;opacity:0.7;">Lighthouse Performance Report — All Variants</p>`;

    const scores = prog.graderScores || {};
    const prevScores = prog.previousScores || {};
    const hasData = Object.keys(scores).length > 0;

    if (!hasData) {
      graderModalBody.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-muted);">No grader data yet for this programme. Run <code>run_grader.ps1</code> to generate scores.</div>`;
      return;
    }

    // Sort: prototypes first (best first), old site at bottom
    const entries = Object.entries(scores).sort((a, b) => {
      const isLiveA = a[1].url && a[1].url.includes('northstar-learning.example');
      const isLiveB = b[1].url && b[1].url.includes('northstar-learning.example');
      if (isLiveA && !isLiveB) return 1;
      if (!isLiveA && isLiveB) return -1;
      return (b[1].overall || 0) - (a[1].overall || 0);
    });

    // Find best prototype (non-old-website)
    const bestProtoEntry = entries.find(([_, s]) => s.url && !s.url.includes('northstar-learning.example') && s.overall);
    const bestLabel = bestProtoEntry ? bestProtoEntry[0] : null;

    const hasPrev = Object.keys(prevScores).length > 0;

    const rows = entries.map(([label, s], idx) => {
      const isLive = s.url && s.url.includes('northstar-learning.example');
      const isBest = label === bestLabel;
      const prev = prevScores[label] || null;
      const badge = isLive ? ' <span style="font-size:0.65rem;background:#e3f2fd;color:#1565c0;padding:2px 6px;border-radius:8px;font-weight:600;">OLD SITE</span>' : '';
      const bestBadge = isBest ? ' <span style="font-size:0.65rem;background:#e8f5e9;color:#2E7D32;padding:2px 6px;border-radius:8px;font-weight:600;">★ BEST</span>' : '';
      const rowClass = isBest ? 'grader-row-best' : '';
      const rowId = `grader-report-${prog.id}-${idx}`;

      // Overall delta
      const overallDelta = (prev && prev.overall) ? deltaChip(s.overall, prev.overall) : '';
      // Previous overall
      const prevOverallText = (prev && prev.overall) ? `<div class="score-prev">was ${prev.overall}</div>` : '';

      return `
        <tr class="${rowClass}" style="border-bottom:1px solid var(--border);">
          <td style="padding:10px 12px;font-weight:${isBest?'700':'500'};font-size:0.9rem;">${label}${badge}${bestBadge}</td>
          <td style="padding:10px 12px;text-align:center;">
            ${scoreChip(s.overall)}${overallDelta}
            ${prevOverallText}
          </td>
          <td style="padding:10px 12px;text-align:center;">${scoreChip(s.performance)}</td>
          <td style="padding:10px 12px;text-align:center;">${scoreChip(s.accessibility)}</td>
          <td style="padding:10px 12px;text-align:center;">${scoreChip(s.bestPractices)}</td>
          <td style="padding:10px 12px;text-align:center;">${scoreChip(s.seo)}</td>
          <td style="padding:10px 12px;text-align:center;">
            <button class="report-toggle-btn" data-report-id="${rowId}">📋 Why?</button>
          </td>
        </tr>
        <tr>
          <td colspan="7" style="padding:0;">
            <div class="report-panel" id="${rowId}">
              ${buildReportPanel(label, s, prev)}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    graderModalBody.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <p style="font-size:0.82rem;color:var(--text-muted);margin:0;">Scores out of 100. Prototypes sorted best-first. ${hasPrev ? 'Δ shows change from previous scan.' : '<em>No previous scan data yet — run grader again to see deltas.</em>'}</p>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
          <thead>
            <tr style="background:var(--bg-dark);color:var(--text-light);">
              <th style="padding:12px;text-align:left;font-weight:600;">Variant</th>
              <th style="padding:12px;text-align:center;">Overall</th>
              <th style="padding:12px;text-align:center;">⚡ Perf</th>
              <th style="padding:12px;text-align:center;">♿ A11y</th>
              <th style="padding:12px;text-align:center;">🔒 BP</th>
              <th style="padding:12px;text-align:center;">🔍 SEO</th>
              <th style="padding:12px;text-align:center;">Report</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p style="margin-top:1rem;font-size:0.78rem;color:var(--text-muted);">N/A = Scan failed (timeout or error). Run <code>run_grader.ps1</code> to refresh all scores.</p>
    `;

    // Attach report panel toggle listeners
    graderModalBody.querySelectorAll('.report-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const panelId = btn.getAttribute('data-report-id');
        const panel = document.getElementById(panelId);
        if (panel) {
          const isOpen = panel.classList.contains('open');
          // Close all other panels first
          graderModalBody.querySelectorAll('.report-panel.open').forEach(p => p.classList.remove('open'));
          if (!isOpen) {
            panel.classList.add('open');
            btn.textContent = '✕ Close';
          } else {
            btn.textContent = '📋 Why?';
          }
          // Reset all other button texts
          graderModalBody.querySelectorAll('.report-toggle-btn').forEach(b => {
            if (b !== btn) b.textContent = '📋 Why?';
          });
        }
      });
    });
  }

  graderModalClose.addEventListener('click', () => { graderModal.style.display = 'none'; });
  graderModalBack.addEventListener('click',  () => { graderModal.style.display = 'none'; });
  graderModal.addEventListener('click', (e) => { if (e.target === graderModal) graderModal.style.display = 'none'; });

  // ── FOLDER VIEW NAVIGATION LOGIC ─────────────────────────────────────────
  function showHomeView() {
    homeView.style.display = 'grid';
    northstarView.style.display = 'none';
    openCoursesView.style.display = 'none';
    breadcrumb.style.display = 'none';
    sidebarNav.innerHTML = ''; // clear sidebar
  }

  folderNorthstar.addEventListener('click', () => {
    homeView.style.display = 'none';
    openCoursesView.style.display = 'none';
    northstarView.style.display = 'block';
    breadcrumb.style.display = 'block';
    renderGrid();
  });

  folderOpenCourses.addEventListener('click', () => {
    homeView.style.display = 'none';
    northstarView.style.display = 'none';
    openCoursesView.style.display = 'block';
    breadcrumb.style.display = 'block';
    sidebarNav.innerHTML = '';
  });

  backToHome.addEventListener('click', (e) => {
    e.preventDefault();
    showHomeView();
  });

  // ── INIT ─────────────────────────────────────────────────────────────────
  // We no longer render the grid immediately, we wait for folder click
  showHomeView();
  
  // Sidebar toggle
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main-content');
    if (sidebar.style.display === 'none') {
      sidebar.style.display = 'flex';
      main.style.marginLeft = '260px';
    } else {
      sidebar.style.display = 'none';
      main.style.marginLeft = '0';
    }
  });
});
