import { provide as olMapProvide } from './olMap.provider';
import { provide as layerManagerProvide } from './layerManager.provider';
import { provide as contextMenuProvider } from './contextMenu.provider';
import { $injector } from '../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('mapProvider', olMapProvide);
translationService.register('layerManagerProvider', layerManagerProvide);
translationService.register('contextMenuProvider', contextMenuProvider);
