export function newBillMock() {
    const type = document.querySelector('select[data-testid="expense-type"]');
    const name = document.querySelector('input[data-testid="expense-name"]');
    const amount = document.querySelector('input[data-testid="amount"]');
    const date = document.querySelector('input[data-testid="datepicker"]');
    const vat = document.querySelector('input[data-testid="vat"]');
    const pct = document.querySelector('input[data-testid="pct"]');
    const commentary = document.querySelector('textarea[data-testid="commentary"]');

    type.value = 'Hôtel et logement';
    name.value = 'New Bill Test';
    amount.value = 100;
    date.value = '2004-04-04';
    vat.value = '80';
    pct.value = 20;
    commentary.value = 'New Bill Test';
}