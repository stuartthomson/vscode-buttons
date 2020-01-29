// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ButtonsProvider } from './buttons';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const buttonsProvider = new ButtonsProvider(vscode.workspace.rootPath);

	vscode.window.registerTreeDataProvider('buttons', buttonsProvider);

}

// this method is called when your extension is deactivated
export function deactivate() {}
