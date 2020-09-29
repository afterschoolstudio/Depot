<script>
import {defaults} from './depotDefaults';
import BooleanField from '../Fields/BooleanField.svelte';
import EnumField from '../Fields/EnumField.svelte';
import ImageField from '../Fields/ImageField.svelte';
import LongTextField from '../Fields/LongTextField.svelte';
import MultipleField from '../Fields/MultipleField.svelte';
import NumberField from '../Fields/NumberField.svelte';
import TextField from '../Fields/TextField.svelte';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
function configUpdate(updateType) {
    dispatch('message', {
        "type" : updateType
    });
}

export let data;
export let config;
export let debug;
let configTitle = "";
$: {
    let first = config.operation === "new" ? "New " : "Edit ";
    let second = config.editType === "sheet" ? "sheet config" : "column config";
    configTitle = first + second;
}
function closeEditor() {
    configUpdate("close");
}
function createBlob() {
    configUpdate("create");
}
function saveBlob() {
    configUpdate("save");
}
function deleteBlob() {
    configUpdate("delete");
}

let validName = true;
// $: disabled = !validName;
$: {
    if(config.active)
    {
        switch (config.editType) {
            case "sheet":
                validName = !config.bannedNames.sheetNames.includes(data.name);
                break;
            default:
                validName = !config.bannedNames.columnNames.includes(data.name);
                break;
        }
    }
}

let configuration = {}
$: {
    if(config.operation === "edit")
    {
        configuration = data.configurable;
    }
    else if(config.operation === "new")
    {
        configuration = defaults[config.editType].configurable;
    }
}

</script>
{#if config.active}
    <p>{configTitle}</p>
    <table>
    <tr>
        <td>Field</td>
        <td>Value</td>
    </tr>
    <tr>
        <td>GUID</td>
        <td>{data["guid"]}</td>
    </tr>
    {#each Object.keys(configuration) as fieldName}
        {#if typeof configuration[fieldName] !== 'object'}
        <tr>
            <td>{fieldName}</td>
            <td>
                <!-- commented out fields aren't used for field config -->
                {#if configuration[fieldName] === "text"}
                <div><TextField bind:data={data[fieldName]}/></div>
                {:else if configuration[fieldName] === "longtext"}
                <div><LongTextField bind:data={data[fieldName]}/></div>
                <!-- {:else if configuration[fieldName] === "image"}
                <div><ImageField bind:data={data[fieldName]} fileKey={fieldName}/></div> -->
                {:else if configuration[fieldName] === "bool"}
                <div><BooleanField bind:data={data[fieldName]}/></div>
                {:else if configuration[fieldName] === "sheetSelect"}
                <div><EnumField allowEmpty={(("sheetSelect@"+fieldName) in configuration && configuration[("sheetSelect@"+fieldName)].allowEmpty)} bind:data={data[fieldName]} options={config.depotInfo.sheetsFiltered.guids} aliases={config.depotInfo.sheetsFiltered.names}/></div>

                <!-- {:else if configuration[fieldName] === "multiple"}
                <div><MultipleField bind:data={data[fieldName]}/></div> -->
                {:else if configuration[fieldName] === "int" || configuration[fieldName] === "float"}
                <div><NumberField bind:data={data[fieldName]}/></div>

                <!-- column and line select assume a sheet field in the editing object -->
                {:else if configuration[fieldName].split("@")[0] === "lineSelect"}
                    {#if data[configuration[fieldName].split("@")[1]] !== ""}
                        <div><EnumField bind:data={data[fieldName]}
                                        options={config.depotInfo.lines[data[configuration[fieldName].split("@")[1]]].guids}
                                        aliases={config.depotInfo.lines[data[configuration[fieldName].split("@")[1]]].names}/></div>
                    <!-- if sheet not assigned  -->
                    {:else}
                        <div><EnumField bind:data={data[fieldName]}
                                        options={[]}
                                        aliases={[]}/></div>
                    {/if}
                    {#if (data["sheet"] !== "" && data["defaultValue"] !== "") && !config.depotInfo.lines[data["sheet"]].guids.includes(data[fieldName])}
                        <div>Warning: Selected value with GUID {data[fieldName]} not in selected sheet</div>
                    {/if}

                <!-- column names are inherently unique, so just bind off name instead of needing guid -->
                {:else if configuration[fieldName].split("@")[0] === "columnSelect"}
                    {#if data[configuration[fieldName].split("@")[1]] !== ""}
                        {#if config.operation === "new" && config.editType === "sheet"}
                            <!-- sheet isnt created yet so no columns would appear in table info, just add defaults -->
                            <div><EnumField allowEmpty={false}
                                            bind:data={data[fieldName]}
                                            options={["id","guid"]}/>
                            </div>
                        {:else}
                            <div><EnumField allowEmpty={false}
                                            bind:data={data[fieldName]}
                                            options={config.depotInfo.columns[
                                                        config.depotInfo.sheets.guids[
                                                            config.depotInfo.sheets.names.indexOf(data[configuration[fieldName].split("@")[1]])
                                                        ]
                                                    ].names}/>
                            </div>
                        {/if}
                    <!-- if sheet not assigned  -->
                    {:else}
                        <div><EnumField allowEmpty={false}
                                        bind:data={data[fieldName]}
                                        options={[]}
                        /></div>
                    {/if}
                {/if}
            </td>
        </tr>
        {/if}
    {/each}
    </table>
    <br>
    {#if config.operation === "new"}
    <button on:click={createBlob} disabled={!validName}>Create</button>
    {:else if config.operation === "edit"}
    <button on:click={saveBlob} disabled={!validName}>Save</button>
    <button on:click={deleteBlob}>Delete</button>
    {/if}
    <button on:click={closeEditor}>Cancel</button>
    {#if debug}
    <pre>{JSON.stringify({data},null,2)}</pre>
    <pre>{JSON.stringify({config},null,2)}</pre>
    {/if}
{/if}