import { v4 } from "https://deno.land/std@0.127.0/uuid/mod.ts"

/**
 * Determines if property is a valid UID.
 * @param uid 
 */
export const isValidUid = (prop: any): prop is string => {
    if (typeof prop === 'string' && v4.validate(prop)) return true
    return false
}
/**
 * Generates a UID.
 * @returns 
 */
export const uuid = () => crypto.randomUUID()