import React from "react";
import BlackPawn from "@/components/icons/ChessPiece/BlackPawn";
import BlackRook from "@/components/icons/ChessPiece/BlackRook";
import BlackQueen from "@/components/icons/ChessPiece/BlackQueen";
import BlackBishop from "@/components/icons/ChessPiece/BlackBishop";
import BlackKing from "@/components/icons/ChessPiece/BlackKing";
import BlackKnight from "@/components/icons/ChessPiece/BlackKnight";
import WhiteBishop from "@/components/icons/ChessPiece/WhiteBishop";
import WhiteKing from "@/components/icons/ChessPiece/WhiteKing";
import WhitePawn from "@/components/icons/ChessPiece/WhitePawn";
import WhiteRook from "@/components/icons/ChessPiece/WhiteRook";
import WhiteQueen from "@/components/icons/ChessPiece/WhiteQueen";
import WhiteKnight from "@/components/icons/ChessPiece/WhiteKnight";
import {ChessProps} from "@/helpers/types";

const dynamicTag: Record<string, React.FC<ChessProps>> = {
	BlackPawn,
	BlackRook,
	BlackQueen,
	BlackBishop,
	BlackKing,
	BlackKnight,
	WhiteBishop,
	WhiteKing,
	WhitePawn,
	WhiteRook,
	WhiteQueen,
	WhiteKnight,
}

const ChessPiece: React.FC<ChessProps> = (props) => {
	const name = props.name ? props.name : "BlackPawn";
	const Chess = dynamicTag[name];
	return Chess ? <Chess /> : <BlackPawn />;
};

export default ChessPiece;