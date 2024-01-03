"use client";
import { UserContext } from "@/context/UserContext";
import { tryUntil } from "@/modules/async-utils";
import { httpGetAllGameSlugs } from "@/modules/backend-client/httpGetAllGameSlugs";
import { httpPostCreateHumanGame } from "@/modules/backend-client/httpPostCreateHumanGame";
import { useRouter } from "next/navigation";

import { Tabs, Button } from "antd";
import { useContext, useState } from "react";

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
  return id === 1 ? <NewGame /> : <JoinGame />;
}

const NewGame = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { userId } = useContext(UserContext);
  const router = useRouter();

  const waitUntilSlugIndexed = async (slug: string) => {
    await tryUntil({
      run: () => httpGetAllGameSlugs(),
      until: (response) => response.includes(slug),
    });
  };

  const onClickCreateNewGame = async () => {
    setLoading(true);

    if (Number.isInteger(userId)) {

      
      const createGameResponse = await httpPostCreateHumanGame({
        userId: userId ?? 0,
      });
      const slug = createGameResponse.slug;
      // Check game is added to db, then route...
      await waitUntilSlugIndexed(slug).then((cause) => {
        console.error("Can't index game slug: ", cause);
      });
      console.log("Human slug: ", slug);
      router.push(`/human/${slug}`);
    } else {
      alert("Can't find your user id, please login first");
    }

    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-3">
      <span> Create new online game </span>
      <div>
        <Button onClick={onClickCreateNewGame} className="font-bold" loading={loading}>
          Create
        </Button>
      </div>
    </div>
  );
};

const JoinGame = () => {
  return <div>Join game via link</div>;
};
