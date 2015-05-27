let proxy = (object = {}) => {
    return new Proxy(object, {
        get: function(target, property) {
            if (property in target) {
                return target[property];
            } else {
                return '';
            }
        }
    });
};

module.exports = proxy;