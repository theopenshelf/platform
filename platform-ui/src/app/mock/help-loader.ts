import { UIHelpArticle, UIHelpCategory } from '../models/UIHelp';
import helpData from './help.json';

const mapHelpCategory = (category: any): UIHelpCategory => {
    return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        order: category.order,
    };
};

export const loadHelpData = (): { categories: UIHelpCategory[], articles: UIHelpArticle[] } => {
    const categories = helpData.categories.map(mapHelpCategory);
    const categoriesMap = new Map(categories.map(cat => [cat.id, cat]));

    const articles = helpData.articles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: categoriesMap.get(article.category_id)!,
        order: article.order,
    }));

    return { categories, articles };
};
