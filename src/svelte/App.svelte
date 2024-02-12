<!--
Copyright 2020 Kyle Kukshtel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<script>
    import Depot from './Depot/Depot.svelte'
    import { onMount, setContext } from 'svelte';
    import resolvePath from 'object-resolve-path';
    setContext("nonce", nonce);
    setContext("iconPaths", icons);
    setContext("openWithSchemaEditingOn", openWithSchemaEditingOn);

	onMount(() => {
      console.log("on mount");
      vscode.postMessage({
          type: 'init-view',
      });
  });
    

	let dataType = "";
    let jsonData = {};

    $: {
        vscode.postMessage({
            type: 'update',
            data: jsonData
        });
    }

	function handleWebviewMessage(event) {
        const message = event.data; // The json data that the extension sent
		switch (message.type) {
            case 'init':
				console.log("initing view");
                //the extension is sending us an init event with the document text
                //not this is the document NOT the state, the state takes precendece
                const state = vscode.getState();
				dataType = message.jsonType;
                if (state) {
                    //we push this state from the vscode workspace to the JSON this component is looking at
                    // console.log("found previous state: " + state.text);
                    updateContent(state.text);
                }
                else
                {
                    //grab new content
                    console.log("no previous state: initing");
                    // this pings the document to send us its state
                    // it's then recieved in the windowMessage function where we update our content
                    updateContent(message.text);
				}
                return;
            // This is commented out as part of the change to get rid of the update callback in the extension but left here in case a need arises again
			// case 'update':
            //     console.log("updating view");
			// 	const text = message.text;

            //     // Update our webview's content
			// 	updateContent(text);

			// 	// Then persist state information.
			// 	// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
			// 	vscode.setState({ text });

            //     return;
            case 'filePicked':
                var dataPath = message.fileKey;
                if("linePath" in dataPath) {
                    let line = resolvePath(jsonData["sheets"][dataPath.sheet].lines, dataPath.linePath);
                    if(Array.isArray(line))
                    {
                        line[dataPath.lineIndex][dataPath.column.name] = message.filePath;
                    }
                    else
                    {
                        line[dataPath.column.name] = message.filePath;
                    }
                } else {
                    jsonData["sheets"][dataPath.sheet].lines[dataPath.lineIndex][dataPath.column.name] = message.filePath;
                }
                jsonData = jsonData;
                return;
		}
    }
	
	function handleDepotMessage(event) {
        // console.log(event);
        switch (event.detail.type) {
            case "update":
                // console.log("pushing data",jsonData)
                //this is where we could conform the data, like flooring an int field if it gets a float value
                vscode.postMessage({
                    type: 'update',
                    data: jsonData
                });
                break;
            case "pickFile":
                console.log("firing file picker");
                vscode.postMessage({
                    type: 'pickFile',
                    fileKey: event.detail.fileKey
                });
                break;
            default:
                break;
        }
        
	}

	function updateContent(/** @type {string} */ text) {
        console.log("updating content");
		try {
            vscode.setState({ text });
            jsonData = JSON.parse(text);
		} catch {
            console.log("issue with content load");
			return;
		}
	}
</script>

<svelte:window on:message={handleWebviewMessage}/>
{#if dataType == ""}
	<p>Loading</p>
{:else if dataType === "depot"}
    <Depot bind:data={jsonData} on:message={handleDepotMessage}/>
{:else}
	<p>Error: Invalid Data Type {dataType}</p>
{/if}

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	/* Table Stuff */
	:global(table) {
				/* background-color: var(--vscode-tab-inactiveBackground); */
        width: 100%;
        text-align: left;
        border-collapse: collapse;
        background: var(--vscode-editor-background);
    }
    :global(table td) {
        border-right: 1px solid var(--vscode-panel-border);
        border-left:  1px solid var(--vscode-panel-border);
        padding: 0px 3px;
        /* width: 50% */
    } 
    :global(table tr:nth-child(even)) {
        background-color: var(--vscode-tree-tableOddRowsBackground);
    } 
    :global(table tbody td) {
        font-size: 13px;
    }
    :global(table tr td.fieldLabel) {
        /* padding-left: 5px; */
        padding: 5px;
    }
    :global(table th) {
        border-right: 1px solid var(--vscode-panel-border);
        border-left:  1px solid var(--vscode-panel-border);
        background: var(--vscode-editor-background);
        font-size: 13px;
        font-weight: bold;
        text-align: left;
				position: sticky;
				top: 0;
    }

</style>