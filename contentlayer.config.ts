import fs from "node:fs";
import path from "node:path";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";

const GENERATED_FILE_PATHS = [
  path.resolve(".contentlayer/generated/Experience/_index.mjs"),
  path.resolve(".contentlayer/generated/Post/_index.mjs"),
  path.resolve(".contentlayer/generated/index.mjs"),
];

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    publishedAt: { type: "date", required: true },
    description: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
    image: {
      type: "string",
      resolve: (post) => `/images/${post._raw.flattenedPath}/cover.webp`,
    },
    slug: {
      type: "string",
      resolve: (post) => post._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
  },
}));

export const Experience = defineDocumentType(() => ({
  name: "Experience",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    company: { type: "string", required: true },
    employmentType: { type: "string", required: true },
    startDate: { type: "date", required: true },
    endDate: { type: "date" },
    skills: { type: "list", required: true, of: { type: "string" } },
  },
}));

const rehypePrettyCodeOptions: Options = {
  theme: {
    dark: "catppuccin-mocha",
    light: "catppuccin-latte",
  },
  keepBackground: false,
};

export default makeSource({
  contentDirPath: "./src/data",
  documentTypes: [Post, Experience],
  mdx: {
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  /** @see https://github.com/timlrx/contentlayer2/issues/21#issuecomment-2533524392 */
  onSuccess: async () => {
    for (const filePath of GENERATED_FILE_PATHS) {
      if (!fs.existsSync(filePath)) return;

      let content = fs.readFileSync(filePath, "utf-8");

      // Remove invalid syntax like `with { type: 'json' }`
      content = content.replace(/ with \{.*?\}/g, "");

      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`Patched ${filePath} after Contentlayer generation.`);
    }
  },
});
