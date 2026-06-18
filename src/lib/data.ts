// Barrel for seed content. Each entity lives in its own module under `seed/`
// so Rollup can code-split the JSON per route instead of bundling every seed
// file into one shared chunk (loaded on every page via the Footer).

export { localize, t, type LocalizedString } from './i18n'

export { default as settings } from './seed/settings'
export { default as events } from './seed/events'
export { default as news } from './seed/news'
export { default as partners } from './seed/partners'
export { default as membership } from './seed/membership'
export { default as pages } from './seed/pages'
export { default as centers } from './seed/centers'
export { default as experts } from './seed/experts'
