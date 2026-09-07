module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-CA", {
      year: "numeric", month: "long", day: "numeric",
    });
  });

  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("rfp.html");
  eleventyConfig.addPassthroughCopy("grants.html");
  eleventyConfig.addPassthroughCopy("akili.jpg");
  eleventyConfig.addPassthroughCopy("og-image.png");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_headers");


  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("blog/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("node_modules/**");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
