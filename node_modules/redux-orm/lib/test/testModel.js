'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinonChai = require('sinon-chai');

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require('../');

var _Table = require('../db/Table');

var _Table2 = _interopRequireDefault(_Table);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_sinonChai2.default);
var expect = _chai2.default.expect;


describe('Model', function () {
    describe('static method', function () {
        var Model = void 0;
        var sessionMock = { db: { tables: { Model: new _Table2.default() } } };

        beforeEach(function () {
            // Get a fresh copy
            // of Model, so our manipulations
            // won't survive longer than each test.
            Model = function (_BaseModel) {
                (0, _inherits3.default)(TestModel, _BaseModel);

                function TestModel() {
                    (0, _classCallCheck3.default)(this, TestModel);
                    return (0, _possibleConstructorReturn3.default)(this, _BaseModel.apply(this, arguments));
                }

                return TestModel;
            }(_.Model);
            Model.modelName = 'Model';
        });

        it('make sure intsance methods are enumerable', function () {
            // See #29.

            var enumerableProps = {};
            for (var propName in Model) {
                // eslint-disable-line
                enumerableProps[propName] = true;
            }

            expect(enumerableProps.create).to.be.true;
        });

        it('session getter works correctly', function () {
            expect(Model.session).to.be.undefined;
            Model._session = sessionMock;
            expect(Model.session).to.equal(sessionMock);
        });

        it('connect works correctly', function () {
            expect(Model.session).to.be.undefined;
            Model.connect(sessionMock);

            expect(Model.session).to.equal(sessionMock);
        });
    });

    describe('Instance methods', function () {
        var Model = void 0;
        var instance = void 0;

        beforeEach(function () {
            Model = function (_BaseModel2) {
                (0, _inherits3.default)(TestModel, _BaseModel2);

                function TestModel() {
                    (0, _classCallCheck3.default)(this, TestModel);
                    return (0, _possibleConstructorReturn3.default)(this, _BaseModel2.apply(this, arguments));
                }

                return TestModel;
            }(_.Model);
            Model.modelName = 'Model';
            Model.fields = {
                id: (0, _.attr)(),
                name: (0, _.attr)(),
                tags: new _.ManyToMany('_')
            };

            instance = new Model({ id: 0, name: 'Tommi' });
        });

        it('equals works correctly', function () {
            var anotherInstance = new Model({ id: 0, name: 'Tommi' });
            expect(instance.equals(anotherInstance)).to.be.ok;
        });

        it('getClass works correctly', function () {
            expect(instance.getClass()).to.equal(Model);
        });
    });
});