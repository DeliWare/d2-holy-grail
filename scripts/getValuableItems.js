/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const fetch = require('node-fetch');

const getValueableItems = async () => {
  const response = await fetch('https://d2.maxroll.gg/items/valuable-unique-set-items');
  const html = await response.text();
  const dom = new jsdom.JSDOM(html);
  const rows = dom.window.document.querySelectorAll('.d2planner-item-table tr');

  const items = [...rows].reduce((items, row) => {
    const cells = row.querySelectorAll('td');

    const key = cells[0].querySelector('span')?.dataset.d2plannerId;

    if (key) {
      const name = cells[0].textContent;
      const value = cells[1].textContent;
      const details = cells[2].innerHTML.replaceAll('href="', 'href="https://d2.maxroll.gg');
      const statPriority = cells[3].innerHTML;

      // [{
      //   "key": "unique381",
      //   "name": "Annihilus",
      //   "value": "High",
      //   "details": "Used on every build<br>The only Unique Small Charm",
      //   "statPriority": "+x to all Attributes<br>All Resistances +x<br>+x% to Experience Gained"
      // }]

      items.push({
        key,
        name,
        value,
        details,
        statPriority: statPriority === '-' ? null : statPriority
      });
    }

    return items;
  }, []);

  if (items.length) {
    fs.writeFileSync(path.join(__dirname, './data/valuableItems.json'), JSON.stringify(items));
    console.log(`Success. Scraped value of ${items.length} items.`);
  } else {
    console.log(`Failure. Scraped value of ${items.length} items.`);
  }
};

getValueableItems();
