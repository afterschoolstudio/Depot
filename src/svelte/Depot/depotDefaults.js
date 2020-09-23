export let defaults = {
    "sheet" : {
        "name" : "newSheet",
        "description" : "description of what the sheet is",
        "columns": [],
        "lines": [],
        "configurable" : {
            "name" : "text",
            "description" : "text"
        }
    },
    "int" : {
        "typeStr": "int",
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
    }
}

//every new column needs a name, typeStr, and defaultValue field
//typeStr directly maps to svelte fieldtypes
//the value in the configurable section also maps to svelte field types