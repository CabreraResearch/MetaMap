
let config = {
    pathImg: (folder) => {
        let ret = `${window.CRLab.site}/dist/img/`;
        if (folder) {
            ret += `${folder}/`;
        }
        return ret;
    },
    getData: (path, callback, that) => {
        window.CRLab.MetaFire.on(`${window.CRLab.site}/${path}`, (data) => {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: (path, callback) => {
        window.CRLab.MetaFire.on(`${window.CRLab.site}/${path}`, (data) => {
            if (callback) {
                callback(data);
            }
        });
    }
};

module.exports = config;