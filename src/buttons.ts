import * as fs from 'fs';
import * as jsonc from 'jsonc-parser';
import * as path from 'path';
import * as vscode from 'vscode';


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

	private _folderPath: string | undefined;
	private _workspaceState: vscode.Memento;

	constructor(private folderPath: string | undefined, workspaceState: vscode.Memento) {
		this._folderPath = folderPath;
		this._workspaceState = workspaceState;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Button): vscode.TreeItem {
		return element;
	}

	getChildren(): Thenable<Button[]> {

		if (this._folderPath === undefined) {
			return Promise.resolve([]);
		}

		const configPath: string = `${this._folderPath}/buttons.jsonc`;

		if (fs.existsSync(configPath)) {
			let config = <IButtonsConfig>jsonc.parse(fs.readFileSync(configPath, 'utf-8'));
			if (config !== undefined) {
				return Promise.resolve(
					config.buttons.map((buttonConfig, index) => {
						return this.createButton(buttonConfig, index);
					})
				);
			}
		}

		return Promise.resolve([]);

	}

	createButton(buttonConfig: IButtonConfig, index: number): Button {
		return new Button(buttonConfig.name, vscode.TreeItemCollapsibleState.None, {
			command: 'vscode-buttons.runCommand',
			title: buttonConfig.description === undefined ? '' : buttonConfig.description,
			arguments: [buttonConfig, index, this._workspaceState]
		});
	}
}

export class Button extends vscode.TreeItem {

	_script: string;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command: vscode.Command,
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