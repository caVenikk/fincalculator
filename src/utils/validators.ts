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
