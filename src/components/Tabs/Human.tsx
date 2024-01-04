"use client";
import { UserContext } from "@/context/UserContext";
import { tryUntil } from "@/modules/async-utils";
import { httpGetAllGameSlugs } from "@/modules/backend-client/httpGetAllGameSlugs";
import { httpPostCreateHumanGame } from "@/modules/backend-client/httpPostCreateHumanGame";
import { useRouter } from "next/navigation";

import { Tabs, Button, Space, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import { SearchProps } from "antd/es/input/Search";
import { InputStatus } from "antd/es/_util/statusUtils";

const { Search } = Input;

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
        <Button
          onClick={onClickCreateNewGame}
          className="font-bold"
          loading={loading}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

const JoinGame = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputStatus, setInputStatus] = useState<InputStatus>("");
  const [allSlugs, setAllSlugs] = useState<string[]>([]);
  const [addOn, setAddOn] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const ISSERVER = typeof window === "undefined";
    try {
      if (!ISSERVER) {
        setAddOn(window.location.href + "/human/");
      }
    } catch (error) {
      console.error("Can't parse game config: ", error, ISSERVER);
    }
    async function fetchAllSlugs() {
      const allSlugs = await httpGetAllGameSlugs();
      setAllSlugs(allSlugs);
    }
    fetchAllSlugs();
  }, []);

  const onSearch: SearchProps["onSearch"] = async (value) => {
    setIsLoading(true);
    setInputStatus("");
    // TODO: Refine this, send game id to BE to check?
    if (allSlugs.includes(value)) {
      router.push(`/human/${value}`);
    } else {
      setInputStatus("error");
    }
    setIsLoading(false);
  };

  const AddOn = () => {
    let text = addOn;
    if (text.length > 40) {
      text = addOn.substring(0, 19) + "..." + "human/";
    }
    return (
      <p
        style={{
          whiteSpace: "nowrap",
          width: "100%",
          overflow: "hidden",
          textOverflow: "clip ellipsis clip 0 1ch",
        }}
      >
        {text}
      </p>
    );
  };

  return (
    <Space direction="vertical" size="middle">
      {!isLoading && inputStatus !== "" && (
        <span className="text-red-400">
          {" "}
          Could not found your game ID, please try again{" "}
        </span>
      )}
      <Space.Compact>
        <Search
          addonBefore={<AddOn />}
          placeholder="Your game id"
          allowClear={false}
          onSearch={onSearch}
          loading={isLoading}
          status={inputStatus}
          onChange={() => setInputStatus("")}
        />
      </Space.Compact>
    </Space>
  );
};
