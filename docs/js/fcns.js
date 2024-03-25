function createDataTable(id,y) {
    if(document.querySelector(id)){
    var cols = y.shift().map(v => { return {title:v}})
    new DataTable(id, {
        columns: cols,
        data: y,
        searching:false,
        ordering:false,
        lengthChange: false,
        info:false,
        paging:false,
        
    });
    }
}



function tsvToArray(x) {
    return x.split('\r\n').map(v=>v.split('\t'))
}



