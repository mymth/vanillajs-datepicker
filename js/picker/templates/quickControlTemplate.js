import {optimizeTemplateHTML} from '../../lib/utils.js';

const quickControlTemplate = optimizeTemplateHTML(`<div class="datepicker-controls">
        <button type="button" class="%buttonClass% quick-control-btn"></button>
</div>`);

export default quickControlTemplate;
