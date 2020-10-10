import * as vscode from 'vscode';
import { window } from 'vscode';
import { posix } from 'path';
import { DepotEditorProvider } from './depotDataEditor';

export function activate(context: vscode.ExtensionContext) {

	const command = 'depot.newDepotFile';

	const commandHandler = async () => {
		let defFile = vscode.workspace.getConfiguration('depot').get('defaults.newFileName') + "";
		const result = await window.showInputBox({
			value: defFile,
			valueSelection: [0, 0],
			placeHolder: 'Enter the name of the new Depot file, including the extension'
			// validateInput: text => {
			// 	window.showInformationMessage(`Validating: ${text}`);
			// 	return text === '123' ? 'Not 123!' : null;
			// }
		});

		if(result !== undefined)
		{
			// @ts-ignore
			const folderUri = vscode.workspace.workspaceFolders[0].uri;
			//set these in depot settings config - default file name, default template
			// @ts-ignore
			const fileUri = folderUri.with({ path: posix.join(folderUri.path, result) });
			const writeStr = '{ "sheets": []}';
			const writeData = Buffer.from(writeStr, 'utf8');
			vscode.workspace.fs.writeFile(fileUri,writeData);
			// var openUri = fileUri.with({ scheme: 'file' });
			// vscode.workspace.openTextDocument(openUri).then(doc => {
			// 	vscode.window.createWebviewPanel(
			// 		'cantata-tools.data',
			// 		result,
			// 		vscode.ViewColumn.One
			// 	);
			// });
		}
	};

	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
	context.subscriptions.push(DepotEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
