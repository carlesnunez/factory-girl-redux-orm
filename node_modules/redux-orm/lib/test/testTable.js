'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _Table = require('../db/Table');

var _Table2 = _interopRequireDefault(_Table);

var _utils = require('../utils');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_sinonChai2.default);
var expect = _chai2.default.expect;


describe('Table', function () {
    describe('prototype methods', function () {
        var state = void 0;
        var batchToken = void 0;
        var txInfo = void 0;
        var table = void 0;

        beforeEach(function () {
            state = (0, _deepFreeze2.default)({
                items: [0, 1, 2],
                itemsById: {
                    0: {
                        id: 0,
                        data: 'cooldata'
                    },
                    1: {
                        id: 1,
                        data: 'verycooldata!'
                    },
                    2: {
                        id: 2,
                        data: 'awesomedata'
                    }
                },
                meta: {}
            });
            batchToken = (0, _utils.getBatchToken)();
            txInfo = { batchToken: batchToken, withMutations: false };
            table = new _Table2.default();
        });

        it('correctly accesses an id', function () {
            expect(table.accessId(state, 1)).to.equal(state.itemsById[1]);
        });

        it('correctly accesses id\'s', function () {
            expect(table.accessIdList(state)).to.equal(state.items);
        });

        it('correctly returns a default state', function () {
            expect(table.getEmptyState()).to.deep.equal({
                items: [],
                itemsById: {},
                meta: {}
            });
        });

        it('correctly inserts an entry', function () {
            var entry = { id: 3, data: 'newdata!' };

            var _table$insert = table.insert(txInfo, state, entry),
                newState = _table$insert.state,
                created = _table$insert.created;

            expect(created).to.equal(entry);

            expect(newState).to.not.equal(state);
            expect(newState.items).to.deep.equal([0, 1, 2, 3]);
            expect(newState.itemsById).to.deep.equal({
                0: {
                    id: 0,
                    data: 'cooldata'
                },
                1: {
                    id: 1,
                    data: 'verycooldata!'
                },
                2: {
                    id: 2,
                    data: 'awesomedata'
                },
                3: {
                    id: 3,
                    data: 'newdata!'
                }
            });
        });

        it('correctly updates entries with a merging object', function () {
            var toMergeObj = { data: 'modifiedData' };
            var rowsToUpdate = [state.itemsById[1], state.itemsById[2]];
            var newState = table.update(txInfo, state, rowsToUpdate, toMergeObj);

            expect(newState).to.not.equal(state);
            expect(newState.items).to.equal(state.items);
            expect(newState.itemsById).to.deep.equal({
                0: {
                    id: 0,
                    data: 'cooldata'
                },
                1: {
                    id: 1,
                    data: 'modifiedData'
                },
                2: {
                    id: 2,
                    data: 'modifiedData'
                }
            });
        });

        it('correctly deletes entries', function () {
            var rowsToDelete = [state.itemsById[1], state.itemsById[2]];
            var newState = table.delete(txInfo, state, rowsToDelete);

            expect(newState).to.not.equal(state);
            expect(newState.items).to.deep.equal([0]);
            expect(newState.itemsById).to.deep.equal({
                0: {
                    id: 0,
                    data: 'cooldata'
                }
            });
        });

        it('filter works correctly with object argument', function () {
            var clauses = [{ type: _constants.FILTER, payload: { data: 'verycooldata!' } }];
            var result = table.query(state, clauses);
            expect(result.length).to.equal(1);
            expect(result[0]).to.equal(state.itemsById[1]);
        });

        it('orderBy works correctly with prop argument', function () {
            var clauses = [{ type: _constants.ORDER_BY, payload: [['data'], ['inc']] }];
            var result = table.query(state, clauses);
            expect(result.map(function (row) {
                return row.data;
            })).to.deep.equal(['awesomedata', 'cooldata', 'verycooldata!']);
        });

        it('orderBy works correctly with function argument', function () {
            var clauses = [{ type: _constants.ORDER_BY, payload: [function (row) {
                    return row.data;
                }, undefined] }];
            var result = table.query(state, clauses);
            expect(result.map(function (row) {
                return row.data;
            })).to.deep.equal(['awesomedata', 'cooldata', 'verycooldata!']);
        });

        it('exclude works correctly with object argument', function () {
            var clauses = [{ type: _constants.EXCLUDE, payload: { data: 'verycooldata!' } }];
            var result = table.query(state, clauses);
            expect(result.length).to.equal(2);
            expect(result.map(function (row) {
                return row.id;
            })).to.deep.equal([0, 2]);
        });

        it('query works with multiple clauses', function () {
            var clauses = [{ type: _constants.FILTER, payload: function payload(row) {
                    return row.id > 0;
                } }, { type: _constants.ORDER_BY, payload: [['data'], ['inc']] }];
            var result = table.query(state, clauses);
            expect(result.map(function (row) {
                return row.data;
            })).to.deep.equal(['awesomedata', 'verycooldata!']);
        });
    });
});