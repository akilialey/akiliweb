module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-CA", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("rfcDate", (d) => new Date(d).toUTCString());
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 230)) + " min read";
  });
  eleventyConfig.addGlobalData("build", { date: new Date().toISOString().slice(0, 10) });
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("services.html");
  eleventyConfig.addPassthroughCopy("akili.jpg");
  eleventyConfig.addPassthroughCopy("akili-avatar.jpg");
  eleventyConfig.addPassthroughCopy("og-image.png");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("_redirects");


  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("blog/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("index.njk");
  eleventyConfig.ignores.add("services.njk");
  eleventyConfig.ignores.add("PRODUCT.md");
  eleventyConfig.ignores.add("DESIGN.md");
  eleventyConfig.ignores.add(".impeccable/**");
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
