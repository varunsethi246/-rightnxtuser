// var Buffer = require('buffer/').Buffer  /// note: the trailing slash is important!

global.Buffer = global.Buffer || require("buffer").Buffer; // eslint-disable-line