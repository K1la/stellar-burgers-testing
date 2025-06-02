import userReducer, {
  getUser,
  getOrdersAll,
  initialState as defaultUserState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';
import { describe, it, expect } from '@jest/globals';

describe('userReducer state and async actions', () => {
  // --- getUser ---
  describe('getUser action', () => {
    it('should handle pending state for getUser', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state for getUser by setting error to null', () => {
      const action = { type: getUser.rejected.type }; 
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBeNull(); 
    });

    it('should handle fulfilled state for getUser', () => {
      const mockUserData = { name: 'Jane Doe', email: 'jane@example.com' };
      const action = { type: getUser.fulfilled.type, payload: { user: mockUserData } };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.userData).toEqual(mockUserData);
      expect(state.error).toBeNull();
    });
  });

  // --- getOrdersAll ---
  describe('getOrdersAll action', () => {
    it('should set request true on getOrdersAll.pending', () => {
      const action = { type: getOrdersAll.pending.type };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set error and request false on getOrdersAll.rejected', () => {
      const errorMessage = 'Could not fetch orders';
      const action = { type: getOrdersAll.rejected.type, error: { message: errorMessage } };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should populate userOrders on getOrdersAll.fulfilled', () => {
      const mockOrders = [{ id: 'order1' }, { id: 'order2' }];
      const action = { type: getOrdersAll.fulfilled.type, payload: mockOrders };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.userOrders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });
  });

  // --- registerUser ---
  describe('registerUser action', () => {
    it('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle registerUser.rejected', () => {
      const errorMessage = 'Registration failed';
      const action = { type: registerUser.rejected.type, error: { message: errorMessage } };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle registerUser.fulfilled', () => {
      const mockNewUser = { name: 'New User', email: 'new@example.com' };
      const action = { type: registerUser.fulfilled.type, payload: { user: mockNewUser } };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.userData).toEqual(mockNewUser);
      expect(state.isAuthenticated).toBe(true); 
      expect(state.error).toBeNull();
    });
  });

  // --- loginUser ---
  describe('loginUser action', () => {
    it('should manage state for loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(defaultUserState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should manage state for loginUser.rejected', () => {
      const errorMessage = 'Login credentials incorrect';
      const action = { type: loginUser.rejected.type, error: { message: errorMessage } };
      const state = userReducer(defaultUserState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.isAuthChecked).toBe(false); 
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should manage state for loginUser.fulfilled', () => {
      const loggedInUser = { name: 'Logged In User', email: 'loggedin@example.com' };
      const action = { type: loginUser.fulfilled.type, payload: { user: loggedInUser } };
      const state = userReducer(defaultUserState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.userData).toEqual(loggedInUser);
      expect(state.error).toBeNull();
    });
  });

  describe('updateUser action', () => {
    it('handles updateUser.pending correctly', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles updateUser.rejected correctly', () => {
      const errorMessage = 'Update failed due to conflict';
      const action = { type: updateUser.rejected.type, error: { message: errorMessage } };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('handles updateUser.fulfilled correctly', () => {
      const updatedUserData = { name: 'Updated Name', email: 'updated@example.com' };
      const action = { type: updateUser.fulfilled.type, payload: { user: updatedUserData } };
      const state = userReducer(defaultUserState, action);
      expect(state.request).toBe(false);
      expect(state.response).toEqual(updatedUserData); 
      expect(state.userData).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('logoutUser action', () => {
    const authenticatedState = {
      ...defaultUserState,
      isAuthenticated: true,
      userData: { name: 'Test User', email: 'test@example.com' }
    };

    it('processes logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userReducer(authenticatedState, action);
      expect(state.request).toBe(true);
    });

    it('processes logoutUser.rejected', () => {
      const errorMessage = 'Logout could not be completed';
      const action = { type: logoutUser.rejected.type, error: { message: errorMessage } };
      const state = userReducer(authenticatedState, action);
      expect(state.request).toBe(false);
      expect(state.isAuthenticated).toBe(true); 
      expect(state.error).toBe(errorMessage);
    });

    it('processes logoutUser.fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(authenticatedState, action);
      expect(state.request).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.userData).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
