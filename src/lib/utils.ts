import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import React from "react";

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
