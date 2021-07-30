### 1.5.0

- Quality of Life updates
  - Nested sheets (from Lists + Props) will now only display their Add Column UI when that specific table is hovered, cleaning up the general UI of Depot and making it more understandable at a glance
  - Added in toggle for nested sheet data previewing so it isn't always on by default
  - Added in ability for a nested sheet to display its name (toggleable from options)
  - Added in ability for a nested sheet to display its path (toggleable from options)
  - These last two changes make it much easier to know what data you are editing in what nested sheet. This also paves the way to the idea of "focusing" a given sheet in a structure so you don't have to look at the whole sheet all the time.
  - Added in ability to "lock"/"unlock" a Depot file ("Allow Schema Editing" option) to locally "lock-in" the structure of a file. This can be toggled on and off at will and is not saved to the depot file directly.
  - Added in ability to prevent entries in a list or property field from being added or removed ("Add/Remove Items" option).
  - Image previews pop out in a tooltip when hovered instead of expanding inline.

### 1.4.0

- NEW COLUMN Grid
  - Grids allow you to define top level arrays that can be indexed like `sheets[0].lines[0].myGrid[0]`. A grid is able to contain values of different types, as configured in the grid settings themselves.
  - Grids, like Properties, can be nested in nested sheets and properties.
  - Grid values are limited to Depot's "primitive" types, so `bool`, `int`, `float`, `text`, `longtext`. The Grid could be expanded to contain other types in the future! 

### 1.3.0

- NEW COLUMN: Properties
  - Properties allow you to create schemas and data structures that don't need to be indexed by an array. For example, doing something like sheets[0].lines[0].props.key is now possible
  - Before, everything needed to be a sheet/list, so you would need to do sheets[0].lines[0].props[0].key. If you only have one set of props, you don't want to use arrays all the time!
  - Nesting: Properties can contain other properties and lists, and list and sheets can contain any number of properties. Nest away!
- NEW COLUMN: File Reference
  - Similar to the image reference column, a file refrence allows you to select a file and link it in by path to your Depot file.
  - This is useful if you want to use a Depot file to corrall all your build platform options, and you want to set file references to platform specific build scripts
- Bug Fixes:
  - Fixes issue where renaming display columns messed up line references that pointed to the affected sheet

### 1.2.0

- Updates Mult-select fields to use checkmark options instead of Ctrl/Cmd+Click
- Adds ability for Multi to display horizontally or vertically
- Adds in List preview in lines to see what items are in a given list. Uses ID to display values
- Adds in concept of "Column Updating" for a column. If the default schema of a column is updated (for example, Multi-Select got the "displayType" property), Depot will prompt you to update "older" versions of that schema to add in any new values.

### 1.0.0

Initial release of Depot