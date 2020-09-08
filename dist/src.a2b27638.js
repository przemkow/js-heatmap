// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/heatmap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderHeatMap = renderHeatMap;

/*
  Prototype written in 1hour.
  Refactor code bellow
 */
function renderHeatMap(config) {
  var heatMap = Array.from({
    length: config.y
  }, function (_, y) {
    return Array.from({
      length: config.x
    }, function (_, x) {
      return {
        value: 0
      };
    });
  });

  var addToNeighbour = function addToNeighbour(cellX, cellY) {
    var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var rowLimit = heatMap.length - 1;
    var columnLimit = heatMap[0].length - 1;

    for (var x = Math.max(0, cellX - distance); x <= Math.min(cellX + distance, rowLimit); x++) {
      for (var y = Math.max(0, cellY - distance); y <= Math.min(cellY + distance, columnLimit); y++) {
        if (x !== cellX || y !== cellY) {
          heatMap[x][y].value += 2 * (distance - Math.max(Math.abs(y - cellY), Math.abs(x - cellX)));
        }
      }
    }
  };

  var cellFactory = function cellFactory(x, y) {
    var div = document.createElement('div');
    div.classList.add('cell');
    var textNode;

    if (config.showValues) {
      textNode = document.createTextNode(heatMap[x][y].value);
      div.appendChild(textNode);
    }

    div.style.backgroundColor = heatMapColorForValue(heatMap[x][y].value);
    heatMap[x][y] = new Proxy(heatMap[x][y], {
      set: function set(obj, prop, value) {
        div.style.backgroundColor = heatMapColorForValue(value);

        if (config.showValues) {
          var newTextNode = document.createTextNode(value);
          div.replaceChild(newTextNode, textNode);
          textNode = newTextNode;
        }

        return Reflect.set.apply(Reflect, arguments);
      }
    });
    div.addEventListener('mouseenter', function () {
      heatMap[x][y].value += config.hoverIncrease;
      addToNeighbour(x, y, config.hoverRadius);
    });
    div.addEventListener('click', function () {
      heatMap[x][y].value += config.clickIncrease;
      addToNeighbour(x, y, config.clickRadius);
    });
    return div;
  };

  var rowFactory = function rowFactory() {
    var div = document.createElement('div');
    div.classList.add('row');
    return div;
  };

  var app = document.getElementById('app');
  app.innerHTML = "";
  var heatMapNode = document.createElement('div');
  heatMapNode.classList.add('heatmap');
  heatMap.forEach(function (row, indexX) {
    var rowNode = rowFactory();
    row.forEach(function (_, indexY) {
      rowNode.appendChild(cellFactory(indexX, indexY));
    });
    heatMapNode.appendChild(rowNode);
  });
  app.appendChild(heatMapNode);
}

function heatMapColorForValue(value) {
  value = value > 130 ? 130 : value;
  var hue = (1.0 - value / 100) * 240;
  return "hsl(".concat(hue, ", 100%, 50%)");
}
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _heatmap = require("./heatmap");

(0, _heatmap.renderHeatMap)({
  x: 50,
  y: 30,
  hoverIncrease: 3,
  hoverRadius: 3,
  clickIncrease: 10,
  clickRadius: 10,
  showValues: false
});
document.getElementById('updateConfig').addEventListener("submit", function (e) {
  e.preventDefault();
  var config = {
    x: parseInt(document.getElementById('size-x').value),
    y: parseInt(document.getElementById('size-y').value),
    hoverIncrease: parseInt(document.getElementById('hover-increase').value),
    hoverRadius: parseInt(document.getElementById('hover-radius').value),
    clickIncrease: parseInt(document.getElementById('click-increase').value),
    clickRadius: parseInt(document.getElementById('click-radius').value),
    showValues: document.getElementById('show-values').checked
  };
  (0, _heatmap.renderHeatMap)(config);
});
var dynamicStyles = document.createElement('style');
document.body.appendChild(dynamicStyles);
document.getElementById('square-size').addEventListener('input', function (e) {
  var size = e.target.value;
  var newDynamicStyles = document.createElement('style');
  newDynamicStyles.innerHTML = ".cell {width: ".concat(size, "px; height: ").concat(size, "px; line-height: ").concat(size, "px; font-size: ").concat(size / 1.2, "px");
  document.body.replaceChild(newDynamicStyles, dynamicStyles);
  dynamicStyles = newDynamicStyles;
});
},{"./heatmap":"src/heatmap.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56849" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map