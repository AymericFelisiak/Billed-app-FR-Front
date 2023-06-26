/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, wait, waitFor } from '@testing-library/dom';
import { localStorageMock } from '../__mocks__/localStorage.js';
import NewBill from '../containers/NewBill.js';
import router from '../app/Router.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import userEvent from '@testing-library/user-event';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
    });

    test('Then form should show up', () => {
      const form = screen.getByTestId('form-new-bill');
      expect(form).toBeTruthy();
    });

    describe('When i click on first icon in the Sidebar', () => {
      test('Then i should go back to Bills page', () => {
        
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }
    
        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage
        });
    
        const iconWindow = screen.getByTestId('icon-window');
        expect(iconWindow).toBeTruthy();
        
        const handleClickNoteBoard = jest.fn(() => newBill.handleClickNoteBoard());
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

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage
        });
  
        const input = screen.getByTestId('file');
        expect(input).toBeTruthy();
        
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile());
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

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage
        });
  
        const input = screen.getByTestId('file');
        expect(input).toBeTruthy();

        const file = new File([''], 'fake-file.txt', {type: 'text/plain'});

        userEvent.upload(input, file);
        
        expect(input.files.length).toBe(1);
        expect(input.reportValidity()).not.toBeTruthy();
      });

      test('Then the added file has the right format', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage
        });
  
        const input = screen.getByTestId('file');
        expect(input).toBeTruthy();

        const file = new File([''], 'fake-file.png', {type: 'image/png'});

        userEvent.upload(input, file);
        
        expect(input.files.length).toBe(1);
        const rFile = input.files[0];

        const handleChangeFile = jest.fn(() => newBill.handleChangeFile());
        input.addEventListener('click', handleChangeFile);
        fireEvent.click(input);

        expect(handleChangeFile).toHaveBeenCalled();

        expect(rFile.type).toBe('image/png');
      });
    });
  });
});
