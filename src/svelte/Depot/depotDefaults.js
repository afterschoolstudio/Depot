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
    }
}

//every new column needs a name, typeStr, and defaultValue field