import {dirname} from 'path';
import {fileURLToPath} from 'url';

const filePath = fileURLToPath(import.meta.url);

export default dirname(dirname(dirname(filePath)));
