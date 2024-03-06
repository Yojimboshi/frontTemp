import { useState } from "react";
import NumberGame from "../home/GuessingGame";
import NumberGame2 from "../home/CardGame";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
const NumberGameTab = () => {
  const [itemActive, setItemActive] = useState(1);
  const tabItem = [
    {
      id: 1,
      text: "Guess the Number",
    },
    {
      id: 2,
      text: "Risk of Chance",
    },
  ];


  return (
    <section className="relative lg:mt-24 lg:pb-24 mt-24 pt-10 pb-24">
          <Tabs className="tabs">
      <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
        {tabItem.map(({ id, text, icon }) => {
          return (
            <Tab
              className="nav-item"
              role="presentation"
              key={id}
              onClick={() => setItemActive(id)}
            >
              <button
                className={
                  itemActive === id
                    ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                    : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                }
              >
                <svg className="icon mr-1 h-5 w-5 fill-current">
                  <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                </svg>
                <span className="font-display text-base font-medium">
                  {text}
                </span>
              </button>
            </Tab>
          );
        })}
      </TabList>

      <TabPanel index={1}>
        <div>
          <NumberGame />
        </div>
      </TabPanel>
      
      <TabPanel index={2}>
        <div>
          <NumberGame2 />
        </div>
      </TabPanel>
    </Tabs>
    </section>

  );
}

export default NumberGameTab;