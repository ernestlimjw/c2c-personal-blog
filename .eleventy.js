module.exports = function(eleventyConfig) {
    // Copy the css directory to the output
    eleventyConfig.addPassthroughCopy("src/css");
    
    // Copy the img directory to the output
    eleventyConfig.addPassthroughCopy("src/img");

    // Create a collection for blog posts
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/blog/*.md");
    });

    // Date filter for formatting
    eleventyConfig.addFilter("date", function(date, format) {
        return new Date(date).toISOString().split('T')[0];
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
}; 