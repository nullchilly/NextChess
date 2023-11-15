import ChessGame from "@/components/ChessGame/ChessGame";
import { httpGetAllGameSlugs } from "@/modules/backend-client/httpGetAllGameSlugs";

export async function generateStaticParams() {
<<<<<<< HEAD
  const allSlugs = await httpGetAllGameSlugs();
  console.log("PAGE: ", allSlugs);
  return allSlugs.map((slug: string) => ({
    slug,
  }));
=======
  try {
    const allSlugs = await httpGetAllGameSlugs();
    console.log("PAGE: ", allSlugs);
    return allSlugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error("ERROR: ", error);
    return [];
  }
>>>>>>> play-bot-full
}

const PlayWithBotPage = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  return <ChessGame id={slug} type="computer" />;
};

export default PlayWithBotPage;
