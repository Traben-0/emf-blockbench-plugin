(() => {
    let constants, ranges, booleans, enabledBooleans
    Plugin.register("emf_animation_addon", {
        title: "EMF Animation Addon",
        icon: "icon.png",
        author: "Traben & Ewan Howell",
        description: "Adds extra animation support to CEM Template Loader so that it is compatible with the Entity Model Features mod.",
        tags: ["Minecraft: Java Edition", "Entity Models", "Animation"],
        version: "1.0.0",
        min_version: "4.9.0",
        variant: "both",
        dependencies: ["cem_template_loader"],
        onload() {
            new Setting("emf_features", {
                    value: true,
                    category: "edit",
                    name: "Enable EMF only features (requires restart)",
                    description: "Enable features that are only compatible with the Entity Model Features mod. These will not work in OptiFine"
                }
            )

            setTimeout(() => {

                constants = {
                    e: 2.718281828459045,
                    nan: NaN,
                    //add: (...args) => args.reduce((a, e) => a + e, 0)
                    catch: (x, c, id) => {
                        if (x === undefined || typeof x !== 'number') {
                            console.log(`catch print(${id}) = x was undefined or not a number type`)
                            return c
                        }
                        if (!Number.isNaN(x)) return x
                        console.log(`catch print(${id}) = x was NaN`)
                        return c
                    },
                    wrapdeg: wrapDegrees,
                    wraprad: (r) => toRadians(wrapDegrees(toDegrees(r))),
                    degdiff: angleBetween,
                    raddiff: (a, b) => toRadians(angleBetween(toDegrees(a), toDegrees(b))),
                    randomb: (seed) => {
                        if (!seed) return Math.random() >= 0.5
                        seed = frac(seed * 123.34)
                        seed += seed * (seed + 45.32)
                        return frac(seed * seed) >= 0.5
                    },
                    ifb: (...args) => {
                        if (args.length < 3 || args.length % 2 !== 1 || typeof args[0] !== "boolean") throw Error
                        for (let i = 0; i < args.length; i += 2) {
                            if (i === args.length - 1) {
                                if (typeof args[i] === "number") throw Error("Ifb statements cannot return a <strong>number</strong>")
                                return args[i]
                            } else if (args[i]) {
                                if (typeof args[i + 1] === "number") throw Error("Ifb statements cannot return a <strong>number</strong>")
                                return args[i + 1]
                            }
                        }
                    },
                    easeinquad: easeInQuad,
                    easeoutquad: easeOutQuad,
                    easeinoutquad: easeInOutQuad,
                    easeincubic: easeInCubic,
                    easeoutcubic: easeOutCubic,
                    easeinoutcubic: easeInOutCubic,
                    easeinquart: easeInQuart,
                    easeoutquart: easeOutQuart,
                    easeinoutquart: easeInOutQuart,
                    easeinquint: easeInQuint,
                    easeoutquint: easeOutQuint,
                    easeinoutquint: easeInOutQuint,
                    easeinsine: easeInSine,
                    easeoutsine: easeOutSine,
                    easeinoutsine: easeInOutSine,
                    easeinexpo: easeInExpo,
                    easeoutexpo: easeOutExpo,
                    easeinoutexpo: easeInOutExpo,
                    easeincirc: easeInCirc,
                    easeoutcirc: easeOutCirc,
                    easeinoutcirc: easeInOutCirc,
                    easeinelastic: easeInElastic,
                    easeoutelastic: easeOutElastic,
                    easeinoutelastic: easeInOutElastic,
                    easeinbounce: easeInBounce,
                    easeoutbounce: easeOutBounce,
                    easeinoutbounce: easeInOutBounce,
                    easeinback: easeInBack,
                    easeoutback: easeOutBack,
                    easeinoutback: easeInOutBack,
                    quadbezier: quadraticBezier,
                    cubicbezier: cubicBezier,
                    hermite: hermiteInterpolation,
                    catmullrom: (t, p0, p1, p2, p3) => {
                        let t2 = t * t;
                        let t3 = t * t2;
                        return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
                    },
                    keyframe: keyframe,
                    keyframeloop: (k, ...args) => {
                        if (args.length < 2) throw Error
                        if (typeof k !== "number") throw Error
                        //normal keyframe bounds
                        if (k < args.length - 1) return keyframe(k, ...args)
                        //loop keyframe
                        args.push(args[0])
                        let boundedK = k % (args.length - 1)
                        return keyframe(boundedK, ...args)
                    }
                }
                ranges = {
                    // zeroToHundred: [0, 50, 100],
                    // start30Jump15: [0, 30, 90, 15]
                    move_forward: [-1, 0, 1, 0.01],
                    move_strafing: [-1, 0, 1, 0.01],
                    height_above_ground: [0, 0, 128, 0.25],
                    fluid_depth: [0, 0, 64],
                    fluid_depth_up: [0, 0, 64],
                    fluid_depth_down: [0, 0, 64],
                    distance: [0, 0, 128, 0.25],
                }
                booleans = ["is_climbing", "is_crawling", "is_swimming", "is_gliding", "is_blocking"]
                enabledBooleans = ["is_right_handed"]

                // only add the values if the setting is enabled
                // but still declare them, so they can be removed on unload, or maybe that isn't needed,
                // idrk how the load unload lifecycle works in block-bench yet
                if (settings.emf_features.value) {
                    Object.assign(optifineAnimationVariables.constants, constants)
                    Object.assign(optifineAnimationVariables.ranges, ranges)
                    for (const boolean of booleans) optifineAnimationVariables.booleans.add(boolean)
                    for (const boolean of enabledBooleans) {
                        optifineAnimationVariables.booleans.add(boolean)
                        optifineAnimationVariables.enabledBooleans.add(boolean)
                    }
                }

            }, 0)
        },
        onunload() {
            for (const key of Object.keys(constants)) delete globalThis.optifineAnimationVariables?.constants[key]
            for (const key of Object.keys(ranges)) delete globalThis.optifineAnimationVariables?.ranges[key]
            for (const boolean of booleans) globalThis.optifineAnimationVariables?.booleans.delete(boolean)
            for (const boolean of enabledBooleans) {
                globalThis.optifineAnimationVariables?.booleans.delete(boolean)
                globalThis.optifineAnimationVariables?.enabledBooleans.delete(boolean)
            }
        }
    })

})()



function keyframe(k, ...args) {
    if (args.length < 2) throw Error
    if (typeof k !== "number") throw Error

    //get lower lerp value
    let minIndex = Math.floor(k)
    //return min if below 0
    if (minIndex < 0) return args[0]
    //return max if above max index
    if (minIndex >= args.length - 1) return args[args.length - 1]
    let min = args[minIndex]
    //get upper lerp value
    let maxIndex = minIndex + 1
    let max = args[maxIndex]
    if (typeof min !== "number" || typeof max !== "number") throw Error

    return lerp(k - minIndex, min, max)

}

function lerp(a, b, c) {
    return b * (1 - a) + c * a;
}

function wrapDegrees(degrees) {
    let d = degrees % 360.0;
    if (d >= 180.0) {
        d -= 360.0;
    }
    if (d < -180.0) {
        d += 360.0;
    }
    return d;
}

function frac(x) {
    return x - Math.floor(x);
}

function toDegrees(radians) {
    return radians * (180.0 / Math.PI);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180.0);
}

function angleBetween(first, second) {
    let v = wrapDegrees(second - first);
    return v < 0 ? -v : v
}

function easeInQuad(t, start, end) {
    let delta = end - start;
    return start + delta * t * t;
}

function easeOutQuad(t, start, end) {
    let delta = end - start;
    return start + delta * -t * (t - 2);
}

function easeInOutQuad(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * (2 * t * t);
    } else {
        return start + delta * (-2 * t * (t - 2) - 1);
    }
}

function easeInCubic(t, start, end) {
    let delta = end - start;
    return start + delta * t * t * t;
}

function easeOutCubic(t, start, end) {
    let delta = end - start;
    return start + delta * ((t = t - 1) * t * t + 1);
}

function easeInOutCubic(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * 4 * t * t * t;
    } else {
        return start + delta * ((t = t - 1) * (2 * t * t + 2) + 1);
    }
}

function easeInQuart(t, start, end) {
    let delta = end - start;
    return start + delta * t * t * t * t;
}

function easeOutQuart(t, start, end) {
    let delta = end - start;
    return start + delta * ((t = t - 1) * t * t * t + 1);
}

function easeInOutQuart(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * 8 * t * t * t * t;
    } else {
        return start + delta * ((t = t - 1) * (8 * t * t * t + 1) + 1);
    }
}

function easeInQuint(t, start, end) {
    let delta = end - start;
    return start + delta * t * t * t * t * t;
}

function easeOutQuint(t, start, end) {
    let delta = end - start;
    return start + delta * ((t = t - 1) * t * t * t * t + 1);
}

function easeInOutQuint(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * 16 * t * t * t * t * t;
    } else {
        return start + delta * ((t = t - 1) * (16 * t * t * t * t + 1) + 1);
    }
}

function easeInSine(t, start, end) {
    let delta = end - start;
    return start + delta * (1 - Math.cos(t * Math.PI / 2));
}

function easeOutSine(t, start, end) {
    let delta = end - start;
    return start + delta * Math.sin(t * Math.PI / 2);
}

function easeInOutSine(t, start, end) {
    let delta = end - start;
    return start + delta * (-0.5 * (Math.cos(Math.PI * t) - 1));
}

function easeInExpo(t, start, end) {
    let delta = end - start;
    return start + delta * Math.pow(2, 10 * (t - 1));
}

function easeOutExpo(t, start, end) {
    let delta = end - start;
    return start + delta * (-Math.pow(2, -10 * t) + 1);
}

function easeInOutExpo(t, start, end) {
    let delta = end - start;
    if (t < 1) {
        return start + delta * (0.5 * Math.pow(2, 10 * (t - 1)));
    } else {
        return start + delta * (0.5 * (-Math.pow(2, -10 * --t) + 2));
    }
}

function easeInCirc(t, start, end) {
    let delta = end - start;
    return start + delta * -(Math.sqrt(1 - t * t) - 1);
}

function easeOutCirc(t, start, end) {
    let delta = end - start;
    let tMinus1 = t - 1;
    return start + delta * Math.sqrt(1 - tMinus1 * tMinus1);
}

function easeInOutCirc(t, start, end) {
    let delta = end - start;
    let tTimes2 = t * 2;
    if (tTimes2 < 1) {
        return start + delta * (-0.5 * (Math.sqrt(1 - tTimes2 * tTimes2) - 1));
    } else {
        let tTimes2Minus2 = tTimes2 - 2;
        return start + delta * (0.5 * (Math.sqrt(1 - tTimes2Minus2 * tTimes2Minus2) + 1));
    }
}

function easeInElastic(t, start, end) {
    let delta = end - start;
    return start + delta * (-Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.3 / 4) * (2 * Math.PI) / 0.3));
}

function easeOutElastic(t, start, end) {
    let delta = end - start;
    return start + delta * (Math.pow(2, -10 * t) * Math.sin((t - 0.3 / 4) * (2 * Math.PI) / 0.3) + 1);
}

function easeInOutElastic(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * (-0.5 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - 0.225 / 4) * (2 * Math.PI) / 0.45));
    } else {
        return start + delta * (0.5 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - 0.225 / 4) * (2 * Math.PI) / 0.45) + 1);
    }
}

function easeInBounce(t, start, end) {
    let delta = end - start;
    return start + delta * (1 - easeOutBounce(1 - t, 0, 1));
}

function easeOutBounce(t, start, end) {
    let delta = end - start;
    if (t < (1 / 2.75)) {
        return start + delta * (7.5625 * t * t);
    } else if (t < (2 / 2.75)) {
        return start + delta * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
    } else if (t < (2.5 / 2.75)) {
        return start + delta * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
    } else {
        return start + delta * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
    }
}

function easeInOutBounce(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * (0.5 * easeInBounce(t * 2, 0, 1));
    } else {
        return start + delta * (0.5 * easeOutBounce(t * 2 - 1, 0, 1) + 0.5);
    }
}

function easeInBack(t, start, end) {
    let delta = end - start;
    return start + delta * (t * t * (2.70158 * t - 1.70158));
}

function easeOutBack(t, start, end) {
    let delta = end - start;
    return start + delta * ((--t) * t * (2.70158 * t + 1.70158) + 1);
}

function easeInOutBack(t, start, end) {
    let delta = end - start;
    if (t < 0.5) {
        return start + delta * (t * t * (7 * t - 2.5) * 2);
    } else {
        return start + delta * ((--t) * t * (7 * t + 2.5) + 2);
    }
}

function quadraticBezier(t, p0, p1, p2) {
    let oneMinusT = 1 - t;
    return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
}

function cubicBezier(t, p0, p1, p2, p3) {
    let oneMinusT = 1 - t;
    let oneMinusTSquared = oneMinusT * oneMinusT;
    let tSquared = t * t;
    return oneMinusTSquared * oneMinusT * p0 + 3 * oneMinusTSquared * t * p1 + 3 * oneMinusT * tSquared * p2 + tSquared * t * p3;
}

function hermiteInterpolation(t, p0, p1, m0, m1) {
    let tSquared = t * t;
    let tCubed = tSquared * t;

    let h00 = 2 * tCubed - 3 * tSquared + 1;
    let h10 = tCubed - 2 * tSquared + t;
    let h01 = -2 * tCubed + 3 * tSquared;
    let h11 = tCubed - tSquared;

    return h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1;
}