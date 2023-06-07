/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import BillsUI from '../views/BillsUI.js';
import Bills from '../containers/Bills.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import router from '../app/Router.js';
import mockStore from '../__mocks__/store.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      // to-do write expect expression
      expect(windowIcon).toBeTruthy();
      expect(windowIcon.classList[0]).toBe('active-icon');
    });
    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
      const antiChrono = (a, b) => ((a < b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test('fetches bills from mock API GET', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('btn-new-bill'));
      const btnNewBill = screen.getByTestId('btn-new-bill');
      expect(btnNewBill).toBeTruthy();
    });
    
    describe('When an error occurs on API', () => {
      beforeEach(() => {
        jest.spyOn(mockStore, 'bills');
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        );
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);
        router();
      });
      test('fetches bills from an API and fails with 404 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 404'));
            }
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByTestId('error-message');
        expect(message).toBeTruthy();
      });

      test('fetches messages from an API and fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 500'));
            }
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByTestId('error-message');
        expect(message).toBeTruthy();
      });
    });

  });
  describe('When I am on Bills Page and I click on eye icon', () => {
    test('Then bill image modal should show up', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));

      document.body.innerHTML = BillsUI({ data: bills });

      const bill = new Bills({
        document, onNavigate, store: null, localStorage
      });

      const eyeIcon = screen.getAllByTestId('icon-eye')[0];
      expect(eyeIcon).toBeTruthy();
      const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(eyeIcon));
      eyeIcon.addEventListener('click', handleClickIconEye);
      $.fn.modal = jest.fn();
      fireEvent.click(eyeIcon);
      expect(handleClickIconEye).toHaveBeenCalled();
      const modal = screen.getByTestId('modal');
      expect(modal).toBeTruthy();
    });
  });
});

describe('When I am on Bills Page and I click on new bill', () => {
  test('Then should be on new bill page', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    }

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }));

    const bill = new Bills({
      document, onNavigate, store: null, localStorage
    });

    const newBillBtn = screen.getByTestId('btn-new-bill');
    expect(newBillBtn).toBeTruthy();
    
    const handleNewBill = jest.fn(() => bill.handleClickNewBill());
    newBillBtn.addEventListener('click', handleNewBill);
    fireEvent.click(newBillBtn);
    expect(handleNewBill).toHaveBeenCalled();

    const text = screen.getByText('Envoyer une note de frais');
    expect(text).toBeTruthy();
  });
});