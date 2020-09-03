export let cantataDataVersion = 1;
function fieldInfo(name, type, desc, defVal) { return {"name" : name,"type" : type,"description" : desc, "defaultValue" : defVal}}
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
        1
    )]
]);


export let terrainData = {
    'gameplay' : new Map([
        ["capacity", fieldInfo(
            "Capacity",
            "text",
            "How much this terrain can hold",
            10
        )],
        ["isWater", fieldInfo(
            "Water?",
            "text",
            "Does this terrain count as Water",
            false
        )],
        ["movementCost", fieldInfo(
            "Movement Cost",
            "text",
            "How much does this terrain cost to move through",
            1
        )],
        ["visibilityCost", fieldInfo(
            "Visibility Cost",
            "text",
            "How much does this terrain cost to see into",
            1
        )],
    ]),
    'generatorInfo' : new Map([
        ["generatorChooseRandom", fieldInfo(
            "Choose Random Sprite on Generation",
            "text",
            "If used in terrain generation, should a random sprite be picked? Otherwise use hero always",
            true
        )],
        ["heightIndex", fieldInfo(
            "Height Index",
            "text",
            "Generator height Index",
            0.5
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
            fieldInfo(
            "Hero Sprite Index",
            "text",
            "Which sprite should be used in UI to show this terrain?",
            0
        )],
        ["numSprites", 
            fieldInfo(
            "Number of Sprites",
            "text",
            "How many sprites does this sheet contain?",
            1
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