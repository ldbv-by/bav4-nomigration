import { Stateless } from './components/Stateless';
if (!window.customElements.get(Stateless.tag)) {
	window.customElements.define(Stateless.tag, Stateless);
}
import { LocalState } from './components/LocalState';
if (!window.customElements.get(LocalState.tag)) {
	window.customElements.define(LocalState.tag, LocalState);
}
import { AsyncLocalState } from './components/AsyncLocalState';
if (!window.customElements.get(AsyncLocalState.tag)) {
	window.customElements.define(AsyncLocalState.tag, AsyncLocalState);
}
