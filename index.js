const mergeImages = require('merge-images');
const Canvas = require('canvas');
const imageDataURI = require('image-data-uri');
const sharp = require('sharp');
const fs = require('fs');

//Resize the company logo
sharp('./assets/config/logo.jpeg').resize({ height: 180 }).toFile('./assets/config/logo_logo.jpeg')
    .then(function(newFileInfo) {
        console.log("Success resizing logo...");
    })
    .catch(function(err) {
        console.log("Error resizing logo...");
    });

//Resize the brands logos
fs.readdir('./assets/brands', (err, files) => {
    files.forEach(file => {
        sharp(`./assets/brands/${file}`).resize({ height: 180 }).toFile(`./assets/brands/${file.split(".")[0]}`)
        .then(function(newFileInfo) {
            console.log("Success brand ", file)
        })
        .catch(function(err) {
            console.log("Error occured ", file);
        })
    });
})


fs.readdir('./assets', (err, files) => {
  files.forEach(file => {
    const brand = file.split('_')[0];
    console.log('processing', brand, file); // use those file and return it as a REST API
    
    // Resizing product
    sharp(`./assets/${file}`).resize({ height: 550, width: 550 }).toFile(`./assets/resized/${file}`)
    .then(function(newFileInfo) {
        // newFileInfo holds the output file properties
        console.log("Success resizing product ...")
        mergeImages([
            { src: './assets/config/background.png', x: 0, y: 0 },
            { src: `./assets/brands/${brand}`, x: 200, y: 10 },
            { src: './assets/config/logo_logo.jpeg', x: 333, y: 790 },
            { src: `./assets/resized/${file}`, x: 250, y: 210 },
            ], {
            Canvas: Canvas
        })
        .then(dataURI => imageDataURI.outputFile(dataURI, `./banners/banner_${file}`)
        .then(res => console.log(res))
        );
    })
    .catch(function(err) {
        console.log("Error occured... ", file);
    });
  });
})






