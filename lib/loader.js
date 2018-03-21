var Twig = require("twig");
var path = require("path");
var loaderUtils = require("loader-utils");
var hashGenerator = require("hasha");
var mapcache = require("./mapcache");
var twigCompiler = require("./compiler");

Twig.cache(false);

Twig.extend(function(Twig) {
    var compiler = Twig.compiler;
    compiler.module['webpack'] = twigCompiler.compiler;
});

module.exports = function(source) {
    var config = loaderUtils.getOptions(this),
        resourcePath = require.resolve(this.resource),
        id = hashGenerator(resourcePath),
        tpl;
    if (config && config.base) twigCompiler.setBase(config.base);
    mapcache.set(id, resourcePath)

    this.cacheable && this.cacheable();

    tpl = Twig.twig({
        id: id,
        path: resourcePath,
        data: source,
        allowInlineIncludes: true
    });

    tpl = tpl.compile({
        module: 'webpack',
        twig: 'twig'
    });

    this.callback(null, tpl);
};
