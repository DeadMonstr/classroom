

import {RankingContent} from "components/presentation/types/exercise/ranking/RankingContent"
import {RankingSidebar} from "components/presentation/types/exercise/ranking/RankingSidebar";
import {RankingPreview} from "components/presentation/types/exercise/ranking/RankingPreview";
import {getRandomColor} from "helpers/colorRandomizer";
import {ReactComponent as Icon} from  "assets/icons/rating.svg";


export const RankingTypeSlice = {
    variants: [
        {
            id: 1,
            name: "",
            value: 0,
            // correct: false,
            color: getRandomColor()
        }
    ],

    // liveResponses: false
}



export const rankingType = {
    name: "ranking",
    title: "Ranking",
    icon: Icon,
    sidebar: RankingSidebar,
    content: RankingContent,
    preview: RankingPreview
}
