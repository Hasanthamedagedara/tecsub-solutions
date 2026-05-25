import { pdfToolsMenu } from "@/data/product";
import ToolClientPage from "./ToolClientPage";

interface Props {
    params: {
        tool: string;
    };
}

export default function Page({ params }: Props) {
    return <ToolClientPage toolSlug={params.tool} />;
}

export async function generateStaticParams() {
    const slugs: string[] = [];
    pdfToolsMenu.forEach(group => {
        group.items.forEach(item => {
            const slug = item.href.replace("/pdf-tools/", "");
            slugs.push(slug);
        });
    });
    return slugs.map(s => ({ tool: s }));
}
