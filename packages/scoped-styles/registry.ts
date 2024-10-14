import type {StyleSheet} from './style-sheet'

export const rootsRegistry = new Set<HTMLElement>()
export const sheetsRegistry = new Map<string, StyleSheet>()
