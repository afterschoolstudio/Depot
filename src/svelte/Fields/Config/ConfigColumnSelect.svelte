
<script>
import EnumField from '../EnumField.svelte';
import ConfigLineSelect from './ConfigLineSelect.svelte';
export let data;
export let sheetName;
export let config;
export let fieldName;
export let columnSettings;

let validColumnNames = [];
$ : potentialColumns = config.depotInfo.columns[
                            config.depotInfo.sheets.guids[
                                config.depotInfo.sheets.names.indexOf(sheetName)
                            ]
                        ];
$ : {
    //start out with all names
    validColumnNames =  typeof potentialColumns != "undefined" ? potentialColumns.names : [];
    if((columnSettings[fieldName]+"@"+fieldName) in columnSettings) {
        let settings = columnSettings[columnSettings[fieldName]+"@"+fieldName];
        if("allowedTypes" in settings) {
            validColumnNames = validColumnNames.filter(cname => {
                let cindex = validColumnNames.findIndex( c => (c == cname || c == "id" || c == "guid"));
                return settings.allowedTypes.includes(potentialColumns.typeStrs[cindex]);
            });
            validColumnNames.push("id","guid");
        }
    }
}

</script>

{#if sheetName !== ""}
<!-- sheet assigned -->
    {#if config.operation === "new" && config.editType === "sheet"}
        <!-- sheet isnt created yet so no columns would appear in table info, just add defaults -->
        <EnumField  allowEmpty={false}
                    bind:data={data}
                    options={["id","guid"]}
                    config={config}/>
    {:else}
        <EnumField  allowEmpty={false}
                    bind:data={data}
                    options={validColumnNames}/>
    {/if}
{:else}
<!-- sheet not assigned -->
<EnumField  allowEmpty={false}
            bind:data={data}
            options={[]}/>
{/if}