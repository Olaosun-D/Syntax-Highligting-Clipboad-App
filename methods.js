const hljs = require('./node_modules/highlight.js');

module.exports = {
    loadProgrammingLanguages: function () {
        hljs.configure({
            language: [
                'javascript',
                'java',
                'css',
                'python',
                'c',
                'c++',
                // 'visual-basic',
                // "ada",
                // "applescript",
                "xml",
                // "clojure-repl", 
                // "cmake", 
                // "coffeescript",
                "django",
                // "dsconfig",
                "ruby",
                // "erlang",
                "excel",
                // "go",
                "http",
                "json",
                // "kotlin",
                // "livescript",
                "bash",
                // "perl",
                "php",
                "plaintext",
                "sas",
                "sql",
                // "swift",
                // "shell",
            ]
        });
    },
    linkify: function (inputText) {
        //URLs starting with http://, https://, or ftp://
        var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        var replacedText = inputText.replace(replacePattern1, '<a id="output__link" href="$1" target="_blank">$1</a>');

        //URLs starting with www. (without // before it, or it'd re-link the ones done above)
        var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        var replacedText = replacedText.replace(replacePattern2, '$1<a class="output__link" id="output__link" href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links
        var replacePattern3 = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
        var replacedText = replacedText.replace(replacePattern3, '<a class="output__link" id="output__link" href="mailto:$1">$1</a>');

        return replacedText;
    },
    compressImage: function (image, width) {
        //Applies compress to images larger than indexed width
        if (image.getSize().width > width) {
            imageHeight = width / image.getAspectRatio();
            reducedImage = image.resize({
                width: width,
                height: imageHeight
            });
            return reducedImage;
        } else {
            // returns image if it's already compressed
            return image;
        }
    },
    truncateString: function (str, num) {
        if (str.length > num)
            return str.slice(0, num > 3 ? num - 3 : num) + '...'
        //   `<span style="color:blue" class="read-more">..read more</span>`;
        return str;
    }
};