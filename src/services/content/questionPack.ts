import { getPracticeQuestions, getTestQuestions } from '@/data/questions'
import { registerQuestionPack } from './packs'

/** Importing this module makes practice and test questions available synchronously to the content service. */
registerQuestionPack({ getPracticeQuestions, getTestQuestions })
