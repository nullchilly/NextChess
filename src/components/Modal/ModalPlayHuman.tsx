import { Modal, Select, Radio, Card } from "antd";
import HumanTabs from "@/components/Tabs/Human";

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export default function ModalPlayHuman({ isOpen, setOpen }: Props) {
  const handleCancelHumanModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      title={"Play online"}
      open={isOpen}
      onCancel={handleCancelHumanModal}
      footer={null}
    >
      <HumanTabs />
    </Modal>
  );
}
