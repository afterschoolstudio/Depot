import * as vscode from 'vscode';
import { window } from 'vscode';
import { posix } from 'path';
import { DepotEditorProvider } from './depotDataEditor';

export function activate(context: vscode.ExtensionContext) {

	// context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
	context.subscriptions.push(DepotEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
