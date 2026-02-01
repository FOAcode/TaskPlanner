# Task Planner

**Task Planner** is a lightweight, fast, and secure local task management tool designed to help you organize your activities efficiently. It runs entirely in your browser, ensuring your data remains private and under your control.

**[🚀 Open Task Planner](https://foacode.github.io/TaskPlanner/)**

## 🚀 Getting Started

To start using **Task Planner**, follow these simple steps:

### 1. Set Your Password
On your first visit, you will be prompted to create a password. This is a crucial step for securing your data.

**Why do you need a password?**
Your password is used to encrypt your task list, ensuring that only you can access your information. The encryption is performed locally in your browser, and your password is never stored or transmitted. This means that if you forget your password, it cannot be recovered.

### 2. Start Organizing Your Tasks
Once your password is set, you can start creating and managing your tasks. You can:
- **Create new tasks:** with a title, description, due date, and priority.
- **Organize tasks:** by dragging and dropping them between the `To Do`, `In Progress`, and `Done` columns.
- **Customize your view:** with different themes, fonts, and more.

## ✨ Features

**Task Planner** offers a comprehensive set of features to help you manage your tasks effectively:

### Task Management
- **Create and Edit Tasks:** Easily add new tasks with a title, description, due date, and priority level.
- **Task Prioritization:** Assign one of four priority levels to your tasks: `None`, `Low`, `Medium`, or `High`.
- **Task Status:** Organize your tasks into three categories: `To Do`, `In Progress`, and `Done`.
- **Drag and Drop:** Intuitively move tasks between statuses using a drag-and-drop interface.
- **Task Filtering:** Quickly find tasks by filtering them by name or description.
- **Copy to Clipboard:** Copy the tasks of a specific column to your clipboard for easy sharing.

### Security
- **Local Data Storage:** All your data is stored securely in your browser's local storage.
- **Password Protection:** Encrypt your task list with a password. Your data cannot be accessed without it.
- **Brute Force Protection:** After 5 incorrect password attempts, the login is temporarily disabled for 5 seconds to prevent brute-force attacks.
- **Data Encryption:** Your data is encrypted using the `AES-GCM` algorithm with a `256-bit` key derived from your password using `PBKDF2` with `100,000` iterations, ensuring a high level of security.

### Customization
- **Appearance:**
  - **Light and Dark Modes:** Switch between light and dark themes to suit your preference.
  - **One Color Mode:** A minimalist mode that uses a single color for all tasks.
- **Fonts:** Choose from a variety of font styles and families to personalize your experience.
- **Language:** The application is available in English and Italian.

### Data Management
- **Import and Export:** Easily back up and restore your task list by importing and exporting it as a `.json` file.
- **Progressive Web App (PWA):** Install Task Planner as a PWA on Chromium-based browsers for a native app-like experience.

## 🤝 Contributing

We welcome contributions to **Task Planner**! If you have ideas for improvements or new features, please open an issue or submit a pull request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.