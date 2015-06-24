
let config = {
    pathImg: (folder) => {
        let ret = `//c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/${window.FrontEnd.site}/`;
        if (folder) {
            ret += `${folder}/`;
        }
        return ret;
    },
    getData: (path, callback, that) => {
        window.FrontEnd.MetaFire.on(`${window.FrontEnd.site}/${path}`, (data) => {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: (path, callback) => {
        window.FrontEnd.MetaFire.on(`${window.FrontEnd.site}/${path}`, (data) => {
            if (callback) {
                callback(data);
            }
        });
    }
};

module.exports = config;