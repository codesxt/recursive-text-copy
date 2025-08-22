# Copy as Context

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/EseMismoBruno.copy-as-context?style=for-the-badge&label=Marketplace)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/EseMismoBruno.copy-as-context?style=for-the-badge)
![License](https://img.shields.io/github/license/codesxt/copy-as-context?style=for-the-badge)

**Easily copy entire folder structures and their contents into your clipboard, perfectly formatted for Large Language Models (LLMs) like ChatGPT, Claude, and Gemini.**

Stop manually copying and pasting individual files! With a single click, you can provide an LLM with the complete context of a project folder, including the directory tree and the code within each file.

---

## The Problem

When you need to ask an AI about a multi-file project, you face a tedious process:
1.  Describe the folder structure manually.
2.  Copy the contents of `file1.js`.
3.  Paste it.
4.  Copy the contents of `file2.ts`.
5.  Paste it.
6.  ...and so on.

This is slow, error-prone, and wastes your valuable time.

## The Solution

**Copy as Context** adds a simple right-click command to your file explorer to automate this entire process.

![Copy as Context in Action](https://raw.githubusercontent.com/YourGitHubUsername/copy-as-context/main/images/demo.gif)

*(Strongly recommend replacing this link with a real GIF of the extension working!)*

---

## ✨ Features

*   **Quick Context Menu Access:** Simply right-click any folder in the VS Code Explorer and select "Copy as Context".
*   **Intelligent Directory Tree:** Automatically generates a clean, recursive tree structure of the selected folder.
*   **Full File Contents:** Appends the complete content of every file, clearly labeled with its path.
*   **Configurable Ignore List:** Comes with a robust, pre-configured list to ignore common clutter like `node_modules`, `.git`, binary files, and images. You can easily customize this list in your settings.
*   **Clean UI Integration:** The command appears in its own dedicated group in the context menu, keeping your workspace tidy.

## 🚀 Usage

1.  In the VS Code Explorer, find the folder you want to copy.
2.  **Right-click** on the folder.
3.  Select **"Copy as Context"** from the menu.
4.  A progress notification will appear for larger folders.
5.  Once complete, **paste** the formatted context into your favorite LLM chat window!

### Example Output

Pasting after using the command will produce a clean, comprehensive block of text like this:

```text
src/
├── components/
│   └── Button.jsx
└── App.js


--- FILE: src/components/Button.jsx ---
import React from 'react';

const Button = ({ children }) => {
  return <button>{children}</button>;
};

export default Button;


--- FILE: src/App.js ---
import React from 'react';
import Button from './components/Button';

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <Button>Click Me</Button>
    </div>
  );
}

export default App;
```

---

## ⚙️ Configuration

You can customize which files and folders are ignored.

1.  Open your VS Code Settings (`Ctrl/Cmd + ,`).
2.  Search for "Copy as Context".
3.  Or, directly edit your `settings.json` file to add or remove [glob patterns](https://www.malikbrowne.com/blog/a-beginners-guide-to-glob-patterns/).

**Example `settings.json`:**

```json
{
  "copyAsContext.ignore": [
    // Default patterns are included here...
    "**/node_modules/**",
    "**/.git/**",
    "**/*.log",
    "**/*.zip",
    // Add your own custom pattern
    "**/__tests__/**"
  ]
}
```

## 💬 Feedback & Contributing

Found a bug or have a feature request? Please [open an issue](https://github.com/YourGitHubUsername/copy-as-context/issues) on our GitHub repository. Contributions are always welcome!

---

## License

This extension is licensed under the [MIT License](LICENSE).