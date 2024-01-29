function generateArt() {
    const shadeString = document.getElementById('shadeString').value;
    const input = document.getElementById('imageInput');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                generateArtFromImage(img, shadeString);
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert("Veuillez sélectionner une image.");
    }
}

function generateArtFromImage(img, shadeString) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = document.getElementById('resolution').value;
    const height =  width * img.height / img.width;
    
    const isInvertButtonChecked = document.getElementById('invertButton').checked;

    document.getElementById('artResult').innerHTML = '';    

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
            const color = ctx.getImageData(x, y, 1, 1).data;
            const char = getCharFromMean(color, isInvertButtonChecked, shadeString);
            if(char==' '){
                row += '\u00A0';
            }else{
                row += char;
            }
            
        }
        createDiv(row);
    }
}

function createDiv(rowContent) {
    const resultDiv = document.getElementById('artResult');
    const rowDiv = document.createElement('pre');
    rowDiv.innerHTML = rowContent;
    rowDiv.classList.add('artResultPre');
    resultDiv.appendChild(rowDiv);
}   

function displayArt(artResult) {
    const resultDiv = document.getElementById('artResult');
    resultDiv.innerHTML = '';

    if (Array.isArray(artResult)) {
        artResult.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.textContent = row.join(' ');
            resultDiv.appendChild(rowDiv);
        });
    } else {
        console.error('Error: not an array');
    }
}

function zoomOut() {
    const resultDivs = document.getElementsByClassName('artResultPre');
    for (let i = 0; i < resultDivs.length; i++) {
        const currentFontSize = parseFloat(resultDivs[i].style.fontSize) || 12;
        const currentLineHeight = parseFloat(resultDivs[i].style.lineHeight) || 12;
        let newFontSize = Math.max(currentFontSize - 1, 2);
        let newLineHeight = newFontSize*0.64;
        resultDivs[i].style.fontSize = newFontSize + 'pt';
        resultDivs[i].style.lineHeight = newLineHeight + 'pt';
    }
}

function zoomIn(){
    const resultDivs = document.getElementsByClassName('artResultPre');
    for (let i = 0; i < resultDivs.length; i++) {
        const currentFontSize = parseFloat(resultDivs[i].style.fontSize) || 12;
        const currentLineHeight = parseFloat(resultDivs[i].style.lineHeight) || 12;
        let newFontSize = Math.max(currentFontSize + 1, 2);     
        let newLineHeight = (newFontSize*0.64);
        resultDivs[i].style.fontSize = newFontSize + 'pt';
        resultDivs[i].style.lineHeight = newLineHeight + 'pt';
    }
}
function getCharFromMean(color, invert, shadeString) {
    let mean = (color[0] + color[1] + color[2]) / 3;
    if(invert){
        mean = 255 - mean;
    }
    const shadeIndex = Math.floor(mean / 255 * shadeString.length);
    const validIndex = Math.max(0, Math.min(shadeIndex, shadeString.length - 1));
    return shadeString[validIndex];
}