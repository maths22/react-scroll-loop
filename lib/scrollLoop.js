'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _swipe = require('./swipe');

var _swipe2 = _interopRequireDefault(_swipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  container: 'style__container___wbUj_',
  swipeWrap: 'style__swipeWrap___3g4s8',
  itemWrap: 'style__itemWrap___P24aJ'
};

require('load-styles')('/*  imported from style.css  */\n\n.style__container___wbUj_ {\n  overflow: hidden;\n}\n.style__swipeWrap___3g4s8 {\n  position: relative;\n}\n.style__swipeWrap___3g4s8::after {\n  content: \'\';\n  display: block;\n  clear: both;\n}\n.style__itemWrap___P24aJ {\n  width: 100%;\n  position: absolute;\n  transition-timing-function: linear;\n  transitionProperty: transform;\n}\n');

var ScrollLoop = function (_Component) {
  _inherits(ScrollLoop, _Component);

  function ScrollLoop(props) {
    _classCallCheck(this, ScrollLoop);

    var _this = _possibleConstructorReturn(this, (ScrollLoop.__proto__ || Object.getPrototypeOf(ScrollLoop)).call(this, props));

    _this.setContainerRef = function (ref) {
      var _this$props = _this.props,
          speed = _this$props.speed,
          _this$props$minSpeed = _this$props.minSpeed,
          minSpeed = _this$props$minSpeed === undefined ? 10 : _this$props$minSpeed,
          _this$props$auto = _this$props.auto,
          auto = _this$props$auto === undefined ? 1 : _this$props$auto,
          transitionEnd = _this$props.transitionEnd;

      var swipeOptions = { speed: speed, minSpeed: minSpeed, transitionEnd: transitionEnd, auto: auto };

      _this.swipe = (0, _swipe2.default)(ref, swipeOptions);
    };

    _this.reset = false;
    return _this;
  }

  _createClass(ScrollLoop, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.children.length != this.props.children.length) {
        this.reset = true;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.reset) {
        this.reset = false;
        if (this.swipe) {
          this.swipe.stop();
          this.swipe.setup();
          this.swipe.begin(this.props.auto);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.swipe.kill();
      this.swipe = void 0;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$height = _props.height,
          height = _props$height === undefined ? 200 : _props$height,
          id = _props.id,
          className = _props.className,
          children = _props.children,
          style = _props.style;


      return _react2.default.createElement(
        'div',
        { ref: this.setContainerRef, id: id, className: styles.container + ' ' + className, style: _extends({ height: height + 'px' }, style) },
        _react2.default.createElement(
          'div',
          { className: styles.swipeWrap },
          _react2.default.Children.map(children, function (child) {
            if (!child) {
              return null;
            }

            var childStyle = child.props.style ? child.props.style : {};

            return _react2.default.cloneElement(child, { style: childStyle, className: child.props.className + ' ' + styles.itemWrap });
          }),
          children && children.length === 2 && _react2.default.Children.map(children, function (child) {
            if (!child) {
              return null;
            }

            var childStyle = child.props.style ? child.props.style : {};

            return _react2.default.cloneElement(child, { style: childStyle, className: child.props.className + ' ' + styles.itemWrap });
          })
        )
      );
    }
  }]);

  return ScrollLoop;
}(_react.Component);

exports.default = ScrollLoop;
module.exports = exports['default'];