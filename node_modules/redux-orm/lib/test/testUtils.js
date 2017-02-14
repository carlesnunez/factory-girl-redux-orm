'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_sinonChai2.default);
var expect = _chai2.default.expect;


describe('Utils', function () {
    describe('arrayDiffActions', function () {
        it('normal case', function () {
            var target = [2, 3];
            var source = [1, 2, 4];

            var actions = (0, _utils.arrayDiffActions)(source, target);
            expect(actions.add).to.deep.equal([3]);
            expect(actions.delete).to.deep.equal([1, 4]);
        });

        it('only add', function () {
            var target = [2, 3];
            var source = [2];

            var actions = (0, _utils.arrayDiffActions)(source, target);
            expect(actions.add).to.deep.equal([3]);
            expect(actions.delete).to.deep.equal([]);
        });

        it('only remove', function () {
            var target = [2, 3];
            var source = [2, 3, 4];

            var actions = (0, _utils.arrayDiffActions)(source, target);
            expect(actions.add).to.deep.equal([]);
            expect(actions.delete).to.deep.equal([4]);
        });

        it('identical', function () {
            var target = [2, 3];
            var source = [2, 3];

            var actions = (0, _utils.arrayDiffActions)(source, target);
            expect(actions).to.equal(null);
        });
    });
});