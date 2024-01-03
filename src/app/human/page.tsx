// Subject to change

import { Tabs } from "antd";

export default function HumanGame() {
  return (
    <Tabs
      defaultActiveKey="1"
      size="middle"
      style={{ marginBottom: 32 }}
      items={new Array(2).fill(null).map((_, i) => {
        const id = i + 1;
        return {
          label: id === 1 ? "Create game" : "Join game",
          key: String(id),
          children: <TabItems id={id} />,
        };
      })}
    ></Tabs>
  );
}

type TabProps = {
  id: number;
};

function TabItems({ id }: TabProps) {
  return id === 1 ? <NewGame /> : <JoinGame />
}

const NewGame = () => {
  return <div>Create new game</div>;
};

const JoinGame = () => {
  return <div>Join game via link</div>;
};
