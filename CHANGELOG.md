# 1.6.0
### Sponsor Us!
Before we get into the patch notes for this release, I wanted to call out the fact that Depot/Afterschool have been accepted into the [Github Sponsors program](https://github.com/sponsors/afterschoolstudio)!

Depot was a labor of love that I initially built over the course of three months of fulltime work on the project. I knew it was something that people outside my game studio needed (thanks [CastleDB](http://castledb.org)!), so the time was well spent knowing that the tool would resonate. To date, Depot has nearly **3,000** installs, making it one of the most popular extensions of its type.

If you use Depot in your work or find value in it, I'd ask you [to throw a few dollars our way](https://github.com/sponsors/afterschoolstudio) — making tools like Depot takes time, and not only that but packaging it up with actual documentation, changelogs, etc. is easily a fulltime job. We want to be able to continue work on the tool outside of fixes and features when we need them, so anything you give us can directly go to working to bring someone on fulltime to continue to build out Depot and other general purpose tools for game developers.

You can back us for as little as $5/month, but studios interested in getting more out of us can pay us to run a workshop for you on the tool or even contract us to build out a Depot solution for your game or application.

Thank you so much for reading and I do hope you consider giving us some money so we can continue to make Depot the best game data editor around! Onto the patch notes!

## Optimizations + Usability inspired by Dogfooding
The core reason Depot was (and is!) developed was for use on [Cantata](https://store.steampowered.com/app/690370/Cantata/). We've been more and more relying on the tool as the game gets more and more fleshed out, and our core Depot data file is a nearly **30,000** lines of JSON long (and growing every day!).

Depot has held up like champ through this use case and proven to be a more than worthwhile investment, but things were definitely starting to get a little slow.

I found out the primary issue was that I was aggressively updating Depot all the time, and the update callbacks that were being emitted from the Code runtime were starting to get out of order with the updates I was sending it, which started to make Depot unusable. Luckily it wasn't an unsolvable problem, and part of the fix was leaning more directly into [Svelte's reactivity functionality](https://svelte.dev/tutorial/updating-arrays-and-objects).

I also took the opportunity to blow off some of the cobwebs on the project and make sure you can still easily build it after a clone. In addition to other minor fixes, **I also implemented the ability to list/rows to be copied**. Nobody was necessarily asking for this, but I was _hurting_ for it. Especially when you have complex nested trees of data, and want a new element with the same basic config, hand-rolling those every time hurt. More below:
## Improves large data handling
- Optimizations made for handling large data files
## Line Copying
- You can now duplicate any list or sheet line by clicking the copy button below the "X" on a line.

![line](https://github.com/afterschoolstudio/Depot/blob/master/images/changelog/copy_preview.png?raw=true)

- The copy is a "deep copy", copying over all the values you set at the given line, including any props or lists you configured at deeper levels
- Copying lines **overwrites all guid values for the copied line**. When you make a copy, you're making a copy with all the same data, however the guids of the lines and object themselves are changed to reflect that this copy isn't literally a "pointer" to the original line, but it's own new line that happens to have the same values.
- Copying can happen at any level — if you're 10 layers nested into an object and copy a list item there, it will only copy at that level and all values below it. It will not duplicate the top sheet line.

## Other Features
- Merges in first PR(!) — adds in ability to declare the initial state a Depot file should be in in regards to schema editing through the new ```depot.openWithSchemaEditingOn``` setting. It still defaults to true but if you find your schema to be static and the editing UI annoying, this is for you!
- Makes the filepicker for images/files not default to a specific type of file (#42)

## Bugfixes
- Gets Depot able to be compiled again after a fresh pull by fixing Svelte and NPM issues.

# 1.5.0
## Quality of Life Updates
- Nested sheets (from Lists + Props) will now only display their Add Column UI when that specific table is hovered, cleaning up the general UI of Depot and making it more understandable at a glance
- Added in toggle for nested sheet data previewing so it isn't always on by default
- Added in ability for a nested sheet to display its name (toggleable from options)
- Added in ability for a nested sheet to display its path (toggleable from options)
- These last two changes make it much easier to know what data you are editing in what nested sheet. This also paves the way to the idea of "focusing" a given sheet in a structure so you don't have to look at the whole sheet all the time.
- Added in ability to "lock"/"unlock" a Depot file ("Allow Schema Editing" option) to locally "lock-in" the structure of a file. This can be toggled on and off at will and is not saved to the depot file directly.
- Added in ability to prevent entries in a list or property field from being added or removed ("Add/Remove Items" option).
- Image previews pop out in a tooltip when hovered instead of expanding inline.
# 1.4.0
## New Column: Grid
- Grids allow you to define top level arrays that can be indexed like `sheets[0].lines[0].myGrid[0]`. A grid is able to contain values of different types, as configured in the grid settings themselves.
- Grids, like Properties, can be nested in nested sheets and properties.
- Grid values are limited to Depot's "primitive" types, so `bool`, `int`, `float`, `text`, `longtext`. The Grid could be expanded to contain other types in the future! 
# 1.3.0
## NEW COLUMN: Properties
- Properties allow you to create schemas and data structures that don't need to be indexed by an array. For example, doing something like sheets[0].lines[0].props.key is now possible
- Before, everything needed to be a sheet/list, so you would need to do sheets[0].lines[0].props[0].key. If you only have one set of props, you don't want to use arrays all the time!
- Nesting: Properties can contain other properties and lists, and list and sheets can contain any number of properties. Nest away!
## NEW COLUMN: File Reference
- Similar to the image reference column, a file reference allows you to select a file and link it in by path to your Depot file.
- This is useful if you want to use a Depot file to corrall all your build platform options, and you want to set file references to platform specific build scripts
## Bug Fixes:
- Fixes issue where renaming display columns messed up line references that pointed to the affected sheet
# 1.2.0
- Updates Multi-select fields to use checkmark options instead of Ctrl/Cmd+Click
- Adds ability for Multi to display horizontally or vertically
- Adds in List preview in lines to see what items are in a given list. Uses ID to display values
- Adds in concept of "Column Updating" for a column. If the default schema of a column is updated (for example, Multi-Select got the "displayType" property), Depot will prompt you to update "older" versions of that schema to add in any new values.

# 1.0.0

Initial release of Depot