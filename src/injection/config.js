import { $injector } from '.';
import { StoreService } from '../services/StoreService';
import { OlCoordinateService } from '../services/OlCoordinateService';
import { EnvironmentService } from '../services/EnvironmentService';
import { BvvSearchService } from '../modules/search/services/BvvSearchService';
import { ProcessEnvConfigService } from '../services/ProcessEnvConfigService';
import { HttpService } from '../services/HttpService';
import { TranslationService } from '../services/TranslationService';
import { ShareService } from '../services/ShareService';
import { GeoResourceService } from '../services/GeoResourceService';
import { loadExampleGeoResources } from '../services/domain/geoResource.provider';
import { UrlService } from '../services/UrlService';


$injector
	.register('HttpService', HttpService)
	.registerSingleton('ConfigService', new ProcessEnvConfigService())
	.registerSingleton('TranslationService', new TranslationService)
	.register('CoordinateService', OlCoordinateService)
	.registerSingleton('EnvironmentService', new EnvironmentService(window))
	.registerSingleton('StoreService', new StoreService())
	.register('SearchService', BvvSearchService)
	.registerSingleton('GeoResourceService', new GeoResourceService(loadExampleGeoResources))
	.registerSingleton('ShareService', new ShareService(navigator))
	.register('UrlService', UrlService);


export let init = true;