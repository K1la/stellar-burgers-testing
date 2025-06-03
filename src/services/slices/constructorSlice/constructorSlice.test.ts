import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('constructorSlice reducer', () => {
  it('should handle adding a bun', () => {
    const bun = {
      _id: 'bun1',
      name: 'Булка 1',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'img1',
      image_mobile: 'img1m',
      image_large: 'img1l'
    };
    const state = constructorSlice(initialState, addIngredient(bun));
    expect(state.constructorItems.bun).toMatchObject({
      ...bun,
      id: expect.any(String)
    });
  });

  it('should add an ingredient to the list', () => {
    const ingredient = {
      _id: 'ing1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 1,
      fat: 2,
      carbohydrates: 3,
      calories: 4,
      price: 5,
      image: 'img2',
      image_mobile: 'img2m',
      image_large: 'img2l'
    };
    const state = constructorSlice(initialState, addIngredient(ingredient));
    expect(state.constructorItems.ingredients[0]).toMatchObject({
      ...ingredient,
      id: expect.any(String)
    });
  });

  it('should replace the bun if a new one is added', () => {
    const firstBun = {
      _id: 'bun1',
      name: 'Булка 1',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'img1',
      image_mobile: 'img1m',
      image_large: 'img1l'
    };
    const secondBun = {
      _id: 'bun2',
      name: 'Булка 2',
      type: 'bun',
      proteins: 20,
      fat: 10,
      carbohydrates: 40,
      calories: 200,
      price: 100,
      image: 'img2',
      image_mobile: 'img2m',
      image_large: 'img2l'
    };
    let state = constructorSlice(initialState, addIngredient(firstBun));
    state = constructorSlice(state, addIngredient(secondBun));
    expect(state.constructorItems.bun).toMatchObject({
      ...secondBun,
      id: expect.any(String)
    });
  });

  it('should remove an ingredient by id', () => {
    const ingredient = {
      _id: 'ing1',
      name: 'Ингредиент 1',
      type: 'main',
      proteins: 1,
      fat: 2,
      carbohydrates: 3,
      calories: 4,
      price: 5,
      image: 'img2',
      image_mobile: 'img2m',
      image_large: 'img2l',
      id: 'test-id'
    };
    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [ingredient]
      }
    };
    const state = constructorSlice(stateWithIngredient, removeIngredient('test-id'));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('should move ingredient up in the list', () => {
    const items = [
      { id: 'a', _id: '1', name: 'A', type: 'main', proteins: 0, fat: 0, carbohydrates: 0, calories: 0, price: 0, image: '', image_mobile: '', image_large: '' },
      { id: 'b', _id: '2', name: 'B', type: 'main', proteins: 0, fat: 0, carbohydrates: 0, calories: 0, price: 0, image: '', image_mobile: '', image_large: '' }
    ];
    const stateWithItems = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: items
      }
    };
    const state = constructorSlice(stateWithItems, moveIngredientUp(1));
    expect(state.constructorItems.ingredients[0].id).toBe('b');
    expect(state.constructorItems.ingredients[1].id).toBe('a');
  });

  it('should move ingredient down in the list', () => {
    const items = [
      { id: 'x', _id: '1', name: 'X', type: 'main', proteins: 0, fat: 0, carbohydrates: 0, calories: 0, price: 0, image: '', image_mobile: '', image_large: '' },
      { id: 'y', _id: '2', name: 'Y', type: 'main', proteins: 0, fat: 0, carbohydrates: 0, calories: 0, price: 0, image: '', image_mobile: '', image_large: '' }
    ];
    const stateWithItems = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: items
      }
    };
    const state = constructorSlice(stateWithItems, moveIngredientDown(0));
    expect(state.constructorItems.ingredients[0].id).toBe('y');
    expect(state.constructorItems.ingredients[1].id).toBe('x');
  });

  describe('orderBurger async actions', () => {
    it('should set loading true on orderBurger.pending', () => {
      const action = { type: orderBurger.pending.type };
      const state = constructorSlice(initialState, action);
      expect(state.loading).toBe(true);
    });

    it('should set error on orderBurger.rejected', () => {
      const action = {
        type: orderBurger.rejected.type,
        error: { message: 'Ошибка' }
      };
      const state = constructorSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });

    it('should set orderModalData on orderBurger.fulfilled', () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 123 } }
      };
      const state = constructorSlice(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.orderModalData!.number).toBe(123);
    });
  });
});
