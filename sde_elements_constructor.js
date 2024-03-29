function createValidator(errorMessage, ...validateFns) {
  return function(value) {
    if (!!validateFns.find(fn => fn(value))) return { valid: true, error: null };
    return { valid: false, error: errorMessage };
  }
}

const validators = {
  any: createValidator('', () => true),
  numberOrEmpty: createValidator('The value has to be either number or empty', v => /^\d+$/.test(v) || v === ''),
  zipOrEmpty: createValidator('The value has to be either 5 digit zip or empty', v => /^\d{5}$/.test(v) || v === ''),
  ctype: createValidator('The value has to be uppercase abbreviation', v => /^[A-Z]+$/.test(v) || v === ''),
}

const attributes = [
  { id: 'onmiItemId', title: 'Omni Item ID', validator: validators.numberOrEmpty },
  { id: 'itemNumber', title: 'Item Number', validator: validators.numberOrEmpty },
  { id: 'itemModel', title: 'Item Model', validator: validators.any },
  { id: 'vendorNumber', title: 'Vendor Number', validator: validators.any },
  { id: 'zip', title: 'ZIP Code', validator: validators.zipOrEmpty },
  { id: 'storeId', title: 'Store ID', validator: validators.numberOrEmpty },
  { id: 'storeName', title: 'Store Name', validator: validators.any },
  { id: 'ctype', title: 'Cust. Type', validator: validators.ctype },
  { id: 'firstName', title: 'First Name', validator: validators.any },
  { id: 'email', title: 'E-mail', validator: validators.any },
];

function createSDEInputRow(attrItem, parent) {
  const row = window.document.createElement('div');
  row.classList.add('row');
  
  const titleCell = window.document.createElement('div');
  titleCell.classList.add('cell');
  titleCell.classList.add('sde-input-title');
  titleCell.innerText = attrItem.title;

  const inputCell = window.document.createElement('div');
  inputCell.classList.add('cell');
  inputCell.classList.add('sde-input-cell');
  
  const input = window.document.createElement('input');
  input.type = 'text';
  input.name = attrItem.id;
  input.value = '';
  input.placeholder = '';
  input.classList.add('textInput');
  input.id = attrItem.id;
  input.addEventListener('focusout', validateInputs);
  input.addEventListener('keypress', event => { if (event.code === 'Enter') sendSDEs(); });
  
  parent.appendChild(row);
  row.appendChild(titleCell);
  row.appendChild(inputCell);
  inputCell.appendChild(input)
}

function createSDEButtons(parent) {
  const row = window.document.createElement('div');
  row.classList.add('row');
  
  const emptyCell = window.document.createElement('div');
  emptyCell.classList.add('cell');

  const buttonCell = window.document.createElement('div');
  buttonCell.classList.add('sde-set-button-cell');
  
  parent.appendChild(row);
  row.appendChild(emptyCell);
  row.appendChild(buttonCell);

  createSDESetButtonRow(buttonCell);
  createSDECopyButtonRow(buttonCell);
}

function createSDESetButtonRow(parent) {
  const button = window.document.createElement('button');
  button.innerText = 'Set SDEs';
  button.classList.add('sde-set-button');
  button.classList.add('sde-button');
  button.id = 'sde-set-button';
  button.onclick = () => { sendSDEs(); };
  
  parent.appendChild(button);
}

function createSDECopyButtonRow(parent) {
  const textarea =  window.document.createElement('textarea');
  textarea.name = 'clipboard';
  textarea.classList.add('sde-clipboard');
  textarea.id = 'sde-clipboard';

  const button = window.document.createElement('button');
  button.innerText = 'Code';
  button.classList.add('sde-copy-button');
  button.classList.add('sde-button');
  button.id = 'sde-copy-button';
  button.onclick = () => { copySDEsCode(textarea); };
  
  parent.appendChild(textarea);
  parent.appendChild(button);
}

function createSDEInputTable() {
  const parent = window.document.getElementById('sde-container-form');
  const table = window.document.createElement('div');
  table.id = 'sde-form'
  table.classList.add('table');
  parent.appendChild(table);

  attributes.forEach(a => { console.log(`create input for ${a.title}(${a.id});`); createSDEInputRow(a, table); });
  createSDEButtons(table);
}

function validateInputs() {
  const setButton = window.document.getElementById('sde-set-button');
  const copyButton = window.document.getElementById('sde-copy-button');
  let isValid = true;
  attributes.forEach(a => {
    const input = window.document.getElementById(a.id);
    const check = a.validator(input.value);
    isValid = isValid && check.valid;
    if (!check.valid) {
      input.classList.add('input-validation-error');
    } else {
      input.classList.remove('input-validation-error');
    }
  });
  setButton.disabled = !isValid;
  copyButton.disabled = !isValid;
  return isValid;
}

function getInputValue(id) { return window.document.getElementById(id).value; }

function readAndConvertSDEs() {
  const valid = validateInputs();
  if (!valid) return { valid };
  return {
    valid, 
    product: {
      title: 'ANY', // getInputValue(),
      price: 100.21, // getInputValue(),
      onmiItemId: getInputValue('onmiItemId'),
      itemNumber: getInputValue('itemNumber'),
      itemModel: getInputValue('itemModel'),
      vendorNumber: getInputValue('vendorNumber'),
    }, 
    store: {
      id: getInputValue('storeId'),
      title: getInputValue('storeName'),
      zip: getInputValue('zip'),
    },
    user: {
      ctype: getInputValue('ctype'),
      email: getInputValue('email'),
      firstName: getInputValue('firstName'),
    }
  }
}

function sendSDEs() {
  const { valid, product, store, user } = readAndConvertSDEs();
  console.log({ valid, product, store, user });
  if (valid) {
    const personal = {
      firstname: user.firstName,
      // lastname:"-",
      contacts:[
        {
          // phone:"-",
          email: user.email
        }
      ],
      // company:"-"
    };
    const ctmrinfo = {
      socialId: store.zip,
      imei: product.onmiItemId, 
      ctype: user.ctype,
      companySize: store.id,
      userName: store.title,
    };
    const products = [{
      product: {
        name: product.title,
        sku: `${product.itemNumber}-${product.vendorNumber}-${product.itemModel}`,  //PRODUCT SKU (PRODUCT_ID-VENDOR_NUMBER-MODEL_ID)
        price: product.price
      }
    }]
    console.log('personal', personal);
    console.log('ctmrinfo', ctmrinfo);
    console.log('products', products);
    lpTag.sdes.reset();
    lpTag.sdes.init();
    lpTag.sdes.send({ type: 'personal', personal });
    lpTag.sdes.send({ type: 'ctmrinfo', info: ctmrinfo });
    lpTag.sdes.send({ type: 'prodView', products });
    showSaved();
  }
}

function copySDEsCode(textarea) {
  const { valid, product, store, user } = readAndConvertSDEs();
  const value = !valid ? '' : [
    `(() => {`,
    `  lpTag.sdes.reset();`,
    `  lpTag.sdes.init();`,
    `  lpTag.sdes.send({`,
    `    type: 'personal',`,
    `    personal: {`,
    `    firstname: ${user.firstName}`,
    `      contacts: [{`,
    `        email: "${user.email}", `,
    `      }], `,
    `    }`,
    `  });`,
    `  lpTag.sdes.send({`,
    `    type: 'ctmrinfo', // MANDATORY`,
    `    info: {`,
    `      socialId: "${store.zip}",`,
    `      imei: "${product.onmiItemId}", `,
    `      ctype: "${user.ctype}", `,
    `      companySize: "${store.id}", `,
    `      userName: "${store.title}", `,
    `    }`,
    `  });`,
    `  lpTag.sdes.send({`,
    `    type: 'prodView', // MANDATORY`,
    `    products: [{`,
    `      product: {`,
    `        name: "${product.title}",`,
    `        sku: "${product.itemNumber}-${product.vendorNumber}-${product.itemModel}",  //PRODUCT SKU (PRODUCT_ID-VENDOR_NUMBER-MODEL_ID)`,
    `        price: "${product.price}"`,
    `      }`,
    `    }]`,
    `  });`,
    `})();`].join('\n');
  textarea.select();
  // textarea.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(value);
  if (valid) showCopied();
}

function faceInOut(popup) {
  popup.style.display = 'block';
  setTimeout(() => { popup.style.opacity = 1; }, 100);
  setTimeout(() => { popup.style.opacity = 0; }, 900);
  setTimeout(() => { popup.style.display = 'none' }, 1200);
}

function showSaved() {
  faceInOut(document.getElementById('popup-container-saved'));
}

function showCopied() {
  faceInOut(document.getElementById('popup-container-copied'));
}
