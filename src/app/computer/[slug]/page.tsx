import ChessGame from "@/components/ChessGame/ChessGame";
import { httpGetAllGameSlugs } from "@/modules/backend-client/httpGetAllGameSlugs";

export async function generateStaticParams() {
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
}

const PlayWithBotPage = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  return <ChessGame id={slug} type="computer" />;
};

export default PlayWithBotPage;
