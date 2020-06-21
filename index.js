const fs = require("fs");
const http = require("http");
const url = require('url');

console.clear();

const laptopData = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'));
const server = http.createServer((req, res) => {
    const urlWithStringQuery = url.parse(req.url, true);
    const pathName = urlWithStringQuery.pathname;
    console.log(pathName);
    const id = urlWithStringQuery.query.id;

    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {"Content-type": "text/html"});
        fs.readFile(`${__dirname}/template/template-card.html`, 'utf-8', (err, templateCard) => {
            const cards = laptopData.reduce((prev, cur) => {
                console.log(cur);
                return prev + repalceTemplate(templateCard, cur);
            }, "");
            fs.readFile(`${__dirname}/template/template-overview.html`, 'utf-8', (err1, templateOverview) => {
                res.end(templateOverview.replace("{%CARDS%}", cards));
            })

        })

    } else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {"Content-type": "text/html"});
        fs.readFile(`${__dirname}/template/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            res.end(repalceTemplate(data, laptop))
        })
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {"Content-type": "image/jpg"});
            res.end(data);
        })
    } else {
        res.writeHead(200, {"Content-type": "text/html"});
        res.end('page not found');
    }

});

server.listen(1337, "localhost", () => {
    console.log("server started listening on port 1337");
});

function repalceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCT_NAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}