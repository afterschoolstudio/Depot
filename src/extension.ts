// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { posix } from 'path';
// import { CantataTerrainEditorProvider } from './cantataTerrainEditor';
// import { CantataInteractableEditorProvider } from './cantataInteractableEditor';
import { CantataDataEditorProvider } from './cantataDataEditor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const command = 'depot.newDepotFile';

	const commandHandler = (name: string = 'world') => {
		const folderUri = vscode.workspace.workspaceFolders[0].uri;
		//set these in depot settings config - default file name, default template
		const fileUri = folderUri.with({ path: posix.join(folderUri.path, 'depot.dpo') });
		const writeStr = '{ "sheets": []}';
		const writeData = Buffer.from(writeStr, 'utf8');
		vscode.workspace.fs.writeFile(fileUri,writeData);
	};

	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
	/*

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cantata-tools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cantata-tools.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Cantata Tools!');
	});

	context.subscriptions.push(disposable);
	*/

	context.subscriptions.push(CantataDataEditorProvider.register(context));
	// context.subscriptions.push(CantataTerrainEditorProvider.register(context));
	// context.subscriptions.push(CantataInteractableEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
