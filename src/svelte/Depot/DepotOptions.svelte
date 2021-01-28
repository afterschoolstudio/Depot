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
export let debug;
export let showLineGUIDs;
export let previewDisclosedFields;
export let showNestedNames;
export let showNestedPaths;
export let allowSchemaEditing;
export let allowAddRemoveItems;

</script>
<input type=checkbox bind:checked={debug}>Debug
<input type=checkbox bind:checked={showLineGUIDs}>Show Line GUIDs
<input type=checkbox bind:checked={previewDisclosedFields}>Preview List/Props/Grid Fields
<input type=checkbox bind:checked={showNestedNames}>Show Nested Sheet Names
<input type=checkbox bind:checked={showNestedPaths}>Show Nested Sheet Paths
<input type=checkbox bind:checked={allowSchemaEditing}>Allow Schema Editing
<input type=checkbox bind:checked={allowAddRemoveItems}>Add/Remove Items
<br>
<br>
