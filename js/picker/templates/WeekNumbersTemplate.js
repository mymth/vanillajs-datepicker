import {createTagRepeat, optimizeTemplateHTML} from '../../lib/utils.js';

const weekNumbersTemplate = optimizeTemplateHTML(`<div class="week-numbers calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat('span', 6, {class: 'week'})}</div>
</div>`);

export default weekNumbersTemplate;
