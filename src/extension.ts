// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ButtonsProvider } from './buttons';
import { runCommand } from './runCommand';
import { getWorkspaceFolder } from './utils';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const folderPath = getWorkspaceFolder().uri.fsPath;

	context.workspaceState.update('terminals', {});

	const buttonsProvider = new ButtonsProvider(folderPath, context.workspaceState);

	let watcher = vscode.workspace.createFileSystemWatcher(`${folderPath}/buttons.jsonc`, false, false, false);
	watcher.onDidChange(() => { buttonsProvider.refresh(); });
	watcher.onDidDelete(() => { buttonsProvider.refresh(); });
	watcher.onDidCreate(() => { buttonsProvider.refresh(); });

	context.subscriptions.push(
		watcher
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('buttons', buttonsProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-buttons.runCommand', runCommand)
	);

	context.workspaceState.update('terminals', {});

}

// this method is called when your extension is deactivated
export function deactivate() { }
