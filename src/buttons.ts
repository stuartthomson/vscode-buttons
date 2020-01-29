import * as vscode from 'vscode';
import * as path from 'path';

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
        return Promise.resolve([
            new Button('Button 1', vscode.TreeItemCollapsibleState.None, {
                command: 'extension.pressButton',
                title: '',
                arguments: []
            })
        ]);
	}
}


export class Button extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label} tooltip`;
	}

	get description(): string {
		return `${this.label} description`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'run.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'run.svg')
	};

	contextValue = 'button';

}