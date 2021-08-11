function displayTitle(name) {
  var catTitle = document.createElement('div');
  catTitle.classList.add('top-title');
  catTitle.innerText = name;
  document.getElementById('cat-title').appendChild(catTitle);
}

function createMenu() {
  [
    { name: 'DIRECT IVR OPT', section: 'direct-ivr-agent-opt' },
    // { name: 'DEV Home Page', section: 'site-gs-dev-homepage' },
    // { name: 'DEV Kitchen', section: 'site-gs-dev-kitchen' },
    // { name: 'STG Home Page', section: 'site-gs-stg-homepage' },
    // { name: 'STG Kitchen', section: 'site-gs-stg-kitchen' },
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

