var express = require("express");var app = express();//app.use(express.logger());app.use(express.bodyParser());var path = require('path');app.post('/ws', function(request, response) {  	console.log(JSON.stringify(request.body));  	console.log('Start PDF');  	var PDFDocument, doc;	PDFDocument = require('pdfkit');	doc = new PDFDocument;	doc.addPage({	size: 'legal',	layout: 'landscape'	});	doc.info['Title'] = 'Test Document';	doc.info['Author'] = 'fco';	doc = new PDFDocument({	info: {	  Title: 'Test Document',	  Author: 'fco'	}	});		doc.moveTo(100, 20).lineTo(200, 160).quadraticCurveTo(230, 200, 250, 120).bezierCurveTo(290, -40, 300, 200, 400, 150).lineTo(500, 90).stroke();    doc.write('public\\pdf\\out.pdf');  //doc.output(function(string) {    response.send("public\\pdf\\out.pdf");	//console.log(string);  //});    	//response.send(request.body);});app.use(express.static(path.join(__dirname, 'public')));var port = process.env.PORT || 5000;app.listen(port, function() {	console.log("Listening on " + port);});