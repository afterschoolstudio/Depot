export let defaults = {
    "sheet" : {
        "name" : "newSheet",
        "description" : "description of what the sheet is",
        "displayColumn" : "id",
        "guid" : "",
        "columns": [],
        "lines": [],
        "hidden":false,
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "displayColumn" : "columnSelect@name",
            "columnSelect@name@displayColumn" : {
                "allowedTypes" : ["int","float","text","longtext"]
            }
        }
    },
    "int" : {
        "typeStr": "int",
        "guid" : "",
        "description" : "int field",
        "name": "newInt",
        "min" : -10000,
        "max" : 100000,
        "defaultValue" : 0,
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "min" : "int",
            "max" : "int",
            "defaultValue" : "int"
        }
    },
    "float" : {
        "typeStr": "float",
        "guid" : "",
        "description" : "float field",
        "name": "newFloat",
        "min" : -10000,
        "max" : 100000,
        "defaultValue" : 0,
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "min" : "float",
            "max" : "float",
            "defaultValue" : "float"
        }
    },
    "bool" : {
        "typeStr": "bool",
        "guid" : "",
        "description" : "bool field",
        "name": "newBool",
        "defaultValue" : true,
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "bool"
        }
    },
    "text" : {
        "typeStr": "text",
        "guid" : "",
        "name": "newText",
        "description" : "text field",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "text"
        }
    },
    "longtext" : {
        "typeStr": "longtext",
        "guid" : "",
        "name": "newLongText",
        "description" : "long text field",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "longtext"
        }
    },
    "image" : {
        "typeStr": "image",
        "guid" : "",
        "name": "newImage",
        "description" : "new image field",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "text"
        }
    },
    "enum" : {
        "typeStr": "enum",
        "guid" : "",
        "name": "newEnum",
        "description" : "new enum field",
        "options" : "",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "text",
            "options" : "text"
        }
    },
    "multiple" : {
        "typeStr": "multiple",
        "guid" : "",
        "name": "newMultiple",
        "description" : "new multiple field",
        "options" : "",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "text",
            "options" : "text"
        }
    },
    "sheetReference" : {
        "typeStr": "sheetReference",
        "guid" : "",
        "name": "newSheetReference",
        "description" : "new sheet reference field",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "defaultValue" : "sheetSelect",
            "sheetSelect@defaultValue" : {
                "allowEmpty" : true
            }
        }
    },
    "lineReference" : {
        "typeStr": "lineReference",
        "guid" : "",
        "name": "newLineReference",
        "description" : "new line reference field",
        "sheet" : "",
        "defaultValue" : "",
        "configurable" : {
            "name" : "text",
            "description" : "text",
            "sheet" : "sheetSelect",
            "defaultValue" : "lineSelect@sheet"
        }
    },
    "list" : {
        "typeStr":"list",
        "guid":"",
        "name":"new list",
        "description":"new list field",
        "sheet":"",
        "defaultValue":[],
        "configurable" : {
            "name" : "text",
            "description" : "text",
        }
    }
};

//every new column needs a name, guid, typeStr, and defaultValue field
//the @ for columnSelect and lineSelect indicates the field in their type that has the sheet to look up a column or line in
//typeStr directly maps to svelte fieldtypes
//the value in the configurable section also maps to svelte field types