import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TabSwitcherProps {
  tabs: string[];
  children: ReactNode[];
}

export const TabSwitcher = ({ tabs, children }: TabSwitcherProps) => {
  return (
    <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
      <TabList bg="var(--background-medium)" p={2} borderRadius="lg">
        {tabs.map((tab, index) => (
          <Tab
          color="var(--primary)" 
            key={index}
            _selected={{ color: "var(--primary)", bg: "var(--background-light)" }}
          >
            {tab}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {children.map((child, index) => (
          <TabPanel key={index} p={4}>
            {child}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
