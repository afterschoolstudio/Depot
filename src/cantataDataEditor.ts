import * as path from 'path';
import * as vscode from 'vscode';
import { getNonce } from './util';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';

/**
 * Provider for cat scratch editors.
 * 
 * Cat scratch editors are used for `.cscratch` files, which are just json files.
 * To get started, run this extension and open an empty `.cscratch` file in VS Code.
 * 
 * This provider demonstrates:
 * 
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
export class CantataDataEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable { 
		const provider = new CantataDataEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(CantataDataEditorProvider.viewType, provider);
		return providerRegistration;
	}

	private static readonly viewType = 'cantata-tools.data';


	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	/**
	 * Called when our custom editor is opened.
	 * 
	 * 
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview,document);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}
		function initWebview() {
			let dataType = "";
			switch (document.fileName.split('.').pop()) 
			{
				case 'cterrain':
					dataType = 'terrain';
					break;
				case 'cinteractable':
					dataType = 'interactable';
					break;
				case 'cruleset':
					dataType = 'ruleset';
					break;
				case 'cfaction':
					dataType = 'faction';
					break;
				case 'csupply':
					dataType = 'supply';
					break;			
				case 'cmod':
					dataType = 'manifest';
					break;			
				case 'dpo':
					dataType = 'depot';
					break;			
			}
			webviewPanel.webview.postMessage({
				type: 'init',
				text: document.getText(),
				jsonType: dataType
			});
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// 
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});


		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		const fileOptions: vscode.OpenDialogOptions = {
			canSelectMany: false,
			openLabel: 'Open',
			filters: {
			   'All files': ['*'],
			   'Text files': ['txt']
		   }
	   };

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
                // case 'validate':
                //     this.validateInteractable(document);
				//     return;
				case 'init-view':
					initWebview();
					return;
				case 'update':
					this.updateTextDocument(document, e.data);
					return;
				case 'pickFile':
					vscode.window.showOpenDialog(fileOptions).then(fileUri => {
						console.log(fileUri);
						if (fileUri && fileUri[0]) {
							console.log('Selected file: ' + fileUri[0].path + ' for key: ' + e.fileKey);
							console.log("relative location from editor to file is: " + path.relative(document.uri.path,fileUri[0].path));
							// let uriPath = webviewPanel.webview.asWebviewUri(vscode.Uri.file('/Users/codey/workspace/cat.gif'))
							let uriPath = webviewPanel.webview.asWebviewUri(fileUri[0]).toString();
							console.log(uriPath);
							webviewPanel.webview.postMessage({
								type: 'filePicked',
								filePath:  path.relative(document.uri.path,fileUri[0].path), //still prob want to send this with uri
								// filePath:  uriPath,
								fileKey: e.fileKey
							});
						}
					});
					return;
			}
		});

		//this is only called the first time the view is created
		//it isn't called if the view is focused again after changing to a different document
		//so instead we just manage it all in svelte onMount
		// initWebview();
	}

	/**
	 * Get the static html used for the editor webviews.
	 */
	private getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): string {
        
		const scriptUri = webview.asWebviewUri(vscode.Uri.file(
			path.join(this.context.extensionPath, 'out', 'compiled/bundle.js')
		));
		const styleUri = webview.asWebviewUri(vscode.Uri.file(
			path.join(this.context.extensionPath, 'out', 'compiled/bundle.css')
			// path.join(this.context.extensionPath, 'includes', 'bulma.css')
		));

		const iconPaths = [
			"addFiveLines.svg",
			"addOneLine.svg",
			"addSheet.svg",
			"addTenLines.svg",
			"editSheet.svg",
			"newBool.svg",
			"newEnum.svg",
			"newFloat.svg",
			"newImage.svg",
			"newInt.svg",
			"newLineLink.svg",
			"newList.svg",
			"newLongText.svg",
			"newMulti.svg",
			"newSheetLink.svg",
			"newText.svg",
			"removeLine.svg",
			"showList.svg",
			"hideList.svg"
		];

		const icons:any = {};
		iconPaths.forEach(iconPath => {
			let filename = iconPath.split(".")[0];
			icons[filename] = vscode.Uri.file(
				path.join(this.context.extensionPath, 'icons', iconPath)
			);
		});
		const strung = JSON.stringify(icons);
		console.log(strung);
		
		const docUri = webview.asWebviewUri(document.uri);
		// console.log(document.uri.with({ scheme: 'vscode-resource' }).fsPath);
		// console.log(document.uri.with({ scheme: 'vscode-resource' }).path);

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		//maybe this to get in base?
	
        //  <!-- <base href="${vscode.Uri.file(path.join(this._extensionPath, 'build')).with({ scheme: 'vscode-resource' })}/"> -->
		// 	<!-- https://github.com/rebornix/vscode-webview-react  -->
        return /* html */`
        <!DOCTYPE html>
        <html lang="en">
        <head>
			<meta charset='utf-8'>
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
			<!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'nonce-${nonce}'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
            <meta name='viewport' content='width=device-width,initial-scale=1'>
            <title>Cantata Data Editor</title>
			<base href="${docUri}/">
            <!-- <link rel='icon' type='image/png' href='/favicon.png'> -->
            <!-- <link rel='stylesheet' href='/global.css'> -->
			<link rel='stylesheet' href="${styleUri}">
			
			<script defer nonce="${nonce}" src="${scriptUri}"></script>
		</head>
			
		<body>
		<script nonce="${nonce}">
			// console.log("${nonce}");
			// console.log(${strung});
			const nonce = "${nonce}";
			const icons = ${strung};
			const vscode = acquireVsCodeApi();
		</script>
        </body>
        </html>`;
	}
    
    private validateInteractable(document: vscode.TextDocument) {
        const json = this.getDocumentAsJson(document);
        //TODO: run validation code
		// const character = CantataDataEditorProvider.scratchCharacters[Math.floor(Math.random() * CantataDataEditorProvider.scratchCharacters.length)];
		// json.scratches = [
		// 	...(Array.isArray(json.scratches) ? json.scratches : []),
		// 	{
		// 		id: getNonce(),
		// 		text: character,
		// 		created: Date.now(),
		// 	}
		// ];

        // return this.updateTextDocument(document, json);
        return true;
    }

	/**
	 * Try to get a current document as json text.
	 */
	private getDocumentAsJson(document: vscode.TextDocument): any {
		const text = document.getText();
		if (text.trim().length === 0) {
			return {};
		}

		try {
			return JSON.parse(text);
		} catch {
			throw new Error('Could not get document as json. Content is not valid json');
		}
	}

	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, json: any) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			JSON.stringify(json, null, 4));
		
		return vscode.workspace.applyEdit(edit);
	}
}
