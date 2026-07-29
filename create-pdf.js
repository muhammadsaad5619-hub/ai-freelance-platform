const PDFDocument = require("pdfkit");
const fs = require("fs");

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream("test-resume.pdf"));

doc.fontSize(25).text("John Doe - Freelance Developer", 100, 100);
doc.fontSize(12).text("Skills: React, Next.js, Node.js, AI", 100, 150);
doc.text("Experience: 5 years of full-stack development. Built AI proposal generators.", 100, 180);

doc.end();
console.log("PDF created: test-resume.pdf");
