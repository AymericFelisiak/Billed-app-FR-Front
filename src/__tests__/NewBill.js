/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { localStorageMock } from '../__mocks__/localStorage.js';
import NewBill from '../containers/NewBill.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import userEvent from '@testing-library/user-event';
import { newBillMock } from '../__mocks__/NewBIll.js';
import NewBillUI from '../views/NewBillUI.js';
import store from '../__mocks__/store.js';
import router from '../app/Router';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    describe('When i click on first icon in the Sidebar', () => {
      test('Then i should go back to Bills page', () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: 'a@a'
        }));

        document.body.innerHTML = NewBillUI();

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        });

        const iconWindow = screen.getByTestId('icon-window');
        expect(iconWindow).toBeTruthy();

        const handleClickNoteBoard = jest.fn(() => newBill.handleClickNoteBoard);
        iconWindow.addEventListener('click', handleClickNoteBoard);
        fireEvent.click(iconWindow);
        expect(handleClickNoteBoard).toHaveBeenCalled();

        const text = screen.getByText('Mes notes de frais');
        expect(text).toBeTruthy();
      });
    });

    describe('When i click to add a file', () => {
      test('Then open window to select a file', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: 'a@a'
        }));

        document.body.innerHTML = NewBillUI();

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        });

        const input = screen.getByTestId('file');
        expect(input).toBeTruthy();

        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
        input.addEventListener('click', handleChangeFile);
        fireEvent.click(input);

        expect(handleChangeFile).toHaveBeenCalled();
      });
    });

    describe('When i selected a file', () => {
      test('Then the added file has the wrong format', () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        document.body.innerHTML = NewBillUI();

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        });

        const input = screen.getByTestId('file');
        expect(input).toBeTruthy();

        const file = new File([''], 'fake-file.txt', { type: 'text/plain' });

        userEvent.upload(input, file);

        expect(input.files.length).toBe(1);
        const rFile = input.files[0];

        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
        input.addEventListener('click', handleChangeFile);
        fireEvent.click(input);

        expect(handleChangeFile).toHaveBeenCalled();

        expect(input.files.length).toBe(1);
        expect(input.reportValidity()).not.toBeTruthy();
      });

      test('Then the added file has the right format', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        document.body.innerHTML = NewBillUI();

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        });

        const input = screen.getByTestId('file');
        expect(input).toBeTruthy();

        const file = new File([''], 'fake-file.png', { type: 'image/png' });

        userEvent.upload(input, file);

        expect(input.files.length).toBe(1);

        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
        input.addEventListener('click', handleChangeFile);
        fireEvent.click(input);

        expect(handleChangeFile).toHaveBeenCalled();

        expect(input.files[0].type).toBe('image/png');
      });
    });
  });
});

describe('When i am connected as an employee', () => {
  describe('When i am on new bill page', () => {
    describe('When i completed the form', () => {
      test('Then i click on submit button', async () => {
        document.body.innerHTML = '';

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });

        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }));
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        const newBill = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        });
        const submitBtn = screen.getByTestId('submit-button');
        newBillMock();
        expect(submitBtn).toBeTruthy();

        const fileInput = screen.getByTestId('file');
        expect(fileInput).toBeTruthy();

        const file = new File([''], 'test.jpg', { type: 'image/jpg' });

        fireEvent.change(fileInput, {
          target: {files: [file]},
        });

        await waitFor(() => fireEvent.click(submitBtn));
        const text = screen.getByText('Mes notes de frais');
        expect(text).toBeTruthy();
      });
    });
  });
});