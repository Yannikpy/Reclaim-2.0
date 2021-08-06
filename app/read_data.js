function csv2obj(csv){
    var lines=csv.split("\n");
    
    var result = [];

    var headers=lines[0].split(";");
    console.log(headers);
    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        console.log(obj);
        result.push(obj);

    }
    return result;
}
fetch("../descriptions/coords.csv", {mode: 'same-origin'})
  .then(response => response.json())
  .then(data => console.log(data));



