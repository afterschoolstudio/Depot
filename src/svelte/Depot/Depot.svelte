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
import { createEventDispatcher, getContext } from 'svelte';
import resolvePath from 'object-resolve-path';
import {defaults} from './depotDefaults';
import DepotOptions from './DepotOptions.svelte';
import DepotSheet from './DepotSheet.svelte';
import DepotConfigurator from './DepotConfigurator.svelte';
import { v4 as uuidv4 } from 'uuid';
export let data;
let debug = false;
let showLineGUIDs = false;
let iconPaths = getContext("iconPaths");

const dispatch = createEventDispatcher();
function sheetsUpdated() {
    // selectedSheetlineData = data.sheets[selectedSheet].lines;
    // selectedSheetData = data.sheets[selectedSheet];
    dispatch('message', {
        "type" : "update"
    });
}

let selectedSheet = 0;
function focusSheet(index) {
    selectedSheet = index;
}

let listVisibility = {};

function getBannedNames(referenceSheetGUID, config) {
    var sheetNames = [];
    for(var o in data.sheets) {
        if(config.operation === "new" || 
          (config.operation === "edit" && referenceSheetGUID in data.sheets && (data.sheets[o].name !== data.sheets[data.sheets.indexOf(sheet => sheet.guid === referenceSheetGUID)].name)))
        {
            //this means its the currently open sheet, we dont add our name to the banned list, only others
            sheetNames.push(data.sheets[o].name);
        }
    }
    var columnNames = [];
    if(data.sheets.length > 0)
    {
        var sheetIndex = data.sheets.findIndex(sheet => sheet.guid === referenceSheetGUID);
        if (sheetIndex >= 0 && data.sheets[sheetIndex].columns.length !== 0) {
            for(var o in data.sheets[sheetIndex].columns) {
                if(config.operation === "new" || 
                  (config.operation === "edit" && (data.sheets[sheetIndex].columns[o].name !== config.editType)))
                {
                    //this means its the currently open column, we dont add our name to the banned list, only others
                    columnNames.push(data.sheets[sheetIndex].columns[o].name);
                }
            }
        }
    }
    return { "sheetNames" : sheetNames, "columnNames" : columnNames}
}

let depotFileInfo = {};
$: {
    var sheetNames = [];
    var sheetGuids = [];
    var sheetNamesFiltered = [];
    var sheetGuidsFiltered = [];
    var lines = {};
    var columns = {};
    data.sheets.forEach(sheet => {
        sheetNames.push(sheet.name);
        sheetGuids.push(sheet.guid);
        if(!sheet.hidden)
        {
            sheetNamesFiltered.push(sheet.name);
            sheetGuidsFiltered.push(sheet.guid);
        }
        lines[sheet.guid] = { "names": [], "ids": [], "guids" : []};
        columns[sheet.guid] = { "names": [], "guids" : []};
        sheet.lines.forEach(line => {
            lines[sheet.guid].names.push(line[sheet.displayColumn])
            lines[sheet.guid].ids.push(line.id)
            lines[sheet.guid].guids.push(line.guid)
        });
        sheet.columns.forEach(column => {
            columns[sheet.guid].names.push(column.name)
            columns[sheet.guid].guids.push(column.guid)
        });
        columns[sheet.guid].names.push("id");
        columns[sheet.guid].names.push("guid");
    });
    depotFileInfo = {"sheets" : {
                    "names":sheetNames,
                    "guids":sheetGuids,
                    },
                "sheetsFiltered" : {
                    "names":sheetNamesFiltered,
                    "guids":sheetGuidsFiltered,
                    },
                "lines" : lines,
                "columns" : columns,
                };
}

function createLines(sheetGUID, amount) {
    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === sheetGUID);
    for (let index = 1; index <= amount; index++) {
        var newLine = {};
        newLine["guid"] = uuidv4();
        newLine["id"] = data.sheets[sheetIndex].lines.length + "";
        data.sheets[sheetIndex].columns.forEach(column => {
            if(column.typeStr == "multiple")
            {
                newLine[column.name] = column.defaultValue.split(', ');
            }
            else
            {
                newLine[column.name] = column.defaultValue;
            }
        });
        data.sheets[sheetIndex].lines.push(newLine);
    }
    sheetsUpdated();
}

function getSubsheetParentInfo(subsheetIndex) {
    var colGUID = data.sheets[subsheetIndex].columnGUID;
    let parent = {};
    let parentSheetIndex = data.sheets.findIndex(sheet => sheet.guid === data.sheets[subsheetIndex].parentSheetGUID);
    parent["parentIndex"] = parentSheetIndex;
    let refColumnIndex = data.sheets[parentSheetIndex].columns.findIndex(sheet => sheet.guid === colGUID);
    let refColumn = data.sheets[parentSheetIndex].columns[refColumnIndex];
    let columnNamePath = [refColumn.name];
    if(data.sheets[parentSheetIndex].hidden)
    {
        parent = getSubsheetParentInfo(parentSheetIndex);
        columnNamePath = columnNamePath.concat(parent.path);
    }
    parent["path"] = columnNamePath;
    return parent;
}

function getValidLinesWithListPath(lines,pathTrail,trailIndex,basePath) {
    let paths = [];
    //lists and top level sheets
    if(Array.isArray(lines)) {
        lines.forEach((line,lineIndex) => {
            //if line[columnName].length > 0 - aka if there are nested lines here
            if(Array.isArray(line[pathTrail[trailIndex]])) {
                if(line[pathTrail[trailIndex]].length > 0) {
                    // [0].listVarName
                    var validPath = basePath + `[${lineIndex}]["${pathTrail[trailIndex]}"]`;
                    if(trailIndex + 1 < pathTrail.length) {
                        paths = paths.concat(getValidLinesWithListPath(line[pathTrail[trailIndex]],pathTrail,trailIndex+1,validPath).paths)
                    } else {
                        paths.push(validPath);
                    }
                }
            } else {
                //props
                if(Object.keys(line[pathTrail[trailIndex]]).length > 0) {
                    var validPath = basePath + `[${lineIndex}]["${pathTrail[trailIndex]}"]`;
                    if(trailIndex + 1 < pathTrail.length) {
                        paths = paths.concat(getValidLinesWithListPath(line[pathTrail[trailIndex]],pathTrail,trailIndex+1,validPath).paths)
                    } else {
                        paths.push(validPath);
                    }
                }
            }
        });
    } else {
        console.log(lines);
        console.log(trailIndex);
        console.log(pathTrail[trailIndex]);
        console.log(lines[pathTrail[trailIndex]]);
        if(Array.isArray(lines[pathTrail[trailIndex]])) {
            if(lines[pathTrail[trailIndex]].length > 0) {
                // [0].listVarName
                var validPath = basePath + `["${pathTrail[trailIndex]}"]`;
                if(trailIndex + 1 < pathTrail.length) {
                    paths = paths.concat(getValidLinesWithListPath(lines[pathTrail[trailIndex]],pathTrail,trailIndex+1,validPath).paths)
                } else {
                    paths.push(validPath);
                }
            }
        } else {
            //props
            if(Object.keys(lines[pathTrail[trailIndex]]).length > 0) {
                var validPath = basePath + `["${pathTrail[trailIndex]}"]`;
                if(trailIndex + 1 < pathTrail.length) {
                    paths = paths.concat(getValidLinesWithListPath(lines[pathTrail[trailIndex]],pathTrail,trailIndex+1,validPath).paths)
                } else {
                    paths.push(validPath);
                }
            }
        }
    }
    return {"paths":paths};
}

function iterateNestedLines(subsheetIndex,iteratorFunction) {
    //find the topmost sheet - this is because nested sheet info is stored inside the top level line values
    let parentInfo = getSubsheetParentInfo(subsheetIndex)
    //reverse the path because it comes it from the perspective of the affected entry, not the sheet itself
    parentInfo.path.reverse();
    //grab the paths to the affected lines
    let affectedLines = getValidLinesWithListPath(data.sheets[parentInfo.parentIndex].lines,parentInfo.path,0,"");
    /*
        affectedLines is an array of paths from the parent sheet lines down to the affected values
        [0].level1[0].level2
        [6].level1[0].level2
        etc.
    */
    console.log("paths: " + affectedLines.paths);
    affectedLines.paths.forEach(linePath => {
        /* linePath comes in like [0].level1[0].level2 */
        // subsheetLines is the array of lines nested inside this line entry
        console.log(resolvePath(data.sheets[parentInfo.parentIndex].lines, linePath));
        let subsheetLines = resolvePath(data.sheets[parentInfo.parentIndex].lines, linePath);
        if(Array.isArray(subsheetLines)) {
            //top level and subsheet
            subsheetLines.forEach(line => {
                console.log("destination line:");
                console.log(line);
                iteratorFunction(line);
            });
        } else {
            //props
            iteratorFunction(subsheetLines);
        }
    });
}

function handleConfigUpdate(event) {
    switch (event.detail.type) {
        case "create":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets.push(editorData);
                    focusSheet(data.sheets.length - 1);
                    editorConfig = {"active":false};
                    createLines(editorData.guid,1); //calls sheets updated as well
                    break;
                default: //column
                    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
                    data.sheets[sheetIndex].columns.push(editorData);
                    //if you're creating a column, create a new entry for a column value in every line based off the default value
                    if(!data.sheets[sheetIndex].hidden)
                    {
                        data.sheets[sheetIndex].lines.forEach(line => {
                            if(editorData.typeStr === "multiple")
                            {
                                line[editorData.name] = editorData.defaultValue.split(', ');
                            }
                            else
                            {
                                line[editorData.name] = editorData.defaultValue;
                            }
                        });
                    }
                    else
                    {
                        iterateNestedLines(sheetIndex,(line) => {
                            if(editorData.typeStr === "multiple")
                            {
                                line[editorData.name] = editorData.defaultValue.split(', ');
                            }
                            else
                            {
                                line[editorData.name] = editorData.defaultValue;
                            }
                        });
                    }
                    if(editorData.typeStr === "list") {
                        // make a new sheet that this list will reference
                        let newList = JSON.parse(JSON.stringify(defaults["sheet"]));
                        newList["hidden"] = true;
                        newList["description"] = "list@"+data.sheets[sheetIndex].guid;
                        newList["parentSheetGUID"] = data.sheets[sheetIndex].guid;
                        newList["columnGUID"] = editorData.guid;
                        let guid = uuidv4();
                        newList["guid"] = guid;
                        //assign the column's sheet param to this new list
                        data.sheets[sheetIndex].columns[data.sheets[sheetIndex].columns.findIndex(col => col.guid === editorData.guid)].sheet = guid;
                        newList["name"] = editorData.name;
                        //the list sheet is not configurable
                        delete newList.configurable;
                        data.sheets.push(newList);
                    }
                    else if(editorData.typeStr === "props") {
                        // make a new sheet that this props will reference
                        let newProps = JSON.parse(JSON.stringify(defaults["sheet"]));
                        newProps["hidden"] = true;
                        newProps["isProps"] = true;
                        newProps["description"] = "props@"+data.sheets[sheetIndex].guid;
                        newProps["parentSheetGUID"] = data.sheets[sheetIndex].guid;
                        newProps["columnGUID"] = editorData.guid;
                        let guid = uuidv4();
                        newProps["guid"] = guid;
                        //assign the column's sheet param to this new props
                        data.sheets[sheetIndex].columns[data.sheets[sheetIndex].columns.findIndex(col => col.guid === editorData.guid)].sheet = guid;
                        newProps["name"] = editorData.name;
                        //the list sheet is not configurable
                        delete newProps.configurable;
                        data.sheets.push(newProps);
                    }
                    editorConfig = {"active":false};
                    sheetsUpdated();
                    break;
            }
            break;
        case "save":
            switch (editorConfig.editType) {
                case "sheet":
                    data.sheets[selectedSheet] = editorData;
                    break;
                default: //column
                    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
                    var index = data.sheets[sheetIndex].columns.findIndex(x => x.name === editorConfig.editType); //old name
                    data.sheets[sheetIndex].columns[index] = editorData; //column now has new name maybe
                    //update line entries depending on circumstances - maybe a faster way?
                    if(editorConfig.editType !== editorData.name) //the name changed
                    {
                        if(!data.sheets[sheetIndex].hidden) {
                            data.sheets[sheetIndex].lines.forEach(line => {
                                //make a new key and assign it the the old value
                                line[editorData.name] = line[editorConfig.editType];
                                //delete the old key
                                delete line[editorConfig.editType];
                            });
                        }
                        else
                        {
                            iterateNestedLines(sheetIndex,(line) => {
                                //make a new key and assign it the the old value
                                line[editorData.name] = line[editorConfig.editType];
                                //delete the old key
                                delete line[editorConfig.editType];
                            });
                        }

                        //update display column if it used the old name
                        if(data.sheets[sheetIndex].displayColumn == editorConfig.editType) {
                            data.sheets[sheetIndex].displayColumn = editorData.name;
                        }

                        //TODO: may need to do more here if column name change was referenced by other sheet?
                    }
                    if(editorData.typeStr == "multiple")
                    {
                        if(!data.sheets[sheetIndex].hidden) {
                            data.sheets[sheetIndex].lines.forEach(line => {
                                //make sure the multiple only has values possible based on config
                                //this removes old values if config changes
                                line[editorData.name] = line[editorData.name].filter(value => editorData.options.includes(value));
                            });
                        }
                        else
                        {
                            iterateNestedLines(sheetIndex,(line) => {
                                line[editorData.name] = line[editorData.name].filter(value => editorData.options.includes(value));
                            });
                        }
                    }
                    if(editorData.typeStr == "enum")
                    {
                        if(!data.sheets[sheetIndex].hidden) {
                            data.sheets[sheetIndex].lines.forEach(line => {
                                //make sure the enum only has values possible based on config
                                if(!editorData.options.includes(line[editorData.name]))
                                {
                                    line[editorData.name] = editorData.defaultValue
                                }
                            });
                        }
                        else
                        {
                            iterateNestedLines(sheetIndex,(line) => {
                                ///make sure the enum only has values possible based on config
                                if(!editorData.options.includes(line[editorData.name]))
                                {
                                    line[editorData.name] = editorData.defaultValue
                                }
                            });
                        }
                    }
                    if(editorData.typeStr == "list")
                    {
                        // let refIndex = data.sheets.findIndex(s => s.guid === editorData.sheet);
                        // data.sheets[refIndex].name = editorData.name;
                        //also update the name in list visibility
                        Object.keys(listVisibility).forEach(key => {
                            // update column name references if we changed a column name here
                            if(listVisibility[key].guid === editorData.guid)
                            {
                                listVisibility[key].name = editorData.name;
                            }
                        });
                    }
                    
                    break;
            }
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "delete":
            switch (editorConfig.editType) {
                case "sheet":
                    const deletedGUID = data.sheets[selectedSheet].guid;
                    //recursively delete any list fields on this sheet
                    data.sheets[selectedSheet].columns.forEach(column => {
                        if(column.typeStr === "list") {
                            deleteListColumn(column);
                        }
                    });
                    data.sheets.splice(selectedSheet,1);
                    focusSheet(0);
                    //delete any references to this and set to ""
                    data.sheets.forEach(sheet => {
                        var sheetRefColumns = sheet.columns.filter(column => column.typeStr === "sheetReference");
                        var lineRefColumns = sheet.columns.filter(column => column.typeStr === "lineReference");
                        if(sheetRefColumns.length > 0) {
                            sheet.lines.forEach(line => {
                                sheetRefColumns.forEach(column => {
                                    if(line[column.name] === deletedGUID)
                                    {
                                        line[column.name] = "";
                                    }
                                });
                            });
                            sheetRefColumns.forEach(column => {
                                if(column.defaultValue === deletedGUID)
                                {
                                    column.defaultValue = "";
                                }
                            });
                        }
                        if(lineRefColumns.length > 0) {
                            let editedColumns = [];
                            lineRefColumns.forEach(column => {
                                if(column.sheet === deletedGUID)
                                {
                                    column.sheet = "";
                                    column.defaultValue = "";
                                    editedColumns.push(column);
                                }
                            });
                            sheet.lines.forEach(line => {
                                editedColumns.forEach(column => {
                                    //clear out previous linked values, as they pointed to a now deleted sheet
                                    line[column.name] = "";
                                });
                            });
                        }
                    });
                    break;
                default: //column
                    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
                    var index = data.sheets[sheetIndex].columns.findIndex(x => x.name === editorConfig.editType); //old name
                    if(!data.sheets[sheetIndex].hidden) {
                        data.sheets[sheetIndex].lines.forEach(line => {
                            //delete the entry for this column
                            delete line[editorConfig.editType];
                        });
                    }
                    else {
                        iterateNestedLines(sheetIndex,(line) => {
                            //delete the entry for this column
                            delete line[editorConfig.editType];
                        });
                    }
                    if(data.sheets[sheetIndex].displayColumn === data.sheets[sheetIndex].columns[index].name)
                    {
                        //we deleted the display column, update to default
                        data.sheets[sheetIndex].displayColumn = defaults["sheet"].displayColumn;
                    }
                    if(data.sheets[sheetIndex].columns[index].typeStr === "list")
                    {
                        deleteListColumn(data.sheets[sheetIndex].columns[index]);
                    }
                    //delete the column
                    data.sheets[sheetIndex].columns.splice(index,1);
                    //TODO: may need to do more here if column name change was referenced by other sheet?
                    break;
            }
            editorConfig = {"active":false};
            sheetsUpdated();
            break;
        case "close":
            editorConfig = {"active":false};
            break;
        case "upgradeColumnData":
            //this updates a column with a new config
            let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === editorConfig.sheetGUID);
            var index = data.sheets[sheetIndex].columns.findIndex(x => x.name === editorConfig.originalData.name); //old name, dont use a new name we may have input into editordata
            //find discrepancies
            let targetColumn = data.sheets[sheetIndex].columns[index];
            Object.keys(defaults[editorData.typeStr]).forEach(key => {
                if(key !== "configurable") {
                    if (!(key in targetColumn)){
                        targetColumn[key] = defaults[editorData.typeStr][key];
                    }
                } else {
                    Object.keys(defaults[editorData.typeStr]["configurable"]).forEach(configKey => {
                        if (!(configKey in targetColumn["configurable"])){
                        targetColumn["configurable"][configKey] = defaults[editorData.typeStr]["configurable"][configKey];
                    }
                    });
                }
            });
            sheetsUpdated();
            handleTableAction({"detail":{
                "type" : "editorUpdate",
                "data" : {
                    "active" : true,
                    "operation" : "edit",
                    "editType" : editorConfig.originalData.name,
                    "sheetGUID" : editorConfig.sheetGUID
                }
            }});
            break;
        default:
            editorConfig = {"active":false};
            break;
    }
}

function deleteListColumn(col) {
    let delSheetIndex = data.sheets.findIndex(sheet => sheet.guid === col.sheet);
    Object.keys(listVisibility).forEach(key => {
        if(listVisibility[key].guid === col.guid)
        {
            //if the column is deleted, we can remove this entry from visibility
            delete listVisibility[key];
        }
    });
    data.sheets[delSheetIndex].columns.forEach(column => {
        if(column.typeStr === "list") {
            deleteListColumn(column);
        }
    });
    data.sheets.splice(delSheetIndex,1);
}

let editorConfig = {"active" : false}
let editorData = {}
function handleTableAction(event) {
    let sheetIndex = data.sheets.findIndex(sheet => sheet.guid === event.detail.data.sheetGUID);
    switch (event.detail.type) {
        case "editorUpdate":
            editorConfig = event.detail.data;
            editorConfig["bannedNames"] = getBannedNames(editorConfig.sheetGUID,editorConfig);
            editorConfig["depotInfo"] = depotFileInfo;
            switch (editorConfig.operation) {
                case "new":
                    editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
                    editorData["guid"] = uuidv4(); //assign columns and sheets guids
                    if(editorConfig.editType === "lineReference")
                    {
                        //not sure why enum value not setting to default in the configurator, so set a default here
                        let defSheet = data.sheets.find(s => s.hidden !== true).guid; //get first unhidden sheet
                        editorData["sheet"] = defSheet;
                    }
                    break;
                case "edit":
                    switch (editorConfig.editType) {
                        case "sheet":
                            editorConfig["originalData"] = JSON.parse(JSON.stringify(data.sheets[sheetIndex]));
                            editorData = JSON.parse(JSON.stringify(data.sheets[sheetIndex]));
                            break;
                        default: //column
                            editorConfig["originalData"] = JSON.parse(JSON.stringify(data.sheets[sheetIndex].columns.find(x => x.name === editorConfig.editType)));
                            editorData = JSON.parse(JSON.stringify(data.sheets[sheetIndex].columns.find(x => x.name === editorConfig.editType)));
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case "update":
            sheetsUpdated();
            break;
        case "lineEdit":
            switch (event.detail.data.operation) {
                case "remove":
                    const deletedGUID = event.detail.data.line.guid;
                    data.sheets[sheetIndex].lines.splice(event.detail.data.lineIndex,1);
                    data.sheets.forEach(sheet => {
                        var lineRefColumns = sheet.columns.filter(column => column.typeStr === "lineReference");
                        if(lineRefColumns.length > 0) {
                            sheet.lines.forEach(line => {
                                lineRefColumns.forEach(column => {
                                    if(line[column.name] === deletedGUID)
                                    {
                                        line[column.name] = "";
                                    }
                                });
                            });
                            lineRefColumns.forEach(column => {
                                if(column.defaultValue === deletedGUID)
                                {
                                    column.defaultValue = "";
                                }
                            });
                        }
                    });
                    if(deletedGUID in listVisibility)
                    {
                        delete listVisibility[deletedGUID];
                    }
                    break;
                case "add":
                    if(!data.sheets[sheetIndex].hidden) {
                        createLines(event.detail.data.sheetGUID,event.detail.data.amount);
                    }
                    else {
                        //line additions to subsheets are handled in DepotSheet
                    }
                break;
                default:
                    break;
            }
            sheetsUpdated();
            break;
        case "pickFile":
            //forward events from fields
            //fileKey={{"line":line,"lineIndex":i,"column":column,"columnIndex":c}
            var fileKey = event.detail.fileKey;
            fileKey["sheet"] = sheetIndex;
            if(data.sheets[sheetIndex].hidden) {
                //find the topmost sheet - this is because nested sheet info is stored inside the top level line values
                let parentInfo = getSubsheetParentInfo(sheetIndex)
                //reverse the path because it comes it from the perspective of the affected entry, not the sheet itself
                parentInfo.path.reverse();
                //grab the paths to the affected lines
                let affectedLines = getValidLinesWithListPath(data.sheets[parentInfo.parentIndex].lines,parentInfo.path,0,"").paths;
                //this is every line with this path, we now need to filter this down to the specific 
                let filtered = affectedLines.filter(linePath => {
                    let subsheetLines = resolvePath(data.sheets[parentInfo.parentIndex].lines, linePath);
                    return subsheetLines[fileKey.lineIndex].guid == fileKey.line.guid;
                });
                //filtered now has one element in it with only the path to the cooresponding line
                fileKey["linePath"] = filtered[0];
                fileKey["sheet"] = parentInfo.parentIndex; //the passed in sheet needs to be the parent index
            }
            dispatch('message', {
                "type" : "pickFile",
                "fileKey" : event.detail.fileKey
            });
            break;
        default:
            break;
    }
}
function createSheet() {
    editorConfig = {
        "active" : true,
        "operation" : "new",
        "editType" : "sheet",
    }
    editorData = JSON.parse(JSON.stringify(defaults[editorConfig.editType]));
    let sheetGUID = uuidv4();
    editorData["guid"] = sheetGUID; //assign columns and sheets guids
    editorConfig["bannedNames"] = getBannedNames(sheetGUID,editorConfig);
    editorConfig["depotInfo"] = depotFileInfo;
}

function selectedSheetColumnCreate(columnType) {
    handleTableAction({"detail":{
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "new",
                "editType" : columnType,
                "sheetGUID" : data.sheets[selectedSheet].guid
                }
    }});
}

function selectedSheetEdit() {
    handleTableAction({"detail":{
        "type" : "editorUpdate",
        "data" :{
                "active" : true,
                "operation" : "edit",
                "editType" : "sheet",
                "sheetGUID" : data.sheets[selectedSheet].guid
                }
    }});
}

</script>
{#if !data.hasOwnProperty("sheets")}
    <h1>Depot</h1>
    <p>Invalid Depot File</p>
    <p>Use Ctrl/Cmd+Shift+P and select "Create new Depot File" to get started</p>
{:else}
    {#if data.sheets.length === 0}
        <h1>Depot</h1>
        <p>Click the button below to create sheet in Depot and get started</p>
       <DepotConfigurator debug={debug} data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
       {#if !editorConfig.active}
       <button class="buttonIcon padded" title="New sheet" on:click={createSheet}>
            <img src={iconPaths["newSheet"].path} alt="New Sheet">
        </button>
        {/if}
    {:else}
        <h1>{data.sheets[selectedSheet].name}</h1>
        <p>{data.sheets[selectedSheet].description}</p>
        <DepotOptions bind:debug={debug} bind:showLineGUIDs={showLineGUIDs}/>
        <button class="buttonIcon padded" title="New sheet" disabled={editorConfig.active} on:click={createSheet}>
            <img src={iconPaths["newSheet"].path} alt="New Sheet">
        </button>
        <button class="buttonIcon padded" title="Edit sheet" disabled={editorConfig.active} on:click={selectedSheetEdit}>
            <img src={iconPaths["editSheet"].path} alt="Edit Sheet">
        </button>
        {#each Object.keys(defaults) as columnType}
            {#if columnType !== "sheet"}
                <button class="buttonIcon padded" disabled={editorConfig.active} title="Create new {columnType} column" on:click={() => selectedSheetColumnCreate(columnType)}>
                    <img src={iconPaths[defaults[columnType].iconName].path} alt="Create new {columnType} column">
                </button>
            {/if}
        {/each}
        <div>
        {#each data.sheets as sheet}
            {#if !sheet.hidden}
            <button class="sheetButton {data.sheets.indexOf(sheet) == selectedSheet ? "selected" : ""}" title="Select sheet" on:click={focusSheet(data.sheets.indexOf(sheet))} disabled={editorConfig.active}>{sheet.name}</button>
            {/if}
        {/each}
        </div>
        <DepotConfigurator debug={debug} data={editorConfig.active ? editorData : {}} config={editorConfig} on:message={handleConfigUpdate}/>
        {#if !editorConfig.active}
            <!-- hide the table if editing a field to prevent sending the sheetupdate -->
            <DepotSheet debug={debug} 
                        showLineGUIDs={showLineGUIDs} 
                        bind:fullData={data} 
                        bind:sheetData={data.sheets[selectedSheet]} 
                        bind:inputLineData={data.sheets[selectedSheet].lines} 
                        depotInfo={depotFileInfo} 
                        on:message={handleTableAction}
                        bind:listVisibility={listVisibility}/>
        {/if}
    {/if}
{/if}

{#if debug}
<p>Selected Sheet: {selectedSheet}</p>
<p>Raw Data:</p>
<pre>{JSON.stringify({data},null,2)}</pre>
{/if}

<style>
    .buttonIcon {
        background-color: #3A3A3A;
        border: none;
        color: white;
        display: inline-block;
        cursor: pointer;
    }

    .buttonIcon:hover {
        background-color: #2A2D2E;
    }

    .buttonIcon:focus {
        outline: none;
        box-shadow: none;
    }
    .buttonIcon:active:focus {
        outline: none;
        box-shadow: none;
    }
    .buttonIcon.padded {
        margin: 5px 5px 5px 0px;
        width: 45px;
        height: 45px;
    }

    .sheetButton {
        background-color: #3A3A3A;
        border: none;
        color: white;
        display: inline-block;
        cursor: pointer;
        margin: 0px 5px 0px 0px;
        padding: 8px 8px 8px 8px;
    }
    .sheetButton:hover {
        background-color: #252526;
    }
    .sheetButton.selected {
        background-color: #252526;
    }
    .sheetButton:focus {
        outline: none;
        box-shadow: none;
    }
    .sheetButton:active:focus {
        outline: none;
        box-shadow: none;
    }
</style>