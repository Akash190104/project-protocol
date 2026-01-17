# Project Protocol

> **"Akash, you have 1356 days remaining."**

Inspired by the Project 1356, **Project Protocol** is a rational, high-contrast dashboard for Google Chrome. It replaces your "New Tab" page with a brutal visualization of time. It is designed for those who need to see the scarcity of time to stay focused.

![Project Protocol Screenshot](icons/project_1356.png)

## ⚡ Features

* **Time Visualization:** A generated grid of squares representing every day between your Start Date and Deadline.
    * 🔴 **Red Squares:** Time spent (Gone forever).
    * 🟢 **Green Squares:** Time remaining.
* **Dynamic Identity:** The system automatically names your project based on the duration (e.g., `PROJECT 1356`).
* **Tactical Protocols:** A command-line style interface to add and track high-level goals.
* **Focus Search:** A minimalist, Google-integrated search bar that respects the aesthetic.
* **Cloud Sync:** Your goals and deadline sync across all Chrome browsers where you are logged in.

## 🛠 Installation

Since this extension is designed for developers and power users, it is installed via Developer Mode.

1.  **Download:** Clone this repository or download the ZIP.
    ```bash
    git clone [https://github.com/YOUR_USERNAME/project-protocol.git](https://github.com/YOUR_USERNAME/project-protocol.git)
    ```
2.  **Open Chrome Extensions:**
    * Navigate to `chrome://extensions/` in your browser.
3.  **Enable Developer Mode:**
    * Toggle the switch in the top-right corner.
4.  **Load Extension:**
    * Click **"Load unpacked"**.
    * Select the folder where you downloaded this repository.
5.  **Initialize:**
    * Open a new tab.
    * Enter your **Codename**, **Start Date**, and **Deadline**.
    * Begin the protocol.

## ⚙️ Configuration

* **Reset Data:** To change your deadline or start over, click the small **Gear Icon (⚙)** in the top right corner of the dashboard.
* **Hard Reset:** If you encounter issues, you can clear `chrome.storage` via the developer console (F12) -> Application -> Storage.

## 🎨 Customization

You can tweak the "Cyberpunk" color scheme in `style.css`:

```css
:root {
    --bg-color: #0d1117;   /* Background */
    --accent-color: #00ff41; /* The Green Glow */
    --danger-color: #ff3333; /* The Red Spent Days */
}