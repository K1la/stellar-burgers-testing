import store, { rootReducer } from '../services/store';

test('rootReducer возвращает начальное состояние при неизвестном действии', () => {
  const initialState = rootReducer(undefined, { type: '@@INIT' });
  expect(store.getState()).toEqual(initialState);
});
