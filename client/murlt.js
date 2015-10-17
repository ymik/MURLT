window.addEventListener('load', function () {
    var fingerprint = undefined;

    var base64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    var hexToBase64 = function (hex) {
        var bin = String.fromCharCode.apply(null,
            hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "));

        for (var i = 0, j = 0, len = bin.length / 3, result = []; i < len; ++i) {
            var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
            if ((a | b | c) > 255)
                throw new Error("String contains an invalid character");
            result[result.length] = base64Table[a >> 2] + base64Table[((a << 4) & 63) | (b >> 4)] +
                (isNaN(b) ? "=" : base64Table[((b << 2) & 63) | (c >> 6)]) +
                (isNaN(b + c) ? "=" : base64Table[c & 63]);
        }
        return result.join("");
    };

    var strToHex = function (str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    };

    var calcHashOfStr = function (str) {
        var hash = 0, i, chr, len;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        if (hash > 0)
            return '0' + hash.toString(16);
        else
            return '1' + (-hash).toString(16);
    };

    var makeURL = function (href) {
        var path = href.split('?', 2);
        path[1] = path[1].split('#', 2);
        var query = path[1][0];
        query = query.split('&');
        path[1][0] = query;

        var assemblyURL = function () {
            path[1][0] = path[1][0].join('&');
            path[1] = path[1].join('#');
            return path.join('?');
        };


        var makeHash = function () {
            var dt = Math.round(Date.now() / 1000).toString(16);
            return 'murlt' + hexToBase64('' + fingerprint + dt);
        };

        for (var i = 0; i < query.length; i++) {
            if (query[i] && typeof(query[i]) == "string" && query[i].indexOf('murlt') == 0) {
                query[i] = makeHash();
                return assemblyURL();
            }
        }

        query[query.length] = makeHash();
        return assemblyURL();

    };

    var fixURL = function (state) {
        var path = window.location.href;
        var title = window.document.title;
        if (!state) {
            state = window.history.state;
        } else {
            path = state.path;
        }

        window.history.replaceState(state, title, makeURL(path));
    };

    if (window.murltFingerprint) {//TODO init & setup murltFingerprint
        fingerprint = window.murltFingerprint.toUpperCase();
        if (/(^[0-9A-F]+$)/i.test(fingerprint)) {
            fingerprint = strToHex(fingerprint);
        } else {
            fingerprint = calcHashOfStr(window.murltFingerprint);
        }

        fixURL();
    } else {
        fingerprint = calcHashOfStr(window.navigator.userAgent);
        fixURL();

        if (window.Fingerprint2) {
            new Fingerprint2().get(function (result) {
                fingerprint = result;
                fixURL();
            });
        }
    }

    setTimeout(function () {
        window.addEventListener('popstate', function (e) {
            fixURL(e.state);
        });
    }, 0);
});