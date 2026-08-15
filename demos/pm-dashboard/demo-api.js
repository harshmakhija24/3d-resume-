/* Portfolio Demo API
 * All records below are fictionalized sample data for showcase purposes.
 * No external API calls or credentials are used in this file.
 */
(function () {
    'use strict';

    const DAY = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateFromToday = (offset) => {
        const date = new Date(today.getTime() + offset * DAY);
        return date.toISOString().slice(0, 10);
    };

    const projects = [
        {
            id: 'northstar', name: 'Northstar Launch', color: '#5eead4', status: 'Active', f_active: true,
            team_size: 4, user_ids: ['asha', 'kabir', 'meera', 'rohan'], group_name: 'Growth Systems',
            demo_url: '#'
        },
        {
            id: 'signalops', name: 'Signal Ops', color: '#60a5fa', status: 'Active', f_active: true,
            team_size: 3, user_ids: ['kabir', 'naina', 'vikram'], group_name: 'Operations',
            demo_url: '#'
        },
        {
            id: 'horizon', name: 'Horizon Learning', color: '#fbbf24', status: 'Active', f_active: true,
            team_size: 4, user_ids: ['asha', 'meera', 'naina', 'vikram'], group_name: 'Programs',
            demo_url: '#'
        },
        {
            id: 'atlas', name: 'Atlas Research Sprint', color: '#94a3b8', status: 'Archived', f_active: false,
            team_size: 2, user_ids: ['rohan', 'vikram'], group_name: 'Archive',
            demo_url: '#'
        }
    ];

    const users = {
        asha: { id: 'asha', name: 'Asha Menon', role: 'Program Lead', projects: ['Northstar Launch', 'Horizon Learning'] },
        kabir: { id: 'kabir', name: 'Kabir Shah', role: 'Product Manager', projects: ['Northstar Launch', 'Signal Ops'] },
        meera: { id: 'meera', name: 'Meera Iyer', role: 'Design & Research', projects: ['Northstar Launch', 'Horizon Learning'] },
        rohan: { id: 'rohan', name: 'Rohan Batra', role: 'Growth Strategist', projects: ['Northstar Launch', 'Atlas Research Sprint'] },
        naina: { id: 'naina', name: 'Naina Kapoor', role: 'Operations Partner', projects: ['Signal Ops', 'Horizon Learning'] },
        vikram: { id: 'vikram', name: 'Vikram Rao', role: 'Tech & Intelligence', projects: ['Signal Ops', 'Horizon Learning', 'Atlas Research Sprint'] }
    };

    const tasks = [
        { id: 't1', project_id: 'northstar', title: 'Lock the launch narrative', user_id: 'asha', status: 'Completed', priority: 'High', start_date: dateFromToday(-20), due_date: dateFromToday(-12), completed_date: dateFromToday(-13), notes: 'Approved after the final positioning review.', url: '#', missed_deadline: false },
        { id: 't2', project_id: 'northstar', title: 'Instrument activation funnel', user_id: 'kabir', status: 'In Progress', priority: 'High', start_date: dateFromToday(-8), due_date: dateFromToday(-2), completed_date: '--', notes: 'Event taxonomy is ready; QA remains.', url: '#', missed_deadline: true },
        { id: 't3', project_id: 'northstar', title: 'Prepare customer proof panel', user_id: 'meera', status: 'In Progress', priority: 'Medium', start_date: dateFromToday(-6), due_date: dateFromToday(3), completed_date: '--', notes: 'Waiting for two final customer quotes.', url: '#', missed_deadline: false },
        { id: 't4', project_id: 'northstar', title: 'Schedule launch retro', user_id: 'rohan', status: 'Not Started', priority: 'Low', start_date: dateFromToday(0), due_date: '--', completed_date: '--', notes: 'Add after the first week of launch data.', url: '#', missed_deadline: false },
        { id: 't5', project_id: 'northstar', title: 'Ship onboarding email sequence', user_id: 'kabir', status: 'Completed', priority: 'Medium', start_date: dateFromToday(-14), due_date: dateFromToday(-7), completed_date: dateFromToday(-7), notes: 'Delivered on the planned date.', url: '#', missed_deadline: false },
        { id: 't6', project_id: 'signalops', title: 'Define escalation rules', user_id: 'naina', status: 'In Progress', priority: 'High', start_date: dateFromToday(-15), due_date: dateFromToday(-5), completed_date: '--', notes: 'Needs a final decision from operations.', url: '#', missed_deadline: true },
        { id: 't7', project_id: 'signalops', title: 'Build weekly signal digest', user_id: 'vikram', status: 'Completed', priority: 'Medium', start_date: dateFromToday(-18), due_date: dateFromToday(-10), completed_date: dateFromToday(-9), notes: 'Digest is now available to the leadership group.', url: '#', missed_deadline: true },
        { id: 't8', project_id: 'signalops', title: 'Validate alert thresholds', user_id: 'vikram', status: 'In Progress', priority: 'High', start_date: dateFromToday(-3), due_date: dateFromToday(2), completed_date: '--', notes: 'Run one more simulation with the new thresholds.', url: '#', missed_deadline: false },
        { id: 't9', project_id: 'signalops', title: 'Document response playbook', user_id: 'kabir', status: 'Not Started', priority: 'Low', start_date: dateFromToday(0), due_date: '--', completed_date: '--', notes: 'Unscheduled demo task for the next planning block.', url: '#', missed_deadline: false },
        { id: 't10', project_id: 'horizon', title: 'Confirm cohort learning goals', user_id: 'asha', status: 'Completed', priority: 'High', start_date: dateFromToday(-24), due_date: dateFromToday(-16), completed_date: dateFromToday(-16), notes: 'Goals signed off by the program team.', url: '#', missed_deadline: false },
        { id: 't11', project_id: 'horizon', title: 'Review facilitator kit', user_id: 'meera', status: 'In Progress', priority: 'Medium', start_date: dateFromToday(-9), due_date: dateFromToday(-1), completed_date: '--', notes: 'Accessibility review surfaced three updates.', url: '#', missed_deadline: true },
        { id: 't12', project_id: 'horizon', title: 'Publish cohort calendar', user_id: 'naina', status: 'Not Started', priority: 'Medium', start_date: dateFromToday(1), due_date: '--', completed_date: '--', notes: 'Awaiting final venue confirmation.', url: '#', missed_deadline: false },
        { id: 't13', project_id: 'horizon', title: 'Test learning analytics', user_id: 'vikram', status: 'Completed', priority: 'Low', start_date: dateFromToday(-11), due_date: dateFromToday(-4), completed_date: dateFromToday(-5), notes: 'Dashboard validation completed with sample learners.', url: '#', missed_deadline: true },
        { id: 't14', project_id: 'horizon', title: 'Write cohort recap template', user_id: 'meera', status: 'Completed', priority: 'Low', start_date: dateFromToday(-17), due_date: dateFromToday(-11), completed_date: dateFromToday(-11), notes: 'Template is ready for reuse.', url: '#', missed_deadline: false },
        { id: 't15', project_id: 'atlas', title: 'Archive research notes', user_id: 'rohan', status: 'Completed', priority: 'Low', start_date: dateFromToday(-70), due_date: dateFromToday(-60), completed_date: dateFromToday(-60), notes: 'Archived as part of the demo dataset.', url: '#', missed_deadline: false },
        { id: 't16', project_id: 'atlas', title: 'Package sprint readout', user_id: 'vikram', status: 'Completed', priority: 'Medium', start_date: dateFromToday(-68), due_date: dateFromToday(-55), completed_date: dateFromToday(-54), notes: 'Readout shared with the fictional steering group.', url: '#', missed_deadline: true }
    ];

    const milestones = [
        { id: 'm1', title: 'Positioning freeze', project: 'Northstar Launch', project_id: 'northstar', assignee: 'Asha Menon', status: 'Completed', due_date: dateFromToday(-12), completed_date: dateFromToday(-13), is_overdue: false, days_overdue: 0, tasks_total: 4, tasks_completed: 4, tasks_in_progress: 0, tasks_not_started: 0 },
        { id: 'm2', title: 'Launch readiness review', project: 'Northstar Launch', project_id: 'northstar', assignee: 'Kabir Shah', status: 'In Progress', due_date: dateFromToday(4), completed_date: '--', is_overdue: false, days_overdue: 0, tasks_total: 6, tasks_completed: 3, tasks_in_progress: 2, tasks_not_started: 1 },
        { id: 'm3', title: 'Escalation playbook v1', project: 'Signal Ops', project_id: 'signalops', assignee: 'Naina Kapoor', status: 'In Progress', due_date: dateFromToday(-3), completed_date: '--', is_overdue: true, days_overdue: 3, tasks_total: 5, tasks_completed: 2, tasks_in_progress: 2, tasks_not_started: 1 },
        { id: 'm4', title: 'Signal digest pilot', project: 'Signal Ops', project_id: 'signalops', assignee: 'Vikram Rao', status: 'Completed', due_date: dateFromToday(-9), completed_date: dateFromToday(-9), is_overdue: false, days_overdue: 0, tasks_total: 3, tasks_completed: 3, tasks_in_progress: 0, tasks_not_started: 0 },
        { id: 'm5', title: 'Cohort kit ready', project: 'Horizon Learning', project_id: 'horizon', assignee: 'Meera Iyer', status: 'In Progress', due_date: dateFromToday(8), completed_date: '--', is_overdue: false, days_overdue: 0, tasks_total: 7, tasks_completed: 4, tasks_in_progress: 2, tasks_not_started: 1 },
        { id: 'm6', title: 'Program retrospective', project: 'Horizon Learning', project_id: 'horizon', assignee: 'Asha Menon', status: 'Not Started', due_date: dateFromToday(15), completed_date: '--', is_overdue: false, days_overdue: 0, tasks_total: 4, tasks_completed: 0, tasks_in_progress: 0, tasks_not_started: 4 }
    ];

    const projectTasks = (projectId) => tasks.filter(task => task.project_id === projectId);
    const activeTasks = tasks.filter(task => task.project_id !== 'atlas');
    const overdueTasks = activeTasks.filter(task => task.missed_deadline && task.status !== 'Completed');
    const unscheduledTasks = activeTasks.filter(task => task.due_date === '--' && task.status !== 'Completed');

    const userStats = (userId, projectId) => {
        const scoped = tasks.filter(task => task.user_id === userId && (projectId === 'all' || task.project_id === projectId));
        const completed = scoped.filter(task => task.status === 'Completed').length;
        const pending = scoped.filter(task => task.status !== 'Completed').length;
        const overdue = scoped.filter(task => task.missed_deadline && task.status !== 'Completed').length;
        return { completed, pending, overdue };
    };

    const toLedgerTask = (task) => ({
        ...task,
        assignee: users[task.user_id]?.name || 'Unassigned',
        project: projects.find(project => project.id === task.project_id)?.name || 'Demo Project'
    });

    const teamForProject = (projectId) => {
        const project = projects.find(item => item.id === projectId);
        if (!project) return [];
        return project.user_ids.map(userId => {
            const stats = userStats(userId, projectId);
            const bottleneck = stats.overdue >= 2 ? 'High' : stats.overdue === 1 ? 'Medium' : 'Low';
            return {
                id: userId,
                name: users[userId].name,
                role: users[userId].role,
                projects: users[userId].projects,
                tasks_completed: stats.completed,
                tasks_pending: stats.pending,
                overdue_count: stats.overdue,
                bottleneck
            };
        });
    };

    const teamGroups = {};
    Object.values(users).forEach(user => {
        const stats = userStats(user.id, 'all');
        const group = user.role.includes('Product') || user.role.includes('Program') || user.role.includes('Growth')
            ? 'PMs & Strategy'
            : user.role.includes('Design')
                ? 'Design & Research'
                : user.role.includes('Tech')
                    ? 'Tech & Intelligence'
                    : 'Operations';
        if (!teamGroups[group]) teamGroups[group] = { members: [], total_pending: 0, total_overdue: 0 };
        teamGroups[group].members.push({
            id: user.id,
            name: user.name,
            role: user.role,
            projects: user.projects,
            tasks_completed: stats.completed,
            tasks_pending: stats.pending,
            overdue_count: stats.overdue,
            bottleneck: stats.overdue >= 2 ? 'High' : stats.overdue === 1 ? 'Medium' : 'Low'
        });
        teamGroups[group].total_pending += stats.pending;
        teamGroups[group].total_overdue += stats.overdue;
    });

    const velocityTasks = activeTasks.filter(task => task.status === 'Completed').map(task => ({
        ...toLedgerTask(task),
        period: (today.getTime() - new Date(task.completed_date).getTime()) / DAY <= 7 ? '7d' : '30d',
        was_late: task.missed_deadline
    }));

    const demoInsights = [
        {
            type: 'risk', title: 'Northstar launch readiness needs a single owner',
            problem: 'Two high-priority workstreams are active while the launch review is still carrying an overdue instrumentation task.',
            action_short_term: 'Assign one owner for the activation funnel and close the remaining QA decision within 48 hours.',
            action_long_term: 'Add a launch-readiness gate with explicit evidence for instrumentation, proof, and customer communications.'
        },
        {
            type: 'warning', title: 'Signal Ops has an unscheduled documentation gap',
            problem: 'The response playbook is not scheduled even though the team is already operating the alert workflow.',
            action_short_term: 'Reserve a 90-minute planning block and add a named reviewer for the first draft.',
            action_long_term: 'Make playbook ownership part of the definition of done for every new alerting capability.'
        },
        {
            type: 'success', title: 'Horizon Learning has steady delivery momentum',
            problem: 'The cohort kit is in progress with most underlying tasks completed and only a small set of review actions open.',
            action_short_term: 'Finish the accessibility review and publish the cohort calendar once the venue is confirmed.',
            action_long_term: 'Reuse the learning-kit checklist as a repeatable launch template for future cohorts.'
        }
    ];

    let scratchpadNotes = [{ date: dateFromToday(0), text: 'Use this space to capture a decision, risk, or follow-up from the demo review.' }];

    const overview = () => ({
        success: true,
        demo: true,
        count: projects.length,
        data: projects.map(project => {
            const scoped = projectTasks(project.id);
            const overdue = scoped.filter(task => task.missed_deadline && task.status !== 'Completed').length;
            return {
                ...project,
                overdue_count: overdue,
                bottleneck_risk: overdue >= 2 ? 'High' : overdue === 1 ? 'Medium' : 'Low'
            };
        }),
        velocity: {
            last_7_days: velocityTasks.filter(task => task.period === '7d').length,
            last_30_days: velocityTasks.length,
            tasks_7d: velocityTasks.filter(task => task.period === '7d'),
            tasks_30d: velocityTasks
        },
        total_bottlenecks: overdueTasks.length,
        total_unscheduled: unscheduledTasks.length,
        cache_refreshed_at: Date.now()
    });

    const readFormValue = (body, key) => {
        if (body && typeof body.get === 'function') return body.get(key) || '';
        if (typeof body === 'string') {
            try { return JSON.parse(body)[key] || ''; } catch (_) { return ''; }
        }
        return body?.[key] || '';
    };

    const response = (payload, status = 200) => ({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(payload)
    });

    const handleAction = (action, url, init) => {
        const projectId = url.searchParams.get('project_id') || 'all';
        if (action === 'overview') return overview();
        if (action === 'milestones') return { success: true, demo: true, data: milestones };
        if (action === 'team') {
            const project = projects.find(item => item.id === projectId);
            const data = teamForProject(projectId);
            const projectTaskList = projectTasks(projectId);
            return {
                success: true, demo: true, project_id: projectId, data,
                priority_distribution: {
                    high: projectTaskList.filter(task => task.priority === 'High').length,
                    medium: projectTaskList.filter(task => task.priority === 'Medium').length,
                    low: projectTaskList.filter(task => task.priority === 'Low').length
                },
                archived: project ? !project.f_active : false,
                demo_url: '#'
            };
        }
        if (action === 'user_tasks') {
            const userId = url.searchParams.get('user_id');
            return { success: true, demo: true, data: tasks.filter(task => task.user_id === userId && (projectId === 'all' || task.project_id === projectId)).map(toLedgerTask) };
        }
        if (action === 'bottlenecks') return { success: true, demo: true, data: overdueTasks.map(toLedgerTask).map(task => ({ ...task, task_name: task.title, days_late: task.missed_deadline ? 5 : 0, impact: task.priority === 'High' ? 'High' : 'Medium', project_id: task.project_id })) };
        if (action === 'unscheduled') return { success: true, demo: true, data: unscheduledTasks.map(task => ({ ...toLedgerTask(task), project_id: task.project_id })) };
        if (action === 'velocity') return { success: true, demo: true, data: velocityTasks };
        if (action === 'teams') return { success: true, demo: true, data: teamGroups };
        if (action === 'insights') {
            const question = readFormValue(init?.body, 'question');
            if (question) {
                return {
                    success: true, demo: true, source: 'demo', answer: `## Demo PM response\n\nBased on the fictional portfolio data, I would start by reviewing the overdue high-priority work, naming one accountable owner, and scheduling the unscheduled playbook task.\n\n**Question received:** ${question}\n\nThis deterministic response is a portfolio-safe fallback. A server-side Groq model can replace it later without changing the UI contract.`
                };
            }
            return { success: true, demo: true, source: 'demo', data: { insights: demoInsights } };
        }
        if (action === 'get_scratchpad') return { success: true, demo: true, notes: scratchpadNotes };
        if (action === 'save_scratchpad') {
            let payload = {};
            if (typeof init?.body === 'string') {
                try { payload = JSON.parse(init.body); } catch (_) { payload = {}; }
            }
            scratchpadNotes = Array.isArray(payload.notes) ? payload.notes : scratchpadNotes;
            return { success: true, demo: true, notes: scratchpadNotes };
        }
        if (action === 'ai_pm') {
            const message = readFormValue(init?.body, 'message');
            const project = projects.find(item => item.id === projectId);
            return {
                success: true, demo: true,
                answer: `**${project?.name || 'Portfolio Overview'} — demo guidance**\n\nI would first review the open high-priority work, confirm the owner for the next decision, and turn any unscheduled task into a dated commitment.\n\n**Your prompt:** ${message || 'Give me the next best action.'}\n\nThis is a deterministic portfolio-demo response. The production-ready Groq adapter can be added server-side later.`
            };
        }
        return { success: false, demo: true, error: 'Unknown demo action' };
    };

    const originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        const rawUrl = typeof input === 'string' ? input : input?.url;
        if (!rawUrl || !rawUrl.includes('api.php')) return originalFetch(input, init);
        const url = new URL(rawUrl, window.location.href);
        return Promise.resolve(response(handleAction(url.searchParams.get('action'), url, init)));
    };

    window.__PM_DEMO__ = {
        label: 'Portfolio Demo',
        description: 'Fictionalized sample data. No external workspace connection or real people are included.',
        projects,
        tasks,
        milestones
    };
})();
