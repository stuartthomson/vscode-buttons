import * as vscode from 'vscode';
import { IButtonConfig } from './buttons';
import { getWorkspaceFolder } from './utils';

interface ITerminalMapping {
    [index: number]: vscode.Terminal;
}

export async function runCommand(buttonConfig: IButtonConfig, index: number, context: vscode.Memento) {
    let folderPath: string = getWorkspaceFolder().uri.fsPath;

    let extensionTerminals = context.get<ITerminalMapping>('terminals');

    if (extensionTerminals === undefined) {
        context.update('terminals', {});
        extensionTerminals = {};
    }

    if (extensionTerminals[index] === undefined) {
        const terminal: vscode.Terminal = vscode.window.createTerminal({ name: buttonConfig.name, cwd: folderPath });
        extensionTerminals[index] = terminal;
        context.update('terminals', extensionTerminals);

        runInTerminal(buttonConfig, terminal, extensionTerminals, index, context, folderPath);
    }

    else {
        runInTerminal(buttonConfig, extensionTerminals[index], extensionTerminals, index, context, folderPath);
    }
}

function runInTerminal(
    buttonConfig: IButtonConfig,
    term: vscode.Terminal,
    extensionTerminals: ITerminalMapping,
    index: number,
    context: vscode.Memento,
    folderPath: string) {
    let activeTerminals = vscode.window.terminals;

    if (!activeTerminals.includes(term)) {
        term = vscode.window.createTerminal({ name: buttonConfig.name, cwd: folderPath });
        extensionTerminals[index] = term;
        context.update('terminals', extensionTerminals);
    }
    term.sendText(buttonConfig.script);
    term.show();
}
