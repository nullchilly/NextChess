import { Modal, Select, Radio, Card } from "antd";
import type { RadioChangeEvent } from "antd";
import React from "react";
import Black from "@/components/icons/bK";
import White from "@/components/icons/wK";
import Random from "@/components/icons/wbK";
import { ChessVariants, TimeMode } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { httpPostCreateBotGame } from "@/modules/backend-client/httpPostCreateBotGame";
import { tryUntil } from "@/modules/async-utils";
import { httpGetAllGameSlugs } from "@/modules/backend-client/httpGetAllGameSlugs";

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

// TODO: Fetch these from DB?
const allVariants = [
  {
    value: 1,
    label: ChessVariants.STANDARD,
  },
  {
    value: 2,
    label: ChessVariants.CHESS960,
  },
];

const timeOptions = [
  {
    value: 0,
    label: TimeMode.UNLIMITED,
  },
  {
    value: 3,
    label: TimeMode.ThreeMins,
  },
  {
    value: 5,
    label: TimeMode.FiveMins,
  },
  {
    value: 7,
    label: TimeMode.SevenMins,
  },
];

export default function ModalPlayBot({ isOpen, setOpen }: Props) {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [strength, setStrength] = React.useState<number>(3);
  const [variant, setVariant] = React.useState<number>(1);
  const [timeMode, setTimeMode] = React.useState<number>(0);
  const router = useRouter();

  const stockfishStrength = Array.from({ length: 8 }, (v, i) => i + 1);

  const handleCancelBotModal = () => {
    setOpen(false);
  };

  const waitUntilSlugIndexed = async (slug: string) => {
    await tryUntil({
      run: () => httpGetAllGameSlugs(),
      until: (response) => response.includes(slug),
    });
  };

  const handleOKBotModal = async () => {
    setConfirmLoading(true);

    const createBotGameRes = await httpPostCreateBotGame({
      strength,
      variant,
      timeMode,
    });
    const slug = createBotGameRes.slug;
    console.log("HELO: ", createBotGameRes.slug);

    // Check game is added to db, then route...
    await waitUntilSlugIndexed(slug).then((cause) => {
      console.error("Can't index game slug: ", cause);
    });

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      router.push(`/computer/${slug}`);
    }, 3000);
  };

  const selectStrength = ({ target: { value } }: RadioChangeEvent) => {
    setStrength(value);
  };

  const selectVariant = (value: number) => {
    setVariant(value);
  };

  const selectTimeMode = (value: TimeMode) => {
    if (value === TimeMode.UNLIMITED) setTimeMode(0);
    else {
      setTimeMode(Number(value));
    }
  };

  return (
    <Modal
      title={"Play vs Stockfish"}
      open={isOpen}
      onCancel={handleCancelBotModal}
      onOk={handleOKBotModal}
      okButtonProps={{ className: "!bg-blue-500" }}
      okText="Start Game"
      confirmLoading={confirmLoading}
    >
      <div className="flex flex-col gap-4 items-center center">
        <div className="flex justify-center center gap-4 items-center">
          <span className="font-bold">Variant</span>
          <Select
            defaultValue={1}
            options={allVariants}
            style={{ width: 120 }}
            onChange={selectVariant}
          />
        </div>
        <div className="flex justify-center center gap-4 items-center">
          <span className="font-bold">Time Control</span>
          <Select
            defaultValue={TimeMode.UNLIMITED}
            options={timeOptions}
            style={{ width: 120, marginRight: "37px" }}
            onChange={selectTimeMode}
          />
        </div>
        <div className="flex flex-col justify-center center items-center gap-4">
          <span className="font-bold"> Strength </span>
          <Radio.Group
            options={stockfishStrength}
            value={strength}
            optionType="button"
            onChange={selectStrength}
          />
        </div>
        <div className="flex flex-col justify-center center items-center gap-4">
          <span className="font-bold"> Start with </span>
          <Radio.Group className="flex flex-row gap-4">
            <Radio.Button value="a" className="w-fit h-fit py-2">
              <Black />
            </Radio.Button>
            <Radio.Button value="b" className="w-fit h-fit py-2">
              <Random className="ml-3" />
            </Radio.Button>
            <Radio.Button value="c" className="w-fit h-fit py-2">
              <White />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
}
