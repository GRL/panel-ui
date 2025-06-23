import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

export function formatSecondsVerbose(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const parts = []
    if (mins > 0) parts.push(`${mins} min`)
    if (secs > 0 || mins === 0) parts.push(`${secs} sec`)
    return parts.join(" ")
}

export function formatSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const paddedSecs = secs.toString().padStart(2, '0')
    return `${mins}:${paddedSecs}`
}

export function formatCentsToUSD(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100)
}

export function titleCase(str: string): string {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export enum Status {
    UNKNOWN = 0,
    ENTER = 1,
    INCOMPLETE = 2,
    COMPLETE = 3
}

export enum AdjustmentTypes {
    ac = "ADJUSTED_TO_COMPLETE",
    af = "ADJUSTED_TO_FAIL",
    pa = "PAYOUT_ADJUSTMENT"
}

export enum Source {
    g = "GRS",
    c = "Cint",
    // "a"
    d = "Dynata",
    // "et" "f"
    i = "Innovate",
    // "l" "m" "n" "o" "e" "r" "pr" "p" "rd" "h" "s" "t" "u"
    w = "WXET",
}