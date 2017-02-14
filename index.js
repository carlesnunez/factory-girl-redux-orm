"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReduxORMAdapter = function () {
  function ReduxORMAdapter(session) {
    _classCallCheck(this, ReduxORMAdapter);

    this.session = session;
  }

  _createClass(ReduxORMAdapter, [{
    key: "build",
    value: function build(modelName, props) {
      return this.session[modelName].create(props);
    }
  }, {
    key: "get",
    value: function get(model, attr) {
      return model[attr];
    }
  }, {
    key: "save",
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(model, Model) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", model);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function save(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: "destroy",
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(model, Model) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", Promise.resolve(model.delete()).then(function () {
                  return true;
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function destroy(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return destroy;
    }()
  }]);

  return ReduxORMAdapter;
}();

exports.default = ReduxORMAdapter;
