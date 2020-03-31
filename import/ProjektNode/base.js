const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: '../../data/processed/Potter1_en_raw.csv',
    header: [
        {id: 'content', title: 'content'},
    ],
    encoding: 'utf8'
});

var pdfreader = require("pdfreader");
var rows = {}; // indexed by y-position
var csvContent = [];
 
function printRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach(y => console.log((rows[y] || []).join(""))); 
}
 
new pdfreader.PdfReader().parseFileItems("../../data/raw/Potter1_en.pdf", function(
  err,
  item
) {
  if(err){
    console.log(err)
  }
  if (!item){   
    csvWriter.writeRecords(csvContent)
       .then(() => {
    console.log('...Done');
});
  } else if (!item || item.page) {
    // end of file, or page
    printRows();
    console.log("PAGE:", item.page);
    rows = {}; // clear rows for next page
  } else if (item.text) {
    // accumulate text items into rows object, per line
    (rows[item.y] = rows[item.y] || []).push(item.text);
    let obj = {content: item.text}
    csvContent.push(obj)
  }
});

