export function newBillMock() {
    const type = document.querySelector('select[data-testid="expense-type"]');
    const name = document.querySelector('select[data-testid="expense-type"]');
    const amount = document.querySelector('select[data-testid="expense-type"]');
    const date = document.querySelector('select[data-testid="expense-type"]');
    const vat = document.querySelector('select[data-testid="expense-type"]');
    const pct = document.querySelector('select[data-testid="expense-type"]');
    const commentary = document.querySelector('select[data-testid="expense-type"]');

    type.value = 'Hôtel et logement';
    name.value = 'New Bill Test';
    amount.value = 100;
    date.value = '2004-04-04';
    vat.value = '80';
    pct.value = 20;
    commentary.value = 'New Bill Test';
}