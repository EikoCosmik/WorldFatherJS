// =====================================
// ==========| DebugSwitches |==========
// =====================================

/**
 * Switches get imported as needed by objects at the top of the file.
 * If you need inline for whatever reason use the following:
 * import type { debug_XXX } from "./types";
 */

// =====| Camera |=====
export const debug_drawCamera: boolean = false;

// =====| Collision |=====
export const debug_collisionGrid: boolean = false;
export const debug_collisionCells: boolean = false;

// =====| Scene |=====
export const debug_sceneCenterRings: boolean = false;
export const debug_sceneCenter: boolean = false;

// =====| Entity |=====
export const debug_EntityDirection: boolean = true;
export const debug_EntityVerticies: boolean = true;
export const debug_EntityBoundingBox: boolean = true;
export const debug_EntityNormals: boolean = true;