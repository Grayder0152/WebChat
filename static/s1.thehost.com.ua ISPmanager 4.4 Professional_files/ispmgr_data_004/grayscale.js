var grayscale = (function(){var RGBtoGRAYSCALE = function(r,g,b) {return parseInt( (0.2125 * r) + (0.7154 * g) + (0.0721 * b), 10 );};var init = function(img) {if ( img.nodeName.toLowerCase() != "img" ) { return; }if ( img.style.display == "none" ) { return; }if (!document.createElement("canvas").getContext) {img.style.filter = "Gray alpha(opacity=50)";return;} else {var canvas = document.createElement("canvas"),context = canvas.getContext("2d"),height = img.naturalHeight || img.offsetHeight || img.height,width = img.naturalWidth || img.offsetWidth || img.width,imgData;canvas.id = "can"+Math.floor(Math.random()*10000);canvas.height = height;canvas.width = width;context.drawImage(img, 0, 0);try {imgData = context.getImageData(0, 0, width, height);} catch(e) {}for (var y = 0; y < height; y++) {for (var x = 0; x < width; x++) {var i = (y * width + x) * 4;imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] =RGBtoGRAYSCALE(imgData.data[i], imgData.data[i+1], imgData.data[i+2]);}}context.putImageData(imgData, 0, 0, 0, 0, width, height);img.parentNode.insertBefore(canvas,img);img.style.display = "none";}};init.reset = function(img) {if ( img.nodeName.toLowerCase() != "img" ) { return; }if (!document.createElement("canvas").getContext) {img.style.filter = "";return;} else {img.style.display = "block";if ( img.previousSibling ) img.parentNode.removeChild(img.previousSibling);}};return init;})();