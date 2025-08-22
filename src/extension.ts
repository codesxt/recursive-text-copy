import * as vscode from 'vscode';
import * as path from 'path';
import { minimatch } from 'minimatch';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('recursive-text-copy.copy', async (folderUri: vscode.Uri) => {
        if (!folderUri) {
            vscode.window.showErrorMessage('Please right-click a folder in the explorer to use this command.');
            return;
        }

        const folderPath = folderUri.fsPath;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running Recursive Text Copy on "${path.basename(folderPath)}"...`,
            cancellable: false
        }, async (progress) => {
            try {
                // 1. Get configuration
                const config = vscode.workspace.getConfiguration('recursiveTextCopy');
                const ignorePatterns = config.get<string[]>('ignore', []);

                progress.report({ message: 'Building file tree...' });
                const allFiles: string[] = [];

                // Manually create the root of the tree with the folder's name
                const rootFolderName = path.basename(folderPath);
                
                // Recursively build the tree for the *contents* of the folder
                const subTree = await buildFileTree(folderUri, '', allFiles, ignorePatterns);

                // Combine them to form the final tree
                const tree = `${rootFolderName}/\n${subTree}`;

                progress.report({ message: 'Reading file contents...' });

                // Get the parent directory of the clicked folder. This will be our new base
                // for calculating relative paths, so the folder's name is included.
                const parentFolderPath = path.dirname(folderPath);
                
                const fileContents = await getFileContents(allFiles, parentFolderPath);
                
                // 4. Combine and copy
                const finalContext = `${tree}\n\n${fileContents}`;
                await vscode.env.clipboard.writeText(finalContext);
                vscode.window.showInformationMessage(`Recursive Text Copy successful for "${path.basename(folderPath)}"!`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Recursive Text Copy failed: ${error.message}`);
            }
        });
    });

    context.subscriptions.push(disposable);
}


/**
 * Recursively builds a tree string and collects all file paths.
 * @param directoryUri The URI of the directory to start from.
 * @param prefix The prefix for the current tree level (for indentation).
 * @param allFiles An array to collect all valid file paths.
 * @param ignorePatterns An array of glob patterns to ignore.
 * @returns A string representing the file tree.
 */
async function buildFileTree(directoryUri: vscode.Uri, prefix: string, allFiles: string[], ignorePatterns: string[]): Promise<string> {
    const entries = await vscode.workspace.fs.readDirectory(directoryUri);
    let tree = '';

    // Sort entries to have directories first, then files
    entries.sort((a, b) => {
        if (a[1] === vscode.FileType.Directory && b[1] !== vscode.FileType.Directory) {
            return -1;
        }
        if (a[1] !== vscode.FileType.Directory && b[1] === vscode.FileType.Directory) {
            return 1;
        }
        return a[0].localeCompare(b[0]);
    });

    for (let i = 0; i < entries.length; i++) {
        const [name, type] = entries[i];
        const entryUri = vscode.Uri.joinPath(directoryUri, name);
        const relativePath = vscode.workspace.asRelativePath(entryUri);

        // Check if the file or folder should be ignored
        if (ignorePatterns.some(pattern => minimatch(relativePath, pattern, { dot: true }))) {
            continue;
        }
        
        const isLast = i === entries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        if (type === vscode.FileType.Directory) {
            tree += `${prefix}${connector}${name}/\n`;
            tree += await buildFileTree(entryUri, newPrefix, allFiles, ignorePatterns);
        } else if (type === vscode.FileType.File) {
            tree += `${prefix}${connector}${name}\n`;
            allFiles.push(entryUri.fsPath);
        }
    }
    return tree;
}

/**
 * Reads the content of all files in the given list.
 * @param filePaths An array of absolute file paths.
 * @param basePath The absolute path of the root folder that was clicked. // <<< ADD THIS COMMENT
 * @returns A formatted string with all file contents.
 */
//                                                    VVVVVVVVVVVVVVVV
async function getFileContents(filePaths: string[], basePath: string): Promise<string> {
    let allContents = '';

    for (const filePath of filePaths) {
        try {
            const fileUri = vscode.Uri.file(filePath);
            const contentBytes = await vscode.workspace.fs.readFile(fileUri);
            const content = new TextDecoder('utf-8').decode(contentBytes);
            
            // --- THIS IS THE KEY CHANGE ---
            // Calculate the path relative to the folder the user clicked, not the whole workspace.
            const relativePath = path.relative(basePath, filePath);

            allContents += `--- FILE: ${relativePath} ---\n`;
            allContents += `${content}\n\n`;

        } catch (error) {
            console.error(`Could not read file ${filePath}:`, error);
            const relativePath = path.relative(basePath, filePath); // Also use relative path for errors
            allContents += `--- FILE: ${relativePath} (Could not be read) ---\n\n`;
        }
    }
    return allContents;
}

// This method is called when your extension is deactivated
export function deactivate() {}