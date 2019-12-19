import {optimizeTemplateHTML} from '../../lib/utils.js';

const pickerTemplate = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        <button class="%buttonClass% prev-btn"></button>
        <button class="%buttonClass% view-switch"></button>
        <button class="%buttonClass% next-btn"></button>
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        <button class="%buttonClass% today-btn"></button>
        <button class="%buttonClass% clear-btn"></button>
      </div>
    </div>
  </div>
</div>`);

export default pickerTemplate;
