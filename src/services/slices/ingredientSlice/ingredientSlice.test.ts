import ingredientsReducer, {
  getIngredients,
  initialState as initialIngredientsState
} from './ingredientSlice';
import { describe, it, expect } from '@jest/globals';

describe('ingredientsReducer behavior', () => {
  describe('handling getIngredients async action states', () => {
    it('should set loading to true and error to null on pending', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientsReducer(initialIngredientsState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set loading to false and store error message on rejection', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const action = { type: getIngredients.rejected.type, error: { message: errorMessage } };
      const state = ingredientsReducer(initialIngredientsState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should populate ingredients array, set loading to false, and error to null on fulfillment', () => {
      const mockIngredients = [
        { _id: 'ingrA', name: 'Ingredient Alpha' },
        { _id: 'ingrB', name: 'Ingredient Beta' }
      ];
      const action = { type: getIngredients.fulfilled.type, payload: mockIngredients };
      const state = ingredientsReducer(initialIngredientsState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });
});
