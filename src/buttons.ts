import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import * as path from 'path';
import * as vscode from 'vscode';
import { getWorkspaceFolder } from './utils';


export interface IButtonConfig {
	name: string;
	description?: string;
    script: string;
}

export interface IButtonsConfig {
	buttons: IButtonConfig[];
}

export class ButtonsProvider implements vscode.TreeDataProvider<Button> {

	private _onDidChangeTreeData: vscode.EventEmitter<Button | undefined> = new vscode.EventEmitter<Button | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Button | undefined> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Button): vscode.TreeItem {
		return element;
	}

	getChildren(): Thenable<Button[]> {
		let folder: vscode.WorkspaceFolder = getWorkspaceFolder();

		let config = <IButtonsConfig>jsonc.parse(fs.readFileSync(`${folder.uri.fsPath}/buttons.jsonc`, 'utf-8'));
		console.log(config);

		if (config === undefined) {
			return Promise.resolve([]);
		}

        return Promise.resolve(
            config.buttons.map(buttonConfig => this.createButton(buttonConfig))
        );
	}

	createButton(buttonConfig: IButtonConfig): Button {
		return new Button(buttonConfig.name, vscode.TreeItemCollapsibleState.None, {
			command: 'vscode-buttons.runCommand',
			title: buttonConfig.description === undefined ? '' : buttonConfig.description,
			arguments: [buttonConfig.script]
		});
	}
}

export class Button extends vscode.TreeItem {

	_script: string;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command: vscode.Command
	) {
		super(label, collapsibleState);
		this._script = command.arguments === undefined ? '' : `${command.arguments[0]}`;
	}

	get tooltip(): string {
		if (this._script === '') {
			return `There is no script associated with this button.`;
		}
		return `Script is: ${this._script}`;
	}

	get description(): string {
		return `${this.command.title}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'run.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'run.svg')
	};

	contextValue = 'button';

}