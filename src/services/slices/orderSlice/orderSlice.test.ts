import orderReducer, { initialState as defaultOrderState, getOrderByNumber } from './orderSlice';
import { describe, it, expect } from '@jest/globals';

describe('orderReducer state management', () => {
  describe('getOrderByNumber asynchronous action handling', () => {
    it('should set request to true and error to null when pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(defaultOrderState, action);
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set request to false and populate error when rejected', () => {
      const specificErrorMessage = 'Order not found';
      const action = { type: getOrderByNumber.rejected.type, error: { message: specificErrorMessage } };
      const state = orderReducer(defaultOrderState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBe(specificErrorMessage);
    });

    it('should set request to false, error to null, and store order data when fulfilled', () => {
      const mockOrderData = { id: 'order123', status: 'done', ingredients: ['bun', 'patty'] };
      const action = { type: getOrderByNumber.fulfilled.type, payload: { orders: [mockOrderData] } };
      const state = orderReducer(defaultOrderState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderByNumberResponse).toEqual(mockOrderData);
    });
  });
});
