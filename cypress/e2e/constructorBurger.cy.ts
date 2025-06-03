import Cypress from 'cypress';


const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const ID_ANOTHER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const ID_FILLING = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${BASE_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modal');
});

describe('Burger constructor functionality', () => {
  context('Ingredient Management', () => {
    it('should correctly increment the ingredient counter upon selection', () => {
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_FILLING).find('.counter__num').should('contain.text', '1');
    });

    context('Adding Buns and Fillings to Order', () => {
      it('should allow adding a bun and a filling to the order', () => {
        cy.get(ID_BUN).children('button').click();
        cy.get(ID_FILLING).children('button').click();
      });

      it('should allow adding a bun after fillings have been added', () => {
        cy.get(ID_FILLING).children('button').click();
        cy.get(ID_BUN).children('button').click();
      });
    });

    context('Bun Replacement Scenarios', () => {
      it('should replace a bun when no fillings are present', () => {
        cy.get(ID_BUN).children('button').click();
        cy.get(ID_ANOTHER_BUN).children('button').click();
      });

      it('should replace a bun when fillings are already added to the order', () => {
        cy.get(ID_BUN).children('button').click();
        cy.get(ID_FILLING).children('button').click();
        cy.get(ID_ANOTHER_BUN).children('button').click();
      });
    });
  });
});

describe('Order Placement Process', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'ipsum');
    cy.setCookie('accessToken', 'lorem');
    cy.getAllLocalStorage().should('not.be.empty');
    cy.getCookie('accessToken').should('not.be.empty');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('should successfully submit an order and verify the order number in the response', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_FILLING).children('button').click();

    cy.get(`[data-cy='order-button']`).click();

    cy.get('@modal').find('h2').should('contain.text', '38483');
  });
});

describe('Modal Window Interactions', () => {
  it('should open ingredient modal and display its data correctly, then close via "X" button', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('not.be.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');

    cy.get('@modal').find('button').click();
    cy.get('@modal').should('be.empty');
  });

  it('should open ingredient modal and then close it by clicking the overlay', () => {
    cy.get('@modal').should('be.empty');

    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('not.be.empty');

    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modal').should('be.empty');
  });

  it('should open ingredient modal and then close it by pressing the Escape key', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('not.be.empty');

    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modal').should('be.empty');
  });
});
