"use client"
import React from "react";
import { Card, Col, Row } from "antd";
import PlayBotPoster from "@/components/icons/PlayBotPoster";
import PlayHumanPoster from "@/components/icons/PlayHumanPoster";
import PlayPuzzlePoster from "@/components/icons/PlayPuzzlePoster";
import ModalPlayBot from "@/components/Modal/ModalPlayBot";

const Home = () => {
  const [isModalPlayBotOpen, setIsModalPlayBotOpen] = React.useState(false);
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
                onClick={() => {setIsModalPlayBotOpen(true)}}
              >
                Play vs Bot
              </Card>
              <ModalPlayBot isOpen={isModalPlayBotOpen} setOpen={setIsModalPlayBotOpen}/>
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
              >
                Play vs Human
              </Card>
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
              >
                Play Puzzle
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div className="bg-[#477330] py-4 px-24" style={{position: 'fixed', bottom: '0', display: 'flex', left: '50%', borderRadius: '8px'}}>
        <span className="text-white">
          Insprised by ChessKid
        </span>
      </div>
    </>
  );
};

export default Home;
