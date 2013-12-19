cloud2ftpapp.filter('FirstFolderThenAlphabetic', function () {
    return function (array, order) {
        var comparator;

        if (order === 'descending') {
            comparator = function (elm1, elm2) {
                return elm1.name < elm2.name;
            }
        } else {
            comparator = function (elm1, elm2) {
                return elm1.name > elm2.name;
            }
        }

        return array.filter(function (elm) {
            return elm.type === 'd';
        }).concat(
            array.filter(function (elm) {
                return elm.type !== 'd';
            }).sort(comparator)
        );

    };
});

cloud2ftpapp.filter('fileorfolderfilter', function () {
    return function (type,name) {
        return type === 'd' ? 'Folder' : getFileType(name);
    };
});
cloud2ftpapp.filter('sizefilter', function () {
    return function (size,type) {        
        return type === 'd' ? '' : getFormatedSize(size);
    };
});
cloud2ftpapp.filter('formatdatefilter', function () {
    return function (date) {        
        return date.replace('T',' ').replace('.000Z','');
    };
});
