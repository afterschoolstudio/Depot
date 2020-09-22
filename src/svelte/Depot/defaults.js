export let defaults = {
    "sheet" : {
        "name" : "newSheet",
        "columns": [],
        "lines": [],
        "editable" : ["name"]
    },
    "int" : {
        "typeStr": "int",
        "name": "newInt",
        "min" : -10000,
        "max" : 100000,
        "default" : 0,
        "editable" : ["name","min","max","default"]
    },
    "bool" : {
        "typeStr": "bool",
        "name": "newBool",
        "default" : true
    }
}