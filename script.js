// Task Manager Application with Multiple Views
class TaskManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.editingTaskId = null;
        this.currentView = 'month';
        this.tasks = this.loadTasks();
        this.holidays = {};
        this.theme = this.loadTheme();
        
        // Undo/Redo functionality
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoStackSize = 10;
        
        this.initializeElements();
        this.applyTheme();
        this.attachEventListeners();
        this.loadHolidays();
        this.renderCurrentView();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            // Header elements
            todayBtn: document.getElementById('todayBtn'),
            addTaskBtn: document.getElementById('addTaskBtn'),
            
            // Navigation elements
            navCurrentDate: document.getElementById('navCurrentDate'),
            navPrevBtn: document.getElementById('navPrevBtn'),
            navNextBtn: document.getElementById('navNextBtn'),
            
            // View buttons
            viewBtns: document.querySelectorAll('.view-btn'),
            
            // View containers
            monthView: document.getElementById('monthView'),
            weekView: document.getElementById('weekView'),
            dayView: document.getElementById('dayView'),
            
            // Month view
            monthCalendarGrid: document.getElementById('monthCalendarGrid'),
            
            // Week view
            weekHeader: document.getElementById('weekHeader'),
            weekGrid: document.getElementById('weekGrid'),
            
            // Day view
            dayHeader: document.getElementById('dayHeader'),
            dayTimeline: document.getElementById('dayTimeline'),
            
            // Modals
            taskModal: document.getElementById('taskModal'),
            taskDetailsModal: document.getElementById('taskDetailsModal'),
            taskForm: document.getElementById('taskForm'),
            
            // Form fields
            modalTitle: document.getElementById('modalTitle'),
            taskTitle: document.getElementById('taskTitle'),
            taskDate: document.getElementById('taskDate'),
            taskTime: document.getElementById('taskTime'),
            taskDescription: document.getElementById('taskDescription'),
            
            // Modal controls
            closeModal: document.getElementById('closeModal'),
            closeDetailsModal: document.getElementById('closeDetailsModal'),
            cancelBtn: document.getElementById('cancelBtn'),
            saveBtn: document.getElementById('saveBtn'),
            
            // Task details
            detailTitle: document.getElementById('detailTitle'),
            detailTime: document.getElementById('detailTime'),
            detailDescription: document.getElementById('detailDescription'),
            detailCompleted: document.getElementById('detailCompleted'),
            deleteTaskBtn: document.getElementById('deleteTaskBtn'),
            editTaskBtn: document.getElementById('editTaskBtn'),
            
            // Menu
            themeToggle: document.getElementById('themeToggle'),
            menuBtn: document.getElementById('menuBtn'),
            dropdownMenu: document.getElementById('dropdownMenu'),
            exportTasks: document.getElementById('exportTasks'),
            importTasks: document.getElementById('importTasks'),
            clearCompleted: document.getElementById('clearCompleted'),
            aboutApp: document.getElementById('aboutApp'),
            
            // Toast
            toast: document.getElementById('toast'),
            
            // Day Popover
            dayPopover: document.getElementById('dayPopover'),
            popoverDate: document.getElementById('popoverDate'),
            popoverContent: document.getElementById('popoverContent'),
            popoverClose: document.getElementById('popoverClose'),
            popoverAddTask: document.getElementById('popoverAddTask'),
            
            // Recurrence fields
            taskRecurring: document.getElementById('taskRecurring'),
            recurrenceOptions: document.getElementById('recurrenceOptions'),
            recurrenceType: document.getElementById('recurrenceType'),
            recurrenceInterval: document.getElementById('recurrenceInterval'),
            recurrenceIntervalLabel: document.getElementById('recurrenceIntervalLabel'),
            recurrenceEndDate: document.getElementById('recurrenceEndDate'),
            
            // Keyboard Shortcuts Modal
            shortcutsModal: document.getElementById('shortcutsModal'),
            closeShortcutsModal: document.getElementById('closeShortcutsModal'),
            
            // Custom Date Picker
            datePickerBtn: document.getElementById('datePickerBtn'),
            datePickerOverlay: document.getElementById('datePickerOverlay'),
            taskDateDisplay: document.getElementById('taskDateDisplay'),
            datePickerTitle: document.getElementById('datePickerTitle'),
            datePickerDays: document.getElementById('datePickerDays'),
            datePrevMonth: document.getElementById('datePrevMonth'),
            dateNextMonth: document.getElementById('dateNextMonth'),
            dateTodayBtn: document.getElementById('dateTodayBtn'),
            dateClearBtn: document.getElementById('dateClearBtn'),
            
            // Custom Time Picker
            timePickerBtn: document.getElementById('timePickerBtn'),
            timePickerOverlay: document.getElementById('timePickerOverlay'),
            taskTimeDisplay: document.getElementById('taskTimeDisplay'),
            hourColumn: document.getElementById('hourColumn'),
            minuteColumn: document.getElementById('minuteColumn'),
            timeSetBtn: document.getElementById('timeSetBtn'),
            timeClearBtn: document.getElementById('timeClearBtn'),
            
            // Tags
            selectedTagsContainer: document.getElementById('selectedTags'),
            customTagInput: document.getElementById('customTagInput'),
            addCustomTagBtn: document.getElementById('addCustomTag'),
            tagsContainer: document.getElementById('tagsContainer')
        };
        
        this.selectedTags = [];
        this.activeTagFilter = 'all';
        
        // Date/Time picker state
        this.pickerDate = new Date();
        this.selectedHour = null;
        this.selectedMinute = null;
    }

    // Attach all event listeners
    attachEventListeners() {
        // Header buttons
        this.elements.todayBtn.addEventListener('click', () => this.goToToday());
        this.elements.addTaskBtn.addEventListener('click', () => this.quickAddTask());
        
        // Navigation buttons
        this.elements.navPrevBtn.addEventListener('click', () => this.navigateView(-1));
        this.elements.navNextBtn.addEventListener('click', () => this.navigateView(1));
        
        // View switcher
        this.elements.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });
        
        // Modal controls
        this.elements.closeModal.addEventListener('click', () => this.closeTaskModal());
        this.elements.closeDetailsModal.addEventListener('click', () => this.closeDetailsModal());
        this.elements.cancelBtn.addEventListener('click', () => this.closeTaskModal());
        
        // Form submission
        this.elements.taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        
        // Task details actions
        this.elements.deleteTaskBtn.addEventListener('click', () => this.deleteTask());
        this.elements.editTaskBtn.addEventListener('click', () => this.editTask());
        this.elements.detailCompleted.addEventListener('change', (e) => this.toggleTaskCompletion(e));
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Menu actions
        this.elements.menuBtn.addEventListener('click', () => this.toggleMenu());
        this.elements.exportTasks.addEventListener('click', (e) => this.exportTasks(e));
        this.elements.importTasks.addEventListener('click', (e) => this.importTasks(e));
        this.elements.clearCompleted.addEventListener('click', (e) => this.clearCompleted(e));
        this.elements.aboutApp.addEventListener('click', (e) => this.showAbout(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-menu')) {
                this.elements.dropdownMenu.classList.remove('active');
            }
        });
        
        // Day popover controls
        this.elements.popoverClose.addEventListener('click', () => this.closeDayPopover());
        this.elements.popoverAddTask.addEventListener('click', () => {
            const dateStr = this.selectedDate;
            this.closeDayPopover();
            // Convert dateStr format (2025-1-4) to ISO format (2025-01-04)
            const formattedDate = this.convertToISODate(dateStr);
            this.openTaskModal(formattedDate);
        });
        
        // Tags event listeners
        document.querySelectorAll('.tag-suggestion').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleTag(e.target.dataset.tag));
        });
        this.elements.addCustomTagBtn.addEventListener('click', () => this.addCustomTag());
        this.elements.customTagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addCustomTag();
            }
        });
        
        // Close modals on background click
        this.elements.taskModal.addEventListener('click', (e) => {
            if (e.target === this.elements.taskModal) this.closeTaskModal();
        });
        this.elements.taskDetailsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.taskDetailsModal) this.closeDetailsModal();
        });
        
        // Close popover on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.day-popover') && !e.target.closest('.day-cell') && 
                !e.target.closest('.week-day-slot') && !e.target.closest('.day-hour-tasks')) {
                this.closeDayPopover();
            }
        });
        
        // Recurrence toggle
        this.elements.taskRecurring.addEventListener('change', (e) => {
            this.elements.recurrenceOptions.style.display = e.target.checked ? 'block' : 'none';
        });
        
        // Recurrence type change (update interval label)
        this.elements.recurrenceType.addEventListener('change', (e) => {
            const type = e.target.value;
            const labels = {
                'daily': 'day(s)',
                'weekly': 'week(s)',
                'monthly': 'month(s)'
            };
            this.elements.recurrenceIntervalLabel.textContent = labels[type];
        });
        
        // Keyboard shortcuts modal
        this.elements.closeShortcutsModal.addEventListener('click', () => this.closeShortcutsModal());
        this.elements.shortcutsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.shortcutsModal) this.closeShortcutsModal();
        });
        
        // Custom Date Picker
        this.elements.datePickerBtn.addEventListener('click', () => this.openDatePicker());
        this.elements.taskDateDisplay.addEventListener('click', () => this.openDatePicker());
        this.elements.datePickerOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.datePickerOverlay) this.closeDatePicker();
        });
        this.elements.datePrevMonth.addEventListener('click', () => this.changePickerMonth(-1));
        this.elements.dateNextMonth.addEventListener('click', () => this.changePickerMonth(1));
        this.elements.dateTodayBtn.addEventListener('click', () => this.selectToday());
        this.elements.dateClearBtn.addEventListener('click', () => this.clearDate());
        
        // Custom Time Picker
        this.elements.timePickerBtn.addEventListener('click', () => this.openTimePicker());
        this.elements.taskTimeDisplay.addEventListener('click', () => this.openTimePicker());
        this.elements.timePickerOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.timePickerOverlay) this.closeTimePicker();
        });
        this.elements.timeSetBtn.addEventListener('click', () => this.setTime());
        this.elements.timeClearBtn.addEventListener('click', () => this.clearTime());
        
        // Initialize pickers
        this.initializeTimePicker();
    }

    // Switch between views
    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        this.elements.viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Show/hide views
        this.elements.monthView.style.display = view === 'month' ? 'block' : 'none';
        this.elements.weekView.style.display = view === 'week' ? 'block' : 'none';
        this.elements.dayView.style.display = view === 'day' ? 'block' : 'none';
        
        this.renderCurrentView();
    }

    // Render current view
    renderCurrentView() {
        switch (this.currentView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
        }
        this.updateNavigation();
    }

    // Update navigation header
    updateNavigation() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const day = this.currentDate.getDate();
        
        switch (this.currentView) {
            case 'month':
                this.elements.navCurrentDate.textContent = new Date(year, month).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                });
                break;
            case 'week':
                const weekStart = this.getWeekStart(this.currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                this.elements.navCurrentDate.textContent = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                break;
            case 'day':
                this.elements.navCurrentDate.textContent = this.currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                break;
        }
    }

    // Navigate view (prev/next)
    navigateView(direction) {
        switch (this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + direction);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + (7 * direction));
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + direction);
                break;
        }
        this.renderCurrentView();
    }

    // Go to today
    goToToday() {
        this.currentDate = new Date();
        this.renderCurrentView();
        this.showToast('Jumped to today');
    }

    // Quick add task (for header button)
    quickAddTask() {
        // Don't pre-fill date - let user choose manually
        this.selectedDate = null;
        this.openTaskModal();
    }

    // MONTH VIEW
    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.elements.monthCalendarGrid.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const cell = this.createMonthDayCell(day, month - 1, year, true);
            this.elements.monthCalendarGrid.appendChild(cell);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === today.getDate();
            const cell = this.createMonthDayCell(day, month, year, false, isToday);
            this.elements.monthCalendarGrid.appendChild(cell);
        }
        
        // Next month days
        const totalCells = this.elements.monthCalendarGrid.children.length;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const cell = this.createMonthDayCell(day, month + 1, year, true);
            this.elements.monthCalendarGrid.appendChild(cell);
        }
        
        // Initialize drag-and-drop after rendering
        setTimeout(() => this.initializeDragAndDrop(), 100);
    }

    createMonthDayCell(day, month, year, isOtherMonth, isToday = false) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        if (isOtherMonth) cell.classList.add('other-month');
        if (isToday) cell.classList.add('today');
        
        const dateStr = this.formatDateKey(year, month, day);
        cell.dataset.date = dateStr; // Add date for drag-and-drop
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);
        
        const taskList = document.createElement('div');
        taskList.className = 'task-list';
        
        const dayTasks = this.getFilteredTasks(dateStr);
        dayTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item color-${task.color || 'blue'}`;
            if (task.completed) taskItem.classList.add('completed');
            if (task.isHoliday) taskItem.classList.add('holiday-event');
            if (task.isRecurring) taskItem.classList.add('recurring');
            
            taskItem.dataset.taskId = task.id; // Add task ID for drag-and-drop
            
            const timeStr = task.time ? `<span class="task-time">${task.time}</span>` : '';
            taskItem.innerHTML = `${timeStr}${task.title}`;
            
            taskItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTaskDetails(task.id);
            });
            
            taskList.appendChild(taskItem);
        });
        
        cell.appendChild(taskList);
        
        // Google Calendar style: show popover instead of modal
        cell.addEventListener('click', (e) => {
            if (!e.target.closest('.task-item')) {
                this.selectedDate = dateStr;
                this.showDayPopover(e.currentTarget, dateStr);
            }
        });
        
        return cell;
    }

    // WEEK VIEW
    renderWeekView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const today = new Date();
        
        // Render header
        this.elements.weekHeader.innerHTML = '<div class="week-header-cell time-col"></div>';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            
            const isToday = this.isSameDate(date, today);
            const cell = document.createElement('div');
            cell.className = 'week-header-cell';
            if (isToday) cell.classList.add('today');
            
            cell.innerHTML = `
                <div class="week-header-day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div class="week-header-date">${date.getDate()}</div>
            `;
            
            this.elements.weekHeader.appendChild(cell);
        }
        
        // Render grid (24 hours)
        this.elements.weekGrid.innerHTML = '';
        
        for (let hour = 0; hour < 24; hour++) {
            // Time label
            const timeSlot = document.createElement('div');
            timeSlot.className = 'week-time-slot';
            timeSlot.textContent = this.formatHour(hour);
            this.elements.weekGrid.appendChild(timeSlot);
            
            // Day slots
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                const dateStr = this.formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());
                
                const daySlot = document.createElement('div');
                daySlot.className = 'week-day-slot';
                
                // Get tasks for this hour
                const dayTasks = this.getFilteredTasks(dateStr);
                const hourTasks = dayTasks.filter(task => {
                    if (!task.time) return false;
                    const taskHour = parseInt(task.time.split(':')[0]);
                    return taskHour === hour;
                });
                
                hourTasks.forEach(task => {
                    const taskEl = document.createElement('div');
                    taskEl.className = `week-task color-${task.color || 'blue'}`;
                    if (task.completed) taskEl.classList.add('completed');
                    if (task.isHoliday) taskEl.classList.add('holiday-event');
                    if (task.isRecurring) taskEl.classList.add('recurring');
                    
                    taskEl.dataset.taskId = task.id; // Add for drag-and-drop
                    taskEl.innerHTML = `<strong>${task.time}</strong> ${task.title}`;
                    taskEl.addEventListener('click', () => this.showTaskDetails(task.id));
                    daySlot.appendChild(taskEl);
                });
                
                daySlot.dataset.date = dateStr; // Add for drag-and-drop
                
                daySlot.addEventListener('click', (e) => {
                    if (e.target === daySlot) {
                        this.selectedDate = dateStr;
                        const formattedDate = this.convertToISODate(dateStr);
                        this.openTaskModal(formattedDate);
                        // Pre-fill time based on hour clicked
                        this.elements.taskTime.value = `${String(hour).padStart(2, '0')}:00`;
                    }
                });
                
                this.elements.weekGrid.appendChild(daySlot);
            }
        }
        
        // Initialize drag-and-drop after rendering
        setTimeout(() => this.initializeDragAndDrop(), 100);
    }

    // DAY VIEW
    renderDayView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const day = this.currentDate.getDate();
        const dateStr = this.formatDateKey(year, month, day);
        
        // Render header
        this.elements.dayHeader.innerHTML = `
            <div class="day-header-date">${day}</div>
            <div class="day-header-day">${this.currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</div>
        `;
        
        // Render timeline
        this.elements.dayTimeline.innerHTML = '';
        
        const dayTasks = this.getFilteredTasks(dateStr);
        
        for (let hour = 0; hour < 24; hour++) {
            const hourDiv = document.createElement('div');
            hourDiv.className = 'day-hour';
            
            const label = document.createElement('div');
            label.className = 'day-hour-label';
            label.textContent = this.formatHour(hour);
            
            const tasksDiv = document.createElement('div');
            tasksDiv.className = 'day-hour-tasks';
            
            // Get tasks for this hour
            const hourTasks = dayTasks.filter(task => {
                if (!task.time) return hour === 0; // Show tasks without time at midnight
                const taskHour = parseInt(task.time.split(':')[0]);
                return taskHour === hour;
            });
            
            hourTasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = `day-task color-${task.color || 'blue'}`;
                if (task.completed) taskEl.classList.add('completed');
                if (task.isHoliday) taskEl.classList.add('holiday-event');
                if (task.isRecurring) taskEl.classList.add('recurring');
                
                taskEl.dataset.taskId = task.id; // Add for drag-and-drop
                
                taskEl.innerHTML = `
                    <div class="day-task-title">${task.title}</div>
                    ${task.time ? `<div class="day-task-time">⏰ ${task.time}</div>` : ''}
                    ${task.description ? `<div class="day-task-desc">${task.description}</div>` : ''}
                `;
                
                taskEl.addEventListener('click', () => this.showTaskDetails(task.id));
                tasksDiv.appendChild(taskEl);
            });
            
            tasksDiv.addEventListener('click', (e) => {
                if (e.target === tasksDiv) {
                    this.selectedDate = dateStr;
                    const formattedDate = this.convertToISODate(dateStr);
                    this.openTaskModal(formattedDate);
                    // Pre-fill time based on hour clicked
                    this.elements.taskTime.value = `${String(hour).padStart(2, '0')}:00`;
                }
            });
            
            hourDiv.appendChild(label);
            hourDiv.appendChild(tasksDiv);
            this.elements.dayTimeline.appendChild(hourDiv);
        }
        
        // Initialize drag-and-drop after rendering
        setTimeout(() => this.initializeDragAndDrop(), 100);
    }

    // Helper: Get week start (Sunday)
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    // Helper: Check if same date
    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Helper: Format hour
    formatHour(hour) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h}:00 ${ampm}`;
    }

    // Format date as YYYY-MM-DD key
    formatDateKey(year, month, day) {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    }
    
    // Convert internal date format to ISO format for date input
    // Handles both formats: "2025-1-4" or "2025-01-04"
    convertToISODate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Normalize date key to padded format (YYYY-MM-DD)
    normalizeDateKey(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Get tasks for a specific date, sorted by time (includes holidays)
    getTasksForDate(dateStr) {
        const dayTasks = this.tasks[dateStr] || [];
        const allItems = [...dayTasks];
        
        // Add holiday if exists for this date
        const holiday = this.holidays[dateStr];
        if (holiday) {
            allItems.push({
                id: `holiday-${dateStr}`,
                title: holiday.title,
                time: '',
                description: holiday.description,
                color: 'blue',
                completed: false,
                date: dateStr,
                tags: [],
                isHoliday: true,
                readOnly: true,
                holidayType: holiday.type
            });
        }
        
        return allItems.sort((a, b) => {
            // Holidays without time go to top
            if (a.isHoliday && !b.isHoliday) return -1;
            if (!a.isHoliday && b.isHoliday) return 1;
            if (!a.time && !b.time) return 0;
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
        });
    }

    // Tags management
    toggleTag(tagName) {
        const index = this.selectedTags.indexOf(tagName);
        if (index > -1) {
            this.selectedTags.splice(index, 1);
        } else {
            this.selectedTags.push(tagName);
        }
        this.renderSelectedTags();
    }
    
    addCustomTag() {
        const tagName = this.elements.customTagInput.value.trim();
        if (tagName && !this.selectedTags.includes(tagName)) {
            this.selectedTags.push(tagName);
            this.renderSelectedTags();
            this.elements.customTagInput.value = '';
        }
    }
    
    renderSelectedTags() {
        this.elements.selectedTagsContainer.innerHTML = '';
        this.selectedTags.forEach(tag => {
            const tagPill = document.createElement('div');
            tagPill.className = 'selected-tag-pill';
            tagPill.innerHTML = `
                <span>${tag}</span>
                <button type="button" class="remove-tag" data-tag="${tag}">&times;</button>
            `;
            tagPill.querySelector('.remove-tag').addEventListener('click', () => this.toggleTag(tag));
            this.elements.selectedTagsContainer.appendChild(tagPill);
        });
        
        // Update tag suggestion buttons to show selected state
        document.querySelectorAll('.tag-suggestion').forEach(btn => {
            if (this.selectedTags.includes(btn.dataset.tag)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
    
    getAllTags() {
        const tags = new Set();
        Object.values(this.tasks).forEach(dayTasks => {
            dayTasks.forEach(task => {
                if (task.tags && Array.isArray(task.tags)) {
                    task.tags.forEach(tag => tags.add(tag));
                }
            });
        });
        return Array.from(tags).sort();
    }
    
    updateSidebarTags() {
        const allTags = this.getAllTags();
        const tagCounts = {};
        let totalTasks = 0;
        
        // Count tasks for each tag
        Object.values(this.tasks).forEach(dayTasks => {
            dayTasks.forEach(task => {
                totalTasks++;
                if (task.tags && Array.isArray(task.tags)) {
                    task.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            });
        });
        
        // Render tags in sidebar
        this.elements.tagsContainer.innerHTML = `
            <div class="tag-badge ${this.activeTagFilter === 'all' ? 'active' : ''}" data-tag="all">
                <span class="tag-name">All Tasks</span>
                <span class="tag-count">${totalTasks}</span>
            </div>
        `;
        
        allTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = `tag-badge ${this.activeTagFilter === tag ? 'active' : ''}`;
            tagElement.dataset.tag = tag;
            tagElement.innerHTML = `
                <span class="tag-name">${tag}</span>
                <span class="tag-count">${tagCounts[tag] || 0}</span>
            `;
            tagElement.addEventListener('click', () => this.filterByTag(tag));
            this.elements.tagsContainer.appendChild(tagElement);
        });
        
        // Add click listener to "All Tasks"
        this.elements.tagsContainer.querySelector('[data-tag="all"]').addEventListener('click', () => this.filterByTag('all'));
    }
    
    filterByTag(tag) {
        this.activeTagFilter = tag;
        this.updateSidebarTags();
        this.renderCurrentView();
        this.showToast(tag === 'all' ? 'Showing all tasks' : `Filtered by: ${tag}`);
    }
    
    // Get filtered tasks based on active tag filter
    getFilteredTasks(dateStr) {
        let tasks = this.getTasksForDate(dateStr);
        
        if (this.activeTagFilter !== 'all') {
            tasks = tasks.filter(task => 
                task.tags && task.tags.includes(this.activeTagFilter)
            );
        }
        
        return tasks;
    }

    // Open task modal
    openTaskModal(prefilledDate = null) {
        this.editingTaskId = null;
        this.selectedTags = [];
        this.elements.modalTitle.textContent = 'Add Task';
        this.elements.saveBtn.textContent = 'Save Task';
        this.elements.taskForm.reset();
        this.renderSelectedTags();
        
        // Reset recurrence fields
        this.elements.taskRecurring.checked = false;
        this.elements.recurrenceOptions.style.display = 'none';
        this.elements.recurrenceType.value = 'weekly';
        this.elements.recurrenceInterval.value = 1;
        this.elements.recurrenceEndDate.value = '';
        this.elements.recurrenceIntervalLabel.textContent = 'week(s)';
        
        // Reset picker displays
        this.elements.taskDateDisplay.value = '';
        this.elements.taskTimeDisplay.value = '';
        
        // Auto-fill date if provided (when user clicks on a specific date)
        if (prefilledDate) {
            this.elements.taskDate.value = prefilledDate;
            // Update display
            const date = new Date(prefilledDate + 'T00:00:00');
            this.elements.taskDateDisplay.value = date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        
        this.elements.taskModal.classList.add('active');
        this.elements.taskTitle.focus();
    }

    // Close task modal
    closeTaskModal() {
        this.elements.taskModal.classList.remove('active');
        this.elements.taskForm.reset();
        this.editingTaskId = null;
    }

    // Close task details modal
    closeDetailsModal() {
        this.elements.taskDetailsModal.classList.remove('active');
        this.editingTaskId = null;
    }

    // Handle task form submission
    handleTaskSubmit(e) {
        e.preventDefault();
        
        const taskDate = this.elements.taskDate.value;
        if (!taskDate) {
            this.showToast('Please select a date for the task');
            return;
        }
        
        // Use the ISO date format directly (2025-01-04) - matches formatDateKey output
        this.selectedDate = taskDate;
        
        const selectedColor = document.querySelector('input[name="taskColor"]:checked');
        
        const taskData = {
            id: this.editingTaskId || this.generateId(),
            title: this.elements.taskTitle.value.trim(),
            time: this.elements.taskTime.value,
            description: this.elements.taskDescription.value.trim(),
            color: selectedColor ? selectedColor.value : 'blue',
            completed: false,
            date: this.selectedDate,
            tags: this.selectedTags || []
        };
        
        if (!taskData.title) return;
        
        if (this.editingTaskId) {
            // Find the task in its original location
            const oldTask = this.findTaskById(this.editingTaskId);
            if (oldTask) {
                const oldDate = oldTask.date;
                taskData.completed = oldTask.completed; // Preserve completion status
                
                // Remove from old date
                this.tasks[oldDate] = this.tasks[oldDate].filter(t => t.id !== this.editingTaskId);
                if (this.tasks[oldDate].length === 0) {
                    delete this.tasks[oldDate];
                }
            }
        }
        
        // Save state for undo before making changes
        this.saveState(this.editingTaskId ? 'Edit task' : 'Add task');
        
        // Handle recurrence
        if (this.elements.taskRecurring.checked) {
            const recurrence = {
                type: this.elements.recurrenceType.value,
                interval: parseInt(this.elements.recurrenceInterval.value) || 1,
                endDate: this.elements.recurrenceEndDate.value
            };
            
            taskData.recurrence = recurrence;
            taskData.isRecurring = true;
        }
        
        // Add to new date (or same date if unchanged)
        if (!this.tasks[this.selectedDate]) {
            this.tasks[this.selectedDate] = [];
        }
        this.tasks[this.selectedDate].push(taskData);
        
        // Generate recurring tasks if enabled
        if (taskData.isRecurring) {
            const recurringTasks = this.generateRecurringTasks(taskData, taskData.recurrence);
            this.addRecurringTasksToCalendar(recurringTasks);
            this.showToast(`Task added with ${recurringTasks.length} recurring instances`);
        } else {
            this.showToast(this.editingTaskId ? 'Task updated' : 'Task added');
        }
        
        this.saveTasks();
        this.renderCurrentView();
        this.updateSidebarTags();
        this.closeTaskModal();
        this.closeDetailsModal();
    }

    // Show task details modal
    showTaskDetails(taskId) {
        const task = this.findTaskById(taskId);
        if (!task) return;
        
        // Check if it's a holiday (read-only)
        if (task.isHoliday || task.readOnly) {
            this.showHolidayInfo(task);
            return;
        }
        
        this.editingTaskId = taskId;
        this.selectedDate = task.date;
        
        this.elements.detailTitle.textContent = task.title;
        this.elements.detailTime.textContent = task.time ? `⏰ ${task.time}` : 'No time set';
        this.elements.detailDescription.textContent = task.description || 'No description';
        this.elements.detailCompleted.checked = task.completed;
        this.elements.detailCompleted.disabled = false;
        
        // Show edit and delete buttons for regular tasks
        this.elements.editTaskBtn.style.display = 'block';
        this.elements.deleteTaskBtn.style.display = 'block';
        
        this.elements.taskDetailsModal.classList.add('active');
    }
    
    // Show holiday information (read-only)
    showHolidayInfo(holiday) {
        const typeLabels = {
            'national_holiday': 'National Holiday',
            'festival': 'Festival',
            'religious': 'Religious',
            'observance': 'Observance'
        };
        
        // Use the task details modal to show holiday info
        this.elements.detailTitle.textContent = holiday.title;
        this.elements.detailTime.textContent = typeLabels[holiday.holidayType] || 'Event';
        this.elements.detailDescription.textContent = holiday.description || 'Built-in calendar event';
        this.elements.detailCompleted.checked = false;
        this.elements.detailCompleted.disabled = true;
        
        // Hide edit and delete buttons for holidays
        this.elements.editTaskBtn.style.display = 'none';
        this.elements.deleteTaskBtn.style.display = 'none';
        
        this.elements.taskDetailsModal.classList.add('active');
    }

    // Toggle task completion
    toggleTaskCompletion(e) {
        const task = this.findTaskById(this.editingTaskId);
        if (task) {
            // Save state for undo
            this.saveState(e.target.checked ? 'Complete task' : 'Uncomplete task');
            
            task.completed = e.target.checked;
            this.saveTasks();
            this.renderCurrentView();
        }
    }

    // Edit task
    editTask() {
        const task = this.findTaskById(this.editingTaskId);
        if (!task) return;
        
        this.elements.modalTitle.textContent = 'Edit Task';
        this.elements.saveBtn.textContent = 'Update Task';
        this.elements.taskTitle.value = task.title;
        this.elements.taskDate.value = this.convertToISODate(task.date);
        this.elements.taskTime.value = task.time || '';
        this.elements.taskDescription.value = task.description || '';
        
        // Update picker displays
        if (task.date) {
            const date = new Date(this.convertToISODate(task.date) + 'T00:00:00');
            this.elements.taskDateDisplay.value = date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        
        if (task.time) {
            const [hour, minute] = task.time.split(':');
            const hour12 = parseInt(hour) % 12 || 12;
            const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';
            this.elements.taskTimeDisplay.value = `${String(hour12).padStart(2, '0')}:${minute} ${ampm}`;
        }
        
        // Set color
        const colorRadio = document.querySelector(`input[name="taskColor"][value="${task.color || 'blue'}"]`);
        if (colorRadio) colorRadio.checked = true;
        
        // Load existing tags
        this.selectedTags = task.tags ? [...task.tags] : [];
        this.renderSelectedTags();
        
        // Load recurrence settings if task is recurring
        if (task.recurrence && task.isRecurring) {
            this.elements.taskRecurring.checked = true;
            this.elements.recurrenceOptions.style.display = 'block';
            this.elements.recurrenceType.value = task.recurrence.type || 'weekly';
            this.elements.recurrenceInterval.value = task.recurrence.interval || 1;
            this.elements.recurrenceEndDate.value = task.recurrence.endDate || '';
            
            const labels = {
                'daily': 'day(s)',
                'weekly': 'week(s)',
                'monthly': 'month(s)'
            };
            this.elements.recurrenceIntervalLabel.textContent = labels[task.recurrence.type] || 'week(s)';
        } else {
            this.elements.taskRecurring.checked = false;
            this.elements.recurrenceOptions.style.display = 'none';
        }
        
        // Close details modal WITHOUT resetting editingTaskId
        this.elements.taskDetailsModal.classList.remove('active');
        this.elements.taskModal.classList.add('active');
        this.elements.taskTitle.focus();
    }

    // Show day popover (Google Calendar style)
    showDayPopover(cellElement, dateStr) {
        const tasks = this.getTasksForDate(dateStr);
        const rect = cellElement.getBoundingClientRect();
        
        // Format date for header
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        this.elements.popoverDate.textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Clear previous content
        this.elements.popoverContent.innerHTML = '';
        
        if (tasks.length === 0) {
            // Show empty state
            this.elements.popoverContent.innerHTML = `
                <div class="popover-empty">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                        <path d="M38 6H34V4H30V6H18V4H14V6H10C7.8 6 6 7.8 6 10V38C6 40.2 7.8 42 10 42H38C40.2 42 42 40.2 42 38V10C42 7.8 40.2 6 38 6ZM38 38H10V16H38V38Z"/>
                    </svg>
                    <p>No tasks scheduled</p>
                </div>
            `;
        } else {
            // Show tasks
            tasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = `popover-task color-${task.color || 'blue'}`;
                if (task.completed) taskEl.classList.add('completed');
                
                taskEl.innerHTML = `
                    <div class="popover-task-info">
                        <div class="popover-task-title">${task.title}</div>
                        ${task.time ? `<div class="popover-task-time">⏰ ${task.time}</div>` : ''}
                    </div>
                `;
                
                taskEl.addEventListener('click', () => {
                    this.closeDayPopover();
                    this.showTaskDetails(task.id);
                });
                
                this.elements.popoverContent.appendChild(taskEl);
            });
        }
        
        // Position popover
        const popover = this.elements.dayPopover;
        popover.classList.add('active');
        
        // Calculate position (try to center under the cell)
        let left = rect.left + (rect.width / 2) - 160; // 160 is half of popover width (320px)
        let top = rect.bottom + 10;
        
        // Adjust if popover goes off screen
        const popoverWidth = 320;
        const popoverHeight = popover.offsetHeight;
        
        if (left < 10) left = 10;
        if (left + popoverWidth > window.innerWidth - 10) {
            left = window.innerWidth - popoverWidth - 10;
        }
        
        if (top + popoverHeight > window.innerHeight - 10) {
            top = rect.top - popoverHeight - 10;
        }
        
        popover.style.left = `${left}px`;
        popover.style.top = `${top}px`;
    }

    // Close day popover
    closeDayPopover() {
        this.elements.dayPopover.classList.remove('active');
    }

    // Delete task
    deleteTask() {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        const task = this.findTaskById(this.editingTaskId);
        if (task) {
            // Save state for undo
            this.saveState('Delete task');
            
            this.tasks[task.date] = this.tasks[task.date].filter(t => t.id !== this.editingTaskId);
            
            if (this.tasks[task.date].length === 0) {
                delete this.tasks[task.date];
            }
            
            this.saveTasks();
            this.renderCurrentView();
            this.updateSidebarTags();
            this.closeDetailsModal();
            this.showToastWithAction('Task deleted', 'Undo', () => this.undo());
        }
    }

    // Find task by ID (includes holidays)
    findTaskById(taskId) {
        // Check if it's a holiday
        if (taskId.startsWith('holiday-')) {
            const dateStr = taskId.replace('holiday-', '');
            const holiday = this.holidays[dateStr];
            if (holiday) {
                return {
                    id: taskId,
                    title: holiday.title,
                    time: '',
                    description: holiday.description,
                    color: 'blue',
                    completed: false,
                    date: dateStr,
                    tags: [],
                    isHoliday: true,
                    readOnly: true,
                    holidayType: holiday.type
                };
            }
        }
        
        // Search in user tasks
        for (const date in this.tasks) {
            const task = this.tasks[date].find(t => t.id === taskId);
            if (task) return task;
        }
        return null;
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Theme management
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        this.showToast(`${this.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} theme activated`);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    saveTheme() {
        localStorage.setItem('planit_theme', this.theme);
    }

    loadTheme() {
        const saved = localStorage.getItem('planit_theme');
        // Default to light theme, or use saved preference
        return saved || 'light';
    }

    // Menu actions
    toggleMenu() {
        this.elements.dropdownMenu.classList.toggle('active');
    }

    exportTasks(e) {
        e.preventDefault();
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `planit-tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.elements.dropdownMenu.classList.remove('active');
        this.showToast('Tasks exported successfully');
    }

    importTasks(e) {
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const imported = JSON.parse(e.target.result);
                        this.tasks = imported;
                        this.saveTasks();
                        this.renderCurrentView();
                        this.showToast('Tasks imported successfully');
                    } catch (error) {
                        alert('Error importing tasks. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
        this.elements.dropdownMenu.classList.remove('active');
    }

    clearCompleted(e) {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete all completed tasks?')) return;
        
        let count = 0;
        for (const date in this.tasks) {
            const remaining = this.tasks[date].filter(t => !t.completed);
            count += this.tasks[date].length - remaining.length;
            
            if (remaining.length > 0) {
                this.tasks[date] = remaining;
            } else {
                delete this.tasks[date];
            }
        }
        
        this.saveTasks();
        this.renderCurrentView();
        this.elements.dropdownMenu.classList.remove('active');
        this.showToast(`${count} completed task(s) cleared`);
    }

    showAbout(e) {
        e.preventDefault();
        alert('PlanIt - Your Smart Task Calendar\n\nVersion 2.0\n\nA simple and elegant task calendar application.\n\nFeatures:\n• Multiple calendar views (Day, Week, Month)\n• Dark & Light themes\n• Task management with time and description\n• Mark tasks as completed\n• Export/Import tasks\n• Local storage persistence\n\nMade with ❤️');
        this.elements.dropdownMenu.classList.remove('active');
    }

    // Show toast notification
    showToast(message) {
        this.elements.toast.textContent = message;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    // Handle keyboard shortcuts
    handleKeyboard(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
        
        // Close modals with Escape
        if (e.key === 'Escape') {
            this.closeTaskModal();
            this.closeDetailsModal();
            this.closeDayPopover();
            this.closeShortcutsModal();
            this.elements.dropdownMenu.classList.remove('active');
            return;
        }
        
        // Submit form with Enter (except in textarea)
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            if (this.elements.taskModal.classList.contains('active')) {
                e.preventDefault();
                this.elements.taskForm.dispatchEvent(new Event('submit'));
            }
            return;
        }
        
        // Don't handle shortcuts if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl+N / Cmd+N: Quick add task
        if (ctrlKey && e.key === 'n') {
            e.preventDefault();
            this.quickAddTask();
            return;
        }
        
        // Ctrl+T / Cmd+T: Go to today
        if (ctrlKey && e.key === 't') {
            e.preventDefault();
            this.goToToday();
            return;
        }
        
        // Ctrl+F / Cmd+F: Focus search
        if (ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('quickSearch');
            if (searchInput) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar.classList.contains('hidden')) {
                    sidebar.classList.remove('hidden');
                }
                searchInput.focus();
                searchInput.select();
            }
            return;
        }
        
        // Ctrl+/ or Cmd+/: Show keyboard shortcuts
        if (ctrlKey && e.key === '/') {
            e.preventDefault();
            this.showShortcutsModal();
            return;
        }
        
        // Ctrl+Z / Cmd+Z: Undo
        if (ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.undo();
            return;
        }
        
        // Ctrl+Y / Cmd+Y or Ctrl+Shift+Z: Redo
        if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            this.redo();
            return;
        }
        
        // S: Toggle sidebar
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('hidden');
            return;
        }
        
        // Arrow keys: Navigate dates
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.navigateView(-1);
            return;
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.navigateView(1);
            return;
        }
    }

    // ===== UNDO/REDO FUNCTIONALITY =====
    
    saveState(action) {
        const state = {
            tasks: JSON.parse(JSON.stringify(this.tasks)),
            action: action,
            timestamp: Date.now()
        };
        
        this.undoStack.push(state);
        
        // Limit stack size
        if (this.undoStack.length > this.maxUndoStackSize) {
            this.undoStack.shift();
        }
        
        // Clear redo stack when new action is performed
        this.redoStack = [];
    }
    
    undo() {
        if (this.undoStack.length === 0) {
            this.showToast('Nothing to undo');
            return;
        }
        
        // Save current state to redo stack
        const currentState = {
            tasks: JSON.parse(JSON.stringify(this.tasks)),
            action: 'current',
            timestamp: Date.now()
        };
        this.redoStack.push(currentState);
        
        // Restore previous state
        const previousState = this.undoStack.pop();
        this.tasks = previousState.tasks;
        this.saveTasks();
        this.renderCurrentView();
        this.updateSidebarTags();
        
        this.showToastWithAction(`Undone: ${previousState.action}`, 'Redo', () => this.redo());
    }
    
    redo() {
        if (this.redoStack.length === 0) {
            this.showToast('Nothing to redo');
            return;
        }
        
        // Save current state to undo stack
        const currentState = {
            tasks: JSON.parse(JSON.stringify(this.tasks)),
            action: 'current',
            timestamp: Date.now()
        };
        this.undoStack.push(currentState);
        
        // Restore redo state
        const redoState = this.redoStack.pop();
        this.tasks = redoState.tasks;
        this.saveTasks();
        this.renderCurrentView();
        this.updateSidebarTags();
        
        this.showToast('Redo completed');
    }
    
    showToastWithAction(message, actionText, actionCallback) {
        this.elements.toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-action">${actionText}</button>
        `;
        this.elements.toast.classList.add('show', 'has-action');
        
        const actionBtn = this.elements.toast.querySelector('.toast-action');
        actionBtn.addEventListener('click', () => {
            actionCallback();
            this.elements.toast.classList.remove('show', 'has-action');
        });
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show', 'has-action');
            this.elements.toast.innerHTML = '';
        }, 5000);
    }
    
    // ===== CUSTOM DATE PICKER =====
    
    openDatePicker() {
        // Set picker to current task date or today
        if (this.elements.taskDate.value) {
            this.pickerDate = new Date(this.elements.taskDate.value + 'T00:00:00');
        } else {
            this.pickerDate = new Date();
        }
        
        this.renderDatePicker();
        this.elements.datePickerOverlay.classList.add('active');
    }
    
    closeDatePicker() {
        this.elements.datePickerOverlay.classList.remove('active');
    }
    
    renderDatePicker() {
        const year = this.pickerDate.getFullYear();
        const month = this.pickerDate.getMonth();
        
        // Update title
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        this.elements.datePickerTitle.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Get selected date
        const selectedDate = this.elements.taskDate.value;
        const today = new Date();
        
        // Clear days
        this.elements.datePickerDays.innerHTML = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayEl = this.createPickerDay(day, month - 1, year, true, false, selectedDate, today);
            this.elements.datePickerDays.appendChild(dayEl);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getFullYear() === year && 
                           today.getMonth() === month && 
                           today.getDate() === day;
            const dayEl = this.createPickerDay(day, month, year, false, isToday, selectedDate, today);
            this.elements.datePickerDays.appendChild(dayEl);
        }
        
        // Next month days
        const totalCells = this.elements.datePickerDays.children.length;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = this.createPickerDay(day, month + 1, year, true, false, selectedDate, today);
            this.elements.datePickerDays.appendChild(dayEl);
        }
    }
    
    createPickerDay(day, month, year, isOtherMonth, isToday, selectedDate, today) {
        const dayEl = document.createElement('button');
        dayEl.type = 'button';
        dayEl.className = 'picker-day';
        dayEl.textContent = day;
        
        if (isOtherMonth) {
            dayEl.classList.add('other-month');
        }
        
        if (isToday) {
            dayEl.classList.add('today');
        }
        
        // Check if this day is selected
        const dateStr = this.formatDateKey(year, month, day);
        if (selectedDate === dateStr) {
            dayEl.classList.add('selected');
        }
        
        dayEl.addEventListener('click', () => {
            this.selectDate(year, month, day);
        });
        
        return dayEl;
    }
    
    selectDate(year, month, day) {
        const dateStr = this.formatDateKey(year, month, day);
        this.elements.taskDate.value = dateStr;
        
        // Update display
        const date = new Date(year, month, day);
        this.elements.taskDateDisplay.value = date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        this.closeDatePicker();
    }
    
    changePickerMonth(direction) {
        this.pickerDate.setMonth(this.pickerDate.getMonth() + direction);
        this.renderDatePicker();
    }
    
    selectToday() {
        const today = new Date();
        this.selectDate(today.getFullYear(), today.getMonth(), today.getDate());
    }
    
    clearDate() {
        this.elements.taskDate.value = '';
        this.elements.taskDateDisplay.value = '';
        this.closeDatePicker();
    }
    
    // ===== CUSTOM TIME PICKER =====
    
    initializeTimePicker() {
        // Populate hours (00-23)
        for (let i = 0; i < 24; i++) {
            const hourEl = document.createElement('div');
            hourEl.className = 'time-option';
            hourEl.textContent = String(i).padStart(2, '0');
            hourEl.dataset.value = i;
            hourEl.addEventListener('click', () => this.selectHour(i, hourEl));
            this.elements.hourColumn.appendChild(hourEl);
        }
        
        // Populate minutes (00-59)
        for (let i = 0; i < 60; i++) {
            const minuteEl = document.createElement('div');
            minuteEl.className = 'time-option';
            minuteEl.textContent = String(i).padStart(2, '0');
            minuteEl.dataset.value = i;
            minuteEl.addEventListener('click', () => this.selectMinute(i, minuteEl));
            this.elements.minuteColumn.appendChild(minuteEl);
        }
    }
    
    openTimePicker() {
        // Reset or load current time
        if (this.elements.taskTime.value) {
            const [hour, minute] = this.elements.taskTime.value.split(':');
            this.selectedHour = parseInt(hour);
            this.selectedMinute = parseInt(minute);
        } else {
            // Default to current time
            const now = new Date();
            this.selectedHour = now.getHours();
            this.selectedMinute = now.getMinutes();
        }
        
        // Update UI
        this.updateTimeSelection();
        
        this.elements.timePickerOverlay.classList.add('active');
    }
    
    closeTimePicker() {
        this.elements.timePickerOverlay.classList.remove('active');
    }
    
    selectHour(hour, element) {
        this.selectedHour = hour;
        
        // Update selection
        this.elements.hourColumn.querySelectorAll('.time-option').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        
        // Scroll to center
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    selectMinute(minute, element) {
        this.selectedMinute = minute;
        
        // Update selection
        this.elements.minuteColumn.querySelectorAll('.time-option').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        
        // Scroll to center
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    updateTimeSelection() {
        // Clear previous selections
        this.elements.hourColumn.querySelectorAll('.time-option').forEach(el => {
            el.classList.remove('selected');
            if (parseInt(el.dataset.value) === this.selectedHour) {
                el.classList.add('selected');
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        });
        
        this.elements.minuteColumn.querySelectorAll('.time-option').forEach(el => {
            el.classList.remove('selected');
            if (parseInt(el.dataset.value) === this.selectedMinute) {
                el.classList.add('selected');
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }
        });
    }
    
    setTime() {
        if (this.selectedHour !== null && this.selectedMinute !== null) {
            const timeStr = `${String(this.selectedHour).padStart(2, '0')}:${String(this.selectedMinute).padStart(2, '0')}`;
            this.elements.taskTime.value = timeStr;
            
            // Update display
            const hour12 = this.selectedHour % 12 || 12;
            const ampm = this.selectedHour >= 12 ? 'PM' : 'AM';
            this.elements.taskTimeDisplay.value = `${String(hour12).padStart(2, '0')}:${String(this.selectedMinute).padStart(2, '0')} ${ampm}`;
            
            this.closeTimePicker();
        } else {
            this.showToast('Please select both hour and minute');
        }
    }
    
    clearTime() {
        this.elements.taskTime.value = '';
        this.elements.taskTimeDisplay.value = '';
        this.selectedHour = null;
        this.selectedMinute = null;
        this.closeTimePicker();
    }
    
    // ===== KEYBOARD SHORTCUTS MODAL =====
    
    showShortcutsModal() {
        this.elements.shortcutsModal.classList.add('active');
    }
    
    closeShortcutsModal() {
        this.elements.shortcutsModal.classList.remove('active');
    }
    
    // ===== RECURRENCE FUNCTIONALITY =====
    
    generateRecurringTasks(task, recurrence) {
        const startDate = new Date(task.date);
        const endDate = recurrence.endDate ? new Date(recurrence.endDate) : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // Default 1 year
        const interval = recurrence.interval || 1;
        const generatedTasks = [];
        
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const dateStr = this.formatDate(currentDate);
            
            // Skip the original date (it's already added)
            if (dateStr !== task.date) {
                const recurringTask = {
                    ...task,
                    id: this.generateId(),
                    date: dateStr,
                    recurrence: recurrence,
                    isRecurring: true,
                    parentTaskId: task.id
                };
                
                generatedTasks.push(recurringTask);
            }
            
            // Move to next occurrence
            if (recurrence.type === 'daily') {
                currentDate.setDate(currentDate.getDate() + interval);
            } else if (recurrence.type === 'weekly') {
                currentDate.setDate(currentDate.getDate() + (7 * interval));
            } else if (recurrence.type === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + interval);
            }
        }
        
        return generatedTasks;
    }
    
    addRecurringTasksToCalendar(tasks) {
        tasks.forEach(task => {
            const dateStr = task.date;
            
            if (!this.tasks[dateStr]) {
                this.tasks[dateStr] = [];
            }
            
            this.tasks[dateStr].push(task);
        });
    }

    // LocalStorage operations
    saveTasks() {
        localStorage.setItem('planit_tasks', JSON.stringify(this.tasks));
    }

    // Load holidays from JSON file
    async loadHolidays() {
        try {
            const response = await fetch('holidays.json');
            if (response.ok) {
                this.holidays = await response.json();
                console.log('Holidays loaded:', Object.keys(this.holidays).length, 'events');
                this.renderCurrentView(); // Re-render to show holidays
            }
        } catch (error) {
            console.warn('Could not load holidays.json:', error);
            this.holidays = {};
        }
    }

    loadTasks() {
        const stored = localStorage.getItem('planit_tasks');
        const tasks = stored ? JSON.parse(stored) : {};
        
        // Normalize all date keys to padded format (YYYY-MM-DD)
        // This fixes existing tasks that may have unpadded dates like "2025-10-5"
        const normalizedTasks = {};
        for (const dateKey in tasks) {
            // Inline normalization to avoid method call before constructor completes
            const [year, month, day] = dateKey.split('-');
            const normalizedKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            normalizedTasks[normalizedKey] = tasks[dateKey];
            // Update date property in each task
            if (Array.isArray(normalizedTasks[normalizedKey])) {
                normalizedTasks[normalizedKey].forEach(task => {
                    task.date = normalizedKey;
                });
            }
        }
        
        // Save the normalized tasks back to localStorage
        if (Object.keys(normalizedTasks).length > 0 && JSON.stringify(tasks) !== JSON.stringify(normalizedTasks)) {
            localStorage.setItem('planit_tasks', JSON.stringify(normalizedTasks));
        }
        
        return normalizedTasks;
    }
    
    // ===== DRAG AND DROP FUNCTIONALITY =====
    
    initializeDragAndDrop() {
        // Will be called after rendering to add drag handlers to all task items
        // Month view tasks
        document.querySelectorAll('.task-item:not(.holiday-event)').forEach(taskItem => {
            this.makeTaskDraggable(taskItem);
        });
        
        // Week view tasks
        document.querySelectorAll('.week-task:not(.holiday-event)').forEach(taskItem => {
            this.makeTaskDraggable(taskItem);
        });
        
        // Day view tasks
        document.querySelectorAll('.day-task:not(.holiday-event)').forEach(taskItem => {
            this.makeTaskDraggable(taskItem);
        });
        
        // Make all day cells droppable (month view)
        document.querySelectorAll('.day-cell').forEach(cell => {
            this.makeDroppable(cell);
        });
        
        // Make week and day slots droppable
        document.querySelectorAll('.week-day-slot, .day-hour').forEach(slot => {
            this.makeDroppable(slot);
        });
    }
    
    makeTaskDraggable(taskItem) {
        taskItem.setAttribute('draggable', 'true');
        taskItem.classList.add('draggable-task');
        
        taskItem.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            taskItem.classList.add('dragging');
            
            // Get task ID from the click handler or data attribute
            const taskId = taskItem.dataset.taskId || taskItem.getAttribute('data-task-id');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', taskId);
            
            // Set drag image
            e.dataTransfer.setDragImage(taskItem, e.offsetX, e.offsetY);
        });
        
        taskItem.addEventListener('dragend', (e) => {
            taskItem.classList.remove('dragging');
            // Remove all drag-over classes
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
        });
    }
    
    makeDroppable(dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Prevent adding class to dragged item itself
            if (!e.currentTarget.classList.contains('dragging')) {
                e.currentTarget.classList.add('drag-over');
            }
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.currentTarget.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            if (!taskId) return;
            
            // Get the target date
            let targetDate = null;
            
            if (e.currentTarget.classList.contains('day-cell')) {
                // Month view drop
                const dayNumber = e.currentTarget.querySelector('.day-number');
                if (dayNumber) {
                    // Extract date from the cell
                    // We need to reconstruct the date from the cell's position
                    targetDate = e.currentTarget.dataset.date;
                    
                    // If no data-date, we'll need to calculate it
                    if (!targetDate) {
                        // This will be set when we render the cell
                        console.warn('No date found on drop target');
                        return;
                    }
                }
            } else if (e.currentTarget.classList.contains('week-day-slot')) {
                // Week view drop
                targetDate = e.currentTarget.dataset.date;
            } else if (e.currentTarget.classList.contains('day-hour')) {
                // Day view drop
                const dateHeader = document.querySelector('.day-header-date');
                if (dateHeader) {
                    const currentDate = this.currentDate;
                    targetDate = this.formatDateKey(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate()
                    );
                }
            }
            
            if (targetDate) {
                this.moveTaskToDate(taskId, targetDate);
            }
        });
    }
    
    moveTaskToDate(taskId, newDate) {
        // Find the task
        const task = this.findTaskById(taskId);
        if (!task || task.isHoliday || task.readOnly) return;
        
        const oldDate = task.date;
        if (oldDate === newDate) return; // Same date, no move needed
        
        // Save state for undo
        this.saveState('Move task');
        
        // Remove from old date
        this.tasks[oldDate] = this.tasks[oldDate].filter(t => t.id !== taskId);
        if (this.tasks[oldDate].length === 0) {
            delete this.tasks[oldDate];
        }
        
        // Add to new date
        task.date = newDate;
        if (!this.tasks[newDate]) {
            this.tasks[newDate] = [];
        }
        this.tasks[newDate].push(task);
        
        // Save and refresh
        this.saveTasks();
        this.renderCurrentView();
        this.updateSidebarTags();
        this.showToast(`Task moved to ${this.formatDateForDisplay(newDate)}`);
    }
    
    formatDateForDisplay(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    new SidebarManager(taskManager);
});

// Sidebar Manager Class
class SidebarManager {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.pomodoroTime = 25 * 60;
        this.pomodoroInterval = null;
        this.pomodoroRunning = false;
        
        this.initializeSidebar();
        this.updateStatistics();
        this.initializeMiniCalendar();
        this.updateUpcomingTasks();
        this.initializePomodoro();
        this.loadNotes();
        this.initializeBatteryStatus();
        this.initializeQuotes();
        this.updateActivityFeed();
        this.taskManager.updateSidebarTags();
        
        // Update stats when tasks change
        setInterval(() => {
            this.updateStatistics();
            this.taskManager.updateSidebarTags();
        }, 5000);
    }
    
    initializeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const quickAddTask = document.getElementById('quickAddTask');
        const quickSearch = document.getElementById('quickSearch');
        const filterByColor = document.getElementById('filterByColor');
        const quickNotes = document.getElementById('quickNotes');
        
        // Keep sidebar hidden by default on every load/reload
        sidebar.classList.add('hidden');
        
        // Sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
                // Save sidebar state to localStorage
                const isVisible = !sidebar.classList.contains('hidden');
                localStorage.setItem('planit_sidebar_state', isVisible ? 'visible' : 'hidden');
            });
        }
        
        // Quick add task
        if (quickAddTask) {
            quickAddTask.addEventListener('click', () => {
                this.taskManager.elements.addTaskBtn.click();
            });
        }
        
        // Quick search
        if (quickSearch) {
            quickSearch.addEventListener('input', (e) => {
                this.filterTasks(e.target.value);
            });
        }
        
        // Color filter
        if (filterByColor) {
            filterByColor.addEventListener('change', (e) => {
                this.filterTasksByColor(e.target.value);
            });
        }
        
        // Save notes
        if (quickNotes) {
            quickNotes.addEventListener('input', (e) => {
                localStorage.setItem('planit_notes', e.target.value);
            });
        }
    }
    
    // 1. Update Statistics Dashboard
    updateStatistics() {
        const tasks = Object.values(this.taskManager.tasks).flat();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completionRate').textContent = completionRate + '%';
        document.getElementById('progressFill').style.width = completionRate + '%';
        
        // Calculate streak
        const streak = this.calculateStreak();
        document.getElementById('streakDays').textContent = streak;
    }
    
    calculateStreak() {
        const tasks = Object.entries(this.taskManager.tasks).sort();
        let streak = 0;
        let currentDate = new Date();
        
        for (let i = 0; i < 30; i++) {
            const dateKey = this.formatDate(currentDate);
            const dayTasks = this.taskManager.tasks[dateKey] || [];
            const hasCompletedTask = dayTasks.some(t => t.completed);
            
            if (hasCompletedTask) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    // 2. Filter Tasks (Quick Actions)
    filterTasks(query) {
        const lowerQuery = query.toLowerCase();
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(lowerQuery)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    filterTasksByColor(color) {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            if (color === 'all' || item.classList.contains(`color-${color}`)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 3. Initialize Mini Calendar
    initializeMiniCalendar() {
        const container = document.getElementById('miniCalendar');
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let html = '<div class="mini-calendar-header">';
        html += `<span class="mini-calendar-month">${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>`;
        html += '</div>';
        
        html += '<div class="mini-calendar-grid">';
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        days.forEach(day => {
            html += `<div class="mini-day-label">${day}</div>`;
        });
        
        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="mini-day other-month"></div>';
        }
        
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = this.formatDate(date);
            const hasTasks = this.taskManager.tasks[dateKey] && this.taskManager.tasks[dateKey].length > 0;
            const isToday = day === now.getDate();
            
            let classes = 'mini-day';
            if (isToday) classes += ' today';
            if (hasTasks) classes += ' has-tasks';
            
            html += `<div class="${classes}" data-date="${dateKey}">${day}</div>`;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.mini-day:not(.other-month)').forEach(day => {
            day.addEventListener('click', (e) => {
                const dateStr = e.target.dataset.date;
                if (dateStr) {
                    const [year, month, dayNum] = dateStr.split('-');
                    this.taskManager.currentDate = new Date(year, month - 1, dayNum);
                    this.taskManager.switchView('day');
                }
            });
        });
    }
    
    // 4. Update Upcoming Tasks
    updateUpcomingTasks() {
        const container = document.getElementById('upcomingTasks');
        const now = new Date();
        const upcoming = [];
        
        // Get tasks for next 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            const dateKey = this.formatDate(date);
            const dayTasks = this.taskManager.tasks[dateKey] || [];
            
            dayTasks.forEach(task => {
                if (!task.completed) {
                    upcoming.push({ ...task, date: date, dateKey: dateKey });
                }
            });
        }
        
        if (upcoming.length === 0) {
            container.innerHTML = '<p class="empty-message">No upcoming tasks</p>';
            return;
        }
        
        let html = '';
        upcoming.slice(0, 5).forEach(task => {
            html += `
                <div class="upcoming-task-item color-${task.color}" data-id="${task.id}" data-date="${task.dateKey}">
                    <div class="upcoming-task-date">${task.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div class="upcoming-task-title">${task.title}</div>
                    ${task.time ? `<div class="upcoming-task-time">⏰ ${task.time}</div>` : ''}
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.upcoming-task-item').forEach(item => {
            item.addEventListener('click', () => {
                const taskId = item.dataset.id;
                const dateKey = item.dataset.date;
                const task = this.taskManager.tasks[dateKey]?.find(t => t.id === taskId);
                if (task) {
                    this.taskManager.showTaskDetails(task);
                }
            });
        });
    }
    
    // 5. Load Notes
    loadNotes() {
        const notes = localStorage.getItem('planit_notes') || '';
        const quickNotes = document.getElementById('quickNotes');
        if (quickNotes) {
            quickNotes.value = notes;
        }
    }
    
    // 6. Initialize Custom Timer (Google Style)
    initializePomodoro() {
        // Load settings and presets from localStorage
        this.timerSettings = JSON.parse(localStorage.getItem('planit_timer_settings')) || {
            notificationsEnabled: true,
            soundEnabled: true,
            autoRepeat: false
        };
        
        this.timerPresets = JSON.parse(localStorage.getItem('planit_timer_presets')) || [
            { name: 'Pomodoro Work', hours: 0, minutes: 25, seconds: 0 },
            { name: 'Short Break', hours: 0, minutes: 5, seconds: 0 },
            { name: 'Long Break', hours: 0, minutes: 15, seconds: 0 }
        ];
        
        // Timer state
        this.timerRunning = false;
        this.timerTime = 0; // Current time in seconds
        this.timerTotalTime = 0; // Total time set
        this.timerInterval = null;
        
        // DOM elements
        this.timerNameInput = document.getElementById('timerNameInput');
        this.hoursInput = document.getElementById('hoursInput');
        this.minutesInput = document.getElementById('minutesInput');
        this.secondsInput = document.getElementById('secondsInput');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('timerStart');
        this.pauseBtn = document.getElementById('timerPause');
        this.resetBtn = document.getElementById('timerReset');
        this.saveBtn = document.getElementById('timerSave');
        this.progressRing = document.getElementById('progressRing');
        this.savedTimersList = document.getElementById('savedTimersList');
        this.btnAddPreset = document.getElementById('btnAddPreset');
        this.settingsToggle = document.getElementById('timerSettingsToggle');
        this.settingsPanel = document.getElementById('timerSettingsPanel');
        
        // Populate settings
        document.getElementById('notificationsEnabled').checked = this.timerSettings.notificationsEnabled;
        document.getElementById('soundEnabled').checked = this.timerSettings.soundEnabled;
        document.getElementById('autoRepeat').checked = this.timerSettings.autoRepeat;
        
        // Request notification permission
        if (this.timerSettings.notificationsEnabled && 'Notification' in window) {
            Notification.requestPermission();
        }
        
        // Render saved presets
        this.renderTimerPresets();
        
        // Time input validation
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach((input, index) => {
            const maxValues = [23, 59, 59];
            input.addEventListener('input', (e) => {
                let value = parseInt(e.target.value) || 0;
                if (value < 0) e.target.value = 0;
                if (value > maxValues[index]) e.target.value = maxValues[index];
            });
            
            input.addEventListener('change', () => {
                this.updateTimerFromInputs();
            });
        });
        
        // Start button
        this.startBtn.addEventListener('click', () => {
            this.startTimer();
        });
        
        // Pause button
        this.pauseBtn.addEventListener('click', () => {
            this.pauseTimer();
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Save button
        this.saveBtn.addEventListener('click', () => {
            this.saveCurrentAsPreset();
        });
        
        // Add preset button
        this.btnAddPreset.addEventListener('click', () => {
            this.saveCurrentAsPreset();
        });
        
        // Settings toggle
        this.settingsToggle.addEventListener('click', () => {
            const isVisible = this.settingsPanel.style.display === 'block';
            this.settingsPanel.style.display = isVisible ? 'none' : 'block';
        });
        
        // Settings change handlers
        ['notificationsEnabled', 'soundEnabled', 'autoRepeat'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.timerSettings[id] = e.target.checked;
                this.saveTimerSettings();
                if (id === 'notificationsEnabled' && e.target.checked) {
                    Notification.requestPermission();
                }
            });
        });
        
        // Set initial time from inputs
        this.updateTimerFromInputs();
    }
    
    // Update timer from input fields
    updateTimerFromInputs() {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        this.timerTime = (hours * 3600) + (minutes * 60) + seconds;
        this.timerTotalTime = this.timerTime;
        this.updateTimerDisplay();
        this.updateProgressRing();
    }
    
    // Start timer
    startTimer() {
        if (this.timerTime === 0) {
            this.taskManager.showToast('Please set a time first');
            return;
        }
        
        this.timerRunning = true;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'block';
        this.progressRing.classList.add('running');
        
        this.timerInterval = setInterval(() => {
            this.timerTime--;
            this.updateTimerDisplay();
            this.updateProgressRing();
            
            if (this.timerTime <= 0) {
                this.onTimerComplete();
            }
        }, 1000);
    }
    
    // Pause timer
    pauseTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.startBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';
        this.startBtn.textContent = '▶ Resume';
    }
    
    // Reset timer
    resetTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.startBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';
        this.startBtn.textContent = '▶ Start';
        
        this.updateTimerFromInputs();
        this.progressRing.classList.remove('running');
    }
    
    // Timer complete
    onTimerComplete() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.startBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';
        this.startBtn.textContent = '▶ Start';
        this.progressRing.classList.remove('running');
        
        // Notification
        const timerName = this.timerNameInput.value || 'Timer';
        this.showTimerNotification(`⏰ ${timerName} complete!`);
        
        // Auto-repeat
        if (this.timerSettings.autoRepeat) {
            setTimeout(() => {
                this.resetTimer();
                this.startTimer();
            }, 2000);
        }
    }
    
    // Update display
    updateTimerDisplay() {
        const hours = Math.floor(this.timerTime / 3600);
        const minutes = Math.floor((this.timerTime % 3600) / 60);
        const seconds = this.timerTime % 60;
        
        this.timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update progress ring
    updateProgressRing() {
        const progress = 1 - (this.timerTime / this.timerTotalTime);
        const circumference = 2 * Math.PI * 60;
        const offset = circumference * (1 - progress);
        this.progressRing.style.strokeDashoffset = offset;
    }
    
    // Save current as preset
    saveCurrentAsPreset() {
        const name = this.timerNameInput.value.trim() || `Timer ${this.timerPresets.length + 1}`;
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
            this.taskManager.showToast('Please set a time first');
            return;
        }
        
        const preset = { name, hours, minutes, seconds };
        this.timerPresets.push(preset);
        this.saveTimerPresets();
        this.renderTimerPresets();
        this.taskManager.showToast(`Saved: ${name}`);
    }
    
    // Render preset list
    renderTimerPresets() {
        this.savedTimersList.innerHTML = '';
        
        this.timerPresets.forEach((preset, index) => {
            const presetEl = document.createElement('div');
            presetEl.className = 'timer-preset';
            
            const duration = `${preset.hours > 0 ? preset.hours + ':' : ''}${preset.minutes}:${preset.seconds.toString().padStart(2, '0')}`;
            
            presetEl.innerHTML = `
                <div class="preset-info">
                    <div class="preset-name">${preset.name}</div>
                    <div class="preset-duration">${duration}</div>
                </div>
                <div class="preset-actions">
                    <button class="preset-btn-load" title="Load timer">▶</button>
                    <button class="preset-btn-delete" title="Delete">×</button>
                </div>
            `;
            
            // Load preset
            presetEl.querySelector('.preset-btn-load').addEventListener('click', (e) => {
                e.stopPropagation();
                this.loadPreset(preset);
            });
            
            // Delete preset
            presetEl.querySelector('.preset-btn-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePreset(index);
            });
            
            this.savedTimersList.appendChild(presetEl);
        });
    }
    
    // Load preset
    loadPreset(preset) {
        this.timerNameInput.value = preset.name;
        this.hoursInput.value = preset.hours;
        this.minutesInput.value = preset.minutes;
        this.secondsInput.value = preset.seconds;
        this.updateTimerFromInputs();
        this.taskManager.showToast(`Loaded: ${preset.name}`);
    }
    
    // Delete preset
    deletePreset(index) {
        const preset = this.timerPresets[index];
        this.timerPresets.splice(index, 1);
        this.saveTimerPresets();
        this.renderTimerPresets();
        this.taskManager.showToast(`Deleted: ${preset.name}`);
    }
    
    // Save settings
    saveTimerSettings() {
        localStorage.setItem('planit_timer_settings', JSON.stringify(this.timerSettings));
    }
    
    // Save presets
    saveTimerPresets() {
        localStorage.setItem('planit_timer_presets', JSON.stringify(this.timerPresets));
    }
    
    // Show notification
    showTimerNotification(message) {
        // Browser notification
        if (this.timerSettings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('PlanIt Timer', {
                body: message,
                icon: 'assets/logo.png'
            });
        }
        
        // In-app toast
        this.taskManager.showToast(message);
    }
    
    // 8. Initialize Battery Status
    async initializeBatteryStatus() {
        const batteryIcon = document.getElementById('batteryIcon');
        const batteryLevel = document.getElementById('batteryLevel');
        const batteryStatus = document.getElementById('batteryStatus');
        
        console.log('🔋 Initializing Battery Status...');
        
        try {
            // Check if Battery API is supported
            if ('getBattery' in navigator) {
                console.log('✅ Battery API is supported');
                const battery = await navigator.getBattery();
                console.log('✅ Battery object obtained:', {
                    level: battery.level,
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                });
                
                const updateBatteryStatus = () => {
                    // Use Math.floor to match system reporting (96.8% shows as 96%)
                    const level = Math.floor(battery.level * 100);
                    const isCharging = battery.charging;
                    
                    console.log(`🔄 Battery Update: ${level}%, Charging: ${isCharging}, Raw: ${battery.level}`);
                    
                    // Update battery level
                    batteryLevel.textContent = `${level}%`;
                    
                    // Update icon and status based on charging state
                    if (isCharging) {
                        batteryIcon.textContent = '⚡';
                        batteryStatus.textContent = 'Charging...';
                        batteryLevel.className = 'battery-level charging';
                    } else {
                        // Show appropriate icon based on level
                        if (level > 80) {
                            batteryIcon.textContent = '🔋';
                        } else if (level > 50) {
                            batteryIcon.textContent = '🔋';
                        } else if (level > 20) {
                            batteryIcon.textContent = '🪫';
                        } else {
                            batteryIcon.textContent = '🪫';
                        }
                        
                        batteryStatus.textContent = level > 20 ? 'On Battery' : 'Low Battery';
                        batteryLevel.className = level > 20 ? 'battery-level' : 'battery-level low';
                    }
                };
                
                // Initial update
                updateBatteryStatus();
                
                // Listen for battery changes (INSTANT updates)
                battery.addEventListener('chargingchange', () => {
                    console.log('⚡ Charging state changed!');
                    updateBatteryStatus();
                });
                
                battery.addEventListener('levelchange', () => {
                    console.log('📊 Battery level changed!');
                    updateBatteryStatus();
                });
                
                battery.addEventListener('chargingtimechange', () => {
                    console.log('⏱️ Charging time changed');
                    updateBatteryStatus();
                });
                
                battery.addEventListener('dischargingtimechange', () => {
                    console.log('⏱️ Discharging time changed');
                    updateBatteryStatus();
                });
                
                // Update every 5 seconds for live updates (more frequent)
                setInterval(() => {
                    console.log('🔄 Periodic update triggered');
                    updateBatteryStatus();
                }, 5000);
                
            } else {
                // Battery API not supported
                console.log('❌ Battery API not supported');
                console.log('ℹ️ This could be: Desktop PC, or Browser blocking the API (like Brave)');
                batteryIcon.textContent = '🔌';
                batteryLevel.textContent = 'N/A';
                batteryStatus.textContent = 'Battery info unavailable';
            }
        } catch (error) {
            // Error accessing battery
            console.error('❌ Battery API error:', error);
            console.log('ℹ️ This is normal for: Desktop PCs, or browsers with privacy shields (Brave, Firefox)');
            batteryIcon.textContent = '🔌';
            batteryLevel.textContent = 'N/A';
            batteryStatus.textContent = 'Battery info unavailable';
        }
    }
    
    // 9. Initialize Quotes
    initializeQuotes() {
        const quotes = [
            { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
            { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "Action is the foundational key to all success.", author: "Pablo Picasso" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.querySelector('.quote-text').textContent = `"${randomQuote.text}"`;
        document.querySelector('.quote-author').textContent = `— ${randomQuote.author}`;
    }
    
    // 10. Update Activity Feed
    updateActivityFeed() {
        const container = document.getElementById('activityFeed');
        const recentActivity = this.getRecentActivity();
        
        if (recentActivity.length === 0) {
            container.innerHTML = '<p class="empty-message">No recent activity</p>';
            return;
        }
        
        let html = '';
        recentActivity.slice(0, 5).forEach(activity => {
            html += `
                <div class="activity-item">
                    <div class="activity-icon">${activity.icon}</div>
                    <div class="activity-content">
                        <div class="activity-text">${activity.text}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    getRecentActivity() {
        const activities = [];
        const now = new Date();
        
        // Get all tasks and sort by creation/completion
        Object.entries(this.taskManager.tasks).forEach(([dateKey, tasks]) => {
            tasks.forEach(task => {
                if (task.completed) {
                    activities.push({
                        icon: '✅',
                        text: `Completed: ${task.title}`,
                        time: 'Recently',
                        timestamp: now
                    });
                } else {
                    activities.push({
                        icon: '➕',
                        text: `Added: ${task.title}`,
                        time: 'Recently',
                        timestamp: now
                    });
                }
            });
        });
        
        return activities.slice(-5).reverse();
    }
    
    // Helper Methods
    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    showNotification(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
}
