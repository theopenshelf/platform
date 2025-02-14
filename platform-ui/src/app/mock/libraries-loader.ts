import { UILibrary } from '../models/UILibrary';
import librariesData from './libraries.json';


export const loadLibrariesData = (): UILibrary[] => {
    return librariesData.map(library => ({
        ...library,
    }));
};
