function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function getFileType(filename) {
    var ext = getExtension(filename).toLowerCase();
    switch (ext) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':        
        return ext.toUpperCase() + " Image";
    }
    return "File";
}

function getFormatedSize(size) {
    return size;
}


