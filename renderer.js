// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { clipboard } = require('electron');
const moment = require('moment');
const hljs = require('./node_modules/highlight.js');
const stripIndent = require('strip-indent');
const { linkify, compressImage, truncateString, loadProgrammingLanguages} = require('./methods.js');
const D = document;
const $ = D.querySelector.bind(D);
const $$ = (selector, elem = D) => elem.querySelectorAll(selector);


document.addEventListener("DOMContentLoaded", () => {
    loadProgrammingLanguages()
    hljs.initHighlightingOnLoad();
    checkClipboardHistory();
    setInterval(checkClipboardHistory, 2000);
});

console.log(hljs.listLanguages());

hljs.configure({
    language: ['javascript', 'java', 'css']
  });

var history = [{ text: "", image: "", clippedTime: "" }];

// Apply methods to data before pushing to history
const readData = {
    text: () => {
        text = clipboard.readText().trim();
        return text;
    },
    image: () => {
        image = clipboard.readImage('png');
        compressImage(image, 300);
        return image;
    },
};                             

// Check Clipboard for any updates then push to history
function checkClipboardHistory() {
    var text = readData.text();
    var image = readData.image().toDataURL();
    var isNewText = history[history.length - 1].text !== text;
    var isNewImage = history[history.length - 1].image !== image;

    if (isNewText || isNewImage) {
        history.push({
            text,
            image,
            clippedTime: moment().calendar(),
        });
        createClipboard();
        if (history.length > 50) {
            history.splice(0, history.length - 1);
        }
        console.log(history);
        console.log(text);
        console.log(image.slice(0, 100));
    }
}

function createClipboard(item) {
    //creates new html element template before parsing data
    var parser = new DOMParser(item);
    var domString = 
    '<a class="panel-block">\
        <span class="btn__delete">X</span>\
           <pre id="formatted-text"><code id="output__code"> Clipboard </code>\</pre>\
           <small id="timeStamp"></small>\
    </a>';
    var html = parser.parseFromString(domString, 'text/html');
    item = $('#items').insertBefore(html.body.firstChild, items.childNodes[0]);
    $('#timeStamp').innerHTML = moment().calendar();
    $('.err__addItems').style.display = "none";
    
    // Read data then push to html element
    const text = readData.text();
    const image = readData.image();
    mountClipboardItem = parseData();

    // Add clipboard methods to each item
    item.onclick = () => {
        row = $$('.panel-block');
        if (row[0].innerHTML !== item.innerHTML) {
            item.parentNode.removeChild(item);   
            clipboard.writeText(text, 'selction');
        }
        if (image) {
            clipboard.writeImage(image, ['png']);    
        } 
        window.scrollTo(0, 0);
    };
    $('.btn__delete').onclick = (e) => {
        item.parentNode.removeChild(item);
        item = $$('.panel-block');
        (item.length == 0) ? $('.err__addItems').style.display = "block": true;
        e.stopPropagation();
    };
    // Archive Clipboard items
    // $('.btn__save').onclick = (e) => {  
    //     clipboard.writeText(text, 'selction');
    //     clipboard.writeImage(image, ['png']);    
    //     $('#itemsSaved').insertBefore(item, $('#itemsSaved').childNodes[0]);
    //     e.stopPropagation();
    // };
    return item;
}

function parseData(str, nativeImage) {
    //Declare data variables 
    str = readData.text();
    nativeImage = readData.image();
    var readableImage = nativeImage.toDataURL().length;
    var errImage = 'data:image/png;base64,'.length;

    //check recent clipboard is a link
    if (str > linkify(str)) {
        link = $('#formatted-text').innerHTML = linkify(str);

    //Check if proper text is copied excluding whitespace
    } else if (str.trim().length > 0) {
        str = stripIndent(str);
        $('code').innerText = truncateString(str, 700);
        hljs.highlightBlock($('code'));

    //Check if its a readable image
    } else if (readableImage > errImage) {
        imageData = `<img id="output__image"src="${nativeImage.toDataURL()}" alt=".image"></img>`
        $('code').innerHTML = imageData;

    // Check if its Not readable image format
    } else if (errImage == readableImage) {
        $('.panel-block').style.display = "none";

    // Check if its Not a link,text,image then hide
    } else {
        alert('there was a problem Copying');
        console.error('problem copying at' + `${getDate()}`);
        $('.panel-block').style.display = "none";
    }
}

(function ClipboardMethods () {
    // Display Welcome Instructions
    ($$('panel-block').length == 0) ? $('.err__addItems').style.display = "block": true;

    $("#btn__pinned").onclick = () => {
        var e = $('#pinnedClipboards');
        if(e.style.display == 'block'){
            e.style.display = 'none';
            $('#items').style.display = 'block';
        } else {
            $('#items').style.display = 'none';
            e.style.display = 'block';
        }
      };
    // Search Method
    $('#search').onkeyup = () => {
        // Get value of input
        let filterValue = $('#search').value.toUpperCase();
        let li = $('#items').querySelectorAll('a.panel-block');
        // Loop through Clipboard item list
        for (let i = 0; i < li.length; i++){
          let clipboard = li[i].getElementsByTagName('pre')[0];
          var matched = clipboard.innerHTML.toUpperCase().indexOf(filterValue) > -1;
          (matched) ? li[i].style.display = '' : li[i].style.display = 'none';
        }
    };
    rows = D.getElementsByClassName('panel-block');
    $('#btn__clear').onclick = () => {
        while (rows.length > 1) {
            rows[1].parentNode.removeChild(rows[1]);
            history.splice(0, history.length - 1);
        }
    };
    window.onscroll = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            $("#scroll-top").style.display = "block";
        } else {
            $("#scroll-top").style.display = "none";
        }
    };
    $("#scroll-top").onclick = () => {
        window.scrollTo(0, 0);
    };
}());

// <span class="btn__save">save</span>\