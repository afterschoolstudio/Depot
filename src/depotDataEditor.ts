import * as path from "path";
import * as fs from "fs";
import { posix } from "path";
import * as vscode from "vscode";
import { window } from "vscode";
import { getNonce } from "./util";

export class DepotEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    vscode.commands.registerCommand("depot.newDepotFile", async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "Creating new Depot files currently requires opening a workspace"
        );
        return;
      }

      let defFile =
        vscode.workspace.getConfiguration("depot").get("defaults.newFileName") +
        "";
      const result = await window.showInputBox({
        value: defFile,
        valueSelection: [0, 0],
        placeHolder:
          "Enter the name of the new Depot file, including the extension",
        // validateInput: text => {
        // 	window.showInformationMessage(`Validating: ${text}`);
        // 	return text === '123' ? 'Not 123!' : null;
        // }
      });

      if (result !== undefined) {
        // @ts-ignore
        const folderUri = vscode.workspace.workspaceFolders[0].uri;
        //set these in depot settings config - default file name, default template
        // @ts-ignore
        const fileUri = folderUri.with({
          path: posix.join(folderUri.path, result),
        });
        const writeStr = '{ "sheets": []}';
        const writeData = Buffer.from(writeStr, "utf8");
        vscode.workspace.fs.writeFile(fileUri, writeData).then(() => {
          vscode.commands.executeCommand(
            "vscode.openWith",
            fileUri,
            DepotEditorProvider.viewType
          );
        });
      }
    });

    return vscode.window.registerCustomEditorProvider(
      DepotEditorProvider.viewType,
      new DepotEditorProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    );
  }

  private static readonly viewType = "depot.data";

  constructor(private readonly context: vscode.ExtensionContext) {}

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
    webviewPanel.webview.html = this.getHtmlForWebview(
      webviewPanel.webview,
      document
    );

    function initWebview() {
      let dataType = "depot";
      webviewPanel.webview.postMessage({
        type: "init",
        text: document.getText(),
        jsonType: dataType,
      });
    }

    // NOTE: This is all commented out because all updates currently only come in from
    // events that the webview emits after it has been editied.
    // I'm keeping this in here in case it needs to change, but commenting it out for now
    // because we were effectively double-subscribing to every event and causing errors, and don't need this second
    // update.

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    // const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
    // 	if (e.document.uri.toString() === document.uri.toString()) {
    // 		updateWebview();
    // 	}
    // });

    // function updateWebview() {
    // 	webviewPanel.webview.postMessage({
    // 		type: 'update',
    // 		text: document.getText(),
    // 	});
    // }

    // // Make sure we get rid of the listener when our editor is closed.
    // webviewPanel.onDidDispose(() => {
    // 	changeDocumentSubscription.dispose();
    // });

    const fileOptions: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Select",
    };

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        // case 'validate':
        //     this.validateFile(document);
        //     return;
        case "init-view":
          initWebview();
          return;
        case "update":
          this.updateTextDocument(document, e.data);
          return;
        case "pickFile":
          vscode.window.showOpenDialog(fileOptions).then((fileUri) => {
            if (fileUri && fileUri[0]) {
              console.log(
                "Selected file: " + fileUri[0].path + " for key: " + e.fileKey
              );
              console.log(
                "relative location from editor to file is: " +
                  path.relative(document.uri.path, fileUri[0].path)
              );
              let uriPath = webviewPanel.webview
                .asWebviewUri(fileUri[0])
                .toString();
              console.log(uriPath);
              webviewPanel.webview.postMessage({
                type: "filePicked",
                filePath: path.relative(document.uri.path, fileUri[0].path), //still prob want to send this with uri
                fileKey: e.fileKey,
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
  private getHtmlForWebview(
    webview: vscode.Webview,
    document: vscode.TextDocument
  ): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this.context.extensionPath, "out", "compiled/bundle.js")
      )
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this.context.extensionPath, "out", "compiled/bundle.css")
      )
    );

    let iconsExtensionPath = path.join(this.context.extensionPath, "icons");
    let iconNames = fs.readdirSync(iconsExtensionPath);
    //@ts-ignore
    const iconPaths = [];
    iconNames.forEach((n) => {
      iconPaths.push(n);
    });

    const icons: any = {};
    //@ts-ignore
    iconPaths.forEach((iconPath) => {
      let filename = iconPath.split(".")[0];
      let diskPath = vscode.Uri.file(path.join(iconsExtensionPath, iconPath));
      icons[filename] = webview.asWebviewUri(diskPath);
    });
    const strung = JSON.stringify(icons);

    const docUri = webview.asWebviewUri(document.uri);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    // get 'openWithSchemaEditingOn' config
    const openWithSchemaEditingOn = vscode.workspace
      .getConfiguration("depot")
      .get("openWithSchemaEditingOn");

    return /* html */ `
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
			const openWithSchemaEditingOn = ${openWithSchemaEditingOn};
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
      throw new Error(
        "Could not get document as json. Content is not valid json"
      );
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
      JSON.stringify(json, null, 4)
    );

    return vscode.workspace.applyEdit(edit);
  }
}
