import json

import openai


def correct_description_with_chatgpt(description):
    # Prompt pour ChatGPT
    prompt = (
        f"Corrigez et reformulez la description suivante pour qu'elle soit syntaxiquement correcte en français. "
        f"Ensuite, créez un résumé de moins de 150 caractères. "
        f"Répondez uniquement avec la description corrigée suivie de \"Résumé :\" et du résumé. "
        f"Ne rajoutez pas d'autres commentaires ou explications.\n\n{description}"
    )

    # Appel à l'API de ChatGPT
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # ou un autre modèle disponible
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
        temperature=0.7,
    )

    # Extraire la réponse
    corrected_description = response.choices[0].message.content.strip()
    return corrected_description

def process_items(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    for item in data:
        original_description = item['description']
        corrected_description = correct_description_with_chatgpt(original_description)

        # Mettre à jour l'item avec la description corrigée
        item['description'] = corrected_description

        # Extraire le résumé de la réponse de ChatGPT
        summary_start = corrected_description.find("Résumé :")
        if summary_start != -1:
            item['shortDescription'] = corrected_description[summary_start + len("Résumé :"):].strip()
        else:
            item['shortDescription'] = corrected_description[:150].rsplit(' ', 1)[0] + '...'

    # Sauvegarder les données corrigées dans un nouveau fichier
    output_file_path = 'corrected_items.json'
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    print(f"Les items corrigés ont été sauvegardés dans {output_file_path}")

# Chemin vers votre fichier JSON
file_path = 'src/app/mock/items.json'
process_items(file_path)
