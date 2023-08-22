import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    publishedAt: { type: 'date', required: true },
    description: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: post => post._raw.flattenedPath,
    },
    image: {
      type: 'string',
      resolve: post => `/images/${post._raw.flattenedPath}.webp`,
    },
  },
}))

export const Experience = defineDocumentType(() => ({
  name: 'Experience',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    company: { type: 'string', required: true },
    employmentType: { type: 'string', required: true },
    startDate: { type: 'date', required: true },
    endDate: { type: 'date' },
    skills: { type: 'list', required: true, of: { type: 'string' } },
  },
}))

export default makeSource({
  contentDirPath: './src/data',
  documentTypes: [Post, Experience],
})
