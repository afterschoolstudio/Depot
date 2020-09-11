export let cantataDataVersion = 1;
function fieldInfo(name, type, desc, defVal) { return {"name" : name,"type" : type,"description" : desc, "defaultValue" : defVal}}
function numberInfo(name, type, desc, defVal, min, max) { return {"name" : name,"type" : type,"description" : desc, "defaultValue" : defVal, "min" : min, "max" : max}}
export let manifest = new Map([
    ["cantataDataVersion", fieldInfo(
        "Cantata Data Version",
        "text",
        "Version spec for Cantata's data",
        cantataDataVersion
    )],
    ["guid", fieldInfo(
        "GUID",
        "text",
        "Unique ID to identify your asset to other assets",
        "guid"
    )],
    ["owner", fieldInfo(
        "Owner",
        "text",
        "Owner of this data",
        ""
    )],
    ["version", fieldInfo(
        "Version",
        "text",
        "Version index of this specific piece of data",
        "1"
    )]
]);


export let terrainData = {
    'gameplay' : new Map([
        ["capacity", numberInfo(
            "Capacity",
            "number",
            "How much this terrain can hold",
            10,0,10
        )],
        ["isWater", fieldInfo(
            "Water?",
            "bool",
            "Does this terrain count as Water",
            false
        )],
        ["movementCost", numberInfo(
            "Movement Cost",
            "number",
            "How much does this terrain cost to move through",
            1,1,10
        )],
        ["visibilityCost", numberInfo(
            "Visibility Cost",
            "number",
            "How much does this terrain cost to see into",
            1,1,10
        )],
    ]),
    'generatorInfo' : new Map([
        ["generatorChooseRandom", fieldInfo(
            "Choose Random Sprite on Generation",
            "bool",
            "If used in terrain generation, should a random sprite be picked? Otherwise use hero always",
            true
        )],
        ["heightIndex", numberInfo(
            "Height Index",
            "number",
            "Generator height Index",
            0.5,0,1
        )],
    ]),
    'info' : new Map([
        ["name", 
            fieldInfo(
            "Terrain Name",
            "text",
            "Name of the terrain. Will appear in game on hover.",
            "Default"
        )],
        ["placementSound", 
            fieldInfo(
            "Placement Sounds",
            "text",
            "The sound the terrain makes when placed",
            "none"
        )],
        ["terrainType", 
            fieldInfo(
            "Terrain Type",
            "text",
            "What kind of terrain is this? (Base, Detail, etc.)",
            "base"
        )],
    ]),
    'spriteInfo' : new Map([
        ["heroSpriteIndex", 
            numberInfo(
            "Hero Sprite Index",
            "number",
            "Which sprite should be used in UI to show this terrain?",
            0,0,64
        )],
        ["numSprites", 
            numberInfo(
            "Number of Sprites",
            "number",
            "How many sprites does this sheet contain?",
            1,1,64
        )],
        ["spriteType", 
            fieldInfo(
            "Sprite Type",
            "text",
            "Is this a single, wang, or animated sprite?",
            "single"
        )],
        ["tilemap", 
            fieldInfo(
            "Spritesheet",
            "text",
            "Local path to the spritesheet",
            "none"
        )],
    ])
};