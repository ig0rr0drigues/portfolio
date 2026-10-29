import { localeRich, localeString, localeText } from './locale'
import { imageBlock, imagePairBlock, textBlock, vimeoBlock } from './blocks'
import { project } from './project'
import { siteSettings } from './siteSettings'
import { archiveOrder, projectOrder } from './projectOrder'

export const schemaTypes = [localeString, localeText, localeRich, imageBlock, imagePairBlock, textBlock, vimeoBlock, project, siteSettings, projectOrder, archiveOrder]
