const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll('.page')

const selectBtn = document.querySelector('.managers__select-btn') 
const selectTitle = document.querySelector('.managers__select-title')
const managerPlus = document.querySelector('.managers__btn-add')




const svgNS = "http://www.w3.org/2000/svg";
const iconCodes = {
  managers: [0xf105, 0xf106],
  resume: [0xf103, 0xf104],
  companies: [0xf10b, 0xf10c],
  import: [0xf109, 0xf10a],
  ads: [0xf10d, 0xf10e],
  letters: [0xf107, 0xf108],
  settings: [0xf101, 0xf102],
};
const navTextWidths = {
  managers: 236,
  resume: 78,
  companies: 104,
  import: 72,
  ads: 138,
  letters: 145,
  settings: 180,
};

function createSvgText(text, options = {}) {
  const svg = document.createElementNS(svgNS, "svg");
  const label = document.createElementNS(svgNS, "text");
  const width = options.width || 260;
  const height = options.height || 30;
  const fontSize = options.size || 20;

  svg.classList.add("svg-label");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
  svg.setAttribute("aria-hidden", "true");
  svg.style.overflow = "visible";

  label.setAttribute("x", options.x || 0);
  label.setAttribute("y", options.y || Math.round(fontSize * 0.82));
  if (options.anchor) {
    label.setAttribute("text-anchor", options.anchor);
  }
  label.setAttribute("fill", options.color || "currentColor");
  label.setAttribute("font-family", options.family || "Roboto, Arial, sans-serif");
  label.setAttribute("font-size", fontSize);
  label.setAttribute("font-weight", options.weight || 300);
  label.textContent = text;
  svg.append(label);

  return svg;
}

function renderElementText(element, options = {}) {
  const text = options.text || element.dataset.text || element.textContent.trim();
  element.dataset.text = text;
  element.setAttribute("aria-label", text);
  element.textContent = "";
  element.append(createSvgText(text, options));
}

function renderIcon(link, hovered = false) {
  const icon = link.querySelector(".icon");
  const tab = link.dataset.tab;

  if (!icon || !iconCodes[tab]) {
    return;
  }

  icon.textContent = "";
  icon.append(createSvgText(String.fromCharCode(iconCodes[tab][hovered ? 1 : 0]), {
    family: "vsevn-icons",
    size: 34,
    width: 44,
    height: 44,
    x: 22,
    y: 40,
    anchor: "middle",
  }));
}

function renderNavText(link) {
  const text = link.querySelector(".nav-text");

  if (!text) {
    return;
  }

  renderElementText(text, {
    size: 20,
    width: navTextWidths[link.dataset.tab] || 180,
    height: 24,
    y: 18,
    weight: link.classList.contains("active") ? 400 : 300,
  });
}

function renderStaticText() {
  navLinks.forEach((link) => {
    renderIcon(link);
    renderNavText(link);
  });
}



renderStaticText();



const pagesContainer = document.querySelector('.static-stage');

const originalPagesHTML = Array.from(document.querySelectorAll('.page')).map(page => {
  return {
    id: page.id,
    html: page.outerHTML
  };
}); 



navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');

    const currentTab = link.dataset.tab;

    document.querySelectorAll('.page').forEach(page => page.remove());

    const target = originalPagesHTML.find(p => p.id === currentTab);
    if (target) {
      pagesContainer.insertAdjacentHTML('beforeend', target.html);
      const newPage = document.getElementById(currentTab);
      if (newPage) newPage.style.display = 'block';

      pageInits[currentTab]?.();
    }
  });
});


const pageInits = {
  managers: initManagers,
  import: initPage,
};

function initManagers() {
  const selectBtn = document.querySelector('.managers__select-btn');
  const selectTitle = document.querySelector('.managers__select-title');
  const selectDelete = document.querySelector('.managers__select-delete');
  const managerPlus = document.querySelector('.managers__btn-add');
  const selectBlock = document.querySelector('.select');
  const managersTbody = document.querySelector('.managers__tbody');
  const managerInputEmail = document.getElementById('managers__input-email');
  const managerInputPrefix = document.getElementById('managers__input-prefix');
  const buttonBlock = document.querySelector('.button__block');

  // Объявляем здесь — на уровне функции
  const existingRows = managersTbody.querySelectorAll('.managers__stroke');
  let IDmanager = existingRows.length;
  let NumManager = existingRows.length;

  function sortSelectItems() {
    const items = Array.from(selectBlock.querySelectorAll('.select__item'));
    items.sort((a, b) => {
      const isLatinA = /^[A-Za-z]/.test(a.textContent.trim());
      const isLatinB = /^[A-Za-z]/.test(b.textContent.trim());
      if (isLatinA && !isLatinB) return -1;
      if (!isLatinA && isLatinB) return 1;
      return 0;
    });
    items.forEach(item => selectBlock.appendChild(item));
  } 

  sortSelectItems();

  if (existingRows.length > 0) {
    buttonBlock.style.display = 'flex';
  }

  selectBtn.addEventListener('click', (e) => {
    selectTitle.classList.toggle('arrow-active');
    selectBlock.classList.toggle('select-active');
    selectBtn.classList.toggle('select-open');

    if (selectBlock.classList.contains('select-active')) {
    setTimeout(() => {
      const rect = selectBlock.getBoundingClientRect();
      const bottomOfSelect = rect.bottom + window.scrollY;
      window.scrollTo({ top: bottomOfSelect - window.innerHeight + 20, behavior: 'smooth' });
    }, 0);
  }
    document.addEventListener('click', (e) => {
      const isInside = e.target.closest('.managers__select');
      if (!isInside) {
        selectBlock.classList.remove('select-active');
        selectTitle.classList.remove('arrow-active');
        selectBtn.classList.remove('select-open');
      }
    });
  });

  managerPlus.addEventListener('click', () => {
    if (!managerInputEmail.value || !managerInputPrefix.value) return;

    IDmanager += 1;
    NumManager += 1;
    buttonBlock.style.display = 'flex';

    const managerArray = [NumManager, IDmanager, managerInputEmail.value, managerInputPrefix.value];
    

    managerInputEmail.value = ''
    managerInputPrefix.value = ''
    managersTbody.insertAdjacentHTML(
      'beforeend',
      `<tr class="managers__stroke" data-id="${IDmanager}">
        <td class="managers__table-n">${managerArray[0]}</td>
        <td class="managers__table-id">${managerArray[1]}</td>
        <td class="managers__table-email">${managerArray[2]}</td>
        <td class="managers__table-prefix">${managerArray[3]}</td>
        <td>
          <button class="managers__btn-delete">
            <span></span>
          </button>
        </td>
      </tr>`
    );

    selectBlock.insertAdjacentHTML(
      'beforeend',
      `<p class="select__item" data-id="${IDmanager}">${managerArray[3]}</p>`
    );
    sortSelectItems();
  });

  selectBlock.addEventListener('click', (e) => {
    const item = e.target.closest('.select__item');
    if (!item) return;

    // Сбрасываем стили у всех пунктов
    selectBlock.querySelectorAll('.select__item').forEach(el => {
      el.style.background = '';
      el.style.color = '';
    });

    // Применяем стили к выбранному
    item.style.background = '#F6FBFF';
    item.style.color = '#0087FC';
    selectBtn.classList.remove('select-open');

    selectTitle.textContent = item.textContent;
    selectTitle.classList.add('select__title-active');
    selectBlock.classList.remove('select-active');
    selectTitle.classList.remove('arrow-active');
    selectDelete.style.display = 'flex';
  });

    selectDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTitle.textContent = 'ВЫБРАТЬ МЕНЕДЖЕРА';
      selectTitle.classList.remove('select__title-active');
      selectDelete.style.display = 'none';

      // Сбрасываем подсветку
      selectBlock.querySelectorAll('.select__item').forEach(el => {
        el.style.background = '';
        el.style.color = '';
      });
    });
         
  managersTbody.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.managers__btn-delete');
    if (!deleteBtn) return;

    const row = deleteBtn.closest('tr');
    const rowPrefix = row.querySelector('.managers__table-prefix').textContent.trim();

    selectBlock.querySelectorAll('.select__item').forEach(item => {
      if (item.textContent.trim() === rowPrefix) item.remove();
    });

    sortSelectItems();

    if (selectTitle.textContent.trim() === rowPrefix) {
      selectTitle.textContent = 'ВЫБРАТЬ МЕНЕДЖЕРА';
      selectTitle.classList.remove('select__title-active');
      selectDelete.style.display = 'none';
    }

    row.remove();
    NumManager -= 1;

    managersTbody.querySelectorAll('.managers__stroke').forEach((tr, index) => {
      tr.querySelector('.managers__table-n').textContent = index + 1;
    });

    if (NumManager === 0) {
      buttonBlock.style.display = 'none';
    }
  });
}

function initPage() {
  const fileInput = document.querySelector("#file-input");
  const filePath = document.querySelector("#file-path");
  const submitButton = document.querySelector(".submit-btn");
}

const activeLink = document.querySelector('.nav-link.active');
if (activeLink) {
  const currentTab = activeLink.dataset.tab;
  const currentPage = document.getElementById(currentTab);
  if (currentPage) { 
    currentPage.style.display = 'block';
  }
  pageInits[currentTab]?.();
}

