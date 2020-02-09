import * as vscode from 'vscode';

export function getWorkspaceFolder(): vscode.WorkspaceFolder {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length >= 1) {
        return vscode.workspace.workspaceFolders[0];
    } else {
        throw new Error('No workspace selected.');
    }
}
