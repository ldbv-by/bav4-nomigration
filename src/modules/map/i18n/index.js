import { provide as olMapProvide } from './olMap.provider';
import { provide as infoButtonProvide } from './infoButton.provider';
import { provide as zoomButtonsProvide } from './zoomButtons.provider';
import { provide as geolocationButtonProvide } from './geolocationButton.provider';
import { provide as layerManagerProvide } from './layerManager.provider';
import { provide as contextMenuProvider } from './contextMenu.provider';
import { provide as storeProvider } from './store.provider';
import { provide as attributionInfoProvider } from './attributionInfo.provider'; 
import { provide as rotationButtonProvider } from './rotationButton.provider'; 
import { $injector } from '../../../injection';
const { TranslationService: translationService } = $injector.inject('TranslationService');
translationService.register('mapProvider', olMapProvide);
translationService.register('infoButtonProvider', infoButtonProvide);
translationService.register('zoomButtonsProvider', zoomButtonsProvide);
translationService.register('geolocationButtonProvider', geolocationButtonProvide);
translationService.register('layerManagerProvider', layerManagerProvide);
translationService.register('contextMenuProvider', contextMenuProvider);
translationService.register('storeProvider', storeProvider);
translationService.register('attributionInfoProvider', attributionInfoProvider);
translationService.register('rotationButtonProvider', rotationButtonProvider);

