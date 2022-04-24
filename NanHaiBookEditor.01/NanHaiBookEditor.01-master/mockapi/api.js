const express = require('express');

const fs = require('fs');
const router = require('express').Router();

/*
router.get('/users/:name/', file('mock-api/User.json'));
router.post('/users/', created);

router.get('/posts/', file('mock-api/Posts.json'));
router.get('/posts/:id/', file('mock-api/Post.json'));
router.post('/post/', created);
*/
const handleGet = filename => {
	try {
		return (req, res) => {
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(200, 'OK');
			fs.createReadStream(`${__dirname}/${filename}`).pipe(res);
		};
	} catch (e) {
		console.log(e);
	}
};

const handlePost = (filename = 'sucess.json') => {
	return (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.writeHead(200, 'OK');
		fs.createReadStream(`${__dirname}/${filename}`).pipe(res);
	};
};

router.post('/login/', handlePost('token.json'));
//get all books
router.get('/books/', handleGet('books.json'));
//get and update book
router.get('/book/:id/', handleGet('book.json'));
router.post('/book/:id/', handlePost());
//get and update page
router.get('/page/:id/', handleGet('page.json'));
router.post('/book/:bookId/page/', handlePost());
//get element templates
router.get('/templates/elements/:pid/', handleGet('templates.json'));
//get images
router.get('/images/list/:pid/', handleGet('image-list.json'));
//save page and group template
router.post('/templates/page/', handlePost());
router.post('/templates/group/', handlePost());
//get group template
router.get('/templates/group/:pid/', handleGet('group-templates.json'));
//get page templates
router.get('/templates/page/:pid/', handleGet('page-templates.json'));
//get audio list
router.get('/audio/list/:pid/', handleGet('audio-list.json'));
const server = (port = 3100) => {
	express()
		.use('/api/v1/', router)
		.listen(port, () => {
			console.log(`Mock api stated at http://localhost:${port}/`);
			console.log(`__dirname: ${__dirname}`);
		});
};
server(process.argv[2]);
