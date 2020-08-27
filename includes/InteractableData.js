
// @ts-check

// @ts-ignore


// const vscode = acquireVsCodeApi();
// window.onload = function() {
// 	vscode.postMessage({ command: 'get-data' });
// 	console.log('Ready to accept data.');
	
	
// 	// Get a reference to the VS Code webview api.
// 	// We use this API to post messages back to our extension.

// 	// @ts-ignore
// 	// const vscode = acquireVsCodeApi();
// 	vscode.postMessage({
// 		type: 'testjs'
// 	});
    
//     // Handle messages sent from the extension to the webview
// 	window.addEventListener('message', event => {
// 		const message = event.data; // The json data that the extension sent
// 		switch (message.type) {
// 			case 'update':
// 				const text = message.text;

//                 // Update our webview's content
//                 // vscode.window.showInformationMessage("recieved update");
// 				updateContent(text);

// 				// Then persist state information.
// 				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
// 				vscode.setState({ text });

// 				return;
// 		}
// 	});


// 	// const notesContainer = /** @type {HTMLElement} */ (document.querySelector('.notes'));

// 	// const addButtonContainer = document.querySelector('.add-button');
// 	// addButtonContainer.querySelector('button').addEventListener('click', () => {
// 	// 	vscode.postMessage({
// 	// 		type: 'add'
// 	// 	});
// 	// })

// 	// const errorContainer = document.createElement('div');
// 	// document.body.appendChild(errorContainer);
// 	// errorContainer.className = 'error'
// 	// errorContainer.style.display = 'none'

// 	/**
// 	 * Render the document in the webview.
// 	 */
//     let interactableJSON = {};
// 	function updateContent(/** @type {string} */ text) {
// 		try {
// 			interactableJSON = JSON.parse(text);
//             vscode.window.showInformationMessage(interactableJSON);
// 		} catch {
//             // vscode.window.showErrorMessage("json read issue");
// 			// notesContainer.style.display = 'none';
// 			// errorContainer.innerText = 'Error: Document is not valid json';
// 			// errorContainer.style.display = '';
// 			return;
// 		}
// 		// notesContainer.style.display = '';
// 		// errorContainer.style.display = 'none';

// 		// Render the scratches
// 		// notesContainer.innerHTML = '';
// 		// for (const note of json.scratches || []) {
// 		// 	const element = document.createElement('div');
// 		// 	element.className = 'note';
// 		// 	notesContainer.appendChild(element);

// 		// 	const text = document.createElement('div');
// 		// 	text.className = 'text';
// 		// 	const textContent = document.createElement('span');
// 		// 	textContent.innerText = note.text;
// 		// 	text.appendChild(textContent);
// 		// 	element.appendChild(text);

// 		// 	const created = document.createElement('div');
// 		// 	created.className = 'created';
// 		// 	created.innerText = new Date(note.created).toUTCString();
// 		// 	element.appendChild(created);

// 		// 	const deleteButton = document.createElement('button');
// 		// 	deleteButton.className = 'delete-button';
// 		// 	deleteButton.addEventListener('click', () => {
// 		// 		vscode.postMessage({ type: 'delete', id: note.id, });
// 		// 	});
// 		// 	element.appendChild(deleteButton);
// 		// }

// 		// notesContainer.appendChild(addButtonContainer);
// 	}

	

// 	// Webviews are normally torn down when not visible and re-created when they become visible again.
// 	// State lets us save information across these re-loads
// 	const state = vscode.getState();
// 	if (state) {
// 		updateContent(state.text);
//     }
    
//     // export { interactableJSON };
// };