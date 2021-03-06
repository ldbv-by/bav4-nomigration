import { ShareMeasureDialog } from '../../../../../src/modules/toolbox/components/measureToolContent/ShareMeasureDialog';
import { TestUtils } from '../../../../test-utils';
import { $injector } from '../../../../../src/injection';

window.customElements.define(ShareMeasureDialog.tag, ShareMeasureDialog);

describe('ShareMeasureDialog', () => {
	const windowMock = {
		matchMedia() { },
		navigator: () => {
			return {
				share() {
					return false;
				}
			};
		}

	};
	const shareServiceMock = {
		copyToClipboard() {
			return Promise.resolve();
		},
	};
	const setup = (state = {}, config = {}) => {

		const { embed = false, isTouch = false, share = false } = config;
		windowMock.navigator.share = share;
		TestUtils.setupStoreAndDi(state, {});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed,
				getWindow: () => windowMock,
				isTouch: () => isTouch

			}).registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('ShareService', shareServiceMock);
		return TestUtils.render(ShareMeasureDialog.tag);
	};

	it('renders the component', async () => {
		const element = await setup();
		element.shareurls = { adminId: 'foo', fileid: 'bar' };
		expect(element).toBeTruthy;
	});

	it('renders the sharedUrls', async () => {
		const element = await setup();
		element.shareurls = { adminId: 'foo', fileid: 'bar' };


		const shareItems = element.shadowRoot.querySelectorAll('.share_item');
		expect(shareItems.length).toBe(2);
	});

	it('renders the shareApi-Button', async () => {
		const element = await setup({}, { share: true });
		element.shareurls = { adminId: 'foo', fileid: 'bar' };


		const shareButton = element.shadowRoot.querySelector('.share_item .share_api');
		const copyButton = element.shadowRoot.querySelector('.share_item .share_copy');

		expect(shareButton).toBeTruthy();
		expect(copyButton).toBeFalsy();
	});

	it('renders the CopyToClipboard-Button, when ShareApi is missing', async () => {
		const element = await setup();
		element.shareurls = { adminId: 'foo', fileid: 'bar' };

		const shareButton = element.shadowRoot.querySelector('.share_item .share_api');
		const copyButton = element.shadowRoot.querySelector('.share_item .share_copy');

		expect(shareButton).toBeFalsy();
		expect(copyButton).toBeTruthy();
	});

	it('copies the url to the clipboard, when click', async (done) => {
		const copySpy = spyOn(shareServiceMock, 'copyToClipboard').and.callFake(() => Promise.resolve());

		const element = await setup();
		element.shareurls = { adminId: 'foo', fileid: 'foo' };
		const copyButton = element.shadowRoot.querySelector('.share_item .share_copy');

		copyButton.click();

		setTimeout(() => {
			expect(copyButton).toBeTruthy();
			expect(copySpy).toHaveBeenCalledWith('foo');
			done();
		});
	});

	it('calls the shareApi, when click', async (done) => {
		const element = await setup({}, { share: () => Promise.resolve(true) });
		const shareSpy = spyOn(windowMock.navigator, 'share').and.callFake(() => Promise.resolve(true));
		element.shareurls = { adminId: 'foo', fileid: 'foo' };
		const shareButton = element.shadowRoot.querySelector('.share_item .share_api');

		shareButton.click();

		setTimeout(() => {
			expect(shareButton).toBeTruthy();
			expect(shareSpy).toHaveBeenCalledWith({ title: 'toolbox_measureTool_share_link_title', url: 'foo' });
			done();
		});
	});

	it('logs a warning when shareApi fails', async (done) => {
		const element = await setup({}, { share: () => Promise.resolve(true) });
		const shareSpy = spyOn(windowMock.navigator, 'share').and.callFake(() => Promise.reject('because!'));
		const errorSpy = spyOn(console, 'error');
		element.shareurls = { adminId: 'foo', fileid: 'foo' };
		const shareButton = element.shadowRoot.querySelector('.share_item .share_api');

		shareButton.click();

		setTimeout(() => {
			expect(errorSpy).toHaveBeenCalledWith('Share-API failed:', 'because!');
			expect(shareSpy).toHaveBeenCalledWith({ title: 'toolbox_measureTool_share_link_title', url: 'foo' });
			done();
		});
	});


	it('logs a warning when copyToClipboard fails', async (done) => {
		const copySpy = spyOn(shareServiceMock, 'copyToClipboard').and.callFake(() => Promise.reject());
		const warnSpy = spyOn(console, 'warn');
		const element = await setup();
		element.shareurls = { adminId: 'foo', fileid: 'foo' };
		const copyElement = element.shadowRoot.querySelector('.share_item .share_copy');

		copyElement.click();

		setTimeout(() => {
			expect(copySpy).toHaveBeenCalledWith('foo');
			expect(warnSpy).toHaveBeenCalledWith('Clipboard API not available');
			done();
		});

	});
});