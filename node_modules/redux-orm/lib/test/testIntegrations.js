'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _chai = require('chai');

var _ = require('../');

var _utils = require('./utils');

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Integration', function () {
    var session = void 0;
    var orm = void 0;
    var state = void 0;

    describe('Immutable session', function () {
        beforeEach(function () {
            var _createTestSessionWit = (0, _utils.createTestSessionWithData)();
            // Deep freeze state. This will raise an error if we
            // mutate the state.

            session = _createTestSessionWit.session;
            orm = _createTestSessionWit.orm;
            state = _createTestSessionWit.state;


            (0, _deepFreeze2.default)(state);
        });

        it('Initial data bootstrapping results in a correct state', function () {
            (0, _chai.expect)(state).to.have.all.keys('Book', 'Cover', 'Genre', 'Author', 'BookGenres', 'Publisher');

            (0, _chai.expect)(state.Book.items).to.have.length(3);
            (0, _chai.expect)((0, _keys2.default)(state.Book.itemsById)).to.have.length(3);

            (0, _chai.expect)(state.Cover.items).to.have.length(3);
            (0, _chai.expect)((0, _keys2.default)(state.Cover.itemsById)).to.have.length(3);

            (0, _chai.expect)(state.Genre.items).to.have.length(4);
            (0, _chai.expect)((0, _keys2.default)(state.Genre.itemsById)).to.have.length(4);

            (0, _chai.expect)(state.BookGenres.items).to.have.length(5);
            (0, _chai.expect)((0, _keys2.default)(state.BookGenres.itemsById)).to.have.length(5);

            (0, _chai.expect)(state.Author.items).to.have.length(3);
            (0, _chai.expect)((0, _keys2.default)(state.Author.itemsById)).to.have.length(3);

            (0, _chai.expect)(state.Publisher.items).to.have.length(2);
            (0, _chai.expect)((0, _keys2.default)(state.Publisher.itemsById)).to.have.length(2);
        });

        it('Models correctly indicate if id exists', function () {
            var _session = session,
                Book = _session.Book;

            (0, _chai.expect)(Book.hasId(0)).to.be.true;
            (0, _chai.expect)(Book.hasId(92384)).to.be.false;
            (0, _chai.expect)(Book.hasId()).to.be.false;
        });

        it('Models correctly create new instances', function () {
            var _session2 = session,
                Book = _session2.Book;

            var book = Book.create({
                name: 'New Book',
                author: 0,
                releaseYear: 2015,
                publisher: 0
            });
            (0, _chai.expect)(session.Book.count()).to.equal(4);
            (0, _chai.expect)(session.Book.last().ref).to.equal(book.ref);
        });

        it('Model.getId works', function () {
            var _session3 = session,
                Book = _session3.Book;

            (0, _chai.expect)(Book.withId(0).getId()).to.equal(0);
            (0, _chai.expect)(Book.withId(1).getId()).to.equal(1);
        });

        it('Model.create throws if passing duplicate ids to many-to-many field', function () {
            var _session4 = session,
                Book = _session4.Book;


            var newProps = {
                name: 'New Book',
                author: 0,
                releaseYear: 2015,
                genres: [0, 0],
                publisher: 0
            };

            (0, _chai.expect)(function () {
                return Book.create(newProps);
            }).to.throw('Book.genres');
        });

        it('Models are correctly deleted', function () {
            var _session5 = session,
                Book = _session5.Book;

            (0, _chai.expect)(Book.count()).to.equal(3);
            Book.withId(0).delete();
            (0, _chai.expect)(session.Book.count()).to.equal(2);
            (0, _chai.expect)(session.Book.hasId(0)).to.be.false;
        });

        it('Models correctly update when setting properties', function () {
            var _session6 = session,
                Book = _session6.Book;

            var book = Book.first();
            var newName = 'New Name';
            book.name = newName;
            (0, _chai.expect)(session.Book.first().name).to.equal(newName);
        });

        it('Model.toString works', function () {
            var _session7 = session,
                Book = _session7.Book;

            var book = Book.first();
            (0, _chai.expect)(book.toString()).to.equal('Book: {id: 0, name: Tommi Kaikkonen - an Autobiography, ' + 'releaseYear: 2050, author: 0, cover: 0, genres: [0, 1], publisher: 1}');
        });

        it('withId throws if model instance not found', function () {
            var _session8 = session,
                Book = _session8.Book;

            (0, _chai.expect)(function () {
                return Book.withId(10);
            }).to.throw(Error);
        });

        it('many-to-many relationship descriptors work', function () {
            var _session9 = session,
                Book = _session9.Book,
                Genre = _session9.Genre;

            // Forward (from many-to-many field declaration)

            var book = Book.first();
            var relatedGenres = book.genres;
            (0, _chai.expect)(relatedGenres).to.be.an.instanceOf(_.QuerySet);
            (0, _chai.expect)(relatedGenres.modelClass).to.equal(Genre);
            (0, _chai.expect)(relatedGenres.count()).to.equal(2);

            // Backward
            var genre = Genre.first();
            var relatedBooks = genre.books;
            (0, _chai.expect)(relatedBooks).to.be.an.instanceOf(_.QuerySet);
            (0, _chai.expect)(relatedBooks.modelClass).to.equal(Book);
        });

        it('many-to-many relationship descriptors work with a custom through model', function () {
            var _session10 = session,
                Author = _session10.Author,
                Publisher = _session10.Publisher;

            // Forward (from many-to-many field declaration)

            var author = Author.get({ name: 'Tommi Kaikkonen' });
            var relatedPublishers = author.publishers;
            (0, _chai.expect)(relatedPublishers).to.be.an.instanceOf(_.QuerySet);
            (0, _chai.expect)(relatedPublishers.modelClass).to.equal(Publisher);
            (0, _chai.expect)(relatedPublishers.count()).to.equal(1);

            // Backward
            var publisher = Publisher.get({ name: 'Technical Publishing' });
            var relatedAuthors = publisher.authors;
            (0, _chai.expect)(relatedAuthors).to.be.an.instanceOf(_.QuerySet);
            (0, _chai.expect)(relatedAuthors.modelClass).to.equal(Author);
            (0, _chai.expect)(relatedAuthors.count()).to.equal(2);
        });

        it('adding related many-to-many entities works', function () {
            var _session11 = session,
                Book = _session11.Book,
                Genre = _session11.Genre;

            var book = Book.withId(0);
            (0, _chai.expect)(book.genres.count()).to.equal(2);
            book.genres.add(Genre.withId(2));

            (0, _chai.expect)(session.Book.withId(0).genres.count()).to.equal(3);
        });

        it('trying to add existing related many-to-many entities throws', function () {
            var _session12 = session,
                Book = _session12.Book;

            var book = Book.withId(0);

            var existingId = 1;
            (0, _chai.expect)(function () {
                return book.genres.add(existingId);
            }).to.throw(existingId.toString());
        });

        it('updating related many-to-many entities works', function () {
            var _session13 = session,
                Book = _session13.Book,
                Genre = _session13.Genre,
                Author = _session13.Author;

            var tommi = Author.get({ name: 'Tommi Kaikkonen' });
            var book = tommi.books.first();
            (0, _chai.expect)(book.genres.toRefArray().map(function (row) {
                return row.id;
            })).to.deep.equal([0, 1]);

            var deleteGenre = Genre.withId(0);
            var keepGenre = Genre.withId(1);
            var addGenre = Genre.withId(2);

            book.update({ genres: [addGenre, keepGenre] });
            (0, _chai.expect)(book.genres.toRefArray().map(function (row) {
                return row.id;
            })).to.deep.equal([1, 2]);

            (0, _chai.expect)(deleteGenre.books.filter({ id: book.id }).exists()).to.be.false;
        });

        it('removing related many-to-many entities works', function () {
            var _session14 = session,
                Book = _session14.Book,
                Genre = _session14.Genre;

            var book = Book.withId(0);
            (0, _chai.expect)(book.genres.count()).to.equal(2);
            book.genres.remove(Genre.withId(0));

            (0, _chai.expect)(session.Book.withId(0).genres.count()).to.equal(1);
        });

        it('trying to remove unexisting related many-to-many entities throws', function () {
            var _session15 = session,
                Book = _session15.Book;

            var book = Book.withId(0);

            var unexistingId = 2012384;
            (0, _chai.expect)(function () {
                return book.genres.remove(0, unexistingId);
            }).to.throw(unexistingId.toString());
        });

        it('clearing related many-to-many entities works', function () {
            var _session16 = session,
                Book = _session16.Book;

            var book = Book.withId(0);
            (0, _chai.expect)(book.genres.count()).to.equal(2);
            book.genres.clear();

            (0, _chai.expect)(session.Book.withId(0).genres.count()).to.equal(0);
        });

        it('foreign key relationship descriptors work', function () {
            var _session17 = session,
                Book = _session17.Book,
                Author = _session17.Author;

            // Forward

            var book = Book.first();
            var author = book.author;
            var rawFk = book.ref.author;
            (0, _chai.expect)(author).to.be.an.instanceOf(Author);
            (0, _chai.expect)(author.getId()).to.equal(rawFk);

            // Backward
            var relatedBooks = author.books;
            (0, _chai.expect)(relatedBooks).to.be.an.instanceOf(_.QuerySet);
            relatedBooks._evaluate();
            (0, _chai.expect)(relatedBooks.rows).to.include(book.ref);
            (0, _chai.expect)(relatedBooks.modelClass).to.equal(Book);
        });

        it('one-to-one relationship descriptors work', function () {
            var _session18 = session,
                Book = _session18.Book,
                Cover = _session18.Cover;

            // Forward

            var book = Book.first();
            var cover = book.cover;
            var rawFk = book.ref.cover;
            (0, _chai.expect)(cover).to.be.an.instanceOf(Cover);
            (0, _chai.expect)(cover.getId()).to.equal(rawFk);

            // Backward
            var relatedBook = cover.book;
            (0, _chai.expect)(relatedBook).to.be.an.instanceOf(Book);
            (0, _chai.expect)(relatedBook.getId()).to.equal(book.getId());
        });

        it('applying no updates returns the same state reference', function () {
            var book = session.Book.first();
            book.name = book.name;

            (0, _chai.expect)(session.state).to.equal(state);
        });

        it('Model works with default value', function () {
            var returnId = 1;

            var DefaultFieldModel = function (_Model) {
                (0, _inherits3.default)(DefaultFieldModel, _Model);

                function DefaultFieldModel() {
                    (0, _classCallCheck3.default)(this, DefaultFieldModel);
                    return (0, _possibleConstructorReturn3.default)(this, _Model.apply(this, arguments));
                }

                return DefaultFieldModel;
            }(_.Model);

            DefaultFieldModel.fields = {
                id: (0, _.attr)({ getDefault: function getDefault() {
                        return returnId;
                    } })
            };
            DefaultFieldModel.modelName = 'DefaultFieldModel';

            var _orm = new _.ORM();
            _orm.register(DefaultFieldModel);

            var sess = _orm.session(_orm.getEmptyState());
            sess.DefaultFieldModel.create({});

            (0, _chai.expect)(sess.DefaultFieldModel.hasId(1)).to.be.true;

            returnId = 999;
            sess.DefaultFieldModel.create({});
            (0, _chai.expect)(sess.DefaultFieldModel.hasId(999)).to.be.true;
        });
    });

    describe('Mutating session', function () {
        beforeEach(function () {
            var _createTestSessionWit2 = (0, _utils.createTestSessionWithData)();

            session = _createTestSessionWit2.session;
            orm = _createTestSessionWit2.orm;
            state = _createTestSessionWit2.state;
        });

        it('works', function () {
            var mutating = orm.mutableSession(state);
            var Book = mutating.Book,
                Cover = mutating.Cover;


            var cover = Cover.create({ src: 'somecover.png' });
            var coverId = cover.getId();

            var book = Book.first();
            var bookRef = book.ref;
            var bookId = book.getId();
            (0, _chai.expect)(state.Book.itemsById[bookId]).to.equal(bookRef);
            var newName = 'New Name';

            book.name = newName;

            (0, _chai.expect)(book.name).to.equal(newName);

            var nextState = mutating.state;
            (0, _chai.expect)(nextState).to.equal(state);
            (0, _chai.expect)(state.Book.itemsById[bookId]).to.equal(bookRef);
            (0, _chai.expect)(bookRef.name).to.equal(newName);
            (0, _chai.expect)(state.Cover.itemsById[coverId].src).to.equal('somecover.png');
        });
    });

    describe('Multiple concurrent sessions', function () {
        beforeEach(function () {
            var _createTestSessionWit3 = (0, _utils.createTestSessionWithData)();

            session = _createTestSessionWit3.session;
            orm = _createTestSessionWit3.orm;
            state = _createTestSessionWit3.state;
        });

        it('works', function () {
            var firstSession = session;
            var secondSession = orm.session(state);

            (0, _chai.expect)(firstSession.Book.count()).to.equal(3);
            (0, _chai.expect)(secondSession.Book.count()).to.equal(3);

            var newBookProps = {
                name: 'New Book',
                author: 0,
                releaseYear: 2015,
                genres: [0, 1]
            };

            firstSession.Book.create(newBookProps);

            (0, _chai.expect)(firstSession.Book.count()).to.equal(4);
            (0, _chai.expect)(secondSession.Book.count()).to.equal(3);
        });
    });
});

describe('Big Data Test', function () {
    var Item = void 0;
    var orm = void 0;

    beforeEach(function () {
        Item = function (_Model2) {
            (0, _inherits3.default)(Item, _Model2);

            function Item() {
                (0, _classCallCheck3.default)(this, Item);
                return (0, _possibleConstructorReturn3.default)(this, _Model2.apply(this, arguments));
            }

            return Item;
        }(_.Model);
        Item.modelName = 'Item';
        Item.fields = {
            id: (0, _.attr)(),
            name: (0, _.attr)()
        };
        orm = new _.ORM();
        orm.register(Item);
    });

    it('adds a big amount of items in acceptable time', function bigDataTest() {
        this.timeout(30000);

        var session = orm.session(orm.getEmptyState());
        var start = new Date().getTime();

        var amount = 10000;
        for (var i = 0; i < amount; i++) {
            session.Item.create({ id: i, name: 'TestItem' });
        }
        var end = new Date().getTime();
        var tookSeconds = (end - start) / 1000;
        console.log('Creating ' + amount + ' objects took ' + tookSeconds + 's');
        (0, _chai.expect)(tookSeconds).to.be.at.most(3);
    });
});