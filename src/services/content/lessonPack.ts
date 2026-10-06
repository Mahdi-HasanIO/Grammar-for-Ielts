import { getLesson } from '@/data/lessons'
import { registerLessonPack } from './packs'

/** Importing this module makes lessons available synchronously to the content service. */
registerLessonPack({ getLesson })
