import {optimizeTemplateHTML} from '../../lib/utils.js';

const getButtons = buttonList => buttonList
  .map(classes => `<button type="button" class="%buttonClass% ${classes}" tabindex="-1"></button>`)
  .join('');

export default optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        ${getButtons([
          'prev-button prev-btn',
          'view-switch',
          'next-button next-btn',
        ])}
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        ${getButtons([
          'today-button today-btn',
          'clear-button clear-btn',
        ])}
      </div>
    </div>
  </div>
</div>`);
