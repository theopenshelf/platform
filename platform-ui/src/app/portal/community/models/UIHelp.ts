export interface UIHelpCategory {
    id: string;
    name: string;
    icon: string;
}

export interface UIHelpArticle {
    id: string;
    title: string;
    content: string;
    category: UIHelpCategory;
}
