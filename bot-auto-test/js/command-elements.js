function getScriptContainer() { return window.document.getElementById('script-window-content'); }
function getButtonsContainer() { return window.document.getElementById('script-window-buttons-command'); }

function buildCommands() {
  commandsModel.commandClasses.forEach(cls => {
    const onClick = () => {
      const cmd = new cls();
      const view = cmd.createView(getScriptContainer());
      commandsModel.append(cmd, view);
    }
    buildCommandButton(cls.readableName, onClick, getButtonsContainer());
  });
}

function buildCommandButton(title, onClick, parent) {
  const btn = window.document.createElement('div');
  btn.classList.add('script-window-tool-btn', title.toLowerCase().replace(/\s/g, '-'));
  btn.innerText = title;
  parent.appendChild(btn);
  btn.onclick = onClick;
}

function buildSystemButtons() {
  const systemContainer = window.document.getElementById('script-window-buttons-system');
  function createBtn(title, onClick) {
    const btn = window.document.createElement('div');
    btn.classList.add('script-window-tool-btn', title.toLowerCase());
    btn.innerText = title;
    systemContainer.appendChild(btn);
    btn.onclick = onClick;
    return btn;
  }

  createBtn('Run', () => { commandsModel.run(); });
  createBtn('Clear', () => { commandsModel.clearCommands(); });
  createBtn('Open', () => {
    const parent = getScriptContainer();
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        commandsModel.fromJsonString(content, parent);
      }
    }
    input.click();
  });
  createBtn('Stop', () => { alert('TODO:') });
  
  const dwnldBtn = createBtn('Download', () => {
    const saveA = window.document.createElement('a');
    let data = commandsModel.toJsonString();
    let fileName = `${(commandsModel.findHeader() || 'TestModel')}.json`;
    saveA.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data)); // ? 
    saveA.setAttribute('download', fileName);
    saveA.click();
  });

  const img = window.document.createElement('img');
  img.setAttribute('src', 'assets/svg/download.svg');
  img.classList.add("ctrl-btn-ico");
  dwnldBtn.appendChild(img);
}
