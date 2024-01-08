"use client";
import React, { useContext } from "react";
import { Card, Col, Row } from "antd";
import PlayBotPoster from "@/components/icons/PlayBotPoster";
import PlayHumanPoster from "@/components/icons/PlayHumanPoster";
import PlayPuzzlePoster from "@/components/icons/PlayPuzzlePoster";
import ModalPlayBot from "@/components/Modal/ModalPlayBot";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import ModalPlayHuman from "@/components/Modal/ModalPlayHuman";

const Home = () => {
  const [isModalPlayBotOpen, setIsModalPlayBotOpen] = React.useState(false);
  const [isModalPlayHumanOpen, setIsModalPlayHumanOpen] = React.useState(false);
  const router = useRouter();
  const { accessToken } = useContext(UserContext);
  return (
    <>
      <div className="px-16 mt-8 flex flex-col gap-4">
        <h1 className="text-white text-3xl font-bold font-['Haptic']">
          {" "}
          Play Chess{" "}
        </h1>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                hoverable
                bordered={false}
                className="bg-[#477330] text-center"
                cover={<PlayBotPoster />}
                bodyStyle={{
                  borderTop: "1px solid white",
                  color: "white",
                  fontFamily: "Haptic",
                  fontSize: "18px",
                }}
                onClick={() => {
                  setIsModalPlayBotOpen(true);
                }}
              >
                Play vs Bot
              </Card>
              <ModalPlayBot
                isOpen={isModalPlayBotOpen}
                setOpen={setIsModalPlayBotOpen}
              />
            </Col>
            <Col span={8}>
              <Card
                hoverable
                bordered={false}
                className="bg-[#477330] text-center"
                cover={<PlayHumanPoster />}
                bodyStyle={{
                  borderTop: "1px solid white",
                  color: "white",
                  fontFamily: "Haptic",
                  fontSize: "18px",
                }}
                onClick={() => accessToken ? setIsModalPlayHumanOpen(true) : router.push("/login")}
              >
                Play vs Human
              </Card>
              <ModalPlayHuman
                isOpen={isModalPlayHumanOpen}
                setOpen={setIsModalPlayHumanOpen}
              />
            </Col>
            <Col span={8}>
              <Card
                hoverable
                bordered={false}
                className="bg-[#477330] text-center"
                cover={<PlayPuzzlePoster />}
                bodyStyle={{
                  borderTop: "1px solid white",
                  color: "white",
                  fontFamily: "Haptic",
                  fontSize: "18px",
                }}
                onClick={() => router.push("/puzzle")}
              >
                Play Puzzle
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
