import * as vscode from 'vscode';
import { getWorkspaceFolder } from './utils';


export async function runCommand(command: string) {
    let folder: vscode.WorkspaceFolder = getWorkspaceFolder();

    const terminal: vscode.Terminal = vscode.window.createTerminal();

    terminal.sendText(`cd "${folder.uri.fsPath}"`); // I think this is usually redudant?

    terminal.sendText(command);
    terminal.show();
}
