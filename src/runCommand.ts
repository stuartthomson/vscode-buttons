import * as vscode from 'vscode';

export async function runCommand() {
    let folder: vscode.WorkspaceFolder = getWorkspaceFolder();

    const terminal: vscode.Terminal = vscode.window.createTerminal();

    terminal.sendText(`cd "${folder.uri.fsPath}"`); // I think this is usually redudant?

    terminal.sendText("echo hello");
    terminal.show();
}

function getWorkspaceFolder(): vscode.WorkspaceFolder {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length >= 1) {
        return vscode.workspace.workspaceFolders[0];
    } else {
        throw new Error('No workspace selected.');
    }
}
