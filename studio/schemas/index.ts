import { event, eventImage, eventLibraryItem, eventProgramEntry, eventProgramSection } from './event'
import { news, newsImage } from './news'
import { homeHero, heroSlide } from './homeHero'
import { settings, office } from './settings'
import { page, pagePillar, pageFaq } from './page'
import { expert, certification } from './expert'
import { partner } from './partner'
import { center, centerImage } from './center'
import {
  localizedListItem,
  membershipBenefitGroup,
  membershipFeeTier,
  membershipPackage,
  membershipProgram,
  membershipRegistrationForm,
  membershipRequirementItem,
  membershipSpecificRequirement,
  membershipType,
} from './membershipProgram'

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
  membershipProgram,
  // Objects
  eventImage,
  eventProgramEntry,
  eventProgramSection,
  eventLibraryItem,
  newsImage,
  heroSlide,
  office,
  pagePillar,
  pageFaq,
  certification,
  centerImage,
  localizedListItem,
  membershipType,
  membershipBenefitGroup,
  membershipRequirementItem,
  membershipSpecificRequirement,
  membershipPackage,
  membershipFeeTier,
  membershipRegistrationForm,
]
