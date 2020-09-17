export let cantataDataVersion = 1;
function textField(name, desc, defVal) { return {"name" : name,"type" : "text", "description" : desc, "defaultValue" : defVal}}
function longTextField(name, desc, defVal) { return {"name" : name,"type" : "longtext", "description" : desc, "defaultValue" : defVal}}
function boolField(name, desc, defVal) { return {"name" : name,"type" : "bool", "description" : desc, "defaultValue" : defVal}}
function intField(name, desc, defVal, min, max) { return {"name" : name,"type" : "int", "description" : desc, "defaultValue" : defVal, "min" : min, "max" : max}}
function floatField(name, desc, defVal, min, max) { return {"name" : name,"type" : "float", "description" : desc, "defaultValue" : defVal, "min" : min, "max" : max}}
function enumField(name, desc, defVal, values) { return {"name" : name,"type" : "enum", "description" : desc, "defaultValue" : defVal, "values" : values}}
function multipleField(name, desc, defVal, values) { return {"name" : name,"type" : "multiple", "description" : desc, "defaultValue" : defVal, "values" : values}}
function imageField(name, desc) { return {"name" : name,"type" : "image", "description" : desc, "defaultValue" : ""}}
export let manifest = new Map([
    ["cantataDataVersion", textField(
        "Cantata Data Version",
        "Version spec for Cantata's data",
        cantataDataVersion
    )],
    ["guid", textField(
        "GUID",
        "Unique ID to identify your asset to other assets",
        "guid"
    )],
    ["owner", textField(
        "Owner",
        "Owner of this data",
        ""
    )],
    ["version", textField(
        "Version",
        "Version index of this specific piece of data",
        "1"
    )]
]);


export let terrainData = {
    'gameplay' : new Map([
        ["capacity", intField(
            "Capacity",
            "How much this terrain can hold",
            10,0,10
        )],
        ["isWater", boolField(
            "Water?",
            "Does this terrain count as Water",
            false
        )],
        ["movementCost", intField(
            "Movement Cost",
            "How much does this terrain cost to move through",
            1,1,10
        )],
        ["testMultipleField", multipleField(
            "Test multiple",
            "Seeing how multiple values would work",
            ["first"],
            ["first","second","third","fourth","fifth"]
        )],
        ["visibilityCost", intField(
            "Visibility Cost",
            "How much does this terrain cost to see into",
            1,1,10
        )]
    ]),
    'generatorInfo' : new Map([
        ["generatorChooseRandom", boolField(
            "Choose Random Sprite on Generation",
            "If used in terrain generation, should a random sprite be picked? Otherwise use hero always",
            true
        )],
        ["heightIndex", floatField(
            "Height Index",
            "Generator height Index",
            0.5,0,1
        )],
    ]),
    'info' : new Map([
        ["name", 
            textField(
            "Terrain Name",
            "Name of the terrain. Will appear in game on hover.",
            "Default"
        )],
        ["description", 
            longTextField(
            "Description",
            "Description of the terrain",
            "An Awesome terrain"
        )],
        ["placementSound", 
            textField(
            "Placement Sounds",
            "The sound the terrain makes when placed",
            "none"
        )],
        ["terrainType", 
            enumField(
            "Terrain Type",
            "What kind of terrain is this? (Base, Detail, etc.)",
            "base",
            ["base","detail","mechanical"]
        )],
    ]),
    'spriteInfo' : new Map([
        ["heroSpriteIndex", 
            intField(
            "Hero Sprite Index",
            "Which sprite should be used in UI to show this terrain?",
            0,0,64
        )],
        ["numSprites", 
            intField(
            "Number of Sprites",
            "How many sprites does this sheet contain?",
            1,1,64
        )],
        ["spriteType", 
            textField(
            "Sprite Type",
            "Is this a single, wang, or animated sprite?",
            "single"
        )],
        ["tilemap", 
            imageField(
            "Spritesheet",
            "Local path to the spritesheet"
        )],
    ])
};