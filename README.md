# PlanIt - Your Smart Task Calendar 📅

A full-featured, professional task calendar web application with multiple view modes, built with vanilla HTML, CSS, and JavaScript.

## 🌐 Live Demo

**[Visit PlanIt Live](https://shravan4507.github.io/personal-task-manager/)**

Experience the full-featured task calendar in action!

## 🎨 Design Features

### Dual Theme System
**Light Theme**
- **Primary**: Soft blue (#4A90E2)
- **Background**: Light gray (#F8F9FA)
- **Cards**: Pure white (#FFFFFF)
- **Text**: Dark gray (#212529)

**Dark Theme**
- **Primary**: Bright blue (#5BA3F5)
- **Background**: Slate (#0F172A)
- **Cards**: Dark slate (#1E293B)
- **Text**: Light gray (#F1F5F9)

### Visual Highlights
- Smooth theme transitions
- Animated theme toggle button
- Hover effects on interactive elements
- Today's date specially highlighted
- Completed tasks with strikethrough
- Clean, minimal design
- Theme preference saved automaticallyle view modes, built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### 🎯 Core Functionality
- **Multiple Calendar Views**: Switch between Day, Week, and Month views
- **Task Management**: Add, edit, delete, and mark tasks as completed
- **Rich Task Details**: Include title, time, and description for each task
- **Smart Task Display**: Tasks automatically sorted by time within each day
- **Persistent Storage**: All tasks saved in browser's localStorage

### 📊 Calendar Views

#### Month View
- Google Calendar-style grid layout
- See all days of the month at a glance
- Task previews in each day cell
- Click any day to add a task

#### Week View
- 7-day weekly timeline with hourly slots
- Perfect for detailed weekly planning
- Click any time slot to add a task at that hour
- See all week's tasks organized by time

#### Day View
- Detailed 24-hour timeline for a single day
- Full task details including descriptions
- Ideal for daily planning and focus
- Click any hour to add a task

### 🎨 User Interface
- **Dual Theme Support**: Toggle between Light and Dark themes
- **Professional Header**: Logo, tagline, and quick action buttons
- **Smart Navigation Bar**: Easy view switching and date navigation
- **Theme Toggle Button**: Smooth transition between light and dark modes
- **"Today" Button**: Instantly jump to current date
- **Quick Add**: Create tasks from header button
- **Dropdown Menu**: Access export, import, and utility functions

### 🛠️ Advanced Features
- **Export Tasks**: Download all tasks as JSON file
- **Import Tasks**: Load tasks from JSON file
- **Clear Completed**: Remove all completed tasks at once
- **Toast Notifications**: Visual feedback for all actions
- **Keyboard Shortcuts**:
  - `ESC` - Close modals and menus
  - `Enter` - Submit task forms
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🎯 Task Features
- ✅ Mark tasks as completed (with strikethrough styling)
- ⏰ Set specific times for tasks
- 📝 Add detailed descriptions
- 🎨 Color-coded completion status
- 🔄 Automatic time-based sorting

## 🚀 Getting Started

### Try it Online
Simply visit **[https://shravan4507.github.io/personal-task-manager/](https://shravan4507.github.io/personal-task-manager/)** to start using PlanIt immediately!

### Local Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Shravan4507/personal-task-manager.git
   ```

2. Open `index.html` in any modern web browser

That's it! No server or dependencies required.

### Deploy Your Own
Want to host your own version? This project is hosted on GitHub Pages. See the [Deployment](#-deployment) section below.

### Usage

#### Adding a Task
1. Click on any day/time slot in the calendar, OR
2. Click the "Add Task" button in the header
3. Fill in the task details:
   - Title (required)
   - Time (optional)
   - Description (optional)
4. Click "Save Task"

#### Viewing Task Details
- Click on any task in the calendar to see full details
- View time, description, and completion status
- Edit or delete from the details modal

#### Switching Views
- Use the view switcher in the navigation bar
- Choose between Day, Week, or Month views
- Navigation arrows adjust based on current view

#### Navigating Dates
- Use left/right arrows to navigate
- Click "Today" button to return to current date
- Different views navigate by day, week, or month

### Switching Themes
- Click the sun/moon icon in the navbar
- Theme preference is automatically saved
- Smooth transition between light and dark modes

## 🎨 Design Features

### Color Scheme
- **Primary**: Soft blue (#4A90E2)
- **Background**: Light gray (#F8F9FA)
- **Success**: Green (#5CB85C)
- **Neutral**: Professional grays

### Visual Highlights
- Smooth animations and transitions
- Hover effects on interactive elements
- Today's date specially highlighted
- Completed tasks with strikethrough
- Clean, minimal design

## 📱 Responsive Design

PlanIt works seamlessly across all devices:

- **Desktop**: Full feature set with spacious layout
- **Tablet**: Optimized for touch interaction
- **Mobile**: Compact view with essential functions

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, Grid, and Flexbox
- **JavaScript ES6+**: Modular class-based architecture

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

### Data Storage
- Uses browser's `localStorage` API
- Data persists across sessions
- No server or database required
- Export/import for backup and transfer

## 📋 Menu Options

### Export Tasks
Download all your tasks as a JSON file for backup or sharing.

### Import Tasks
Load tasks from a previously exported JSON file.

### Clear Completed
Remove all completed tasks to keep your calendar clean.

### About
View application information and version details.

## 🎯 Future Enhancement Ideas

While the current version is fully functional, here are some ideas for expansion:

- [ ] Task categories/tags with color coding
- [ ] Recurring tasks (daily, weekly, monthly)
- [ ] Task priorities (high, medium, low)
- [ ] Search and filter functionality
- [x] ~~Dark mode theme~~ ✅ Implemented!
- [ ] Task reminders/notifications
- [ ] Drag-and-drop task rescheduling
- [ ] Calendar sharing and collaboration
- [ ] Backend integration for multi-device sync
- [ ] Task statistics and analytics

## 💡 Tips & Tricks

1. **Quick Planning**: Use Week view for weekly planning sessions
2. **Daily Focus**: Use Day view to focus on today's tasks
3. **Overview**: Use Month view to see the big picture
4. **Backup Regularly**: Export your tasks periodically
5. **Mobile Usage**: Install as PWA for app-like experience (requires PWA setup)

## � Deployment

This project is deployed on **GitHub Pages** and is accessible at:  
**[https://shravan4507.github.io/personal-task-manager/](https://shravan4507.github.io/personal-task-manager/)**

### How to Deploy Your Own

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/Shravan4507/personal-task-manager.git
   ```

2. **Push to your GitHub repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Navigate to **Pages** in the left sidebar
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

4. **Access your site**
   - Your site will be live at: `https://[your-username].github.io/personal-task-manager/`
   - It may take a few minutes for the first deployment

### Automatic Deployment
- Any push to the `main` branch automatically updates the live site
- Changes typically reflect within 1-2 minutes

## �📄 License

This is a personal project. Feel free to use, modify, and distribute as needed.

## 🤝 Contributing

This is a standalone project, but feel free to:
- Report issues
- Suggest features
- Fork and modify for your needs

## ⭐ Credits

Built with ❤️ as a minimal, professional task calendar solution.

---

**Version**: 2.0  
**Last Updated**: October 2025  
**Status**: Production Ready ✅

### ✨ New in Version 2.0
- 🌓 Dual theme support (Light & Dark modes)
- 💾 Theme preference persistence
- 🎨 Smooth theme transitions
- 🌙 Animated theme toggle button
