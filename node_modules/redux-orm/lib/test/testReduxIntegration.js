'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _ = require('../');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_sinonChai2.default);
var expect = _chai2.default.expect;


describe('Redux integration', function () {
    var orm = void 0;
    var Book = void 0;
    var Cover = void 0;
    var Genre = void 0;
    var Author = void 0;
    var Publisher = void 0;
    var defaultState = void 0;
    beforeEach(function () {
        var _createTestModels = (0, _utils.createTestModels)();

        Book = _createTestModels.Book;
        Cover = _createTestModels.Cover;
        Genre = _createTestModels.Genre;
        Author = _createTestModels.Author;
        Publisher = _createTestModels.Publisher;

        orm = new _.ORM();
        orm.register(Book, Cover, Genre, Author, Publisher);
        defaultState = orm.getEmptyState();
    });

    it('runs reducers if explicitly specified', function () {
        Author.reducer = _sinon2.default.spy();
        Book.reducer = _sinon2.default.spy();
        Cover.reducer = _sinon2.default.spy();
        Genre.reducer = _sinon2.default.spy();
        Publisher.reducer = _sinon2.default.spy();

        var reducer = (0, _.createReducer)(orm);
        var mockAction = {};
        var nextState = reducer(defaultState, mockAction);

        expect(nextState).to.not.be.a('undefined');

        expect(Author.reducer).to.be.calledOnce;
        expect(Book.reducer).to.be.calledOnce;
        expect(Cover.reducer).to.be.calledOnce;
        expect(Genre.reducer).to.be.calledOnce;
        expect(Publisher.reducer).to.be.calledOnce;
    });

    it('correctly creates a selector', function () {
        var selectorTimesRun = 0;
        var selector = (0, _.createSelector)(orm, function () {
            return selectorTimesRun++;
        });
        expect(selector).to.be.a('function');

        var state = orm.getEmptyState();

        selector(state);
        expect(selectorTimesRun).to.equal(1);
        selector(state);
        expect(selectorTimesRun).to.equal(1);
        selector(orm.getEmptyState());
        expect(selectorTimesRun).to.equal(1);
    });

    it('correctly creates a selector with input selectors', function () {
        var _selectorFunc = _sinon2.default.spy();

        var selector = (0, _.createSelector)(orm, function (state) {
            return state.orm;
        }, function (state) {
            return state.selectedUser;
        }, _selectorFunc);

        var _state = orm.getEmptyState();

        var appState = {
            orm: _state,
            selectedUser: 5
        };

        expect(selector).to.be.a('function');

        selector(appState);
        expect(_selectorFunc.callCount).to.equal(1);

        expect(_selectorFunc.lastCall.args[0]).to.be.an.instanceOf(_.Session);
        expect(_selectorFunc.lastCall.args[0].state).to.equal(_state);

        expect(_selectorFunc.lastCall.args[1]).to.equal(5);

        selector(appState);
        expect(_selectorFunc.callCount).to.equal(1);

        var otherUserState = (0, _assign2.default)({}, appState, { selectedUser: 0 });

        selector(otherUserState);
        expect(_selectorFunc.callCount).to.equal(2);
    });

    it('calling reducer with undefined state doesn\'t throw', function () {
        var reducer = (0, _.createReducer)(orm);
        reducer(undefined, { type: '______init' });
    });
});