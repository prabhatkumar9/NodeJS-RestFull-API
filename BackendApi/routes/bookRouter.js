// import express
const express = require('express');
// import controller
const bookController = require('../controller/bookController.js');

function routes(Book) {
    // import router from express
    const bookRouter = express.Router();

    // make controller to call function
    const controller = bookController(Book);
    bookRouter
        .route("/books") // same url for post and get
        .post(controller.post)
        .get(controller.get)

    // let use middleware
    // this will add some data with req and then pass to the 
    // function handling request

    bookRouter.use('/book/:id', (req, res, next) => {
        Book.findById(req.params.id, (err, book) => {
            if (err) {
                return res.send(err);
            } else if (book) {
                req.book = book;
                return next();
            } else {
                return res.sendStatus(404);
            }
        });
    })

    // get single book by id
    bookRouter.route("/book/:id")
        .get((req, res) => {

            const returnBook = req.book.toJSON();
            const genre = req.book.genre.replace(' ', '%20');
            returnBook.links.filterByGenre = `http://${req.headers.host}/api/book/?genre=${genre}`

            // now req have book already fetched by using middleware
            return res.json(returnBook);

        })
        .put((req, res) => {
            const {
                book
            } = req;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;
            req.book.save((err) => {
                if (err) {
                    return res.send(err);
                } else {
                    return res.json(book);
                }
            })
        })

        .patch((req, res) => {
            const {
                book
            } = req;

            if (req.body._id) {
                delete req.body._id;
            }
            Object.entries(req.body).forEach((item) => {
                //console.log(item);// give req as array
                const key = item[0];
                const value = item[1];
                book[key] = value;
            })
            req.book.save((err) => {
                if (err) {
                    return res.send(err);
                } else {
                    return res.json(book);
                }
            })
        })
        .delete((req, res) => {
            req.book.remove((err) => {
                if (err) {
                    return res.send(err)
                }
                return res.sendStatus(204);
            })
        })
    return bookRouter;
}


module.exports = routes;