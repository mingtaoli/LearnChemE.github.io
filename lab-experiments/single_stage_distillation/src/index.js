import './style/style.scss';
import jQuery from 'jquery';
window["jQuery"] = jQuery;
window["$"] = jQuery;
import 'bootstrap';
import * as p5 from 'p5';
window.p5 = p5;
import * as setup from './js/setup.js';
import * as loop from './js/loop.js';
import * as Separator from './js/Separator.js';

window.separator = Separator();

/******** ADD HTML ********/
require('./js/insertSVG.js')();
require('./js/insertInputs.js')();

let animation = (sk) => {
  setup(sk, 20);
  loop(sk);
}


let P5 = new p5(animation);
