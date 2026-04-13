// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   const url  = req.url;
//   if(url==="/"){
//     res.end('Welcome to the Home Page!');
//   }else if (url==="/users" && req.method === 'GET') {
//     res.write('Welcome to the Users Page!').statusCode = 200;
//   }else if(url==="/users" && req.method === 'POST'){
//     res.write('User created successfully!').statusCode = 201;
//   }else{
//     res.write('Page Not Found!').statusCode = 404;
//   }
//   res.end();
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });


// --> read file 

// const fs = require('fs');

// ASSYNCHRONOUSLY

// fs.readFile('example.txt', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading file:', err);
//         return;
//     }   
//     console.log('File contents:', data);
// });


// synchronously

// try {
//   const data = fs.readFileSync('example.txt', 'utf8');
//   console.log(data);
// } catch (err) {
//   console.error(err);
// }


// --> write file
const fs = require('fs');
// ASYNCHRONOUSLY
// fs.writeFile('example.txt', 'I write the file  asynchronously!', (err) => {
//   if (err) throw err;
//   console.log('File written!');
// });


//Synchronously
try{
   fs.writeFileSync("example.txt", "I write the file Synchronously !");

}catch(err){
    console.error(err); 
}
