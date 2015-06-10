let config = {
    pathImg: (folder) => {
        let ret = `${CRLab.site}/dist/img/`;
        if (folder) {
            ret += `${folder}/`;
        }
        return ret;
    },
    getData: (path, callback, that) => {
        CRLab.MetaFire.on(`${CRLab.site}/${path}`, (data) => {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    }
};

module.exports = config;