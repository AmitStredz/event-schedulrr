# 🌟 Dynamic Event Calendar Application 🌟

A feature-rich, interactive event calendar built with **React.js** and styled with **shadcn** for a clean, modern UI. This app allows users to manage events efficiently with advanced calendar logic and data persistence.

---

## 🗓️ **Overview**
The **Dynamic Event Calendar Application** is designed to help users organize their schedules seamlessly. With robust functionality and a user-friendly interface, it ensures a smooth experience for managing events.

---

## 🚀 **Features**

### 📅 **Core Functionalities**
- **Calendar View**:
  - Displays a monthly calendar in a grid format.
  - Navigate between months using "Previous" and "Next" buttons.
- **Event Management**:
  - Add, edit, and delete events for specific days.
  - Event details include:
    - Name of the event.
    - Start and End Time.
    - Optional Description.
- **Event List**:
  - Displays all events for the selected day in a modal or side panel.
- **Data Persistence**:
  - Events are saved in `localStorage` to retain data even after refreshing the page.

### 🧠 **Advanced Logic**
- Smooth month transitions (e.g., Jan 31 → Feb 1).
- Prevention of overlapping events for the same time slots.
- Search and filter events by keywords.

### 🎨 **UI Design**
- Clean and modern interface using **shadcn** components.
- Highlights for:
  - The current day.
  - Selected day.
- Clear distinction between weekends and weekdays.

### ✨ **Bonus Features** (Optional)
- **Drag-and-drop** functionality to reschedule events between days.
- **Color-coded events** for different categories (e.g., Work, Personal, Others).
- Export the event list of a month as **JSON**.

---

## 🌐 **Live Demo**
Check out the deployed application: https://event-schedulrr.vercel.app/

---

## 🛠️ **Technologies Used**
- **Frontend**: React.js (Vite) with functional components and hooks.
- **UI Library**: shadcn for component styling.
- **Styling**: TailwindCSS.
- **Data Persistence**: localStorage.
- **Deployment**: Vercel.

---

## 🏗️ **Folder Structure**

```plaintext
src/
├── components/      # Reusable UI components.
    ├──ui            # Shadcn UI components.
    └──calendar      # Custom calendar components (CalendarHeader, EventPanels etc.)

├──lib               # Utility functions (calendar logic, export logic).
├──types             # Specifies event variable types.
├── App.tsx          # Main application entry point
└── index.tsx        # Application bootstrap
```

## 🛠️ **Getting Started**

Follow these steps to set up the project on your local machine:

### **Prerequisites**
Ensure you have the following installed on your system:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### **Installation**

1. **Clone the Repository**  
   Clone this repository to your local machine using the following command:
   ```bash
   git clone https://github.com/AmitStredz/event-schedulrr.git
   ```
   Redirect to the project repo
   ```bash
   cd event-schedulrr
   ```

2. Install Dependencies
Install all necessary dependencies using npm or yarn:
```bash
npm install
# or
yarn install
```
3. Run your project
```bash
npm run dev
```
The app will be available at:
http://localhost:5173
