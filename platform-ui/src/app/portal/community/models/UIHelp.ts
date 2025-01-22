export interface UIHelpCategory {
    id: string;
    name: string;
    icon: string;
    order: number;
}

export interface UIHelpArticle {
    id: string;
    title: string;
    content: string;
    category: UIHelpCategory;
    order: number;
}