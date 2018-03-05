module.exports = function (num) {
    var string = "";
    var chars =  "qiLEP8c9eTg0ubRxjCFpyWD4AY5wa1nohMXlkB6GS!7Qs%ZvrfHdUJOI3tNz2$#KV@m".split("")
    for (var i = 0; i < num; i++) {
        string += chars[Math.floor(Math.random()*chars.length -1) % chars.length];
    };
    return string;
};