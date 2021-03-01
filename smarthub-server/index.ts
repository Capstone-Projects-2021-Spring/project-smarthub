import express from 'express';

const server = express();

const PORT = 3000;

server.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// serverApp.post('/video', (req, res) => {
//
// });

server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
