let I, Log;

(() => {
    Log = function ({name = null, logfn}) {
        logfn = logfn || console.log;
        let log;
        if (name) {
            let prefix = `[${name}]`;
            log = (...args) => {
                if (log._enabled) {
                    logfn.call(console, prefix, ...args);
                }
            };
        } else {
            log = (...args) => {
                if (log._enabled) {
                    logfn.call(console, ...args);
                }
            };
        }
        log._enabled = true;
        log.on = () => {
            log._enabled = true;
            return log;
        };
        log.off = () => {
            log._enabled = false;
            return log;
        };
        return log;
    }

    let VOID = new Proxy({}, {
        get: (_obj, _prop) => {
            return VOID;
        },
        set: (_obj, _prop, _val) => {
            return VOID;
        },
        apply: (_obj, _thisArg, _args) => {
            return VOID;
        }
    });

    function check(fail) {
        return (obj) => {
            if (obj === undefined || obj === null || obj === VOID) {
                fail();
                return VOID;
            } else {
                return obj;
            }
        }
    }

    I = {
        accept: check(() => {
            console.log("Doing without it.");
        }),
        want: check(() => {
            console.warn("I didn't get the object I want.");
        }),
        need: check(() => {
            throw new Error("I didn't get the object I need.");
        }),
        needToKnow: check(() => {
            debugger
        }),
    };
})();