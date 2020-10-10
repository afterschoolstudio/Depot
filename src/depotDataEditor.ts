import * as path from 'path';
import * as vscode from 'vscode';
import { getNonce } from './util';

export class DepotEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable { 
		const provider = new DepotEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(DepotEditorProvider.viewType, provider);
		return providerRegistration;
	}

	private static readonly viewType = 'depot.data';


	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	/**
	 * Called when our custom editor is opened.
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
				// This is sketched in here for people to easily extend Depot by providing their own extensions
				// That allow a different route through the scaffolded code
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
                //     this.validateFile(document);
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
							let uriPath = webviewPanel.webview.asWebviewUri(fileUri[0]).toString();
							console.log(uriPath);
							webviewPanel.webview.postMessage({
								type: 'filePicked',
								filePath:  path.relative(document.uri.path,fileUri[0].path), //still prob want to send this with uri
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
		));

		const iconPaths = [
			"addFiveLines.svg",
			"addOneLine.svg",
			"newSheet.svg",
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
			let diskPath = vscode.Uri.file(
				path.join(this.context.extensionPath, 'icons', iconPath)
			);
			icons[filename] = webview.asWebviewUri(diskPath);
		});
		const strung = JSON.stringify(icons);
		
		const docUri = webview.asWebviewUri(document.uri);

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

        return /* html */`
        <!DOCTYPE html>
        <html lang="en">
        <head>
			<meta charset='utf-8'>
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
			<!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'nonce-${nonce}'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
            <meta name='viewport' content='width=device-width,initial-scale=1'>
            <title>Depot Data Editor</title>
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
	
	// Could implment validation
    // private validateFile(document: vscode.TextDocument) {
	// 	const json = this.getDocumentAsJson(document);
	// 	// Validate, update doc with new json
    //     return this.updateTextDocument(document, json);
    // }

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
