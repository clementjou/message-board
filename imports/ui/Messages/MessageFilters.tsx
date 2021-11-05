import { Button, Dropdown, Switch } from "antd";
import Text from "antd/lib/typography/Text";
import * as React from "react";

interface IMessageFiltersProps {
  showOnlyMyMessages: boolean;
  setShowOnlyMyMessages: (val: boolean) => void;
  hideMyMessages: boolean;
  setHideMyMessages: (val: boolean) => void;
}

export const MessageFilters = (props: IMessageFiltersProps) => {
  const {
    showOnlyMyMessages,
    hideMyMessages,
    setShowOnlyMyMessages,
    setHideMyMessages,
  } = props;

  const filters = (
    <div className="filters">
      <div className="filter-item">
        <Text strong>Hide my messages</Text>
        <Switch
          onChange={(val) => {
            setHideMyMessages(val);
            if (val && showOnlyMyMessages) {
              setShowOnlyMyMessages(false);
            }
          }}
          checked={hideMyMessages}
        />
      </div>
      <div className="filter-item">
        <Text strong>Show only my messages</Text>
        <Switch
          onChange={(val) => {
            setShowOnlyMyMessages(val);
            if (val && hideMyMessages) {
              setHideMyMessages(false);
            }
          }}
          checked={showOnlyMyMessages}
        />
      </div>
    </div>
  );
  return (
    <Dropdown overlay={filters} arrow trigger={["click"]}>
      <Button>Show filters</Button>
    </Dropdown>
  );
};
