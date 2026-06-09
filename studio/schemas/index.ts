import { event, eventImage } from './event'
import { news, newsImage } from './news'
import { homeHero, heroSlide } from './homeHero'
import { settings, office } from './settings'
import { page, pagePillar, pageFaq } from './page'
import { expert, certification } from './expert'
import { partner } from './partner'
import { center, centerImage } from './center'
import course from './course'
import lesson from './lesson'
import resource from './resource'

export const schemaTypes = [
  // Documents
  event,
  news,
  homeHero,
  settings,
  page,
  expert,
  partner,
  center,
  course,
  resource,
  // Objects
  eventImage,
  newsImage,
  heroSlide,
  office,
  pagePillar,
  pageFaq,
  certification,
  centerImage,
  lesson,
]
