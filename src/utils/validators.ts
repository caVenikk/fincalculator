export const getRequiredRule = (errorMessage: string) => {
    return [(v: string) => v !== "" || errorMessage];
};

export const getMinLengthRule = (length: number, errorMessage: string) => {
    return [(v: string) => v.length >= length || errorMessage];
};

export const getMaxLengthRule = (length: number, errorMessage: string) => {
    return [(v: string) => v.length <= length || errorMessage];
};

export const getMinRule = (min: number, errorMessage: string) => {
    return [(v: string) => parseFloat(v) > min || errorMessage];
};

export const getMinOrEqualRule = (min: number, errorMessage: string) => {
    return [(v: string) => parseFloat(v) >= min || errorMessage];
};

export const getMaxRule = (max: number, errorMessage: string) => {
    return [(v: string) => parseFloat(v) < max || errorMessage];
};

export const getMaxOrEqualRule = (max: number, errorMessage: string) => {
    return [(v: string) => parseFloat(v) <= max || errorMessage];
};

export const getInRangeRule = (min: number, max: number, errorMessage: string) => {
    return [(v: string) => (parseFloat(v) >= min && parseFloat(v) <= max) || errorMessage];
};

export const getIsNumberRule = (errorMessage: string) => {
    return [(v: string) => !isNaN(parseFloat(v)) || errorMessage];
};

export const checkRules = (rules: ((v: string) => string | boolean)[] | undefined, value: string) => {
    if (!rules) return true;
    for (const rule of rules) {
        const result = rule(value);
        if (result !== true) {
            return result;
        }
    }
    return true;
};
