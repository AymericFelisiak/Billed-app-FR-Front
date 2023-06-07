import { ROUTES_PATH } from '../constants/routes.js';
import Logout from './Logout.js';

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const noteBoard = document.querySelector('div[data-testid="icon-window"]');
    if (noteBoard) noteBoard.addEventListener('click', this.handleClickNoteBoard);
    const formNewBill = this.document.querySelector('form[data-testid="form-new-bill"]');
    formNewBill.addEventListener('submit', this.handleSubmit);
    const file = this.document.querySelector('input[data-testid="file"]');
    file.addEventListener('change', this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    this.inputFile = null;
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNoteBoard = () => {
    this.onNavigate(ROUTES_PATH.Bills);
  };

  handleChangeFile = () => {
    const inputField = this.document.querySelector('input[data-testid="file"]');
    const file = inputField.files[0];
    
    if(file) {
      const fileType = file.type;
      const filePath = e.target.value.split(/\\/g);
      const fileName = filePath[filePath.length - 1];

      if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
        inputField.setCustomValidity('');
        this.inputFile = file;
        this.fileName = fileName;
      } else inputField.setCustomValidity('Invalid');
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector('input[data-testid="datepicker"]').value);
    const email = JSON.parse(localStorage.getItem('user')).email;
    const formData = new FormData();
    formData.append('file', this.inputFile);
    formData.append('email', email);
    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({ fileUrl, key }) => {
        this.billId = key;
        this.fileUrl = fileUrl;
        const bill = {
          email,
          type: e.target.querySelector('select[data-testid="expense-type"]').value,
          name: e.target.querySelector('input[data-testid="expense-name"]').value,
          amount: parseInt(e.target.querySelector('input[data-testid="amount"]').value),
          date: e.target.querySelector('input[data-testid="datepicker"]').value,
          vat: e.target.querySelector('input[data-testid="vat"]').value,
          pct: parseInt(e.target.querySelector('input[data-testid="pct"]').value) || 20,
          commentary: e.target.querySelector('textarea[data-testid="commentary"]').value,
          fileUrl: this.fileUrl,
          fileName: this.fileName,
          status: 'pending'
        };
        this.updateBill(bill);
        this.onNavigate(ROUTES_PATH.Bills);
      }).catch(error => console.error(error));
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH.Bills);
        })
        .catch(error => console.error(error));
    }
  };
}
