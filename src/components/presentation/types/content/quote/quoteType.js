import {ReactComponent as QuoteThumb } from "assets/icons/quote.svg"
import {QuoteSidebar} from "./QuoteSidebar";
import {QuotePreview} from "./QuotePreview";
import {QuoteContent} from "./QuoteContent";

export const quoteType = {
    name: "quote",
    title: "Quote",
    preview: QuotePreview,
    icon: QuoteThumb,
    sidebar: QuoteSidebar,
    content: QuoteContent
}
