class MetaFire {

    constructor () {
        this.fb = new Firebase("https://popping-fire-897.firebaseio.com");
    }

    getChild(path) {
        return this.fb.child(path);
    }

    getData (path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        var promise = new Promise( (resolve, reject) => {
            child.on('value',
                (snapshot) => {
                    resolve(snapshot.val());
                },
                (error) => {
                    reject(error);
                });
        });
        
        return promise;
    }
    setData (data, path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        return child.set(data);
    }
}
module.exports = MetaFire;


