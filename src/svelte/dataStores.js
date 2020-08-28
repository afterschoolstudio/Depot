import { writable } from 'svelte/store';

export var interactableData = writable({
    "name" : "default name",
    "another_value" : "default value"
});