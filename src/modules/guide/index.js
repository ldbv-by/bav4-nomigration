import { NoState } from './components/NoState';
if (!window.customElements.get(NoState.tag)) {
	window.customElements.define(NoState.tag, NoState);
}
import { LocalState } from './components/LocalState';
if (!window.customElements.get(LocalState.tag)) {
	window.customElements.define(LocalState.tag, LocalState);
}
import { AsyncLocalState } from './components/AsyncLocalState';
if (!window.customElements.get(AsyncLocalState.tag)) {
	window.customElements.define(AsyncLocalState.tag, AsyncLocalState);
}
