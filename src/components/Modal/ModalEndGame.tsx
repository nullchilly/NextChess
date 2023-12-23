import { Button, Modal } from "antd";
import { useState } from "react";
import Checkmate from "../icons/Checkmate";
import { useRouter } from "next/navigation";
import Crown from "../icons/Crown";
import { WINNER } from "@/helpers/types";
import Handshake from "../icons/Handshake";

type Props = {
  winner: WINNER;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};  

export default function ModalEndGame({ winner, isOpen, setOpen }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);

  const handleOk = () => {
    router.push("/");
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={isOpen}
        // Taking for granted that user always play as white
        title={
          winner === "black" ? <span> You lost </span> : <span> You won </span>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Review
          </Button>,
          <Button
            key="link"
            type="primary"
            loading={loading}
            onClick={handleOk}
            className="bg-blue-500"
          >
            Home
          </Button>,
        ]}
      >
        <div className="flex flex-col justify-center items-center">
          {winner === "black" ? (
            <>
              <Checkmate />
              <span> Try again next time!</span>
            </>
          ) : winner === "draw" ? (
            <>
              <Handshake /> <span> What a game! </span>
            </>
          ) : (
            <>
              <Crown />
              <span> Congratulations!!! </span>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
