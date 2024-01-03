import HumanChessGame from "@/components/HumanChessGame/HumanChessGame";
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

const PlayWithHumanPage = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  return <HumanChessGame id={slug} />;
};

export default PlayWithHumanPage;
