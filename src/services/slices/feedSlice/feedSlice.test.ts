import reducer, { getFeeds, initialState as defaultFeedState } from './feedSlice';
import { describe, it, expect } from '@jest/globals';

describe('feedSlice state transitions', () => {
  describe('handling getFeeds asynchronous thunk', () => {
    it('should reflect loading state when getFeeds is pending', () => {
      const action = { type: getFeeds.pending.type };
      const state = reducer(defaultFeedState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should store error message when getFeeds is rejected', () => {
      const mockError = 'Network Error';
      const action = { type: getFeeds.rejected.type, error: { message: mockError } };
      const state = reducer(defaultFeedState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockError);
    });

    it('should populate orders and clear loading/error when getFeeds is fulfilled', () => {
      const mockOrders = [{ id: '1', name: 'Order 1' }, { id: '2', name: 'Order 2' }];
      const action = { type: getFeeds.fulfilled.type, payload: { orders: mockOrders } };
      const state = reducer(defaultFeedState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrders);
    });
  });
});
