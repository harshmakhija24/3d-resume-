document.addEventListener('DOMContentLoaded', () => {

    const views = {
        hawkeye: document.getElementById('hawkeye-view'),
        projectDetail: document.getElementById('project-detail-view'),
        userLedger: document.getElementById('user-ledger-view'),
        bottleneckDetail: document.getElementById('bottleneck-detail-view'),
        milestoneDetail: document.getElementById('milestone-detail-view'),
        velocityDetail: document.getElementById('velocity-detail-view'),
        teamOverview: document.getElementById('team-overview-view'),
        pmInsights: document.getElementById('pm-insights-view'),
        unscheduledDetail: document.getElementById('unscheduled-detail-view'),
        scratchpad: document.getElementById('scratchpad-view'),
        milestonesDashboard: document.getElementById('milestones-dashboard-view')
    };

    let lastLedgerOrigin = 'projectDetail';
    let lastTeamOrigin = 'hawkeye';
    let activeLoaderTimer = null;
    let globalMilestonesCache = [];
    let currentLedgerTasks = [];
    let currentCopilotProjectId = null;
    let currentCopilotProjectName = null;
    let copilotHistory = [];

    const navItems = document.querySelectorAll('.nav-item');

    function switchView(viewId) {
        Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });
        if (views[viewId]) {
            views[viewId].style.display = 'block';
            views[viewId].style.animation = 'fadeIn 0.3s ease-out';
            if (viewId === 'hawkeye') loadHawkeyeData();
            if (viewId === 'teamOverview') loadTeamOverview();
            if (viewId === 'pmInsights') loadPMInsights();
            if (viewId === 'scratchpad') loadScratchpad();
            if (viewId === 'milestonesDashboard') loadMilestonesDashboard();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            switchView(item.dataset.view);
        });
    });

    // BACK NAVIGATION
    document.getElementById('back-to-hawkeye-1').addEventListener('click', () => switchView(lastTeamOrigin));
    document.getElementById('back-to-hawkeye-2').addEventListener('click', () => switchView('hawkeye'));
    document.getElementById('back-to-hawkeye-3').addEventListener('click', () => {
        document.getElementById('milestone-filters').style.display = 'none';
        switchView('hawkeye');
    });
    document.getElementById('back-to-team').addEventListener('click', () => {
        document.getElementById('ledger-filters').style.display = 'none';
        switchView(lastLedgerOrigin);
    });
    if (document.getElementById('back-to-hawkeye-5')) document.getElementById('back-to-hawkeye-5').addEventListener('click', () => switchView('hawkeye'));
    if (document.getElementById('back-to-hawkeye-6')) document.getElementById('back-to-hawkeye-6').addEventListener('click', () => switchView('hawkeye'));

    document.getElementById('bottleneck-trigger').addEventListener('click', () => loadGlobalBottlenecks());
    document.getElementById('unscheduled-trigger').addEventListener('click', () => loadUnscheduledDetail());
    document.getElementById('velocity-trigger').addEventListener('click', () => loadVelocityDetail());
    document.getElementById('milestone-trigger').addEventListener('click', () => {
        switchView('milestoneDetail');
        document.getElementById('milestone-filters').style.display = 'flex';
        renderMilestoneTable(globalMilestonesCache);
        resetFilters('milestone-filters');
    });
    document.getElementById('back-to-hawkeye-4').addEventListener('click', () => switchView('hawkeye'));

    function resetFilters(containerId) {
        const container = document.getElementById(containerId);
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        container.querySelector('.filter-btn[data-status="All"]').classList.add('active');
    }

    // PERCENTAGE LOADER
    function runLoader(loaderContainerId, pctId, barId, tableWrapperId, durationMs, onComplete) {
        const loaderDiv = document.getElementById(loaderContainerId);
        const tableDiv = document.getElementById(tableWrapperId);
        const pctEl = document.getElementById(pctId);
        const barEl = document.getElementById(barId);

        tableDiv.style.opacity = '0';
        setTimeout(() => tableDiv.style.display = 'none', 50);
        loaderDiv.style.display = 'block';
        pctEl.innerText = '0%';
        barEl.style.width = '0%';

        let current = 0;
        const intervalTime = 30;
        const increment = 100 / (durationMs / intervalTime);
        if (activeLoaderTimer) { clearInterval(activeLoaderTimer); activeLoaderTimer = null; }
        activeLoaderTimer = setInterval(() => {
            current += increment;
            if (current >= 100) {
                current = 100;
                clearInterval(activeLoaderTimer);
                activeLoaderTimer = null;
                pctEl.innerText = '100%';
                barEl.style.width = '100%';
                setTimeout(() => {
                    loaderDiv.style.display = 'none';
                    tableDiv.style.display = 'block';
                    tableDiv.style.opacity = '1';
                    onComplete();
                }, 150);
            } else {
                pctEl.innerText = Math.floor(current) + '%';
                barEl.style.width = current + '%';
            }
        }, intervalTime);
    }

    // ============================================
    // LAYER 1: HAWKEYE
    // ============================================
    let allProjectsCache = [];

    const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };

    function renderProjectTable() {
        const statusFilter = document.getElementById('filter-status').value;
        const overdueSort = document.getElementById('sort-overdue').value;
        const riskSort = document.getElementById('sort-risk').value;

        let filtered = [...allProjectsCache];
        if (statusFilter !== 'All') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (riskSort !== 'none') {
            filtered.sort((a, b) => {
                const diff = (riskOrder[a.bottleneck_risk] || 0) - (riskOrder[b.bottleneck_risk] || 0);
                return riskSort === 'desc' ? -diff : diff;
            });
        }
        if (overdueSort !== 'none') {
            filtered.sort((a, b) => {
                const diff = a.overdue_count - b.overdue_count;
                return overdueSort === 'desc' ? -diff : diff;
            });
        }

        const tbody = document.querySelector('#projects-table tbody');
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding:24px;">No projects match current filters.</td></tr>';
            return;
        }

        filtered.forEach(project => {
            const tr = document.createElement('tr');
            let badgeClass = 'status-low';
            if (project.bottleneck_risk === 'High') badgeClass = 'status-high';
            if (project.bottleneck_risk === 'Medium') badgeClass = 'status-med';

            const overdueDisplay = project.overdue_count > 0
                ? `<span style="color:var(--danger-red); font-weight:bold;">${project.overdue_count}</span>`
                : `<span style="color:var(--success-green);">0</span>`;

            const aiBtn = project.f_active
                ? `<button class="copilot-row-btn" data-pid="${project.id}" data-pname="${project.name}" title="Ask Senior PM about this project" onclick="event.stopPropagation();">👨‍💼 Senior PM</button>`
                : '';

            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${project.color}"></div>
                        <strong style="color: #f8fafc">${project.name}</strong>
                    </div>
                </td>
                <td><span style="color: ${project.status === 'Active' ? 'var(--success-green)' : 'var(--text-tertiary)'}; font-weight:500;">${project.status}</span></td>
                <td><span style="color: var(--text-secondary);">${project.team_size}</span></td>
                <td>${overdueDisplay}</td>
                <td><span class="status-badge ${badgeClass}">${project.bottleneck_risk}</span></td>
                <td>${aiBtn}</td>
            `;
            tr.addEventListener('click', () => {
                if (project.f_active) {
                    lastTeamOrigin = 'hawkeye';
                    loadProjectTeam(project.id, project.name);
                } else {
                    lastTeamOrigin = 'hawkeye';
                    loadProjectTeam(project.id, project.name);
                }
            });

            // Wire AI PM button
            const btn = tr.querySelector('.copilot-row-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openCopilot(project.id, project.name);
                });
            }

            tbody.appendChild(tr);
        });
    }

    document.getElementById('filter-status').addEventListener('change', renderProjectTable);
    document.getElementById('sort-overdue').addEventListener('change', renderProjectTable);
    document.getElementById('sort-risk').addEventListener('change', renderProjectTable);
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('filter-status').value = 'All';
        document.getElementById('sort-overdue').value = 'none';
        document.getElementById('sort-risk').value = 'none';
        renderProjectTable();
    });

    const loadHawkeyeData = async () => {
        try {
            const response = await fetch('api.php?action=overview');
            const result = await response.json();

            if (result.success) {
                allProjectsCache = result.data;

                let activeCount = 0, archivedCount = 0;
                allProjectsCache.forEach(p => {
                    if (p.status === 'Active') activeCount++;
                    else archivedCount++;
                });

                document.getElementById('proj-total').innerText = allProjectsCache.length;
                document.getElementById('proj-active').innerText = activeCount;
                document.getElementById('proj-archived').innerText = archivedCount;

                if (result.velocity) {
                    document.getElementById('vel-7d').innerText = result.velocity.last_7_days;
                    document.getElementById('vel-30d').innerText = result.velocity.last_30_days;
                }

                document.getElementById('total-bottlenecks').innerText = result.total_bottlenecks || 0;
                document.getElementById('total-unscheduled').innerText = result.total_unscheduled || 0;

                if (result.cache_refreshed_at) {
                    const syncTime = new Date(result.cache_refreshed_at);
                    const timeStr = syncTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                    const dateStr = syncTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    document.getElementById('last-synced').innerText = `Demo snapshot: ${dateStr}, ${timeStr}`;
                }

                renderProjectTable();

                // Milestones
                const msResponse = await fetch('api.php?action=milestones');
                const msResult = await msResponse.json();
                if (msResult.success) {
                    globalMilestonesCache = msResult.data;
                    const compCount = globalMilestonesCache.filter(m => m.status === 'Completed').length;
                    const inProgCount = globalMilestonesCache.filter(m => m.status === 'In Progress').length;
                    const notStartCount = globalMilestonesCache.filter(m => m.status === 'Not Started').length;
                    document.getElementById('ms-total').innerText = globalMilestonesCache.length;
                    document.getElementById('ms-comp').innerText = compCount;
                    document.getElementById('ms-inprogress').innerText = inProgCount;
                    document.getElementById('ms-notstarted').innerText = notStartCount;
                }
            }
        } catch (err) { console.error("Hawkeye load failed:", err); }
    };

    // ============================================
    // MILESTONES DASHBOARD (TOP LEVEL)
    // ============================================
    const loadMilestonesDashboard = async () => {
        try {
            const msResponse = await fetch('api.php?action=milestones');
            const msResult = await msResponse.json();
            if (msResult.success) {
                globalMilestonesCache = msResult.data;
                const compCount = globalMilestonesCache.filter(m => m.status === 'Completed').length;
                const inProgCount = globalMilestonesCache.filter(m => m.status === 'In Progress').length;
                const notStartCount = globalMilestonesCache.filter(m => m.status === 'Not Started').length;

                document.getElementById('md-total').innerText = globalMilestonesCache.length;
                document.getElementById('md-comp').innerText = compCount;
                document.getElementById('md-inprogress').innerText = inProgCount;
                document.getElementById('md-notstarted').innerText = notStartCount;

                let tTotal = 0, tComp = 0, tInProg = 0, tNotStart = 0;
                globalMilestonesCache.forEach(m => {
                    tTotal += (m.tasks_total || 0);
                    tComp += (m.tasks_completed || 0);
                    tInProg += (m.tasks_in_progress || 0);
                    tNotStart += (m.tasks_not_started || 0);
                });

                document.getElementById('md-tasks-total').innerText = tTotal;
                document.getElementById('md-tasks-comp').innerText = tComp;
                document.getElementById('md-tasks-inprogress').innerText = tInProg;
                document.getElementById('md-tasks-notstarted').innerText = tNotStart;

                // Update table headers with totals
                if (document.getElementById('th-tasks-comp'))
                    document.getElementById('th-tasks-comp').innerText = `Tasks Completed (${tComp})`;
                if (document.getElementById('th-tasks-inprog'))
                    document.getElementById('th-tasks-inprog').innerText = `Tasks In Progress (${tInProg})`;
                if (document.getElementById('th-tasks-pending'))
                    document.getElementById('th-tasks-pending').innerText = `T. Pending (${tNotStart})`;

                renderMilestonesDashboardTable(globalMilestonesCache);
            }
        } catch (err) { console.error("Milestones dashboard load failed:", err); }
    };

    function renderMilestonesDashboardTable(milestones) {
        const tbody = document.querySelector('#milestones-dashboard-table tbody');
        tbody.innerHTML = '';
        if (milestones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding:24px;">No milestones available.</td></tr>';
            return;
        }
        milestones.forEach(m => {
            const tr = document.createElement('tr');
            let mBadge = 'status-low';
            if (m.status === 'Completed') mBadge = 'status-ontime';
            else if (m.status === 'In Progress') mBadge = 'status-med';
            else mBadge = 'status-high';

            const overdueTag = m.is_overdue ? `<span style="font-size:10px; color:var(--danger-red); margin-left:6px;">⚠ Overdue (${m.days_overdue}d)</span>` : '';

            let daysToDueDateText = '--';
            if (m.due_date && m.due_date !== '--') {
                const parts = m.due_date.split('-');
                if (parts.length === 3) {
                    const dueTime = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diffTime = dueTime - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (m.status === 'Completed') {
                        daysToDueDateText = '-';
                    } else if (diffDays > 0) {
                        daysToDueDateText = `<span style="color:var(--text-primary); font-weight:500;">${diffDays} Days</span>`;
                    } else if (diffDays === 0) {
                        daysToDueDateText = `<span style="color:#f59e0b; font-weight:bold;">Due Today</span>`;
                    } else {
                        daysToDueDateText = `<span style="color:var(--danger-red); font-weight:bold;">${Math.abs(diffDays)} Days Late</span>`;
                    }
                }
            }

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${m.title}</strong>${overdueTag}</td>
                <td><span style="color:var(--text-secondary)">${m.project}</span></td>
                <td><span class="status-badge" style="background:rgba(16,185,129,0.1); color:var(--success-green); padding: 4px 12px; font-size: 13px;">${m.tasks_completed || 0}</span></td>
                <td><span class="status-badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; padding: 4px 12px; font-size: 13px;">${m.tasks_in_progress || 0}</span></td>
                <td><span class="status-badge" style="background:rgba(239,68,68,0.1); color:var(--danger-red); padding: 4px 12px; font-size: 13px;">${m.tasks_not_started || 0}</span></td>
                <td>${daysToDueDateText}</td>
                <td><span class="status-badge ${mBadge}">${m.status}</span></td>
            `;
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => {
                lastTeamOrigin = 'milestonesDashboard';
                loadProjectTeam(m.project_id, m.project);
            });
            tbody.appendChild(tr);
        });
    }

    // ============================================
    // MILESTONE TABLE + FILTER
    // ============================================
    function renderMilestoneTable(milestones) {
        const tbody = document.querySelector('#global-milestone-table tbody');
        tbody.innerHTML = '';
        if (milestones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding:24px;">No milestones match this filter.</td></tr>';
            return;
        }
        milestones.forEach(m => {
            const tr = document.createElement('tr');
            let mBadge = 'status-med';
            if (m.status === 'Completed') mBadge = 'status-ontime';
            else if (m.status === 'In Progress') mBadge = 'status-med';
            else mBadge = 'status-high';

            // Show overdue flag for non-completed milestones past due date
            const today = new Date().toISOString().split('T')[0];
            const isOverdue = m.status !== 'Completed' && m.due_date !== '--' && m.due_date < today;
            const overdueTag = isOverdue ? `<span style="font-size:10px; color:var(--danger-red); margin-left:6px;">⚠ Overdue</span>` : '';

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${m.title}</strong>${overdueTag}</td>
                <td><span style="color:var(--text-secondary)">${m.project}</span></td>
                <td><span style="color:var(--text-secondary)">${m.assignee || '--'}</span></td>
                <td style="color: ${isOverdue ? 'var(--danger-red)' : 'var(--text-secondary)'}; font-variant-numeric: tabular-nums; ${isOverdue ? 'font-weight:bold;' : ''}">${m.due_date}</td>
                <td style="color: ${m.status === 'Completed' ? 'var(--success-green)' : 'var(--text-secondary)'}; font-variant-numeric: tabular-nums;">${m.completed_date}</td>
                <td><span class="status-badge ${mBadge}">${m.status}</span></td>
            `;
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => {
                lastTeamOrigin = 'milestoneDetail';
                document.getElementById('milestone-filters').style.display = 'none';
                loadProjectTeam(m.project_id, m.project);
            });
            tbody.appendChild(tr);
        });
    }

    document.getElementById('milestone-filters').addEventListener('click', e => {
        if (e.target.classList.contains('filter-btn')) {
            resetFilters('milestone-filters');
            e.target.classList.add('active');
            const tgt = e.target.dataset.status;
            if (tgt === 'All') renderMilestoneTable(globalMilestonesCache);
            else renderMilestoneTable(globalMilestonesCache.filter(m => m.status === tgt));
        }
    });

    // ============================================
    // LAYER 2: PROJECT TEAM
    // ============================================
    const loadProjectTeam = async (projectId, projectName) => {
        document.getElementById('drill-project-name').innerText = projectName;
        switchView('projectDetail');

        // Open / update copilot context quietly (don't force-open)
        currentCopilotProjectId = projectId;
        currentCopilotProjectName = projectName;
        const headerEl = document.getElementById('copilot-project-name');
        if (headerEl) headerEl.innerText = projectName;

        runLoader('team-loader', 'team-load-pct', 'team-load-bar', 'team-table-wrapper', 500, async () => {
            const tbody = document.querySelector('#team-drill-table tbody');
            try {
                const response = await fetch(`api.php?action=team&project_id=${projectId}`);
                const result = await response.json();

                if (result.success) {
                    if (result.archived) {
                        document.getElementById('team-subtitle').innerHTML = `This project is <strong style="color:var(--text-primary)">archived</strong>. <a href="${result.demo_url}" target="_blank" style="color:var(--accent-blue); text-decoration:underline;">Demo record — external workspace disconnected</a>`;
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding:24px;">Archived demo project — historical sample data is shown locally for this portfolio.</td></tr>';
                        document.getElementById('priority-dist').style.display = 'none';
                        return;
                    }

                    document.getElementById('team-subtitle').innerText = 'Review individual task loads. Click any member to view their complete task ledger.';

                    if (result.priority_distribution) {
                        const pd = result.priority_distribution;
                        document.getElementById('pd-high').innerText = `${pd.high} High Priority`;
                        document.getElementById('pd-med').innerText = `${pd.medium} Medium`;
                        document.getElementById('pd-low').innerText = `${pd.low} Low/None`;
                        document.getElementById('priority-dist').style.display = 'flex';
                    }

                    tbody.innerHTML = '';
                    result.data.forEach(user => {
                        const tr = document.createElement('tr');
                        let riskClass = 'status-low';
                        if (user.bottleneck === 'High') riskClass = 'status-high';
                        else if (user.bottleneck === 'Medium') riskClass = 'status-med';

                        const overdueDisplay = user.overdue_count > 0
                            ? `<span style="color:var(--danger-red); font-weight:bold;">${user.overdue_count}</span>`
                            : `<span style="color:var(--success-green);">0</span>`;

                        tr.innerHTML = `
                            <td><strong style="color: #f8fafc">${user.name}</strong></td>
                            <td><span style="color:var(--text-secondary)">${user.role}</span></td>
                            <td><span class="status-badge" style="background:rgba(16,185,129,0.1); color:var(--success-green); padding: 4px 12px; font-size: 13px;">${user.tasks_completed}</span></td>
                            <td><span class="status-badge" style="background:rgba(239,68,68,0.1); color:var(--danger-red); padding: 4px 12px; font-size: 13px;">${user.tasks_pending}</span></td>
                            <td>${overdueDisplay}</td>
                            <td><span class="status-badge ${riskClass}">${user.bottleneck}</span></td>
                        `;
                        tr.addEventListener('click', () => {
                            lastLedgerOrigin = 'projectDetail';
                            loadUserLedger(user.id, user.name, projectId);
                        });
                        tbody.appendChild(tr);
                    });
                }
            } catch (err) { console.error("Team load error:", err); }
        });
    };

    // ============================================
    // LAYER 3: TASK LEDGER
    // ============================================
    const loadUserLedger = async (userId, userName, projectId) => {
        document.getElementById('drill-user-name').innerText = userName;
        document.getElementById('ledger-filters').style.display = 'none';
        resetFilters('ledger-filters');
        switchView('userLedger');

        runLoader('ledger-loader', 'ledger-load-pct', 'ledger-load-bar', 'ledger-table-wrapper', 400, async () => {
            try {
                const response = await fetch(`api.php?action=user_tasks&user_id=${userId}&project_id=${projectId}`);
                const result = await response.json();
                if (result.success) {
                    currentLedgerTasks = result.data;
                    document.getElementById('ledger-filters').style.display = 'flex';
                    renderLedgerTable(currentLedgerTasks);
                }
            } catch (err) { console.error("Ledger error:", err); }
        });
    };

    function renderLedgerTable(tasks) {
        const tbody = document.querySelector('#task-ledger-table tbody');
        tbody.innerHTML = '';
        if (tasks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-secondary); padding:24px;">No tasks match this filter.</td></tr>';
            return;
        }

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            let deadlineBadge = task.missed_deadline ? 'status-missed' : 'status-ontime';
            let deadlineText = task.missed_deadline ? '⚠ Missed' : '✓ On Track';

            let priBadge = 'status-low';
            if (task.priority === 'High') priBadge = 'status-high';
            else if (task.priority === 'Medium') priBadge = 'status-med';

            const linkIcon = task.url
                ? `<a href="${task.url}" target="_blank" style="color:var(--accent-blue); text-decoration:none; font-size:16px;" title="Open demo record">↗</a>`
                : '--';

            let notesDisplay = task.notes || 'No notes';
            if (notesDisplay.length > 50) notesDisplay = notesDisplay.substring(0, 50) + '...';

            let daysToDueDateText = '--';
            if (task.due_date && task.due_date !== '--') {
                const parts = task.due_date.split('-');
                if (parts.length === 3) {
                    const dueTime = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diffTime = dueTime - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (task.status === 'Completed') {
                        daysToDueDateText = '-';
                    } else if (diffDays > 0) {
                        daysToDueDateText = `<span style="color:var(--text-primary); font-weight:500;">${diffDays} Days</span>`;
                    } else if (diffDays === 0) {
                        daysToDueDateText = `<span style="color:#f59e0b; font-weight:bold;">Due Today</span>`;
                    } else {
                        daysToDueDateText = `<span style="color:var(--danger-red); font-weight:bold;">${Math.abs(diffDays)} Days Late</span>`;
                    }
                }
            }

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${task.title}</strong></td>
                <td><span style="color:var(--text-secondary)">${task.status}</span></td>
                <td><span class="status-badge ${priBadge}">${task.priority}</span></td>
                <td style="color: var(--text-secondary); font-variant-numeric: tabular-nums;">${task.start_date}</td>
                <td style="font-variant-numeric: tabular-nums; ${task.missed_deadline ? 'color:var(--danger-red); font-weight:bold;' : 'color:var(--text-secondary);'}">${task.due_date}</td>
                <td>${daysToDueDateText}</td>
                <td><span class="status-badge ${deadlineBadge}">${deadlineText}</span></td>
                <td><span style="color:var(--text-secondary); font-size:12px; font-style:italic;" title="${task.notes}">${notesDisplay}</span></td>
                <td>${linkIcon}</td>
            `;
            tr.style.cursor = 'default';
            tbody.appendChild(tr);
        });
    }

    document.getElementById('ledger-filters').addEventListener('click', e => {
        if (e.target.classList.contains('filter-btn')) {
            resetFilters('ledger-filters');
            e.target.classList.add('active');
            const statusTarget = e.target.dataset.status;
            if (statusTarget === 'All') renderLedgerTable(currentLedgerTasks);
            else renderLedgerTable(currentLedgerTasks.filter(t => t.status === statusTarget));
        }
    });

    // ============================================
    // BOTTLENECK VIEW
    // ============================================
    let allBottlenecksCache = [];

    function renderBottleneckTable() {
        const projectFilter = document.getElementById('bn-filter-project').value;
        const daysSort = document.getElementById('bn-sort-days').value;
        const impactFilter = document.getElementById('bn-filter-impact').value;

        let filtered = [...allBottlenecksCache];
        if (projectFilter !== 'All') filtered = filtered.filter(b => b.project === projectFilter);
        if (impactFilter !== 'All') filtered = filtered.filter(b => b.impact === impactFilter);

        filtered.sort((a, b) => daysSort === 'desc' ? b.days_late - a.days_late : a.days_late - b.days_late);

        document.getElementById('bottleneck-live-count').innerText = `(${filtered.length} of ${allBottlenecksCache.length} demo overdue)`;
        document.getElementById('bn-showing-count').innerText = `Showing ${filtered.length} overdue tasks`;

        const tbody = document.querySelector('#global-bottleneck-table tbody');
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--success-green); padding:24px;">🎉 No overdue tasks match these filters.</td></tr>';
            return;
        }

        filtered.forEach(blocker => {
            const tr = document.createElement('tr');
            let impactClass = 'status-med';
            if (blocker.impact === 'Critical') impactClass = 'status-missed';
            else if (blocker.impact === 'High') impactClass = 'status-high';

            let priBadge = 'status-low';
            if (blocker.priority === 'High') priBadge = 'status-high';
            else if (blocker.priority === 'Medium') priBadge = 'status-med';

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${blocker.task_name}</strong></td>
                <td>${blocker.assignee}</td>
                <td><span style="color:var(--text-secondary)">${blocker.project}</span></td>
                <td><span class="status-badge ${priBadge}">${blocker.priority}</span></td>
                <td style="color:var(--danger-red); font-weight:bold;">${blocker.days_late} Days</td>
                <td><span class="status-badge ${impactClass}">${blocker.impact}</span></td>
            `;
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => {
                lastLedgerOrigin = 'bottleneckDetail';
                loadUserLedger(blocker.user_id, blocker.assignee, blocker.project_id);
            });
            tbody.appendChild(tr);
        });
    }

    document.getElementById('bn-filter-project').addEventListener('change', renderBottleneckTable);
    document.getElementById('bn-sort-days').addEventListener('change', renderBottleneckTable);
    document.getElementById('bn-filter-impact').addEventListener('change', renderBottleneckTable);
    document.getElementById('bn-reset-filters').addEventListener('click', () => {
        document.getElementById('bn-filter-project').value = 'All';
        document.getElementById('bn-sort-days').value = 'desc';
        document.getElementById('bn-filter-impact').value = 'All';
        renderBottleneckTable();
    });

    const loadGlobalBottlenecks = async () => {
        switchView('bottleneckDetail');
        const tbody = document.querySelector('#global-bottleneck-table tbody');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading demo overdue data...</td></tr>';

        try {
            const response = await fetch('api.php?action=bottlenecks');
            const result = await response.json();
            if (result.success) {
                allBottlenecksCache = result.data;

                const projectSelect = document.getElementById('bn-filter-project');
                const uniqueProjects = [...new Set(allBottlenecksCache.map(b => b.project))].sort();
                projectSelect.innerHTML = '<option value="All" style="background:#1e293b; color:#f1f5f9;">All Projects</option>';
                uniqueProjects.forEach(pName => {
                    const opt = document.createElement('option');
                    opt.value = pName;
                    opt.textContent = pName;
                    opt.style.background = '#1e293b';
                    opt.style.color = '#f1f5f9';
                    projectSelect.appendChild(opt);
                });

                document.getElementById('bn-sort-days').value = 'desc';
                document.getElementById('bn-filter-impact').value = 'All';
                renderBottleneckTable();
            }
        } catch (err) { console.error("Bottleneck load error:", err); }
    };

    // ============================================
    // VELOCITY DETAIL VIEW
    // ============================================
    let allVelocityCache = [];

    function renderVelocityTable() {
        const periodFilter = document.getElementById('vel-filter-period').value;
        const projectFilter = document.getElementById('vel-filter-project').value;
        const priorityFilter = document.getElementById('vel-filter-priority').value;

        let filtered = [...allVelocityCache];
        if (periodFilter === '7d') filtered = filtered.filter(t => t.period === '7d');
        else if (periodFilter === '30d') filtered = filtered.filter(t => t.period === '30d');
        if (projectFilter !== 'All') filtered = filtered.filter(t => t.project === projectFilter);
        if (priorityFilter !== 'All') filtered = filtered.filter(t => t.priority === priorityFilter);

        document.getElementById('velocity-live-count').innerText = `(${filtered.length} of ${allVelocityCache.length} completed)`;
        document.getElementById('vel-showing-count').innerText = `Showing ${filtered.length} completed tasks`;

        const tbody = document.querySelector('#velocity-detail-table tbody');
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-secondary); padding:24px;">No completed tasks match these filters.</td></tr>';
            return;
        }

        filtered.forEach(task => {
            const tr = document.createElement('tr');
            let priBadge = 'status-low';
            if (task.priority === 'High') priBadge = 'status-high';
            else if (task.priority === 'Medium') priBadge = 'status-med';

            const deliveryBadge = task.was_late
                ? '<span class="status-badge status-missed">⚠ Late</span>'
                : '<span class="status-badge status-ontime">✓ On Time</span>';

            const linkIcon = task.url
                ? `<a href="${task.url}" target="_blank" style="color:var(--accent-blue); text-decoration:none; font-size:16px;" title="Open demo record">↗</a>`
                : '--';

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${task.title}</strong></td>
                <td><span style="color:var(--text-secondary)">${task.assignee}</span></td>
                <td><span style="color:var(--text-secondary)">${task.project}</span></td>
                <td><span class="status-badge ${priBadge}">${task.priority}</span></td>
                <td style="color:var(--success-green); font-variant-numeric: tabular-nums;">${task.completed_date}</td>
                <td style="color:var(--text-secondary); font-variant-numeric: tabular-nums;">${task.due_date}</td>
                <td>${deliveryBadge}</td>
                <td>${linkIcon}</td>
            `;
            tr.style.cursor = 'default';
            tbody.appendChild(tr);
        });
    }

    document.getElementById('vel-filter-period').addEventListener('change', renderVelocityTable);
    document.getElementById('vel-filter-project').addEventListener('change', renderVelocityTable);
    document.getElementById('vel-filter-priority').addEventListener('change', renderVelocityTable);
    document.getElementById('vel-reset-filters').addEventListener('click', () => {
        document.getElementById('vel-filter-period').value = 'All';
        document.getElementById('vel-filter-project').value = 'All';
        document.getElementById('vel-filter-priority').value = 'All';
        renderVelocityTable();
    });

    const loadVelocityDetail = async () => {
        switchView('velocityDetail');
        const tbody = document.querySelector('#velocity-detail-table tbody');
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading completed tasks...</td></tr>';

        try {
            const response = await fetch('api.php?action=velocity');
            const result = await response.json();
            if (result.success) {
                allVelocityCache = result.data;

                const projectSelect = document.getElementById('vel-filter-project');
                const uniqueProjects = [...new Set(allVelocityCache.map(t => t.project))].sort();
                projectSelect.innerHTML = '<option value="All" style="background:#1e293b; color:#f1f5f9;">All Projects</option>';
                uniqueProjects.forEach(pName => {
                    const opt = document.createElement('option');
                    opt.value = pName;
                    opt.textContent = pName;
                    opt.style.background = '#1e293b';
                    opt.style.color = '#f1f5f9';
                    projectSelect.appendChild(opt);
                });

                document.getElementById('vel-filter-period').value = 'All';
                document.getElementById('vel-filter-priority').value = 'All';
                renderVelocityTable();
            }
        } catch (err) { console.error("Velocity load error:", err); }
    };

    // ============================================
    // TEAM OVERVIEW VIEW
    // ============================================
    const loadTeamOverview = async () => {
        const container = document.getElementById('team-cards-container');
        if (!container.innerHTML) container.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding: 20px;">Loading team data...</div>';

        try {
            const res = await fetch('api.php?action=teams');
            const result = await res.json();
            if (result.success) {
                container.innerHTML = '';
                let totalMembers = 0;

                Object.entries(result.data).forEach(([roleName, data]) => {
                    totalMembers += data.members.length;
                    const card = document.createElement('div');
                    card.className = 'team-card';
                    card.dataset.team = roleName;
                    card.innerHTML = `
                        <div class="team-name">${roleName}</div>
                        <div class="team-stats">
                            <div><span class="team-stat-value">${data.members.length}</span><span style="font-size:11px;">Members</span></div>
                            <div><span class="team-stat-value" style="color:var(--text-secondary)">${data.total_pending}</span><span style="font-size:11px;">Pending</span></div>
                            <div><span class="team-stat-value" style="${data.total_overdue > 0 ? 'color:var(--danger-red)' : ''}">${data.total_overdue}</span><span style="font-size:11px;">Overdue</span></div>
                        </div>
                    `;
                    card.addEventListener('click', () => renderTeamMembersTable(roleName, data.members));
                    container.appendChild(card);
                });
                document.getElementById('team-overview-count').innerText = `(${totalMembers} members)`;
            }
        } catch (err) { console.error("Team overview error:", err); }
    };

    function renderTeamMembersTable(roleName, members) {
        document.getElementById('team-members-section').style.display = 'block';
        document.getElementById('team-members-title').innerText = `${roleName} Members`;
        const tbody = document.querySelector('#team-members-table tbody');
        tbody.innerHTML = '';

        members.sort((a, b) => b.overdue_count - a.overdue_count);

        members.forEach(m => {
            const tr = document.createElement('tr');
            let riskClass = 'status-low';
            if (m.bottleneck === 'High') riskClass = 'status-high';
            else if (m.bottleneck === 'Medium') riskClass = 'status-med';

            const overdisp = m.overdue_count > 0 ? `<span style="color:var(--danger-red); font-weight:bold">${m.overdue_count}</span>` : `<span style="color:var(--success-green)">0</span>`;

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${m.name}</strong></td>
                <td><span style="color:var(--text-secondary); font-size:12px;">${(m.projects || []).join(', ')}</span></td>
                <td><span class="status-badge" style="background:rgba(16,185,129,0.1); color:var(--success-green);">${m.tasks_completed}</span></td>
                <td><span class="status-badge" style="background:rgba(239,68,68,0.1); color:var(--danger-red);">${m.tasks_pending}</span></td>
                <td>${overdisp}</td>
                <td><span class="status-badge ${riskClass}">${m.bottleneck}</span></td>
            `;
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => {
                lastLedgerOrigin = 'teamOverview';
                loadUserLedger(m.id, m.name, 'all');
            });
            tbody.appendChild(tr);
        });
        document.getElementById('team-members-section').scrollIntoView({ behavior: 'smooth' });
    }

    // ============================================
    // UNSCHEDULED DETAIL VIEW
    // ============================================
    let allUnscheduledCache = [];

    function renderUnscheduledTable() {
        const projectFilter = document.getElementById('unsched-filter-project').value;
        const priorityFilter = document.getElementById('unsched-filter-priority').value;

        let filtered = [...allUnscheduledCache];
        if (projectFilter !== 'All') filtered = filtered.filter(t => t.project === projectFilter);
        if (priorityFilter !== 'All') filtered = filtered.filter(t => t.priority === priorityFilter);

        document.getElementById('unscheduled-live-count').innerText = `(${filtered.length} total)`;
        document.getElementById('unsched-showing-count').innerText = `Showing ${filtered.length} unscheduled tasks`;

        const tbody = document.querySelector('#unscheduled-detail-table tbody');
        tbody.innerHTML = '';
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--success-green); padding:24px;">🎉 No unscheduled tasks found.</td></tr>';
            return;
        }

        filtered.forEach(task => {
            const tr = document.createElement('tr');
            let priBadge = 'status-low';
            if (task.priority === 'High') priBadge = 'status-high';
            else if (task.priority === 'Medium') priBadge = 'status-med';

            const linkIcon = task.url ? `<a href="${task.url}" target="_blank" style="color:var(--accent-blue); text-decoration:none; font-size:16px;" title="Open demo record">↗</a>` : '--';

            tr.innerHTML = `
                <td><strong style="color: #f8fafc">${task.title}</strong></td>
                <td>${task.assignee}</td>
                <td><span style="color:var(--text-secondary)">${task.project}</span></td>
                <td><span class="status-badge ${priBadge}">${task.priority}</span></td>
                <td><span style="color:var(--text-secondary)">${task.status}</span></td>
                <td style="color:var(--text-secondary); font-variant-numeric: tabular-nums;">${task.start_date || '--'}</td>
                <td>${linkIcon}</td>
            `;
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', () => {
                lastLedgerOrigin = 'unscheduledDetail';
                loadUserLedger(task.user_id, task.assignee, task.project_id);
            });
            tbody.appendChild(tr);
        });
    }

    if (document.getElementById('unsched-filter-project')) {
        document.getElementById('unsched-filter-project').addEventListener('change', renderUnscheduledTable);
        document.getElementById('unsched-filter-priority').addEventListener('change', renderUnscheduledTable);
        document.getElementById('unsched-reset-filters').addEventListener('click', () => {
            document.getElementById('unsched-filter-project').value = 'All';
            document.getElementById('unsched-filter-priority').value = 'All';
            renderUnscheduledTable();
        });
    }

    const loadUnscheduledDetail = async () => {
        switchView('unscheduledDetail');
        const tbody = document.querySelector('#unscheduled-detail-table tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading tasks...</td></tr>';

        try {
            const res = await fetch('api.php?action=unscheduled');
            const result = await res.json();
            if (result.success) {
                allUnscheduledCache = result.data;
                const projectSelect = document.getElementById('unsched-filter-project');
                const uniqueProjects = [...new Set(allUnscheduledCache.map(t => t.project))].sort();
                if (projectSelect) {
                    projectSelect.innerHTML = '<option value="All" style="background:#1e293b; color:#f1f5f9;">All Projects</option>';
                    uniqueProjects.forEach(pName => {
                        const opt = document.createElement('option');
                        opt.value = pName; opt.textContent = pName;
                        opt.style.background = '#1e293b'; opt.style.color = '#f1f5f9';
                        projectSelect.appendChild(opt);
                    });
                }
                if (document.getElementById('unsched-filter-priority')) document.getElementById('unsched-filter-priority').value = 'All';
                renderUnscheduledTable();
            }
        } catch (err) { console.error("Unscheduled load error:", err); }
    };

    // ============================================
    // PM INSIGHTS VIEW
    // ============================================
    let insightsLoaded = false;

    if (document.getElementById('refresh-insights')) {
        document.getElementById('refresh-insights').addEventListener('click', () => {
            insightsLoaded = false;
            loadPMInsights();
        });
    }

    function formatAIResponse(text) {
        if (!text) return '';
        let html = text;
        // Headings
        html = html.replace(/###\s+(.*$)/gim, '<h3 style="color:var(--accent-blue); font-size:16px; margin-top:20px; margin-bottom:12px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">$1</h3>');
        html = html.replace(/##\s+(.*$)/gim, '<h2 style="color:#f8fafc; font-size:18px; margin-top:24px; margin-bottom:14px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">$1</h2>');

        // Bold, Italics
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f8fafc; font-weight: 600;">$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em style="color:var(--text-secondary);">$1</em>');

        // Lists
        html = html.replace(/^\*\s+(.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 8px;">$1</li>');
        html = html.replace(/^\d+\.\s+(.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 8px; list-style-type: decimal;">$1</li>');
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/<\/li><br>/g, '</li>');
        html = html.replace(/<br><li/g, '<li');

        // Clean up excessive breaks after headings
        html = html.replace(/<\/h3><br>/g, '</h3>');
        html = html.replace(/<\/h2><br>/g, '</h2>');
        return html;
    }

    // --- File Attachment State ---
    let copilotAttachedFile = null;
    let insightsAttachedFile = null;

    // --- Helper to read file as Base64 or Text ---
    async function processFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            if (file.type.startsWith('image/')) {
                reader.onload = (e) => resolve({ type: 'image', name: file.name, data: e.target.result, mimeType: file.type });
            } else {
                reader.onload = (e) => resolve({ type: 'text', name: file.name, data: e.target.result });
            }
            reader.onerror = reject;
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    // --- Global Clear Functions ---
    window.clearCopilotAttachment = () => {
        copilotAttachedFile = null;
        const preview = document.getElementById('copilot-attachment-preview');
        if (preview) preview.style.display = 'none';
        const input = document.getElementById('copilot-file-input');
        if (input) input.value = '';
    };

    window.clearInsightsAttachment = () => {
        insightsAttachedFile = null;
        const preview = document.getElementById('insights-attachment-preview');
        if (preview) preview.style.display = 'none';
        const input = document.getElementById('insights-file-input');
        if (input) input.value = '';
    };

    // --- Initial File Listeners ---
    document.addEventListener('click', e => {
        if (e.target.closest('#copilot-attach-btn')) {
            document.getElementById('copilot-file-input').click();
        }
        if (e.target.closest('#insights-attach-btn')) {
            document.getElementById('insights-file-input').click();
        }
    });

    document.addEventListener('change', async e => {
        if (e.target.id === 'copilot-file-input' && e.target.files.length > 0) {
            const file = e.target.files[0];
            copilotAttachedFile = await processFile(file);
            const preview = document.getElementById('copilot-attachment-preview');
            const nameSpan = document.getElementById('copilot-attachment-name');
            nameSpan.textContent = file.name;
            preview.style.display = 'flex';
        }
        if (e.target.id === 'insights-file-input' && e.target.files.length > 0) {
            const file = e.target.files[0];
            insightsAttachedFile = await processFile(file);
            const preview = document.getElementById('insights-attachment-preview');
            const nameSpan = document.getElementById('insights-attachment-name');
            nameSpan.textContent = file.name;
            preview.style.display = 'flex';
        }
    });

    if (document.getElementById('ai-question-send')) {
        const askBtn = document.getElementById('ai-question-send');
        const askInput = document.getElementById('ai-question-input');
        const micBtn = document.getElementById('ai-mic-btn');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isListening = false;

        if (SpeechRecognition && micBtn) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                isListening = true;
                micBtn.classList.add('listening');
                askInput.placeholder = "Listening... Speak now";
            };
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const currentVal = askInput.value;
                askInput.value = currentVal ? currentVal + " " + transcript : transcript;
            };
            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                askInput.placeholder = "e.g. Which team member has the most overdue tasks?";
            };
            recognition.onend = () => {
                isListening = false;
                micBtn.classList.remove('listening');
                askInput.placeholder = "e.g. Which team member has the most overdue tasks?";
            };
            micBtn.addEventListener('click', () => {
                if (isListening) recognition.stop();
                else { askInput.value = ''; recognition.start(); }
            });
        } else if (micBtn) {
            micBtn.style.display = 'none';
        }

        askBtn.addEventListener('click', async () => {
            const q = askInput.value.trim();
            if (!q) return;

            const ansContainer = document.getElementById('ai-answer-container');
            ansContainer.innerHTML = `<div class="ai-chat-answer"><em>Analyzing project data...</em></div>`;
            askBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('question', q);
                if (insightsAttachedFile) {
                    formData.append('file_data', insightsAttachedFile.data);
                    formData.append('file_name', insightsAttachedFile.name);
                    formData.append('file_type', insightsAttachedFile.type);
                }

                const res = await fetch('api.php?action=insights', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (result.success) {
                    const answerText = result.answer || (typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2));
                    const formatted = formatAIResponse(answerText);
                    ansContainer.innerHTML = `<div class="ai-chat-answer" style="line-height: 1.6; color: var(--text-secondary);"><strong style="color:var(--success-green); font-size: 15px;">Senior Project Manager:</strong><br><br><div style="font-size: 14px; background: rgba(30, 41, 59, 0.4); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">${formatted}</div></div>`;
                } else {
                    ansContainer.innerHTML = `<div class="ai-chat-answer"><em>Error getting answer.</em></div>`;
                }
            } catch (err) {
                ansContainer.innerHTML = `<div class="ai-chat-answer"><em>Error getting answer.</em></div>`;
            }
            askBtn.disabled = false;
            askInput.value = '';
            window.clearInsightsAttachment();
        });

        askInput.addEventListener('keypress', e => { if (e.key === 'Enter') askBtn.click(); });
    }

    const loadPMInsights = async () => {
        if (insightsLoaded) return;
        const container = document.getElementById('insights-container');
        container.innerHTML = `
            <div class="shimmer-line"></div>
            <div class="shimmer-line"></div>
            <div class="shimmer-line"></div>
            <div class="shimmer-line"></div>
        `;
        document.getElementById('ai-answer-container').innerHTML = '';

        try {
            const res = await fetch('api.php?action=insights');
            const result = await res.json();
            if (result.success) {
                insightsLoaded = true;
                // FIX: Badge shows correctly for any working AI source
                const badgeEl = document.getElementById('insights-source-badge');
                if (badgeEl) {
                    badgeEl.innerText = (result.source === 'fallback') ? 'Demo Mode' : 'Portfolio Demo';
                }

                container.innerHTML = '';
                const insights = result.data?.insights || (Array.isArray(result.data) ? result.data : []);
                if (insights.length === 0) {
                    container.innerHTML = '<div style="color:var(--text-secondary); padding:20px;">No insights returned. Try refreshing.</div>';
                    return;
                }
                insights.forEach(insight => {
                    let iconChar = 'ℹ️';
                    if (insight.type === 'risk') iconChar = '🔴';
                    if (insight.type === 'warning') iconChar = '⚠️';
                    if (insight.type === 'success') iconChar = '✅';

                    const card = document.createElement('div');
                    card.className = 'insight-card';
                    card.dataset.type = insight.type;

                    const problemHTML = formatAIResponse(insight.problem || insight.body || 'No problem details available.');
                    const shortTermHTML = formatAIResponse(insight.action_short_term || 'N/A');
                    const longTermHTML = formatAIResponse(insight.action_long_term || 'N/A');

                    card.innerHTML = `
                        <div class="insight-header">
                            <div class="insight-icon">${iconChar}</div>
                            <div class="insight-title">${insight.title || 'Insight'}</div>
                        </div>
                        <div class="insight-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                            <div class="insight-square" style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden;">
                                <h4 style="margin: 0 0 12px 0; color: #f8fafc; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Problem</h4>
                                <div class="formatted-ai-text" style="color: var(--text-secondary); font-size: 14px; line-height: 1.5; overflow-y: auto; padding-right: 4px;">
                                    ${problemHTML}
                                </div>
                            </div>
                            <div class="insight-square" style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden;">
                                <h4 style="margin: 0 0 12px 0; color: #f8fafc; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Action</h4>
                                <div class="formatted-ai-text" style="color: var(--text-secondary); font-size: 14px; line-height: 1.5; flex: 1; overflow-y: auto; padding-right: 4px;">
                                    <div style="margin-bottom: 12px;">
                                        <strong style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Short Term</strong>
                                        <div style="margin-top: 4px;">${shortTermHTML}</div>
                                    </div>
                                    <div>
                                        <strong style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Long Term</strong>
                                        <div style="margin-top: 4px;">${longTermHTML}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        } catch (err) {
            container.innerHTML = `<div style="color:var(--danger-red); padding: 20px;">Failed to load PM insights.</div>`;
        }
    };

    // ============================================
    // SCRATCHPAD
    // ============================================
    const loadScratchpad = async () => {
        try {
            const res = await fetch('api.php?action=get_scratchpad');
            const result = await res.json();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('scratch-date').value = today;
            if (result.success && result.notes && result.notes.length > 0) {
                const todayNote = result.notes.find(n => n.date === today);
                if (todayNote) document.getElementById('scratch-textarea').value = todayNote.text;
            }
        } catch (err) { console.error("Scratchpad load error:", err); }
    };

    if (document.getElementById('save-scratch')) {
        document.getElementById('save-scratch').addEventListener('click', async () => {
            const date = document.getElementById('scratch-date').value;
            const text = document.getElementById('scratch-textarea').value;
            try {
                const res = await fetch('api.php?action=save_scratchpad', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ success: true, notes: [{ date, text }] })
                });
                const result = await res.json();
                document.getElementById('scratch-status').innerText = result.success ? '✓ Saved' : '✗ Error saving';
                setTimeout(() => { document.getElementById('scratch-status').innerText = ''; }, 3000);
            } catch (err) { console.error("Scratchpad save error:", err); }
        });
    }

    if (document.getElementById('copy-scratch')) {
        document.getElementById('copy-scratch').addEventListener('click', () => {
            const text = document.getElementById('scratch-textarea').value;
            navigator.clipboard.writeText(text).then(() => {
                document.getElementById('scratch-status').innerText = '✓ Copied to clipboard';
                setTimeout(() => { document.getElementById('scratch-status').innerText = ''; }, 2000);
            });
        });
    }

    // ============================================
    // AI PM COPILOT
    // ============================================
    const copilotPanel = document.getElementById('ai-copilot-panel');
    const copilotFloatBtn = document.getElementById('copilot-float-btn');
    const copilotCloseBtn = document.getElementById('copilot-close-btn');
    const copilotInput = document.getElementById('copilot-input');
    const copilotSendBtn = document.getElementById('copilot-send-btn');
    const copilotMessages = document.getElementById('copilot-messages');

    function openCopilot(projectId, projectName) {
        currentCopilotProjectId = projectId;
        currentCopilotProjectName = projectName;

        const headerEl = document.getElementById('copilot-project-name');
        if (headerEl) headerEl.innerText = projectName;

        // Clear previous chat if switching project
        if (copilotMessages) {
            copilotMessages.innerHTML = `
                <div class="copilot-msg copilot-msg-ai">
                    <div class="copilot-msg-bubble">
                        👋 Hi ${window.PM_NAME || 'there'}! I'm your AI Co-Project Manager for <strong>${projectName}</strong>. I've reviewed the latest data. Tell me what decisions we need to make today!
                    </div>
                </div>
            `;
        }
        copilotHistory = [];

        if (copilotPanel) {
            copilotPanel.classList.add('open');
            if (copilotFloatBtn) copilotFloatBtn.style.display = 'none';
        }
    }

    function closeCopilot() {
        if (copilotPanel) copilotPanel.classList.remove('open');
        if (copilotFloatBtn) copilotFloatBtn.style.display = 'flex';
    }

    if (copilotFloatBtn) {
        copilotFloatBtn.addEventListener('click', () => {
            if (currentCopilotProjectId) {
                openCopilot(currentCopilotProjectId, currentCopilotProjectName);
            } else {
                // No project selected yet — open with portfolio context
                openCopilot('all', 'Portfolio Overview');
            }
        });
    }

    if (copilotCloseBtn) copilotCloseBtn.addEventListener('click', closeCopilot);

    async function sendCopilotMessage() {
        if (!copilotInput || !copilotMessages) return;
        const msg = copilotInput.value.trim();
        if (!msg) return;

        // Add user message
        let attachmentHtml = '';
        if (copilotAttachedFile) {
            if (copilotAttachedFile.type === 'image') {
                attachmentHtml = `<div class="attachment-bubble"><img src="${copilotAttachedFile.data}" style="max-width:100%; border-radius:4px; margin-bottom:8px;"></div>`;
            } else {
                attachmentHtml = `<div class="attachment-bubble" style="background:rgba(255,255,255,0.05); padding:6px; border-radius:4px; margin-bottom:8px; font-size:12px; border:1px solid rgba(255,255,255,0.1);">📄 ${copilotAttachedFile.name}</div>`;
            }
        }

        copilotMessages.innerHTML += `
            <div class="copilot-msg copilot-msg-user">
                <div class="copilot-msg-bubble">
                    ${attachmentHtml}
                    ${escapeHtml(msg)}
                </div>
            </div>
        `;
        copilotInput.value = '';
        copilotMessages.scrollTop = copilotMessages.scrollHeight;

        // Thinking indicator
        const thinkingId = 'thinking-' + Date.now();
        copilotMessages.innerHTML += `
            <div class="copilot-msg copilot-msg-ai" id="${thinkingId}">
                <div class="copilot-msg-bubble copilot-thinking">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        copilotMessages.scrollTop = copilotMessages.scrollHeight;

        if (copilotSendBtn) copilotSendBtn.disabled = true;

        try {
            const pId = currentCopilotProjectId || 'all';
            const formData = new FormData();
            formData.append('project_id', pId);
            formData.append('message', msg);
            if (copilotAttachedFile) {
                formData.append('file_data', copilotAttachedFile.data);
                formData.append('file_name', copilotAttachedFile.name);
                formData.append('file_type', copilotAttachedFile.type);
            }

            const res = await fetch('api.php?action=ai_pm', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            window.clearCopilotAttachment();

            // Remove thinking bubble
            const thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) thinkingEl.remove();

            const answerText = result.answer || result.data || 'Sorry, I could not get a response.';
            const formatted = formatAIResponse(String(answerText));

            copilotMessages.innerHTML += `
                <div class="copilot-msg copilot-msg-ai">
                    <div class="copilot-msg-bubble">${formatted}</div>
                </div>
            `;
        } catch (err) {
            const thinkingEl = document.getElementById(thinkingId);
            if (thinkingEl) thinkingEl.remove();
            copilotMessages.innerHTML += `
                <div class="copilot-msg copilot-msg-ai">
                    <div class="copilot-msg-bubble" style="color:var(--danger-red);">Failed to get response. Please try again.</div>
                </div>
            `;
        }

        if (copilotSendBtn) copilotSendBtn.disabled = false;
        copilotMessages.scrollTop = copilotMessages.scrollHeight;
    }

    if (copilotSendBtn) copilotSendBtn.addEventListener('click', sendCopilotMessage);
    if (copilotInput) copilotInput.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCopilotMessage(); } });

    // Expose openCopilot globally for row buttons
    window.openCopilot = openCopilot;

    function escapeHtml(text) {
        const el = document.createElement('div');
        el.innerText = text;
        return el.innerHTML;
    }

    // Boot
    loadHawkeyeData();
});
