function displayTitle(name) {
  var catTitle = document.createElement('div');
  catTitle.classList.add('top-title');
  catTitle.innerText = name;
  document.getElementById('cat-title').appendChild(catTitle);
}

function createMenu() {
  [
    { name: 'DEV Home Page', section: 'site-gs-dev-homepage' },
    { name: 'DEV Kitchen', section: 'site-gs-dev-kitchen' },
    { name: 'STG Home Page', section: 'site-gs-stg-homepage' },
    { name: 'STG Kitchen', section: 'site-gs-stg-kitchen' },
    { name: 'DEV SMS Home', section: 'site-gs-dev-sms-homepage' },
    { name: 'STG SMS Home', section: 'site-gs-stg-sms-homepage' },
    { name: 'STG ABC Pro-Loyalty', section: 'abc-gs-stg-pro-loyalty' },
    { name: 'STG SMS Pro-Loyalty', section: 'sms-gs-stg-pro-loyalty' },
    { name: 'DEV PRICE MATCH', section: 'site-gs-dev-price-promise' },
  ].forEach(function(cat) {
    var aTag = document.createElement('a');
    aTag.setAttribute('href', '?section=' + cat.section);
    aTag.setAttribute('id', 'category-btn-' + cat.section);
    if (section === cat.section) {
      aTag.classList.add('active');
      displayTitle(cat.name);
    }
    aTag.innerText = cat.name;
    document.getElementById('top-menu').appendChild(aTag)
  });
};

